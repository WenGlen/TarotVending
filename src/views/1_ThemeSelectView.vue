<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useSessionStore } from '../stores/sessionStore'
import themes from '../data/themes.json'
import VendingMachine from '../components/VendingMachine.vue'

const session = useSessionStore()

// 是否已投幣（避免重複）
const isCoinUsed = ref(false)

const isDragging = ref(false)
const coinPosition = ref({ x: 0, y: 0 })
const coinInitialPosition = ref({ x: 0, y: 0 })
const coinElement = ref(null)
const coinAreaElement = ref(null)
const isDropped = ref(false)
const isReturning = ref(false)
const currentDropTarget = ref(null)
const displayMessage = ref('請選擇主題並投幣')
const showCoinModal = ref(true) // 控制彈窗顯示

// 更新金幣位置
function updateCoinPosition(event) {
  if (!isDragging.value || isDropped.value) return
  
  coinPosition.value = {
    x: event.clientX,
    y: event.clientY
  }

  // 檢查是否在投幣口（黑色長方形）上方，檢測範圍擴大兩倍
  const coinSlots = document.querySelectorAll('.coin-slot')
  let foundTarget = null
  
  coinSlots.forEach(slot => {
    const rect = slot.getBoundingClientRect()
    // 計算投幣口中心點
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // 擴大檢測範圍：寬度和高度各擴大兩倍
    const detectWidth = rect.width * 2  // 8px * 2 = 16px
    const detectHeight = rect.height * 2  // 40px * 2 = 80px
    
    // 檢查滑鼠位置是否在擴大後的檢測範圍內
    if (
      event.clientX >= centerX - detectWidth / 2 &&
      event.clientX <= centerX + detectWidth / 2 &&
      event.clientY >= centerY - detectHeight / 2 &&
      event.clientY <= centerY + detectHeight / 2
    ) {
      foundTarget = slot.closest('.coin-slot-wrapper')
      const wrapper = slot.closest('.coin-slot-wrapper')
      wrapper?.classList.add('slot-hover')
      // 更新顯示器訊息
      const themeTitle = wrapper?.dataset.slotTitle || ''
      displayMessage.value = `準備投入：${themeTitle}`
    } else {
      slot.closest('.coin-slot-wrapper')?.classList.remove('slot-hover')
    }
  })
  
  // 如果沒有在投幣口上方，恢復預設訊息
  if (!foundTarget && !isDropped.value) {
    displayMessage.value = '請選擇主題並投幣'
  }
  
  currentDropTarget.value = foundTarget
}

function onMouseDown(event) {
  if (isCoinUsed.value || isDropped.value) return
  
  event.preventDefault()
  
  // 如果還在彈窗中，關閉彈窗
  if (showCoinModal.value) {
    showCoinModal.value = false
    // 等待彈窗關閉動畫完成後再開始拖拽
    setTimeout(() => {
      startDragging(event)
    }, 300)
  } else {
    startDragging(event)
  }
}

