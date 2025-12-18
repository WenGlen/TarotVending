<script setup>
    /**
     * 機台通用實體按鈕
     * - 不知道流程
     * - 不知道用途
     * - 只根據 mode 改變外觀
     */
    
    const props = defineProps({
      mode: {
        type: String,
        required: true,
        // disabled | standby | active | locked
      },
      variant: {
        type: String,
        default: 'confirm',
        // confirm | next | finish（預留）
      },
      pulse: {
        type: Boolean,
        default: false,
      },
      showLoadingLights: {
        type: Boolean,
        default: false,
      },
    })
    
    const emit = defineEmits(['press'])
    
    function handlePress() {
      emit('press')
    }
    </script>
    
    <template>
        <div class="machine-action-button-container">
            <button
                class="machine-action-button"
                :class="[
                `mode-${mode}`,
                `variant-${variant}`,
                { pulse }
                ]"
                @click="handlePress"
            >
                <!-- 無文字，之後可放 icon -->
                <span class="button-core">
                  <!-- 三個小綠燈 -->
                  <span 
                    v-if="showLoadingLights"
                    class="loading-lights"
                  >
                    <span 
                      v-for="i in 3" 
                      :key="i"
                      class="loading-light"
                      :class="`light-${i}`"
                    />
                  </span>
                </span>
            </button>
        </div>
    </template>
    
    <style scoped>

    .machine-action-button-container {
        display: flex;
        justify-content: end;
        align-items: center;
        height: 100%;
        width: 100%;
        padding: 12px 0;
    }

    .machine-action-button {
        position: relative;
        height: 18px;
        width: 72px;
        border-radius: 9px;
        border: none;
        background: #2b2b2b;
        cursor: pointer;
        padding: 0;
    }
    
    /* 中央按鍵本體 */
    .button-core {
      display: block;
      width: 100%;
      height: 100%;
      border-radius:  9px;
      box-shadow:
        inset 0 0 0 2px rgba(0,0,0,0.4),
        inset 0 -4px 6px rgba(0,0,0,0.4);
      position: relative;
    }
    
    /* ===== 狀態樣式 ===== */
    
    /* 尚未啟用 */
    .mode-disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    
    /* 待機 */
    .mode-standby {
      opacity: 0.6;
    }
    
    /* 可進行（亮綠燈） */
    .mode-active .button-core {
      background: #3cff8f;
      box-shadow:
        0 0 12px rgba(60,255,143,0.6),
        inset 0 0 0 2px rgba(0,0,0,0.3);
    }
    
    /* 已鎖定 */
    .mode-locked {
      opacity: 0.8;
      cursor: not-allowed;
    }
    
    /* 呼吸燈（可選） */
    .pulse .button-core {
      animation: pulseGlow 1.6s ease-in-out infinite;
    }
    
    @keyframes pulseGlow {
      0% {
        box-shadow: 0 0 6px rgba(60,255,143,0.3);
      }
      50% {
        box-shadow: 0 0 16px rgba(60,255,143,0.8);
      }
      100% {
        box-shadow: 0 0 6px rgba(60,255,143,0.3);
      }
    }
    
    /* ===== 讀取動畫小綠燈 ===== */
    .loading-lights {
      display: flex;
      gap: 4px;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    .loading-light {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #3cff8f;
      opacity: 0.3;
      animation: loadingLightPulse 1.2s ease-in-out infinite;
    }
    
    .loading-light.light-1 {
      animation-delay: 0s;
    }
    
    .loading-light.light-2 {
      animation-delay: 0.4s;
    }
    
    .loading-light.light-3 {
      animation-delay: 0.8s;
    }
    
    @keyframes loadingLightPulse {
      0%,60%, 100% {
        opacity: 0.3;
        transform: scale(1);
      }
      30% {
        opacity: 1;
        transform: scale(1.2);
        box-shadow: 0 0 6px rgba(60,255,143,0.8);
      }
    }
    </style>
    