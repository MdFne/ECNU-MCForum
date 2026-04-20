<template>
  <div class="bg-content">
    <div class="bg-image"></div>
    <div class="forum-container">
      <div class="channels-sidebar">
        <h2>频道</h2>
        <div class="channels-list">
          <Channel
            v-for="channel in forumStore.channels"
            :key="channel.id"
            :channel="channel"
            :active="channel.id === channelId"
          />
        </div>
      </div>

      <!-- 未选择频道：占位提示 -->
      <div v-if="!channelId" class="chat-content">
        <h2>选择一个频道开始聊天</h2>
        <p>点击左侧频道进入对应的聊天室</p>
      </div>

      <!-- 已选择频道：聊天界面 -->
      <div v-else class="chat-page">
        <div class="chat-header">
          <h2>{{ currentChannelName }}</h2>
          <span class="connection-status" :class="{ connected: forumStore.connected }">
            {{ forumStore.connected ? '已连接' : '未连接' }}
          </span>
        </div>

        <div class="chat-messages" ref="messagesContainer">
          <!-- 上拉加载更多 -->
          <div v-if="forumStore.hasMore" class="load-more" @click="loadMore">
            加载更多消息
          </div>
          <!-- 消息列表 -->
          <div
            v-for="message in forumStore.messages"
            :key="message.id"
            class="message"
            :class="{'message-self': message.sender?.id === userStore.userId}"
          >
            <!-- 消息头像 -->
            <img
              v-if="message.sender"
              :src="getAvatarUrl(message.sender.avatar)"
              @error="handleAvatarError"
              class="message-avatar"
              alt="头像"
            />
            <div class="message-body">
              <div class="message-header">
                <span class="message-sender">{{ message.sender ? message.sender.username : '未知用户' }}</span>
                <span class="message-time">{{ formatTime(message.createdAt) }}</span>
              </div>
              <div class="message-content">
                <!-- 回复引用 -->
                <div v-if="message.replyTo" class="reply-reference">
                  <span class="reply-to-sender">{{ message.replyTo.sender.username }}</span>:
                  {{ message.replyTo.content.length > 30 ? message.replyTo.content.slice(0, 30) + '...' : message.replyTo.content }}
                </div>
                {{ message.content }}
                <!-- 回复按钮 -->
                <button class="reply-btn" @click="setReplyTo(message)" title="回复">↩</button>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <!-- 回复预览条 -->
          <div v-if="replyingTo" class="reply-bar">
            <span>
              回复 <strong>{{ replyingTo.sender ? replyingTo.sender.username : '未知用户' }}</strong>:
              {{ replyingTo.content.length > 20 ? replyingTo.content.slice(0, 20) + '...' : replyingTo.content }}
            </span>
            <button class="cancel-reply" @click="replyingTo = null">✕</button>
          </div>
          <div class="input-row">
            <input
              type="text"
              v-model="newMessage"
              :placeholder="inputPlaceholder"
              :disabled="!userStore.isLoggedIn"
              @keyup.enter="handleSendMessage"
            />
            <button @click="handleSendMessage" :disabled="!userStore.isLoggedIn">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Channel from '../components/channel.vue'
import { useForumStore } from '../stores/forum'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import defaultAvatar from '../assets/avatar.webp'

const route = useRoute()
const forumStore = useForumStore()
const userStore = useUserStore()

// 当前频道ID（来自路由参数）
const channelId = computed(() => route.params.channelId || '')
const newMessage = ref('')
const replyingTo = ref(null)
const messagesContainer = ref(null)

// 当前频道名称
const currentChannelName = computed(() => {
  const channel = forumStore.channels.find(ch => ch.id === channelId.value)
  return channel ? channel.name : '聊天频道'
})

