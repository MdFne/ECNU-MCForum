import { defineStore } from 'pinia'
import { loginApi, registerApi, getProfileApi, logoutApi } from '../api/auth'
import { updateProfileApi, changePasswordApi, uploadAvatarApi } from '../api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 从 localStorage 初始化，实现页面刷新后保持登录状态
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    username: localStorage.getItem('username') || '',
    avatar: localStorage.getItem('avatar') || '',
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    userId: localStorage.getItem('userId') || '',
    role: localStorage.getItem('role') || '',
    school: localStorage.getItem('school') || '',
    age: localStorage.getItem('age') || '',
    email: localStorage.getItem('email') || '',
    lastLoginAt: localStorage.getItem('lastLoginAt') || '',
    createdAt: localStorage.getItem('createdAt') || ''
  }),

  actions: {
    // 登录
    async login(username, password) {
      const response = await loginApi({ username, password })
      const { user, token, refreshToken } = response.data.data

      this.isLoggedIn = true
      this.username = user.username
      this.avatar = user.avatar || ''
      this.token = token
      this.refreshToken = refreshToken
      this.userId = user.id
      this.role = user.role
      this.school = user.school || ''
      this.age = user.age || ''
      this.email = user.email || ''
      this.lastLoginAt = user.lastLoginAt || ''
      this.createdAt = user.createdAt || ''

      // 持久化到 localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', user.username)
      localStorage.setItem('avatar', user.avatar || '')
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', user.id)
      localStorage.setItem('role', user.role)
      localStorage.setItem('school', user.school || '')
      localStorage.setItem('age', user.age || '')
      localStorage.setItem('email', user.email || '')
      localStorage.setItem('lastLoginAt', user.lastLoginAt || '')
      localStorage.setItem('createdAt', user.createdAt || '')
    },

    // 注册
    async register(username, email, password) {
      const response = await registerApi({ username, email, password, confirmPassword: password })
      const { user, token, refreshToken } = response.data.data

      this.isLoggedIn = true
      this.username = user.username
      this.avatar = user.avatar || ''
      this.token = token
      this.refreshToken = refreshToken
      this.userId = user.id
      this.role = user.role
      this.school = user.school || ''
      this.age = user.age || ''
      this.email = user.email || ''
      this.lastLoginAt = user.lastLoginAt || ''
      this.createdAt = user.createdAt || ''

      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', user.username)
      localStorage.setItem('avatar', user.avatar || '')
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userId', user.id)
      localStorage.setItem('role', user.role)
      localStorage.setItem('school', user.school || '')
      localStorage.setItem('age', user.age || '')
      localStorage.setItem('email', user.email || '')
      localStorage.setItem('lastLoginAt', user.lastLoginAt || '')
      localStorage.setItem('createdAt', user.createdAt || '')
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
      this.refreshToken = ''
      this.userId = ''
      this.role = ''
      this.school = ''
      this.age = ''
      this.email = ''
      this.lastLoginAt = ''
      this.createdAt = ''

      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('username')
      localStorage.removeItem('avatar')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('role')
      localStorage.removeItem('school')
      localStorage.removeItem('age')
      localStorage.removeItem('email')
      localStorage.removeItem('lastLoginAt')
      localStorage.removeItem('createdAt')
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
        this.school = user.school || ''
        this.age = user.age || ''
        this.email = user.email || ''
        this.lastLoginAt = user.lastLoginAt || ''
        this.createdAt = user.createdAt || ''

        localStorage.setItem('username', user.username)
        localStorage.setItem('avatar', user.avatar || '')
        localStorage.setItem('role', user.role)
        localStorage.setItem('userId', user.id)
        localStorage.setItem('school', user.school || '')
        localStorage.setItem('age', user.age || '')
        localStorage.setItem('email', user.email || '')
        localStorage.setItem('lastLoginAt', user.lastLoginAt || '')
        localStorage.setItem('createdAt', user.createdAt || '')
      } catch (error) {
        // token 无效，清除登录状态
        this.isLoggedIn = false
        this.token = ''
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('token')
      }
    },

    // 更新用户资料
    async updateProfile(data) {
      const response = await updateProfileApi(data)
      const user = response.data.data

      // 更新 store 状态
      this.username = user.username
      this.avatar = user.avatar || ''
      this.school = user.school || ''
      this.age = user.age || ''
      this.email = user.email || ''

      // 持久化到 localStorage
      localStorage.setItem('username', user.username)
      localStorage.setItem('avatar', user.avatar || '')
      localStorage.setItem('school', user.school || '')
      localStorage.setItem('age', user.age || '')
      localStorage.setItem('email', user.email || '')

      return response
    },

    // 修改密码
    async changePassword(data) {
      const response = await changePasswordApi(data)
      return response
    },

    // 上传头像
    async uploadAvatar(file) {
      const formData = new FormData()
      formData.append('avatar', file)
      const response = await uploadAvatarApi(formData)
      const { avatar } = response.data.data

      this.avatar = avatar
      localStorage.setItem('avatar', avatar)

      return response
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
