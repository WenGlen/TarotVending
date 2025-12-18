<script setup>
import { computed } from 'vue'
import { useSessionStore } from '../../stores/sessionStore'

const session = useSessionStore()

const emit = defineEmits(['close'])

const result = computed(() => session.result)

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
  <div class="result-overlay">
    <h3>占卜結果</h3>
    
    <div v-if="result && result.content" class="result-content">
      <!-- 總結 -->
      <div class="result-section">
        <h4>總結</h4>
        <p>{{ result.content.summary }}</p>
      </div>

      <!-- 過去 -->
      <div class="result-section">
        <h4>過去</h4>
        <p>{{ result.content.past }}</p>
      </div>

      <!-- 現在 -->
      <div class="result-section">
        <h4>現在</h4>
        <p>{{ result.content.present }}</p>
      </div>

      <!-- 未來 -->
      <div class="result-section">
        <h4>未來</h4>
        <p>{{ result.content.future }}</p>
      </div>

      <!-- 整體觀察 -->
      <div class="result-section">
        <h4>整體觀察</h4>
        <p>{{ result.content.overall }}</p>
      </div>
    </div>

    <button @click="emit('close')" class="close-button">
      關閉
    </button>
  </div>
</template>

<style scoped>
.result-overlay {
  text-align: left;
  max-height: 85vh;
  overflow-y: auto;
}

.result-overlay h3 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
}

.result-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.result-section {
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.result-section h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.result-section p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #666;
}

.close-button {
  width: 100%;
  padding: 10px;
  background: #3cff8f;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.close-button:hover {
  background: #2ee077;
}
</style>

