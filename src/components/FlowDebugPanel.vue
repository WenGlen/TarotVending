<script setup>
    import { computed } from 'vue'
    import { useSessionStore } from '../stores/sessionStore'
    
    const session = useSessionStore()
    
    const statuses = [
      'idle',
      'theme_selected',
      'deck_selected',
      'shuffling',
      'selecting_cards',
      'result_generating',
      'result_displayed',
      'completed',
    ]
    
    // 安全地获取 spread 数组
    const spreadCards = computed(() => {
      if (!session.spread) return null
      // 如果是数组，直接返回
      if (Array.isArray(session.spread)) return session.spread
      // 如果是对象且有 cards 属性，返回 cards
      if (session.spread.cards && Array.isArray(session.spread.cards)) return session.spread.cards
      return null
    })
    
    function go(status) {
      session.status = status
    }
    </script>
    
    <template>



      <div class="debug-panel">
        <div class="debug-info">
        <div>status：{{ session.status }}</div>
        <div>selectedTheme：{{ session.selectedTheme || '（尚未選擇）' }}</div>
        <div>selectedDeckId：{{ session.selectedDeckId || '（尚未選擇）' }}</div>
        <div>inputTopicFreeText：{{ session.inputTopicFreeText || '（尚未輸入）' }}</div>
        <div>deckPile：<template v-if="session.deckPile">{{ session.deckPile.length }} 張 /  {{ session.deckPile[0].cardId }},  {{ session.deckPile[0].orientation }}</template><template v-else>（尚未產生）</template></div>
        <div>
          spread：
          <template v-if="spreadCards && spreadCards.length === 3">
            <br/>{{ spreadCards[0].position }}: {{ spreadCards[0].card.name }}, {{ spreadCards[0].orientation }}
            <br/>{{ spreadCards[1].position }}: {{ spreadCards[1].card.name }}, {{ spreadCards[1].orientation }}
            <br/>{{ spreadCards[2].position }}: {{ spreadCards[2].card.name }}, {{ spreadCards[2].orientation }}
          </template>
          <template v-else>（尚未產生）</template>
        </div>

      </div>


        <div class="title">流程測試</div>
    
        <button
          v-for="s in statuses"
          :key="s"
          @click="go(s)"
        >
          {{ s }}
        </button>
      </div>
    </template>
    
    <style scoped>
    .debug-panel {
      position: fixed;
      right: 12px;
      bottom: 12px;
      background: rgba(0, 0, 0, 0.8);
      padding: 10px;
      border-radius: 10px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 200px;
    }

    .debug-info {
      color: #fff;
      font-size: 12px;
      line-height: 1.4;
      margin-bottom: 6px;
      opacity: 0.85;
    }

    
    .title {
      color: #fff;
      font-size: 12px;
      margin-bottom: 4px;
      opacity: 0.7;
    }
    
    button {
      font-size: 12px;
      border: none;
      border-radius: 6px;
      padding: 4px 6px;
      cursor: pointer;
    }
    </style>
    