// 输入框占位文本
const inputPlaceholder = computed(() => {
  if (!userStore.isLoggedIn) return '请先登录后再发送消息'
  if (!forumStore.connected) return '正在连接...'
  if (replyingTo.value) {
    const name = replyingTo.value.sender ? replyingTo.value.sender.username : '未知用户'
    return `回复 ${name}...`
  }
  return '输入消息...'
})

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const curDate = new Date()
  if (date.getFullYear() === curDate.getFullYear()) {
    return date.toLocaleTimeString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  } else {
    return date.toLocaleTimeString('zh-CN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
}

// 处理头像加载错误
const handleAvatarError = (event) => {
  event.target.src = defaultAvatar
  event.target.onerror = null
}

// 拼接头像URL：本地上传的头像需要加上后端地址
const API_BASE = 'http://localhost:3000'
const getAvatarUrl = (avatar) => {
  if (!avatar) return defaultAvatar
  if (avatar.startsWith('/uploads/')) return API_BASE + avatar
  return avatar
}

// 设置回复目标
const setReplyTo = (message) => {
  replyingTo.value = message
}

// 发送消息
const handleSendMessage = () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  if (!newMessage.value.trim()) return

  const replyToId = replyingTo.value ? replyingTo.value.id : null
  forumStore.sendMessage(newMessage.value.trim(), replyToId)
  newMessage.value = ''
  replyingTo.value = null
}

