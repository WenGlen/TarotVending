<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useSessionStore } from '../stores/sessionStore'
  import { useAIPayload } from '../composables/useAIPayload'
  import { sendToGemini } from '../api/gemini'

const session = useSessionStore()
const { aiPayload } = useAIPayload()

const emit = defineEmits(['result-generated'])

const SYSTEM_PROMPT = `
你是一台「投幣式塔羅占卜機」。 你的任務不是安慰、不是聊天、不是給人生建議， 而是根據使用者提供的占卜資料，進行冷靜、清楚、有結構的解讀。 請嚴格遵守以下規則： 1. 你只能使用使用者提供的資料進行解讀。 不得自行新增牌卡、占卜位置、背景故事或假設。 2. 你必須尊重每一張牌的「位置」（過去、現在、未來）與「正位／逆位」， 解讀時不可忽略、不可顛倒。 3. 解讀語氣需保持中性、觀察式、具象， 避免命令、避免說教、避免過度樂觀或恐嚇。 4. 不要給出明確行動指令（例如「你應該辭職」）， 而是描述「狀態」、「趨勢」、「可能的內在衝突或方向」。 5. 請將解讀視為一次性的占卜結果， 不需提及「如果你再抽一次」、「下次可以再問」等內容。 6. 回傳內容必須嚴格依照指定的 JSON 格式， 不得加入額外說明文字或段落。具體如下 { "summary": "一句話總結這次占卜的核心狀態。", "past": "針對「過去」位置的解讀。", "present": "針對「現在」位置的解讀。", "future": "針對「未來」位置的解讀。", "overall": "整體趨勢與三張牌之間的關聯觀察。" } 
`

function buildUserPrompt(payload) {
  return `以下是一次完整的塔羅占卜資料，請進行解讀：

${JSON.stringify(payload, null, 2)}
`
}

/**
 * 解析 Gemini API 回應，提取文本內容
 */
 function parseGeminiResponse(geminiData) {
  try {
    const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!text) {
      console.warn('Gemini 回應中沒有找到文本內容', geminiData)
      return { summary: '解析失敗', /* ...其他欄位略... */ }
    }

    // --- 修改開始：清洗 Markdown 標記 ---
    // 移除 ```json, ``` 以及前後空白
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // --- 修改結束 ---

    try {
      return JSON.parse(cleanText)
    } catch (e) {
      console.warn("JSON 解析失敗，回退至純文字顯示", e);
      // 如果真的不是 JSON，只好全部塞給 summary 或其他欄位
      return {
        summary: cleanText,
        past: "",
        present: "",
        future: "",
        overall: ""
      }
    }
  } catch (err) {
    console.error('解析 Gemini 回應時發生錯誤：', err)
    return {
      summary: '解析錯誤',
      past: '解析錯誤',
      present: '解析錯誤',
      future: '解析錯誤',
      overall: '解析錯誤'
    }
  }
}

// 儲存 AI 回應結果
const aiRawResponse = ref(null)

// 防止重複調用 API
const isCallingAPI = ref(false)

// 標記是否為配額已滿錯誤
const isQuotaExceeded = ref(false)

  
/**
 * 將 spread 固定排序為：過去 → 現在 → 未來
 */
const orderedSpread = computed(() => {
  if (!session.spread) return []
  const order = ['past', 'present', 'future']
  return [...session.spread].sort(
    (a, b) => order.indexOf(a.position) - order.indexOf(b.position)
  )
})

/**
 * 控制卡片依序出現
 */
const visibleCount = ref(0)

/**
 * 控制說明文字是否顯示
 */
const showInfo = ref(false)

/**
 * 實際要顯示的卡片（避免在 template 用 index 判斷）
 */
const visibleSpread = computed(() => {
  return orderedSpread.value.slice(0, visibleCount.value)
})



onMounted(async () => {
  console.log('送給 AI 的資料：', aiPayload.value)
  
  // 卡片依序出現動畫
  const interval = setInterval(() => {
    visibleCount.value++
    if (visibleCount.value >= orderedSpread.value.length) {
      clearInterval(interval)

      // 三張牌都出現後，再延遲顯示文字
      setTimeout(() => {
        showInfo.value = true
        
        // 在卡片顯示完成後，呼叫 API 並處理結果
        callGeminiAPI()
      }, 300)
    }
  }, 300)
})

/**
 * 呼叫 Gemini API 並處理結果
 */
