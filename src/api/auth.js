// 认证相关接口
import request from './rerquest'

// 用户登录
export const loginApi = (data) => {
  return request.post('/auth/login', data)
}

// 用户注册
export const registerApi = (data) => {
  return request.post('/auth/register', data)
}

// 获取当前用户信息
export const getProfileApi = () => {
  return request.get('/auth/me')
}

// 退出登录
export const logoutApi = () => {
  return request.post('/auth/logout')
}

// 刷新 Token（不用 request 实例，避免触发拦截器循环）
import axios from 'axios'
export const refreshTokenApi = (refreshToken) => {
  return axios.post('http://localhost:3000/api/auth/refresh', { refreshToken })
}

// 发送重置密码验证码
export const sendResetCodeApi = (email) => {
  return request.post('/auth/send-reset-code', { email })
}

// 发送注册验证码
export const sendRegisterCodeApi = (email) => {
  return request.post('/auth/send-register-code', { email })
}

// 重置密码
export const resetPasswordApi = (data) => {
  return request.post('/auth/reset-password', data)
}
