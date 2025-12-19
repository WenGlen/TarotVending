<script setup>
  import { ref, computed, watch, onUnmounted } from 'vue'
  import { useSessionStore } from './stores/sessionStore'
  import { machineUIMap } from './config/machineUIMap'
  import MachineActionButton from './components/machine/MachineActionButton.vue'
  import VendingMachineLayout from './layouts/VendingMachineLayout.vue'
  
  import IdleView from './views/0_IdleView.vue'
  import ThemeSelectView from './views/1_ThemeSelectView.vue'
  import DeckSelectView from './views/2_DeckSelectView.vue'
  import ShufflingView from './views/3_CardShufflingView.vue'
  import CardSelectingView from './views/4_CardSelectingView.vue'
  import ResultGeneratingView from './views/5_ResultGeneratingView.vue'
  import ResultDisplayedView from './views/6_ResultDisplayedView.vue'
  import CompletedView from './views/7_CompletedView.vue'

  import IdleOverlay from './components/overlays/IdleOverlay.vue'
  import ThemeOverlay from './components/overlays/ThemeOverlay.vue'
  import ShuffleOverlay from './components/overlays/ShuffleOverlay.vue'
  import CompletedOverlay from './components/overlays/CompletedOverlay.vue'
  import ResultOverlay from './components/overlays/ResultOverlay.vue'
  import MachineOverlay from './components/MachineOverlay.vue'

  import decksData from './data/decks.json'
  const decks = computed(() => {
    return decksData.filter(deck => deck.isActive)
  })

  import FlowDebugPanel from './components/FlowDebugPanel.vue'
  import { useResponsiveViewport } from './composables/useResponsiveViewport'

const session = useSessionStore()

/* --------------------
   響應式縮放控制
-------------------- */
// 使用 composable 處理所有視窗自適應邏輯
const {
  containerRef: appContainerRef,
  scale
} = useResponsiveViewport(420, 800)

/* --------------------
   Overlay 控制
-------------------- */
const overlayVisible = ref(false)
const resultOverlayVisible = ref(false)
const idleOverlayVisible = ref(false)

watch(
  () => session.status,
  (status) => {
    if (status === 'shuffling') {
      overlayVisible.value = false

      // 洗牌先跑，0.5 秒後才出現彈窗
      setTimeout(() => {
        overlayVisible.value = true
      }, 2500)
    } else if (status === 'idle') {
      // IdleOverlay 延遲顯示控制：先隱藏，0.5秒後再顯示
      overlayVisible.value = false
      idleOverlayVisible.value = false
      setTimeout(() => {
        if (session.status === 'idle') {
          overlayVisible.value = true
          idleOverlayVisible.value = true
        }
      }, 200)
    } else {
      overlayVisible.value = machineUIMap[status]?.showOverlay ?? false
      idleOverlayVisible.value = false
    }
    
    // 當進入選牌階段時，重置已選擇卡片數量
    if (status === 'selecting_cards') {
      selectedCardsCount.value = 0
    }
  },
  { immediate: true }
)

const uiState = computed(() => {
  return machineUIMap[session.status] || {
    activeSection: 'none',
    machineMode: 'standby',
  }
})

/* --------------------
   Overlay 下一步
-------------------- */
const nextStatusMap = {
  idle: 'theme_selected',
  shuffling: 'selecting_cards',
  completed: 'idle',
}

function goNextFromOverlay() {
  const next = nextStatusMap[session.status]
  overlayVisible.value = false
  if (next) session.status = next
}

/* --------------------
   金幣拖曳狀態（唯一一套）
-------------------- */
const holdingCoin = ref(false)
const dragging = ref(false)
const coinPos = ref({ x: 0, y: 0 })

/**
 * 從 ThemeOverlay 開始拖曳金幣
 */
function startCoinDrag(e) {
  // 1. 關閉 overlay
  overlayVisible.value = false

  // 2. 建立金幣並立刻進入拖曳狀態
  holdingCoin.value = true
  dragging.value = true

  // 3. 一開始就把金幣放在游標下
  coinPos.value = {
    x: e.clientX,
    y: e.clientY,
  }

  // ❗關鍵：等金幣 DOM 出現後，再 capture pointer
  requestAnimationFrame(() => {
    const coinEl = document.querySelector('.floating-coin')
    if (coinEl) {
      coinEl.setPointerCapture(e.pointerId)
    }
  })
}


function onCoinMove(e) {
  if (!dragging.value) return
  coinPos.value = {
    x: e.clientX,
    y: e.clientY,
  }
}

function onCoinUp(e) {
  dragging.value = false

  const coinEl = document.querySelector('.floating-coin')
  if (coinEl) {
    coinEl.releasePointerCapture(e.pointerId)
  }

  checkCoinDrop()
}

function checkCoinDrop() {
  const slots = document.querySelectorAll('.coin-slot')
  const { x, y } = coinPos.value

  for (const slot of slots) {
    const rect = slot.getBoundingClientRect()

    const hit =
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom

    if (hit) {
      // ✅ 投幣成功
      session.selectedTheme = slot.dataset.theme
      holdingCoin.value = false
      session.status = 'deck_selected'
      return
    }
  }

  // ❌ 投幣失敗：回到本階段起點
  holdingCoin.value = false
  overlayVisible.value = true
}

