/**
 * 將 Gemini 回傳的文字，解析為系統可用的 Result.content
 */
export function parseGeminiResult(rawText) {
    const EMPTY_RESULT = {
      summary: '',
      past: '',
      present: '',
      future: '',
      overall: '',
    }
  
    if (!rawText || typeof rawText !== 'string') {
      return {
        ...EMPTY_RESULT,
        overall: '解析失敗：AI 未回傳有效內容',
      }
    }
  
    // ---------- 1️⃣ 嘗試擷取 JSON ----------
    let jsonText = rawText
  
    // 移除 ```json ``` 包裝
    const jsonMatch = rawText.match(/```json([\s\S]*?)```/)
    if (jsonMatch) {
      jsonText = jsonMatch[1]
    }
  
    try {
      const parsed = JSON.parse(jsonText)
  
      return {
        summary: parsed.summary ?? '',
        past: parsed.past ?? '',
        present: parsed.present ?? '',
        future: parsed.future ?? '',
        overall: parsed.overall ?? '',
      }
    } catch (e) {
      // JSON 解析失敗，進 fallback
    }
  
    // ---------- 2️⃣ fallback：純文字解析 ----------
    return {
      ...EMPTY_RESULT,
      overall: rawText.trim(),
    }
  }
  