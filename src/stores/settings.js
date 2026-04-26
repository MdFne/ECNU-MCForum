import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    sakuraEnabled: localStorage.getItem('sakura') !== 'false',
    darkMode: localStorage.getItem('darkMode') === 'true',
  }),

  actions: {
    toggleSakura() {
      this.sakuraEnabled = !this.sakuraEnabled
      localStorage.setItem('sakura', this.sakuraEnabled)
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
      document.documentElement.classList.toggle('dark', this.darkMode)
    },

    // 初始化：如果 localStorage 里是暗色模式，立即加上 class
    init() {
      document.documentElement.classList.toggle('dark', this.darkMode)
    }
  }
})