function selectDeck(deckId) {
  if (session.status !== 'deck_selected') return

  session.selectedDeckId = deckId
  session.status = 'shuffling'
}

function handleQuestionSubmit(text) {
  session.inputTopicFreeText = text
  overlayVisible.value = false

  setTimeout(() => {
    session.status = 'selecting_cards'
  }, 600)
}

function handleConfirmSpread(spread) {
  session.spread = spread
  session.status = 'result_generating'
}

const cardSelectingReady = ref(false)
const selectedCardsCount = ref(0)

function handleCardSelectingReady(isReady) {
  cardSelectingReady.value = isReady
}

function handleSelectionCountChanged(count) {
  selectedCardsCount.value = count
}

const actionButtonMode = computed(() => {
  if (machineUIMap[session.status]?.action === 'confirm-spread') {
    return cardSelectingReady.value ? 'active' : 'disabled'
  }
  // 當 AI 結果已產生時，按鈕亮起
  if (session.status === 'result_generating' && session.result) {
    return 'active'
  }
  return 'disabled'
})

/* --------------------
   讀取動畫小綠燈控制
-------------------- */
const resultGeneratingStartTime = ref(null)
const currentTime = ref(Date.now())
let loadingTimer = null

watch(
  () => session.status,
  (status) => {
    // 清除舊的定時器
    if (loadingTimer) {
      clearInterval(loadingTimer)
      loadingTimer = null
    }
    
    if (status === 'result_generating') {
      // 記錄進入 result_generating 狀態的時間
      resultGeneratingStartTime.value = Date.now()
      currentTime.value = Date.now()
      
      // 啟動定時器，每100ms更新一次時間，用於計算經過時間
      loadingTimer = setInterval(() => {
        if (session.status === 'result_generating' && !session.result) {
          currentTime.value = Date.now()
        } else {
          if (loadingTimer) {
            clearInterval(loadingTimer)
            loadingTimer = null
          }
        }
      }, 100)
    } else {
      // 離開該狀態時重置
      resultGeneratingStartTime.value = null
    }
  },
  { immediate: true }
)

// 組件卸載時清理定時器
onUnmounted(() => {
  if (loadingTimer) {
    clearInterval(loadingTimer)
    loadingTimer = null
  }
})

const showLoadingLights = computed(() => {
  // 只有在 result_generating 狀態時才可能顯示
  if (session.status !== 'result_generating') {
    return false
  }
  
  // 如果已經有結果了，不顯示
  if (session.result) {
    return false
  }
  
  // 如果還沒記錄開始時間，不顯示
  if (!resultGeneratingStartTime.value) {
    return false
  }
  
  // 計算經過的時間（毫秒）
  const elapsed = currentTime.value - resultGeneratingStartTime.value
  
  // 3秒後才顯示
  return elapsed >= 1500
})

const confirmRequestId = ref(0)

function handleMachineButtonPress() {
  // 處理選牌階段的按鈕按下
  if (session.status === 'selecting_cards') {
    if (!cardSelectingReady.value) return
    // 🔔 發出「請確認」訊號
    confirmRequestId.value++
    return
  }
  
  // 處理結果生成完成後的按鈕按下
  if (session.status === 'result_generating' && session.result) {
    session.status = 'result_displayed'
    return
  }
}



const cardSelectingViewRef = ref(null)

function handleResultGenerated(result) {
  // 直接使用從子組件傳來的完整 result 對象
  session.result = result
  // 保持在 result_generating 狀態，等待用戶按下按鈕
  console.log('結果產生：', session.result)
}

function handleOutletClick() {
  // 當 outlet section 為 active 時（即 result_displayed 狀態），點擊出貨口顯示結果
  if (session.status === 'result_displayed' && session.result) {
    resultOverlayVisible.value = true
  }
}

function handleResultOverlayClose() {
  resultOverlayVisible.value = false
  // 關閉彈窗後切換到完成狀態
  session.status = 'completed'
}

/* --------------------
   引導文字
-------------------- */
const guideText = computed(() => {
  const guideTextMap = {
    idle: '請將金幣投入主題投幣口',
    theme_selected: '請將金幣投入主題投幣口',
    deck_selected: '請選擇您想要的牌組',
    shuffling: '正在洗牌中<br/>請在腦中想著您想問的問題',
    selecting_cards: selectedCardsCount.value === 0 
      ? '請依序選出代表你 過去、現在、未來 的三張牌<br/>點擊時長按可左右移動挑選卡片'
      : '長按已選卡片可重新選擇 <br/> 選擇完畢請按右下角按鈕確認',
    result_generating: session.result 
      ? (session.result.quotaExceeded 
          ? '本日占卜額度已滿，請明天再試' 
          : '占卜完成，請點擊右下角按鈕印出占卜結果')
      : '正在占卜中，請稍後...',
    result_displayed: '請點擊出貨口查看占卜結果',
    completed: '感謝使用',
  }
  return guideTextMap[session.status] || ''
})

