export const machineUIMap = {
    idle: {
      activeSection: 'none',
      showOverlay: true,
      machineMode: 'standby',
    },
  
    theme_selected: {
      activeSection: 'coin',
      showOverlay: true,
      machineMode: 'standby',
    },
  
    deck_selected: {
      activeSection: 'product',
      showOverlay: false,
      machineMode: 'active',
    },
  
    shuffling: {
      activeSection: 'cards',
      showOverlay: true,
      machineMode: 'active',
    },
  
    selecting_cards: {
      activeSection: 'cards',
      showOverlay: false,
      machineMode: 'active',
      action: 'confirm-spread',
    },
  
    result_generating: {
      activeSection: 'cards',
      showOverlay: false,
      machineMode: 'processing',
    },
  
    result_displayed: {
      activeSection: 'outlet',
      showOverlay: false,
      machineMode: 'locked',
    },
  
    completed: {
      activeSection: 'none',
      showOverlay: true,
      machineMode: 'sleep',
    },
  }
  