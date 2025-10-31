import { defineStore } from 'pinia'

import type { FirebaseUser } from '@/types/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as FirebaseUser | null,
  }),
  actions: {
    setSelected(user: FirebaseUser) {
      this.user = user
      const stringUser = JSON.stringify(this.user)
      localStorage.setItem('user', stringUser)
    },
    getHistoryUser() {
        const storageUser = localStorage.getItem('user')
        const decodedUser = JSON.parse(storageUser!)
        this.user = decodedUser
    },
    clearUser() {
        this.user = null
        localStorage.setItem('user', '')
    }
  },
})
