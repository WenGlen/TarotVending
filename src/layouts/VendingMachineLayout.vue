<script setup>
    import MachineOverlay from '../components/MachineOverlay.vue'
    
    /**
     * Props
     * activeSection: 'none' | 'product' | 'guide' | 'cards' | 'coin' | 'outlet'
     * machineMode: 'sleep' | 'standby' | 'active' | 'processing' | 'locked'
     */
    const props = defineProps({
      activeSection: {
        type: String,
        default: 'none',
      },
      showOverlay: {
        type: Boolean,
        default: false,
      },
      machineMode: {
        type: String,
        default: 'standby',
      },
    })
    
    const emit = defineEmits(['outlet-click'])
    
    function handleOutletClick() {
      emit('outlet-click')
    }
    
    function sectionClass(name) {
      if (props.machineMode === 'sleep') {
        return ['inactive']
      }
    
      // guide section 特殊處理：除了 idle 狀態（activeSection === 'none'），其他時間都長亮
      if (name === 'guide') {
        if (props.activeSection === 'none') {
          return ['standby']
        }
        return ['active', props.machineMode]
      }
    
      if (props.activeSection === name) {
        return ['active', props.machineMode]
      }
    
      return ['standby']
    }
    </script>
    
    <template>
      <div class="vending-machine">
    
        <!-- 商品陳列區 -->
        <section
          class="section product"
          :class="sectionClass('product')"
        >
          <slot name="product" />
        </section>
    
        <!-- 引導文字區 -->
        <section
          class="section guide"
          :class="sectionClass('guide')"
        >
          <div class="guide-panel">
            <div class="guide-content">
              <slot name="guide" />
            </div>
          </div>
        </section>
    
        <!-- 算牌區 -->
        <section
          class="section cards"
          :class="sectionClass('cards')"
        >
          <slot name="cards" />
        </section>
    
        <div class="machine-bottom">

          <!-- 出貨區 -->
          <section
            class="section outlet"
            :class="sectionClass('outlet')"
            @click="handleOutletClick"
          >
            <slot name="outlet">
              <div class="outlet-slot">
                <div class="outlet-slot-content">
                  ✉️
                  <p>占卜結果</p>
                </div>
              </div>
            </slot>
          </section>

          <!-- 投幣區 -->
          <section
            class="section coin"
            :class="sectionClass('coin')"
          >
            <div class="coin-slots">
              <div class="coin-slot" data-theme="love">
                <div class="coin-slot-img-outer"><div class="coin-slot-img-inner"/></div>
                <span>感情 ❤️</span>
              </div>
              <div class="coin-slot" data-theme="career">
                <div class="coin-slot-img-outer"><div class="coin-slot-img-inner"/></div>
                <span>事業 💼</span>
              </div>
              <div class="coin-slot" data-theme="life">
                <div class="coin-slot-img-outer"><div class="coin-slot-img-inner"/></div>
                <span>生活 🌿</span>
              </div>
            </div>
            
            <slot name="coin" />
          </section>

        </div>
    
        <!-- Overlay -->
        <MachineOverlay :show="showOverlay">
          <slot name="overlay" />
        </MachineOverlay>

        
    
      </div>





    </template>
    
    <style scoped>
    /* ===== 機台外框 ===== */
    .vending-machine {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      background: hsl(210, 10%, 50%);
      border-radius: 24px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      position: relative;
    }
    
    /* ===== 區塊共用基礎 ===== */
    .section {
      border-radius: 12px;
      padding: 12px;
      background: #ffffff;
      opacity: 0.8;
      filter: saturate(0.6);
      transition:
        opacity 0.35s ease,
        box-shadow 0.35s ease,
        filter 0.35s ease;
    }
    
    /* ===== 區塊尺寸 ===== */
    .section.product {
      min-height: 120px;
    }
    
    .section.guide {
      min-height: 84px;
      height: 84px;
      display: flex;
      align-items: stretch;

    }
    
    .section.cards {
      min-height: 220px;
    }
    
    .section.outlet {
      min-height: 96px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    .section.coin {
      min-height: 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
    }
    
    /* ===== 狀態樣式 ===== */
    
    /* 待命通電 */
    .section.standby {
      opacity: 0.60;
      filter: saturate(0.8);
    }
    
    /* 操作中（呼吸感） */
    .section.active {
      opacity: 1 ;
      filter: saturate(1);
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
      animation: pulse 2.8s ease-in-out infinite;
    }
    
    /* 占卜處理中（穩定） */
    .section.active.processing {
      opacity: 1 ;
      animation: none;
      box-shadow:
        inset 0 0 0 2px rgba(0, 0, 0, 0.2),
        0 0 12px rgba(255, 255, 255, 0.25);
    }
    
    .section.processing {
      animation: none;
      box-shadow:
        inset 0 0 0 2px rgba(0, 0, 0, 0.2),
        0 0 12px rgba(255, 255, 255, 0.25);
    }
    
    /* 已完成鎖定 */
    .section.active.locked {
      opacity: 1 ;
      animation: none;
    }
    
    .section.locked {
      opacity: 0.9;
      animation: none;
    }
    
    /* 休眠 */
    .section.inactive {
      opacity: 0.18;
      filter: saturate(0.4);
      animation: none;
    }
    
    /* ===== 呼吸動畫 ===== */
    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
      }
      50% {
        box-shadow:
          0 0 0 2px rgba(0, 0, 0, 0.25),
          0 0 18px rgba(255, 255, 255, 0.35);
      }
      100% {
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
      }
    }




/* ===== 引導文字區 ===== */
.guide-panel {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.75);
  padding: 6px 12px;


}

.guide-content {
  font-size: 16px;
  color: hsl(140, 100%, 75%);
  letter-spacing: 0.1em;
  font-weight: 500;
  text-shadow: 0 0 10px hsla(140, 100%, 75%, 0.3);
  text-align: center;
}

/* ===== 出貨口 ===== */

.machine-bottom {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.outlet-slot {
  width: 96px;
  height: 96px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.section.outlet.active .outlet-slot {
  opacity: 1;
  transform: scale(1.05);
  background: rgba(60, 255, 143, 0.75);
  box-shadow: 0 0 24px rgba(60, 255, 143, 1);
}

.outlet-slot-content {
  display: none;
  font-size: 36px;

}

.outlet-slot-content p {
  font-size: 10px;
  margin: 0px;
}

.section.outlet.active .outlet-slot-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}



    /* ===== 投幣槽 ===== */
    .coin-slots {
        flex: 1;
        display: flex;
        justify-content: space-around;
        border-radius: 8px;
    }

    .coin-slot {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 20px;
    }

    .coin-slot-img-outer {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .coin-slot-img-inner {
    width: 12px;
    height: 48px;
    border-radius: 4px;
    background: #777;
    }


    .coin-slot span {
        font-size: 12px;
        margin-top: 4px;
    }




    
    </style>
    