<script setup>
  import { ref } from 'vue'
  
  const emit = defineEmits(['submit'])
  
  const question = ref('')
  </script>
  
  <template>
    <div class="overlay-content">
      <p class="title">
        在心中默念你的問題<br>如果能簡單寫下來更好
      </p>

  
      <textarea
        v-model="question"
        placeholder="例如：我現在該怎麼看待這段關係？"
        rows="3"
      />
  
      <button
        class="confirm-button"
        @click="emit('submit', question.trim() || '')"
      >
        {{ question.trim() === '' ? '我默念好了' : '這就是我想問的問題' }}
      </button>
    </div>
  </template>
  
  <style scoped>
  .overlay-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .title {
    font-size: 14px;
    text-align: center;
  }
  
  textarea {
    resize: none;
    padding: 8px;
    font-size: 14px;
    border: 2px solid #aaa;
    border-radius: 8px;
  }

  textarea:focus {
    outline: none;
    border: 2px solid rgb(36, 196, 105);
  }
  

  .confirm-button {
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

.confirm-button:hover {
  background: #2ee077;
}


  </style>
  