</script>

<template>
  <div ref="appContainerRef" class="app-container" :style="{ transform: `translate(-50%, -50%) scale(${scale})` }">
    <VendingMachineLayout
      :activeSection="uiState.activeSection"
      :machineMode="uiState.machineMode"
      @outlet-click="handleOutletClick"
    >
  <!-- 商品櫥窗（牌組 + 櫥窗下方按鈕） -->
    <!-- 商品櫥窗（永遠存在） -->
    <template #product>
      <div class="product-wrapper">

        <!-- 櫥窗內容 -->
        <DeckSelectView
          :decks="decks"
          :active="session.status === 'deck_selected'"
          :selectedDeckId="session.selectedDeckId"
        />

        <!-- 櫥窗下方：機台按鈕 -->
        <div class="deck-buttons">
          <button
            v-for="deck in decks"
            :key="deck.deckId"
            class="deck-button"
            :class="{ enabled: session.status === 'deck_selected' }"
            :disabled="session.status !== 'deck_selected'"
            @click="selectDeck(deck.deckId)"
          />
        </div>

      </div>
    </template>


  <!-- 引導文字區 -->
  <template #guide>
    <div v-html="guideText"></div>
  </template>


  <template #cards>
    <div class="cards-container">
      <ShufflingView
        v-if="session.status === 'shuffling'"
      />

      <CardSelectingView
        v-if="session.status === 'selecting_cards'"
        :confirm-request-id="confirmRequestId"
        @ready="handleCardSelectingReady"
        @confirm="handleConfirmSpread"
        @selection-count-changed="handleSelectionCountChanged"
      />

      <ResultGeneratingView
        v-if="session.status === 'result_generating'"
        @result-generated="handleResultGenerated"
      />
    </div>
    <MachineActionButton
      :mode="actionButtonMode"
      :show-loading-lights="showLoadingLights"
      @press="handleMachineButtonPress"
    />
  </template>
  

    <template #coin></template>
  </VendingMachineLayout>
  </div>

  <!-- 機台遮罩（覆蓋整個畫面） -->
  <MachineOverlay :show="overlayVisible">
    <IdleOverlay
      v-if="idleOverlayVisible"
      @next="goNextFromOverlay"
    />

    <ThemeOverlay
      v-else-if="session.status === 'theme_selected'"
      @start-drag="startCoinDrag"
    />

    <ShuffleOverlay
      v-else-if="session.status === 'shuffling'"
      @submit="handleQuestionSubmit"
    />

    <CompletedOverlay
      v-else-if="session.status === 'completed'"
      @next="goNextFromOverlay"
    />
  </MachineOverlay>

  <!-- 結果展示彈窗 -->
  <MachineOverlay 
    :show="resultOverlayVisible"
    :close-on-mask="true"
    @close="handleResultOverlayClose"
  >
    <ResultOverlay @close="handleResultOverlayClose" />
  </MachineOverlay>

  <!-- 拖曳中的金幣（只在拖曳後存在） -->
  <div
    v-if="holdingCoin"
    class="floating-coin"
    :class="{ dragging }"
    :style="{ left: coinPos.x + 'px', top: coinPos.y + 'px' }"
    @pointermove="onCoinMove"
    @pointerup="onCoinUp"
  >
    🪙
  </div>

  <!-- <FlowDebugPanel /> -->
</template>

<style scoped>
.app-container {
  width: 420px;
  /* height 由內容決定，不設固定值 */
  position: fixed;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  
  /* 安全區域支援（iOS Safari 等）- 設置最小 padding 避免貼邊 */
  /* 透過 CSS 變數動態設置，預設值為 20px */
  /* 如果 CSS 變數未設置，直接使用固定值確保一定有 padding */
  padding-top: var(--safe-area-top, 20px) !important;
  padding-bottom: var(--safe-area-bottom, 20px) !important;
  padding-left: var(--safe-area-left, 0px);
  padding-right: var(--safe-area-right, 0px);
  
  /* 確保在安全區域內 */
  box-sizing: border-box;
}

.floating-coin {
  position: fixed;
  transform: translate(-50%, -50%) scale(1.5 ) ;
  font-size: 64px;             
  cursor: grabbing;           
  user-select: none;         
  pointer-events: auto;     
  touch-action: none;        
  z-index: 9999;
}

.floating-coin.dragging {
  cursor: grabbing;
  transform: translate(-50%, -50%) scaleX(0.5);
}




.product-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cards-container {
  height: 340px;
  background: #dddddd;
}

/* 櫥窗亮暗 */
.deck-showcase {
  opacity: 1;
  transition: opacity 0.3s;
}
.deck-showcase.active {
  opacity: 1;
}

/* 機台按鈕 */
.deck-buttons {
  display: flex;
  justify-content: space-around;
  padding: 12px;
}

.deck-button {
  height: 18px;
  width: 72px;
  border-radius: 9px;
  background: #444;
  border: none;
}

.deck-button.enabled {
  background: #3cff8f;
  box-shadow: 0 0 8px rgba(60, 255, 143, 0.8);
  cursor: pointer;
}


</style>
