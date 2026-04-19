// 用户信息相关接口
import request from './rerquest'

// 更新用户资料
export const updateProfileApi = (data) => {
  return request.put('/users/profile', data)
}

// 修改密码
export const changePasswordApi = (data) => {
  return request.put('/users/password', data)
}

// 上传头像
export const uploadAvatarApi = (formData) => {
  return request.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
