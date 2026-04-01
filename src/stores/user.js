import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    avatar: ''
  }),
  
  actions: {
    login(username, avatar) {
      this.isLoggedIn = true
      this.username = username
      this.avatar = avatar
    },
    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.avatar = ''
    }
  },
  
  getters: {
    userInfo: (state) => {
      return {
        username: state.username,
        avatar: state.avatar,
        isLoggedIn: state.isLoggedIn
      }
    }
  }
})