// 加载更多历史消息
const loadMore = async () => {
  await forumStore.loadMoreMessages()
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 视差滚动
const parallaxScroll = () => {
  const scrollTop = window.scrollY
  const bg = document.querySelector('.bg-image')
  bg.style.transform = `translateY(${scrollTop * -0.3}px)`
}

// 监听新消息自动滚动
watch(() => forumStore.messages.length, () => {
  scrollToBottom()
})

// 监听路由变化，切换频道
watch(channelId, async (newChannelId, oldChannelId) => {
  if (newChannelId && newChannelId !== oldChannelId) {
    replyingTo.value = null
    await forumStore.joinChannel(newChannelId)
    scrollToBottom()
  }
})

onMounted(async () => {
  // 获取频道列表
  await forumStore.fetchChannels()

  // 建立 Socket 连接（需要登录）
  if (userStore.isLoggedIn && userStore.token) {
    forumStore.connectSocket(userStore.token)
    // 等待连接建立后加入频道
    setTimeout(async () => {
      if (channelId.value) {
        await forumStore.joinChannel(channelId.value)
        scrollToBottom()
      }
    }, 500)
  } else if (channelId.value) {
    // 未登录也能查看消息（通过 REST API）
    await forumStore.fetchMessages(channelId.value)
  }

  window.addEventListener('scroll', parallaxScroll)
})

onUnmounted(() => {
  forumStore.disconnectSocketAction()
  window.removeEventListener('scroll', parallaxScroll)
})
</script>

<style scoped>
  .bg-image {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
          url('../assets/ECNUSakura/2.png') center/cover no-repeat;
  }

  /* ---- 论坛容器布局 ---- */
  .forum-container {
    display: flex;
    height: 85vh;
    max-width: 1200px;
    margin: 0 auto;
    width: 95%;
    border-radius: var(--radius-lg);
  }

  .channels-sidebar {
    width: 20%;
    background-color: var(--color-bg-light);
    border-right: 1px solid var(--color-border);
    padding: 20px;
    overflow-y: auto;
    border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  }

  .channels-sidebar h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: var(--color-text);
  }

  .channels-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ---- 未选择频道时的占位提示 ---- */
  .chat-content {
    width: 80%;
    padding: 0px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-bg-white);
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  }

  .chat-content h2 {
    margin-bottom: 16px;
    color: var(--color-text);
  }

  .chat-content p {
    color: var(--color-text-secondary);
    font-size: 16px;
  }

  /* ---- 聊天页面 ---- */
  .chat-page {
    display: flex;
    flex-direction: column;
    height: 85vh;
    width: 80%;
    background-color: var(--color-bg-white);
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: var(--color-primary);
    color: white;
    border-radius: 0 var(--radius-lg) 0 0;
  }

  .chat-header h2 {
    color: white;
    margin: 0;
  }

  .connection-status {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    background-color: rgba(255, 255, 255, 0.2);
  }

  .connection-status.connected {
    background-color: rgba(76, 175, 80, 0.6);
  }

  .chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: white;
    border-bottom: 1px solid var(--color-border);
  }

  /* 加载更多 */
  .load-more {
    text-align: center;
    padding: 8px;
    margin-bottom: 12px;
    color: var(--color-primary);
    cursor: pointer;
    font-size: 13px;
  }

  .load-more:hover {
    text-decoration: underline;
  }

  /* 消息气泡 */
  .message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    padding: 12px;
    /* background-color: var(--color-bg-light); */
    border-radius: var(--radius-md);
    position: relative;
  }

  .message-self {
    flex-direction: row-reverse;
    background-color: var(--color-bg-self);
  }

  .message-self .message-avatar {
    margin-right: 0;
    margin-left: 10px;
  }

  .message-self .message-body {
    text-align: right;
  }

  .message-self .message-header {
    flex-direction: row-reverse;
  }

  .message-self .message-content {
    justify-self: flex-end;
    background-color: var(--color-primary);
    color: white;
    text-align: left;
    border-radius: var(--radius-md) 0 var(--radius-md) var(--radius-md);
  }

  .message-self .reply-btn {
    right: auto;
    left: -30px;
  }

  .message:hover .reply-btn {
    opacity: 1;
  }

  /* 回复引用 */
  .reply-reference {
    background-color: var(--color-bg-reply);
    width: fit-content;
    color: var(--text);
    padding: 4px 8px;
    margin: 6px 0;
    border-left: 3px solid var(--color-text-muted);
    border-radius: var(--radius-sm);
    font-size: 14px;
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reply-to-sender {
    font-weight: 500;
  }

  /* 消息头像 */
  .message-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    margin-top: 8px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .message-body {
    flex: 1;
    min-width: 0;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .message-sender {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
  }

  .message-content {
    background-color: var(--color-bg-message);
    width: fit-content;
    padding: 4px 12px;
    border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md);
    text-align: left;
    line-height: 1.2;
    font-size: 16px;
    word-break: break-word;
    position: relative;
  }

  .message-time {
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  /* 回复按钮 */
  .reply-btn {
    position: absolute;
    bottom: -3px;
    right: -24px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    opacity: 0;
    transition: opacity 0.2s;
    padding: 4px;
    color: var(--color-text-secondary);
  }

  .reply-btn:hover {
    color: var(--color-primary);
  }

  /* 聊天输入区 */
  .chat-input {
    display: flex;
    flex-direction: column;
    padding: 16px;
    background-color: white;
    border-top: 1px solid var(--color-border);
    border-radius: 0 0 var(--radius-lg) 0;
  }

  .input-row {
    display: flex;
  }

  .chat-input input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: var(--radius-sm);
    margin-right: 12px;
  }

  .chat-input .input-row button {
    padding: 0 24px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .chat-input .input-row button:hover {
    background-color: #0069d9;
  }

  /* 回复预览条 */
  .reply-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 8px;
    background-color: var(--color-bg-light);
    border-radius: var(--radius-sm);
    font-size: 13px;
    color: var(--color-text-secondary);
  }

  .cancel-reply {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: var(--color-text-secondary);
    padding: 0 4px;
  }

  .cancel-reply:hover {
    color: var(--color-danger);
  }

  /* ---- 响应式 ---- */
  @media(max-width: 768px) {
    .forum-container {
      flex-direction: column;
      height: auto;
      width: auto;
      padding: 0px;
      margin: 0 5% 5% 5%;
    }

    .channels-sidebar {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 0;
      border-radius: 6px 6px 0 0;
      overflow-y: hidden;
    }

    .channels-sidebar h2 {
      margin: 12px 0;
    }

    .channels-list {
      flex-direction: row;
      justify-content: space-evenly;
    }

    .chat-content {
      width: 100%;
      height: 75vh;
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
    }

    .chat-page {
      width: 100%;
      height: 75vh;
    }

    .chat-header {
      border-radius: 0;
    }

    .chat-input {
      border-radius: 0;
      padding: 8px 4px;
    }

    .chat-input .input-row button {
      padding: 8px 12px;
    }

    .reply-reference {
      max-width: 150px;
    }
  }
</style>