async function callGeminiAPI() {
  // 防止重複調用
  if (isCallingAPI.value) {
    console.warn('API 調用已進行中，跳過重複調用')
    return
  }

  if (!aiPayload.value) {
    console.warn('沒有可用的 AI payload')
    // 使用預設值
    aiRawResponse.value = {
      summary: '缺少資料',
      past: '缺少資料',
      present: '缺少資料',
      future: '缺少資料',
      overall: '缺少資料'
    }
    emitResult()
    return
  }

  isCallingAPI.value = true

  try {
    const geminiResponse = await sendToGemini({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildUserPrompt(aiPayload.value),
    })

    console.log('Gemini 回傳結果：', geminiResponse)
    
    // 解析回應
    aiRawResponse.value = parseGeminiResponse(geminiResponse)
    
    // 觸發結果產生
    emitResult()
  } catch (err) {
    console.error('Gemini 發生錯誤：', err)
    
    // 429 錯誤：配額已用完，返回特定格式
    if (err.status === 429) {
      isQuotaExceeded.value = true
      aiRawResponse.value = {
        summary: '本日占卜額度已滿，請明天再試',
        past: '無',
        present: '無',
        future: '無',
        overall: '無'
      }
    } else {
      isQuotaExceeded.value = false
      // 其他錯誤使用預設值
      let errorMessage = 'API 錯誤'
      if (err.status === 503) {
        errorMessage = '服務暫時不可用，請稍後再試'
      }
      
      aiRawResponse.value = {
        summary: 'API 錯誤',
        past: 'API 錯誤',
        present: 'API 錯誤',
        future: 'API 錯誤',
        overall: errorMessage
      }
    }
    
    emitResult()
  } finally {
    isCallingAPI.value = false
  }
}

/**
 * 觸發結果產生事件
 */
function emitResult() {
  if (!aiRawResponse.value) {
    console.warn('AI 回應尚未準備好')
    return
  }

  const result = {
    resultId: crypto.randomUUID(),
    userId: session.userId,
    sessionId: session.sessionId,
    deckId: session.selectedDeckId,
    spread: session.spread,
    content: aiRawResponse.value,
    layoutStyle: 'default',
    skinId: 'pixel_basic',
    createdAt: new Date().toISOString(),
    quotaExceeded: isQuotaExceeded.value
  }

  emit('result-generated', result)
}

function positionLabel(position) {
  if (position === 'past') return '過去'
  if (position === 'present') return '現在'
  return '未來'
}

function orientationLabel(orientation) {
  return orientation === 'upright' ? '正位' : '逆位'
}

  </script>
  
  <template>
    <div class="result-generating">
      <!-- 固定三欄卡槽，位置永遠不動 -->
      <div class="cards-row">
        <div
          v-for="slot in ['past', 'present', 'future']"
          :key="slot"
          class="card-slot"
        >
          <div class="position-label">
            {{ positionLabel(slot) }}
          </div>
  
          <!-- 只在對應卡片已出現時才 render -->
          <transition name="card-deal">
            <div
              v-if="visibleSpread.find(c => c.position === slot)"
              class="card-shell"
            >
              <div
                class="card-face"
                :class="{
                  reversed:
                    visibleSpread.find(c => c.position === slot)?.orientation ===
                    'reversed'
                }"
              >
                {{
                  visibleSpread.find(c => c.position === slot)?.card.id
                }}
              </div>
            </div>
          </transition>
        </div>
      </div>
  
      <!-- 說明文字：等三張牌都擺好才出現 -->
      <transition name="fade">
        <div v-if="showInfo" class="info-row">
          <div
            v-for="card in orderedSpread"
            :key="card.position"
            class="info-cell"
          >
            <div>{{ card.card.name }}</div>
            <div>{{ orientationLabel(card.orientation) }}</div>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <style scoped>
  .result-generating {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    padding: 48px 0;
    align-items: center;
    gap: 24px;
  }
  
  /* ===== 卡片區 ===== */
  
  .cards-row {
    display: flex;
    gap: 24px;
  }
  
  /* 每一欄都是固定寬度，先佔位 */
  .card-slot {
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  
  .position-label {
    font-size: 12px;
    opacity: 0.7;
  }
  
  /* 外殼：陰影不旋轉 */
  .card-shell {
    width: 80px;
    height: 136px;
    border-radius: 8px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3);
  }
  
  /* 卡面：正逆位旋轉 */
  .card-face {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    border-radius: 8px;
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    font-size: 20px;
    font-weight: bold;
  
    transition: transform 0.3s ease;
  }
  
  .card-face.reversed {
    transform: rotate(180deg);
  }
  
  /* ===== 卡片進場動畫 ===== */
  
  .card-deal-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  
  .card-deal-enter-active {
    transition: all 0.5s ease;
  }
  
  .card-deal-enter-to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  
  /* ===== 下方說明文字 ===== */
  
  .info-row {
    display: flex;
    gap: 24px;
  }
  
  .info-cell {
    width: 80px;
    text-align: center;
    font-size: 12px;
    opacity: 0.85;
  }
  
  /* 文字淡入 */
  .fade-enter-from {
    opacity: 0;
    transform: translateY(6px);
  }
  
  .fade-enter-active {
    transition: all 0.25s ease;
  }
  
  .fade-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  </style>
  