import { defineStore } from 'pinia'

import type { Lista } from '@/types/types'

export const useListsStore = defineStore('lists', {
  state: () => ({
    selected: null as Lista | null,
  }),
  actions: {
    setSelected(lista: Lista) {
      this.selected = lista
    },
    clearSelected() {
      this.selected = null
    },
  },
})
