import { defineStore } from 'pinia'

export const useResultStore = defineStore('result', {
  state: () => ({
    results: [],
  }),

  actions: {
    addResult(result) {
      this.results.push(result)
    },

    getResultBySession(sessionId) {
      return this.results.find(r => r.sessionId === sessionId)
    },
  },
})
