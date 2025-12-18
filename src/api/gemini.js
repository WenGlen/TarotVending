// gemini.js

// 使用後端 API 端点
// 開發環境：使用 Vite proxy 連接到本地後端（http://localhost:3000）
// 生產環境：使用環境變數 VITE_API_URL 指定的後端 URL
const getApiEndpoint = () => {
  // 如果設定了環境變數，使用環境變數指定的 URL
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api/gemini-chat`
  }
  
  // 開發環境：使用相對路徑（Vite proxy 會處理）
  if (import.meta.env.DEV) {
    return '/api/gemini-chat'
  }
  
  // 生產環境：如果沒有設定 VITE_API_URL，拋出錯誤
  throw new Error('請設定 VITE_API_URL 環境變數指向後端 API 服務器')
}

const GEMINI_ENDPOINT = getApiEndpoint()

/**
 * 延遲函數
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 從錯誤響應中提取 retryDelay（秒）
 */
function extractRetryDelay(errorData) {
  try {
    const retryInfo = errorData?.error?.details?.find(
      d => d['@type']?.includes('RetryInfo')
    )
    if (retryInfo?.retryDelay) {
      // retryDelay 格式可能是 "49s" 或 "49.345623487s"
      const match = retryInfo.retryDelay.match(/(\d+\.?\d*)/)
      return match ? parseFloat(match[1]) : null
    }
  } catch (e) {
    // 忽略解析錯誤
  }
  return null
}

/**
 * 重試機制：指數退避
 * @param {Function} fn - 要執行的異步函數
 * @param {number} maxRetries - 最大重試次數
 * @param {number} initialDelay - 初始延遲時間（毫秒）
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      // 429 錯誤（配額限制）：不重試，直接拋出
      if (error.status === 429) {
        throw error
      }
      
      // 503 錯誤（服務過載）：使用指數退避重試
      if (error.status === 503 && attempt < maxRetries) {
        const delayTime = initialDelay * Math.pow(2, attempt)
        console.warn(`Gemini API 503 錯誤，${delayTime}ms 後重試 (${attempt + 1}/${maxRetries})...`)
        await delay(delayTime)
        continue
      }
      
      // 其他錯誤或已達最大重試次數，直接拋出
      throw error
    }
  }
  
  throw lastError
}

export async function sendToGemini({ systemPrompt, userPrompt }) {
  return retryWithBackoff(async () => {
    // 使用後端 API，API key 由後端處理，不需要在前端傳遞
    const response = await fetch(
      GEMINI_ENDPOINT,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: userPrompt,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
          generationConfig: {
            response_mime_type: "application/json"
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      
      const error = new Error(`Gemini API error: ${errorText}`)
      error.status = response.status
      error.data = errorData
      throw error
    }

    const data = await response.json()
    return data
  })
}