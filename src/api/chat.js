// 聊天相关接口
import request from './rerquest'

// 获取频道列表（无需认证）
export const getChannelsApi = () => {
  return request.get('/chat/channels')
}

// 获取历史消息（需要认证）
// params: { limit: 50, before: 'ObjectId' }
export const getMessagesApi = (channelId, params = {}) => {
  return request.get(`/chat/channels/${channelId}/messages`, { params })
}
