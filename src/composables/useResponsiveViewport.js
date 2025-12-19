import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * 響應式視窗自適應 Composable
 * 處理視口尺寸、縮放比例、安全區域等邏輯
 */
export function useResponsiveViewport(baseWidth = 420, baseHeight = 800) {
  // 視口尺寸（優先使用 visualViewport，降級使用 window.innerWidth/Height）
  const getViewportSize = () => {
    if (window.visualViewport) {
      return {
        width: window.visualViewport.width,
        height: window.visualViewport.height
      }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  const initialSize = getViewportSize()
  const viewportWidth = ref(initialSize.width)
  const viewportHeight = ref(initialSize.height)

  // 容器引用和實際尺寸
  const containerRef = ref(null)
  const containerWidth = ref(baseWidth)
  const containerHeight = ref(baseHeight)

  // 計算縮放比例（取寬高比例的最小值，確保兩個方向都能完整顯示）
  const scale = computed(() => {
    if (containerWidth.value === 0 || containerHeight.value === 0) return 1
    const scaleX = viewportWidth.value / containerWidth.value
    const scaleY = viewportHeight.value / containerHeight.value
    return Math.min(scaleX, scaleY, 1) // 不超過 1，避免放大
  })

  // 更新容器實際尺寸
  function updateContainerSize() {
    if (containerRef.value) {
      const rect = containerRef.value.getBoundingClientRect()
      const newWidth = rect.width || baseWidth
      const newHeight = rect.height || baseHeight
      
      // 只有當尺寸真的改變時才更新，避免不必要的重新計算
      if (containerWidth.value !== newWidth || containerHeight.value !== newHeight) {
        containerWidth.value = newWidth
        containerHeight.value = newHeight
      }
    }
  }

  // 設置安全區域 padding（確保在所有設備上都有）
  function setSafeAreaPadding() {
    let safeAreaTop = 20 // 預設最小 padding
    let safeAreaBottom = 20
    let safeAreaLeft = 0
    let safeAreaRight = 0
    
    // 方法1: 嘗試讀取 env() 變數（使用臨時元素）
    try {
      // 確保 document.body 存在
      if (!document.body) {
        throw new Error('document.body not available')
      }
      
      const tempEl = document.createElement('div')
      tempEl.style.position = 'fixed'
      tempEl.style.top = '0'
      tempEl.style.left = '0'
      tempEl.style.width = '1px'
      tempEl.style.height = '1px'
      tempEl.style.paddingTop = 'env(safe-area-inset-top, 0px)'
      tempEl.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)'
      tempEl.style.paddingLeft = 'env(safe-area-inset-left, 0px)'
      tempEl.style.paddingRight = 'env(safe-area-inset-right, 0px)'
      tempEl.style.visibility = 'hidden'
      tempEl.style.pointerEvents = 'none'
      document.body.appendChild(tempEl)
      
      // 強制重排以確保樣式計算
      void tempEl.offsetHeight
      
      const computedStyle = getComputedStyle(tempEl)
      const envTop = parseInt(computedStyle.paddingTop, 10) || 0
      const envBottom = parseInt(computedStyle.paddingBottom, 10) || 0
      const envLeft = parseInt(computedStyle.paddingLeft, 10) || 0
      const envRight = parseInt(computedStyle.paddingRight, 10) || 0
      
      document.body.removeChild(tempEl)
      
      // 如果讀取到有效的安全區域值，使用它（但至少要有 20px）
      if (envTop > 0) safeAreaTop = Math.max(envTop, 20)
      if (envBottom > 0) safeAreaBottom = Math.max(envBottom, 20)
      safeAreaLeft = envLeft
      safeAreaRight = envRight
    } catch (e) {
      // 忽略錯誤，使用預設值
    }
    
    // 方法2: 檢測設備類型，針對不同設備設置不同的 padding
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isMobile = /mobile/.test(userAgent) || window.innerWidth < 768
    
    // 檢測是否為 iPhone（不包含 iPad）
    const isIPhone = /iphone/.test(userAgent)
    
    // 如果是手機設備，確保有足夠的 padding
    if (isMobile) {
      // iPhone（所有型號，包括 iPhone 12）都需要 padding
      // 不依賴高度判斷，因為不同 iPhone 的高度可能不同
      if (isIPhone) {
        safeAreaTop = Math.max(safeAreaTop, 44) // iPhone 狀態欄高度（瀏海機型）
        safeAreaBottom = Math.max(safeAreaBottom, 34) // iPhone 底部指示器
      }
      // iPad 也需要 padding（但可能不需要那麼多）
      else if (isIOS && /ipad/.test(userAgent)) {
        safeAreaTop = Math.max(safeAreaTop, 20)
        safeAreaBottom = Math.max(safeAreaBottom, 20)
      }
      // Android 手機（包括 Samsung）也需要 padding
      else if (isAndroid) {
        safeAreaTop = Math.max(safeAreaTop, 24) // Android 狀態欄
        safeAreaBottom = Math.max(safeAreaBottom, 24) // Android 導航欄
      }
    }
    
    // 動態設置 CSS 變數（確保一定會設置）
    document.documentElement.style.setProperty('--safe-area-top', `${safeAreaTop}px`)
    document.documentElement.style.setProperty('--safe-area-bottom', `${safeAreaBottom}px`)
    document.documentElement.style.setProperty('--safe-area-left', `${safeAreaLeft}px`)
    document.documentElement.style.setProperty('--safe-area-right', `${safeAreaRight}px`)
    
    return { safeAreaTop, safeAreaBottom, safeAreaLeft, safeAreaRight }
  }

  // 更新視口尺寸（支援 visualViewport 和安全區域）
  function updateViewportSize() {
    const size = getViewportSize()
    const originalHeight = size.height
    
    // 設置安全區域 padding
    const { safeAreaTop, safeAreaBottom } = setSafeAreaPadding()
    
    // 計算可用高度（考慮安全區域）
    let availableHeight = originalHeight
    if (originalHeight < 1000) {
      availableHeight = Math.max(
        originalHeight - safeAreaTop - safeAreaBottom,
        originalHeight * 0.75 // 至少保留 75% 的高度
      )
    }
    
    // 更新視口尺寸
    viewportWidth.value = size.width
    viewportHeight.value = availableHeight
    
    updateContainerSize()
  }

  // ResizeObserver 監聽容器尺寸變化
  let resizeObserver = null
  let visualViewportResizeHandler = null
  let visualViewportScrollHandler = null

  // 初始化視窗監聽
  onMounted(() => {
    // 使用 nextTick 確保 DOM 已渲染
    nextTick(() => {
      // 立即設置安全區域 padding（在更新視口尺寸之前）
      setSafeAreaPadding()
      updateViewportSize()
      updateContainerSize()
      
      // 使用 ResizeObserver 監聽容器尺寸變化
      if (containerRef.value && window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          updateContainerSize()
        })
        resizeObserver.observe(containerRef.value)
      }
    })
    
    // 延遲一下確保 DOM 完全渲染（處理動態內容）
    setTimeout(() => {
      setSafeAreaPadding() // 再次設置，確保生效
      updateContainerSize()
    }, 200)
    
    // 監聽 window resize（降級方案）
    window.addEventListener('resize', updateViewportSize)
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        updateViewportSize()
      }, 200)
    })
    
    // 監聽 visualViewport 變化（如果可用，優先使用）
    if (window.visualViewport) {
      visualViewportResizeHandler = () => updateViewportSize()
      visualViewportScrollHandler = () => updateViewportSize()
      
      window.visualViewport.addEventListener('resize', visualViewportResizeHandler)
      window.visualViewport.addEventListener('scroll', visualViewportScrollHandler)
    }
  })

  // 清理監聽器
  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    window.removeEventListener('resize', updateViewportSize)
    window.removeEventListener('orientationchange', updateViewportSize)
    
    // 清理 visualViewport 監聽器
    if (window.visualViewport) {
      if (visualViewportResizeHandler) {
        window.visualViewport.removeEventListener('resize', visualViewportResizeHandler)
      }
      if (visualViewportScrollHandler) {
        window.visualViewport.removeEventListener('scroll', visualViewportScrollHandler)
      }
    }
  })

  return {
    // 響應式引用
    containerRef,
    viewportWidth,
    viewportHeight,
    containerWidth,
    containerHeight,
    scale,
    
    // 方法
    updateViewportSize,
    updateContainerSize,
    setSafeAreaPadding
  }
}

