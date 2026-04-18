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
