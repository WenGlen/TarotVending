<script setup>
  import { onMounted, ref } from 'vue'
  
  const isShuffling = ref(false)
  
  onMounted(() => {
    // 一進來就開始洗牌
    isShuffling.value = true
  })
  </script>
  
  <template>
    <div class="shuffling-area">
      <div class="card-stack">
        <!-- 第一張卡片：初始顯示，然後透明度變0 -->
        <div class="card card-1" />
        <!-- 第二張卡片：抽出移到範圍外，然後放回原位 -->
        <div class="card card-2" />
        <!-- 第三張卡片：保持不動 -->
        <div class="card card-3" />
        <div class="card card-3" />
      </div>
  
      <div class="hint">
        正在洗牌中…
      </div>
    </div>
  </template>
  
  <style scoped>
  .shuffling-area {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .card-stack {
    position: relative;
    width: 49px;
    height: 84px;
  }
  
  .card {
    position: absolute;
    width: 49px;
    height: 84px;
    background: #eee;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    left: 0;
    top: 0;
  }
  
  /* 第一張卡片：初始顯示，然後透明度變0 */
  .card-1 {
    transform: translateY(0px) rotate(-1deg);
    z-index: 3;
    animation: card1FadeOut 1.5s infinite ease-in-out;

  }
  
  /* 第二張卡片：抽出移到範圍外，然後放回原位 */
  .card-2 {
    transform: translateY(0px) rotate(1deg);
    z-index: 2;
    animation: card2MoveOutAndBack 1.2s infinite ease-in-out;
  }
  
  /* 第三張卡片：保持不動 */
  .card-3 {
    transform: translateY(0px) rotate(-0.5deg);
    z-index: 1;
    /* 沒有動畫，保持不動 */
  }
  
  @keyframes card1FadeOut {
    0% {
      /* 初始顯示，三張重疊 */
      opacity: 1;
      transform: translateY(0px) rotate(-1deg);
    }
    35% {
      /* 第二張抽出後，保持顯示 */
      opacity: 1;
      transform: translateY(0px) rotate(-1deg);
    }
    45% {
      /* 第二張移到範圍外後，第一張瞬間變透明 */
      opacity: 0;
      transform: translateY(0px) rotate(-1deg);
    }
    100% {
      /* 保持透明 */
      opacity: 0;
      transform: translateY(0px) rotate(-1deg);
    }
  }
  
  @keyframes card2MoveOutAndBack {
    0% {
      /* 初始位置，三張重疊 */
      transform: translateY(0px) rotate(1deg);
    }
    0.1% {
      /* 開始抽出 */
      transform: translateY(-5px) rotate(1deg);
    }
    30% {
      /* 移到範圍外（右側） */
      transform: translateY(-10px) translateX(70px) rotate(10deg);
    }
    30.1% {
      /* 在範圍外停留（此時第一張變透明） */
      transform: translateY(-10px) translateX(70px) rotate(10deg);
    }
    60% {
      /* 開始移回 */
      transform: translateY(-5px) translateX(0px) rotate(1deg);
    }
    90% {
      /* 放回原位 */
      transform: translateY(0px) rotate(1deg);
    }
    100% {
      /* 保持原位 */
      transform: translateY(0px) rotate(1deg);
    }
  }
  
  .hint {
    margin-top: 12px;
    font-size: 12px;
    opacity: 0.7;
  }
  </style>
  