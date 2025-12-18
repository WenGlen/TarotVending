<script setup>
defineProps({
  displayMessage: {
    type: String,
    default: '請先投幣選擇主題'
  },
  products: {
    type: Array,
    default: () => []
  },
  coinSlots: {
    type: Array,
    default: () => []
  },
  showCoin: {
    type: Boolean,
    default: true
  }
})

defineEmits(['coin-drop'])
</script>

<template>
  <div class="vending-machine">
    <!-- 商品櫥窗區域 -->
    <div class="products-section">
      <slot name="products">
        <!-- 長條櫥窗 -->
        <div class="products-window">
          <div
            v-for="(product, index) in products"
            :key="product.id || index"
            class="product-color-block"
            :style="{ backgroundColor: product.color || getProductColor(index) }"
          ></div>
        </div>
        <!-- 按鈕區域 -->
        <div class="products-buttons">
          <button
            v-for="(product, index) in products"
            :key="product.id || index"
            class="product-button"
            disabled
          >
            {{ product.title || product.label }}
          </button>
        </div>
      </slot>
    </div>

    <!-- 顯示器區域 -->
    <div class="display-section">
      <div class="display-screen">
        <div class="display-content">
          <slot name="display">
            {{ displayMessage }}
          </slot>
        </div>
      </div>
    </div>

    <!-- 投幣孔區域 -->
    <div class="coin-section">
      <slot name="coin-slots">
        <div class="coin-slots">
          <div
            v-for="slot in coinSlots"
            :key="slot.id"
            class="coin-slot-wrapper"
            :data-slot-id="slot.id"
            :data-slot-title="slot.title || slot.label"
          >
            <div class="coin-slot-container">
              <div class="coin-slot-circle">
                <div class="coin-slot"></div>
              </div>
              <div class="coin-slot-label">
                {{ slot.title || slot.label }}
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>

    <!-- 金幣區域 -->
    <div v-if="showCoin" class="coin-area">
      <slot name="coin"></slot>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getProductColor(index) {
      const colors = ['#888888', '#aaaaaa', '#888888', '#aaaaaa', '#888888', '#aaaaaa']
      return colors[index % colors.length]
    }
  }
}
</script>

<style scoped>
.vending-machine {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
  padding-bottom: 100px;
  background: linear-gradient(135deg,rgb(160, 160, 160) 0%,rgb(125, 125, 125) 100%);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  position: relative;
}

/* 商品櫥窗區域 */
.products-section {
  margin-bottom: 24px;
}

/* 長條櫥窗 */
.products-window {
  background-color: #fff;
  border: 3px solid #333;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 8px;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.product-color-block {
  flex: 1;
  min-width: 80px;
  height: 100px;
  border-radius: 4px;
  flex-shrink: 0;
}

/* 按鈕區域 */
.products-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.product-button {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  background-color: #4a5568;
  color: #fff;
  border: 2px solid #2d3748;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.7;
  transition: all 0.2s;
  flex-shrink: 0;
}

.product-button:disabled {
  cursor: not-allowed;
}

/* 顯示器區域 */
.display-section {
  margin-bottom: 24px;
}

.display-screen {
  background-color: #1a202c;
  border: 4px solid #2d3748;
  border-radius: 12px;
  padding: 20px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
}

.display-content {
  background-color: #2d3748;
  color: #68d391;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 10px rgba(104, 211, 145, 0.5);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 投幣孔區域 */
.coin-section {
  margin-bottom: 24px;
}

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

/* 金幣區域 */
.coin-area {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

