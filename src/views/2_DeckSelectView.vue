<script setup>
  defineProps({
    decks: {
      type: Array,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    selectedDeckId: String,
  })




  </script>
  
  <template>
    <div class="deck-showcase" :class="{ active }">
      <div
        v-for="deck in decks"
        :key="deck.deckId"
        class="deck-item"
        :class="{ selected: deck.deckId === selectedDeckId }"
      >
        <div class="deck-card">
          <!-- 放牌組的卡背圖 -->
        </div>
  
        <div class="deck-title">
          {{ deck.title }}
        </div>
  

      </div>
    </div>
  </template>
  
  <style scoped>
  .deck-showcase {
    display: flex;
    justify-content: space-around;
    background: rgba(0, 0, 0, 0.3);
    padding: 12px;

  }
  

  .deck-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

  }

  .deck-item {
    opacity: 0.25;
    transition: opacity 0.3s, box-shadow 0.3s;
  }

  /* 當 deck_selected 狀態時，所有 deck-item 都亮起 */
  .deck-showcase.active .deck-item {
    opacity: 1;
  }

  /* 後續維持長亮狀態 */
  .deck-item.selected {
    opacity: 1;
  }

  
  .deck-card {
    width: 49px;
    height: 84px;
    border-radius: 8px;
    background: #f2f2f2;
    margin-bottom: 6px;
  }
  
  .deck-title {
    font-size: 14px;
  }
  
  </style>
  