<script setup>
    const emit = defineEmits(['next'])
    </script>
    
    <template>
      <div style="text-align:center">
        <h3>占卜完成</h3>
    
        <button class="completed-button" @click="emit('next')">
          回到投幣機待機狀態
        </button>
      </div>
      </template>
      
      <style scoped>
        
      .completed-button {
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
      .completed-button:hover {
        background: #2ee077;
      }
    </style>