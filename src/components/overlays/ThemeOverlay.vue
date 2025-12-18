<script setup>
    const emit = defineEmits(['start-drag'])
    
    function onPointerDown(e) {
      emit('start-drag', e)
    }
    </script>
    
    <template>
      <div class="overlay-inner">
        <p>請長按將金幣拿起</p>
    
        <div
          class="overlay-coin"
          @pointerdown="onPointerDown"
        >
          🪙
        </div>
      </div>
    </template>
    
    <style scoped>

    .overlay-inner {
      text-align: center;
    }

    .coin-button {
      font-size: 20px;
      padding: 12px 20px;
    }

    .overlay-coin {
        font-size: 64px;
        cursor: grab;
        user-select: none;
        touch-action: none;
    }

    </style>
    