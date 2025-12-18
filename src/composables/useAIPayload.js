import { computed } from 'vue'
import { useSessionStore } from '../stores/sessionStore'
import decksData from '../data/decks.json'

export function useAIPayload() {
  const session = useSessionStore()

  const POSITION_MAP = {
    past: '過去',
    present: '現在',
    future: '未來',
  }

  const ORIENTATION_MAP = {
    upright: '正位',
    reversed: '逆位',
  }

  /**
   * 專門給 AI 使用的最終 payload
   * 只保留「語意資料」
   */
  const aiPayload = computed(() => {
    if (!session.spread || session.spread.length !== 3) {
      return null
    }

    const deck = decksData.find(
      d => d.deckId === session.selectedDeckId
    )

    return {
      topic: session.selectedTheme || null,

      // 觀看目的（人類語言）
      purpose: deck?.title || null,

      question: session.inputTopicFreeText || '',

      spread: session.spread.map(item => ({
        position: POSITION_MAP[item.position] ?? item.position,
        card: item.card.name ?? item.card,
        orientation: ORIENTATION_MAP[item.orientation] ?? item.orientation,
      })),
    }
  })

  return {
    aiPayload,
  }
}
