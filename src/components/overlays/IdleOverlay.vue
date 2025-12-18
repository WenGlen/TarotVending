<script setup>
    const emit = defineEmits(['next'])
    </script>
    
    <template>
      <Transition name="fade">
        <div style="text-align:center" class="overlay-content">
          <h3>歡迎使用占卜投幣機</h3>
    
          <button class="start-button" @click="emit('next')">
            開始投幣
          </button>
        </div>
      </Transition>
    </template>


    <style scoped>
      .overlay-content {
        opacity: 1;
      }

      .fade-enter-active {
        transition: opacity 0.3s ease-in;
      }

      .fade-enter-from {
        opacity: 0;
      }

      .fade-enter-to {
        opacity: 1;
      }

      .start-button {
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

      .start-button:hover {
        background: #2ee077;
      }
    </style>