import { defineStore } from 'pinia'
import { loginApi, registerApi, getProfileApi, logoutApi } from '../api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 从 localStorage 初始化，实现页面刷新后保持登录状态
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    username: localStorage.getItem('username') || '',
    avatar: localStorage.getItem('avatar') || '',
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    role: localStorage.getItem('role') || ''
  }),

  actions: {
    // 登录
    async login(username, password) {
      const response = await loginApi({ username, password })
      const { user, token } = response.data.data

      this.isLoggedIn = true
      this.username = user.username
      this.avatar = user.avatar || ''
      this.token = token
      this.userId = user.id
      this.role = user.role

      // 持久化到 localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', user.username)
      localStorage.setItem('avatar', user.avatar || '')
      localStorage.setItem('token', token)
      localStorage.setItem('userId', user.id)
      localStorage.setItem('role', user.role)
    },

    // 注册
    async register(username, email, password) {
      const response = await registerApi({ username, email, password, confirmPassword: password })
      const { user, token } = response.data.data

      this.isLoggedIn = true
      this.username = user.username
      this.avatar = user.avatar || ''
      this.token = token
      this.userId = user.id
      this.role = user.role

      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', user.username)
      localStorage.setItem('avatar', user.avatar || '')
      localStorage.setItem('token', token)
      localStorage.setItem('userId', user.id)
      localStorage.setItem('role', user.role)
    },

    // 退出登录
    async logout() {
      try {
        await logoutApi()
      } catch (error) {
        // 即使接口报错也清除本地状态
        console.error('退出登录接口失败:', error)
      }

      this.isLoggedIn = false
      this.username = ''
      this.avatar = ''
      this.token = ''
      this.userId = ''
      this.role = ''

      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      localStorage.removeItem('avatar')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('role')
    },

    // 从服务器获取最新用户信息（用于页面刷新后校验 token 是否仍然有效）
    async fetchProfile() {
      try {
        const response = await getProfileApi()
        const user = response.data.data

        this.username = user.username
        this.avatar = user.avatar || ''
        this.role = user.role
        this.userId = user.id

        localStorage.setItem('username', user.username)
        localStorage.setItem('avatar', user.avatar || '')
        localStorage.setItem('role', user.role)
        localStorage.setItem('userId', user.id)
      } catch (error) {
        // token 无效，清除登录状态
        this.isLoggedIn = false
        this.token = ''
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('token')
      }
    }
  },

  getters: {
    userInfo: (state) => {
      return {
        username: state.username,
        avatar: state.avatar,
        isLoggedIn: state.isLoggedIn,
        role: state.role
      }
    }
  }
})