function startDragging(event) {
  isDragging.value = true
  isDropped.value = false
  currentDropTarget.value = null

  // 記錄初始位置（相對於coinAreaElement）
  if (coinElement.value && coinAreaElement.value) {
    const coinAreaRect = coinAreaElement.value.getBoundingClientRect()
    coinInitialPosition.value = {
      x: coinAreaRect.left + coinAreaRect.width / 2,
      y: coinAreaRect.top + coinAreaRect.height / 2
    }
    coinPosition.value = {
      x: event.clientX,
      y: event.clientY
    }
  }

  // 添加全局鼠标移动和释放监听
  document.addEventListener('mousemove', updateCoinPosition)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseUp(event) {
  if (!isDragging.value) return

  // 移除监听
  document.removeEventListener('mousemove', updateCoinPosition)
  document.removeEventListener('mouseup', onMouseUp)

  // 清除所有slot的hover状态
  document.querySelectorAll('.coin-slot-wrapper').forEach(slot => {
    slot.classList.remove('slot-hover')
  })

  // 如果成功投币
  if (currentDropTarget.value && !isDropped.value && !isCoinUsed.value) {
    const themeId = currentDropTarget.value.dataset.slotId
    if (themeId) {
      isDropped.value = true
      isCoinUsed.value = true
      displayMessage.value = '投幣成功！'
      
      // 等待半秒後切換到下一個view
      setTimeout(() => {
        session.selectTheme(themeId)
      }, 500)
      return
    }
  }
  
  // 如果沒有成功投幣，恢復預設訊息
  if (!isDropped.value) {
    displayMessage.value = '請先投幣選擇主題'
  }

  // 如果没有成功投币，回到初始位置
  if (!isDropped.value && !isCoinUsed.value && coinElement.value) {
    isReturning.value = true
    // 使用transition让金币平滑回到初始位置
    coinPosition.value = { ...coinInitialPosition.value }
    
    setTimeout(() => {
      isDragging.value = false
      isReturning.value = false
    }, 300)
  } else {
    isDragging.value = false
  }
}

// 初始化金幣位置（當彈窗關閉後）
function initCoinPosition() {
  setTimeout(() => {
    if (coinElement.value && coinAreaElement.value) {
      const coinAreaRect = coinAreaElement.value.getBoundingClientRect()
      coinInitialPosition.value = {
        x: coinAreaRect.left + coinAreaRect.width / 2,
        y: coinAreaRect.top + coinAreaRect.height / 2
      }
      coinPosition.value = { ...coinInitialPosition.value }
    }
  }, 100)
}

// 監聽彈窗關閉
watch(showCoinModal, (newVal) => {
  if (!newVal) {
    // 彈窗關閉後，初始化金幣位置
    initCoinPosition()
  }
})

onMounted(() => {
  // 如果一開始就沒有彈窗，初始化位置
  if (!showCoinModal.value) {
    initCoinPosition()
  }
})

// 準備商品數據
const products = computed(() => 
  themes.map(theme => ({
    id: theme.id,
    title: theme.title,
    label: theme.title
  }))
)

// 準備投幣孔數據
const coinSlotsData = computed(() =>
  themes.map(theme => ({
    id: theme.id,
    title: theme.title,
    label: theme.title
  }))
)

onUnmounted(() => {
  document.removeEventListener('mousemove', updateCoinPosition)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <!-- 彈窗 -->
  <div v-if="showCoinModal" class="coin-modal" @click.self="showCoinModal = false">
    <div class="coin-modal-content">
      <div class="coin-modal-title">請拿起金幣</div>
      <div 
        class="coin-modal-coin"
        @mousedown="onMouseDown"
      >
        🪙
      </div>
      <div class="coin-modal-hint">點擊金幣開始</div>
    </div>
  </div>

  <!-- 投幣機 -->
  <VendingMachine
    v-if="!showCoinModal"
    :display-message="displayMessage"
    :products="products"
    :coin-slots="coinSlotsData"
  >
    <template #coin-slots>
      <div class="coin-slots">
        <div
          v-for="theme in themes"
          :key="theme.id"
          class="coin-slot-wrapper"
          :data-slot-id="theme.id"
          :data-slot-title="theme.title"
        >
          <div class="coin-slot-container">
            <div class="coin-slot-circle">
              <div class="coin-slot"></div>
            </div>
            <div class="coin-slot-label">
              {{ theme.title }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #coin>
      <div ref="coinAreaElement" class="coin-area-wrapper">
        <div
          v-if="!isCoinUsed"
          ref="coinElement"
          class="coin"
          :class="{ 'coin-dragging': isDragging }"
          :style="{
            position: (isDragging || isReturning) ? 'fixed' : 'absolute',
            left: (isDragging || isReturning) ? coinPosition.x + 'px' : '50%',
            top: (isDragging || isReturning) ? coinPosition.y + 'px' : '50%',
            transform: (isDragging || isReturning) 
              ? 'translate(-50%, -50%) scaleX(0.3)' 
              : 'translate(-50%, -50%)',
            zIndex: (isDragging || isReturning) ? 1000 : 'auto',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }"
          @mousedown="onMouseDown"
        >
          🪙
        </div>

        <div v-else class="coin-used">
          已投幣
        </div>
      </div>
    </template>
  </VendingMachine>
</template>

<style scoped>
/* 投幣孔樣式（覆蓋組件樣式以保持拖拽功能） */
.coin-slots {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.coin-slot-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.coin-slot-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.coin-slot-circle {
  width: 100px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  border: 3px solid #999;
}

.coin-slot-wrapper.slot-hover .coin-slot-circle {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
  border-color: #4CAF50;
}

.coin-slot {
  width: 8px;
  height: 40px;
  background-color: #000;
  border-radius: 4px;
  pointer-events: none;
}

.coin-slot-label {
  pointer-events: none;
  font-size: 12px;
  color: #fff;
  text-align: center;
  font-weight: 500;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* 金幣區域包裝器 */
.coin-area-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 金幣樣式 */
.coin {
  font-size: 48px;
  cursor: grab;
  user-select: none;
  display: inline-block;
}

.coin:active {
  cursor: grabbing;
}

.coin-dragging {
  cursor: grabbing;
  transform-origin: center;
}

.coin-used {
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

/* 彈窗樣式 */
.coin-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.coin-modal-content {
  background: linear-gradient(135deg, rgb(160, 160, 160) 0%, rgb(125, 125, 125) 100%);
  border-radius: 20px;
  padding: 60px 80px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.coin-modal-title {
  font-size: 24px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.coin-modal-coin {
  font-size: 120px;
  cursor: grab;
  user-select: none;
  display: inline-block;
  transition: transform 0.2s ease-out;
  margin-bottom: 20px;
}

.coin-modal-coin:hover {
  transform: scale(1.1);
}

.coin-modal-coin:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.coin-modal-hint {
  font-size: 16px;
  color: #fff;
  opacity: 0.8;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
