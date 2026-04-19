// Socket.IO 客户端单例封装
import { io } from 'socket.io-client'

let socket = null

/**
 * 获取 Socket.IO 客户端实例（单例）
 * @param {string} token - JWT token，首次连接时传入
 * @returns {import('socket.io-client').Socket}
 */
export const getSocket = (token) => {
  if (!socket) {
    socket = io('http://localhost:3000', {
      auth: { token },
      autoConnect: false
    })
  }
  return socket
}

/**
 * 断开并销毁 Socket 连接
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
