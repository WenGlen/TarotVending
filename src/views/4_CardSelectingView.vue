<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useSessionStore } from '../stores/sessionStore'
  import { TAROT_CARDS } from '../data/tarotCards'

  const emit = defineEmits(['confirm', 'ready', 'selection-count-changed'])
  
  const session = useSessionStore()

  const props = defineProps({
    confirmRequestId: Number,
  })
  
  /**
   * deckPile：本次選牌階段的完整牌列（一次性）
   * - 長度固定為 78
   * - 每張牌都有 cardId 與 orientation
   * - 僅存在於 CardSelectingView
   */
  const deckPile = ref([])
  
  function generateDeckPile() {
    // 先創建 1-78 的牌堆
    const pile = []
    for (let i = 1; i <= 78; i++) {
      pile.push({
        cardId: i,
        orientation: Math.random() < 0.5 ? 'upright' : 'reversed',
      })
    }
    
    // Fisher-Yates 洗牌算法：隨機打亂順序
    for (let i = pile.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pile[i], pile[j]] = [pile[j], pile[i]]
    }
    
    return pile
  }
  
  onMounted(() => {
    deckPile.value = generateDeckPile()
    // 將 deckPile 存儲到 sessionStore，方便調試面板查看
    session.deckPile = deckPile.value 
  })
  
  /**
   * 將畫面上的 row / index 對應到 deckPile 的 index（0～77）
   * 注意：v-for="index in cardsPerRow" 會從 1 開始，所以要減 1
   */
  function getDeckIndex(row, index) {
    return row * 26 + (index - 1)
  }
  
  /**
   * 計算每行的動畫延遲時間，實現一行一行依次出現的效果
   * @param {number} row - 行數（0, 1, 2）
   * @returns {number} 動畫延遲時間（秒）
   */
  function getAnimationDelay(row) {
    return row * 0.2
  }
  
  /* ---------- UI 設定 ---------- */
  
  const rows = [0, 1, 2]
  const cardsPerRow = 26
  
  /* ---------- 選牌狀態（全部用 deckIndex） ---------- */
  
  const pressingIndex = ref(null)      // 正在按壓中的 deckIndex
  const selectedIndexes = ref([])      // 已選 deckIndex（順序 = 過去 / 現在 / 未來）
  const editingIndex = ref(null)        // 正在重選的位置（0 / 1 / 2）
  
  const POSITION_LABELS = ['過去', '現在', '未來']
  
  function isSelected(deckIndex) {
    return selectedIndexes.value.includes(deckIndex)
  }
  
  function isEditing(deckIndex) {
    if (editingIndex.value === null) return false
    return selectedIndexes.value[editingIndex.value] === deckIndex
  }
  
  /**
   * 判斷某張已選卡片是否應該在拖移時被穿透（不阻擋選擇）
   * 當正在拖移時，除了正在編輯的那張卡片外，其他已選卡片都應該被穿透
   */
  function shouldIgnorePointerEvents(deckIndex) {
    // 如果不是已選卡片，不需要穿透
    if (!isSelected(deckIndex)) return false
    
    // 如果沒有正在拖移，不需要穿透
    if (pressingIndex.value === null) return false
    
    // 如果這張卡片正在被編輯，不應該穿透
    if (isEditing(deckIndex)) return false
    
    // 其他情況：正在拖移且不是正在編輯的已選卡片，應該穿透
    return true
  }
  
  /* ---------- Pointer 行為 ---------- */
  
  function onPointerDown(deckIndex, e) {
    e.preventDefault()
  
    // 點到已選牌 → 進入重選模式
    if (isSelected(deckIndex)) {
      editingIndex.value = selectedIndexes.value.indexOf(deckIndex)
      pressingIndex.value = deckIndex
      return
    }
  
    // 一般選牌：最多三張
    if (selectedIndexes.value.length >= 3) return
  
    pressingIndex.value = deckIndex
  }
  
  function onPointerUp() {
    if (pressingIndex.value === null) return

    // 重選模式：替換指定位置
    if (editingIndex.value !== null) {
      selectedIndexes.value.splice(
        editingIndex.value,
        1,
        pressingIndex.value
      )
      editingIndex.value = null
    }
    // 一般模式：新增
    else if (selectedIndexes.value.length < 3) {
      selectedIndexes.value.push(pressingIndex.value)
    }

    pressingIndex.value = null
  }

  // 監聽選牌狀態，當選完三張時通知父組件
  watch(
    () => selectedIndexes.value.length,
    (length) => {
      emit('ready', length === 3)
      emit('selection-count-changed', length)
    },
    { immediate: true }
  )
  
  function cancelPress() {
    pressingIndex.value = null
    editingIndex.value = null
  }
  
  function onPointerMove(e) {
    if (pressingIndex.value === null) return
  
    // 非重選模式，且已選滿三張 → 不允許移動
    if (editingIndex.value === null && selectedIndexes.value.length >= 3) return
  
    e.preventDefault()
  
    const el = document.elementFromPoint(e.clientX, e.clientY)
    if (!el) return
  
    const cardEl = el.closest('.card')
    if (!cardEl) return
  
    const deckIndex = Number(cardEl.dataset.deckIndex)
    if (Number.isNaN(deckIndex)) return
  
    // 一般模式不能移到已選牌
    if (editingIndex.value === null && isSelected(deckIndex)) return
  
    // 重選模式不能停在原本那張
    if (
      editingIndex.value !== null &&
      selectedIndexes.value[editingIndex.value] === deckIndex
    ) {
      return
    }
  
    if (deckIndex !== pressingIndex.value) {
      pressingIndex.value = deckIndex
    }
  }

  // ----確認選牌（由 MachineActionButton 觸發）-----
  const POSITION_ORDER = ['past', 'present', 'future']

  function getTarotCardById(cardId) {
    return TAROT_CARDS.find(card => card.id === cardId)
  }

  function buildFinalSpread() {
    return selectedIndexes.value.map((deckIndex, positionIndex) => {
      const rawCard = deckPile.value[deckIndex]
      
      // 安全检查：确保 card 存在
      if (!rawCard) {
        console.error(`Card at deckIndex ${deckIndex} not found in deckPile`)
        return null
      }

      const tarotCard = getTarotCardById(rawCard.cardId)
      
      // 安全检查：确保 tarotCard 存在
      if (!tarotCard) {
        console.error(`Tarot card with id ${rawCard.cardId} not found`)
        return null
      }

      return {
        position: POSITION_ORDER[positionIndex],
        card: {
          id: tarotCard.id,
          name: tarotCard.name,
        },
        orientation: rawCard.orientation,
      }
    }).filter(Boolean) // 过滤掉 null 值
  }

  watch(
    () => props.confirmRequestId,
    () => {
      if (selectedIndexes.value.length !== 3) return
      if (!deckPile.value || deckPile.value.length === 0) return

      const spread = buildFinalSpread()

      // 确保有3张有效的卡片才 emit
      if (spread.length === 3) {
        emit('confirm', spread)
      }
    }
  )




  </script>
  
  
  <template>
    <div
      class="card-table"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
    >
      <div
        v-for="row in rows"
        :key="row"
        class="card-row"
      >
        <div
          v-for="index in cardsPerRow"
          :key="index"
          class="card"
          :data-deck-index="getDeckIndex(row, index)"
          :style="{ animationDelay: `${getAnimationDelay(row)}s` }"
          :class="{
            pressing: pressingIndex === getDeckIndex(row, index),
            selected: isSelected(getDeckIndex(row, index)),
            'ignore-pointer': shouldIgnorePointerEvents(getDeckIndex(row, index)),
          }"
          @pointerdown="onPointerDown(getDeckIndex(row, index), $event)"
          @pointercancel="cancelPress"
        >
          <span
            v-if="isSelected(getDeckIndex(row, index)) && !isEditing(getDeckIndex(row, index))"
            class="selected-number"
          >
            {{ POSITION_LABELS[selectedIndexes.indexOf(getDeckIndex(row, index))] }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .card-table {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    /* 防止文本选择和拖拽 */
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    padding: 12px 0;
  }
  
  .card-row {

    display: flex;
    justify-content: center;
    position: relative;
  }
  
  /* 卡牌尺寸：照你的規格 */
  .card {
    width: 49px;
    height: 84px;
    background: #f5f5f5;
    border-radius: 6px;
    margin-left: -36px;
    position: relative;
    z-index: 1;
  
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
    /* 防止文本选择和拖拽 */
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
    
    /* 進場動畫 */
    animation: cardFadeIn 1s ease-out forwards;
    opacity: 0;
    transform: translateY(30px);
  }
  
  /* 淡入浮出動畫 */
  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 第一張不要被吃掉 */
  .card-row .card:first-child {
    margin-left: 0;
  }
  
  /* 按壓中（暫時標記） */
  .card.pressing {
    transform: translateY(-6px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.35);
    z-index: 20;
  }
  
  /* 已選定 */
  .card.selected {
    box-shadow: 0 0 0 2px #3cff8f, 0 8px 16px rgba(0,0,0,0.4);
    z-index: 30; /* Z 軸最上方 */
  }
  
  /* 拖移時，已選卡片（除了正在編輯的）不阻擋選擇 */
  .card.selected.ignore-pointer {
    pointer-events: none;
    z-index: 1; /* 降低到與普通卡片相同 */
  }
  
  /* 選定編號 */
  .selected-number {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  background: #3cff8f;
  color: #000;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  white-space: nowrap;
}
  </style>
  