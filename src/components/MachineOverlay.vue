<script setup>
    const props = defineProps({
      show: {
        type: Boolean,
        required: true,
      },
      closeOnMask: {
        type: Boolean,
        default: false,
      },
    })
    
    const emit = defineEmits(['close'])
    
    function onMaskClick() {
      if (props.closeOnMask) {
        emit('close')
      }
    }
    </script>
    
    <template>
      <transition name="overlay-fade">
        <div
          v-if="show"
          class="overlay-mask"
          @click="onMaskClick"
        >
          <div
            class="overlay-panel"
            @click.stop
          >
            <slot />
          </div>
        </div>
      </transition>
    </template>
    
    <style scoped>
    /* 遮罩 */
    .overlay-mask {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
    }
    
    /* 彈窗本體 */
    .overlay-panel {
      background: #ffffff;
      border-radius: 16px;
      padding: 20px;
      width: 80%;
      max-width: 320px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
    }
    
    /* 進出動畫 */
    .overlay-fade-enter-active,
    .overlay-fade-leave-active {
      transition: opacity 0.25s ease;
    }
    
    .overlay-fade-enter-from,
    .overlay-fade-leave-to {
      opacity: 0;
    }
    </style>
    