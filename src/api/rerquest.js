// axios 请求封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { refreshTokenApi } from './auth'

const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
})

// 是否正在刷新 token
let isRefreshing = false
// 刷新期间排队等待的请求
let pendingRequests = []

// 请求拦截器：自动携带 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：自动刷新 token + 统一错误处理
request.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // 401 且不是刷新请求本身 → 尝试刷新 token
    if (error.response?.status === 401 && !originalRequest._retry) {
      const storedRefreshToken = localStorage.getItem('refreshToken')

      if (!storedRefreshToken) {
        // 没有 refreshToken，直接清除登录状态
        clearAuthState()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // 已经在刷新了，把请求排队等待
        return new Promise((resolve) => {
          pendingRequests.push(() => {
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
            resolve(request(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await refreshTokenApi(storedRefreshToken)
        const { token, refreshToken } = response.data.data

        // 更新 token
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)

        // 通知排队的请求重新发送
        pendingRequests.forEach(cb => cb())
        pendingRequests = []

        // 重试原始请求
        originalRequest.headers.Authorization = `Bearer ${token}`
        return request(originalRequest)
      } catch (refreshError) {
        // 刷新也失败了，清除登录状态
        clearAuthState()
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    const message = error.response?.data?.message || '请求失败'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 清除登录状态
function clearAuthState() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  localStorage.removeItem('avatar')
  localStorage.removeItem('userId')
  localStorage.removeItem('role')
}

export default request
