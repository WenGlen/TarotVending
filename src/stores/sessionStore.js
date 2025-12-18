import { defineStore } from 'pinia'
import { useResultStore } from './resultStore'


export const useSessionStore = defineStore('session', {
    state: () => ({
        sessionId: null,
        status: 'idle',
      
        selectedTheme: null,
        selectedDeckId: null,
      
        inputTopicPreset: null,
        inputTopicFreeText: '',
      
        deckPile: null,
        spread: null,
      }),
      
      
      

  actions: {
    startSession() {
        this.sessionId = Date.now().toString()
        this.status = 'theme_selected'
    },
      

    selectTheme(themeId) {
        this.selectedTheme = themeId
        this.status = 'deck_selected'
    },
    
    resetSession() {
        this.status = 'idle'
        this.selectedTheme = null
    },

    selectDeck(deckId) {
        this.selectedDeckId = deckId
        this.status = 'shuffling'
    },

    setTopicPreset(text) {
        this.inputTopicPreset = text
    },
    
    setTopicFreeText(text) {
        this.inputTopicFreeText = text
    },
    
    finishShuffling() {
        this.status = 'selecting_cards'
    },

    setSpread(cards) {
        this.spread = {
          cards,
        }
        this.status = 'result_generating'
    },

    generateResult() {
        const resultStore = useResultStore()
      
        // 防止重生
        const existing = resultStore.getResultBySession(this.sessionId)
        if (existing) {
          this.status = 'result_displayed'
          return
        }
      
        const result = {
          resultId: Date.now().toString(),
          sessionId: this.sessionId,
          deckId: this.selectedDeckId,
      
          spread: this.spread,
      
          content: {
            note: '這裡之後由 template + AI 產生',
          },
      
          layoutStyle: 'default',
          skinId: 'default',
      
          createdAt: new Date().toISOString(),
        }
      
        resultStore.addResult(result)
        this.status = 'result_displayed'
    },


    completeSession() {
        this.status = 'completed'
    },

      
  },
})
