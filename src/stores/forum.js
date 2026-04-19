import { defineStore } from 'pinia'
import { getChannelsApi, getMessagesApi } from '../api/chat'
import { getSocket, disconnectSocket } from '../utils/socket'

export const useForumStore = defineStore('forum', {
  state: () => ({
    channels: [],
    currentChannelId: null,
    messages: [],
    hasMore: true,
    connected: false
  }),

  actions: {
    // 获取频道列表
    async fetchChannels() {
      try {
        const response = await getChannelsApi()
        if (response.data.success) {
          this.channels = response.data.data
        }
      } catch (error) {
        console.error('获取频道列表失败:', error)
      }
    },

    // 获取历史消息
    async fetchMessages(channelId, before = null) {
      try {
        const params = { limit: 50 }
        if (before) {
          params.before = before
        }
        const response = await getMessagesApi(channelId, params)
        if (response.data.success) {
          const { messages, hasMore } = response.data.data
          if (before) {
            // 加载更多：新消息拼接到前面（时间更早的）
            this.messages = [...messages, ...this.messages]
          } else {
            // 首次加载
            this.messages = messages
          }
          this.hasMore = hasMore
        }
      } catch (error) {
        console.error('获取消息失败:', error)
      }
    },

    // 建立 Socket.IO 连接
    connectSocket(token) {
      const socket = getSocket(token)

      // 监听新消息
      socket.on('new-message', (message) => {
        this.messages.push(message)
      })

      // 监听连接/断开
      socket.on('connect', () => {
        this.connected = true
      })
      socket.on('disconnect', () => {
        this.connected = false
      })

      socket.connect()
    },

    // 加入频道
    async joinChannel(channelId) {
      this.currentChannelId = channelId
      this.messages = []
      this.hasMore = true

      // 加载历史消息
      await this.fetchMessages(channelId)

      // 通过 Socket 加入频道房间
      const socket = getSocket()
      if (socket && this.connected) {
        socket.emit('join-channel', { channelId })
      }
    },

    // 离开频道
    leaveChannel() {
      const socket = getSocket()
      if (socket && this.connected && this.currentChannelId) {
        socket.emit('leave-channel', { channelId: this.currentChannelId })
      }
      this.currentChannelId = null
      this.messages = []
    },

    // 发送消息
    sendMessage(content, replyTo = null) {
      const socket = getSocket()
      if (!socket || !this.connected || !this.currentChannelId) return

      socket.emit('send-message', {
        channelId: this.currentChannelId,
        content,
        replyTo
      }, (ack) => {
        // ack 回调：发送失败时提示（成功的不需要处理，new-message 事件会自动推送）
        if (ack && !ack.success) {
          console.error('发送消息失败:', ack.message)
        }
      })
    },

    // 加载更多历史消息（上拉加载）
    async loadMoreMessages() {
      if (!this.hasMore || !this.currentChannelId) return
      const oldestMessage = this.messages[0]
      const before = oldestMessage ? oldestMessage.id : null
      await this.fetchMessages(this.currentChannelId, before)
    },

    // 断开 Socket 连接
    disconnectSocketAction() {
      this.leaveChannel()
      disconnectSocket()
      this.connected = false
    }
  }
})
