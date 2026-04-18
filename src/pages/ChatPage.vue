<template>
  <div class="bg-content">
    <div class="bg-image"></div>
    <div class="forum-container">
      <div class="channels-sidebar">
        <h2>频道</h2>
        <div class="channels-list">
          <Channel v-for="channel in channels" :key="channel.id" :channel="channel" :active="channel.id === channelId" />
        </div>
      </div>
      <div class="chat-page">
        <div class="chat-header">
          <h2>{{ channelName }}</h2>
        </div>
        
        <div class="chat-messages">
          <div v-for="message in messages" :key="message.id" class="message">
            <div class="message-sender">{{ message.sender }}</div>
            <div class="message-content">{{ message.content }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
        
        <div class="chat-input">
          <input 
            type="text" 
            v-model="newMessage" 
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Channel from '../components/channel.vue'

const route = useRoute()

const channelId = ref(route.params.channelId)
const channelName = ref('聊天频道')
const newMessage = ref('')
const messages = ref([
  {
    id: 1,
    sender: '用户1',
    content: '大家好！',
    time: '10:00'
  },
  {
    id: '2',
    sender: '用户2',
    content: '你好！',
    time: '10:01'
  }
])

// 频道数据
const channels = [
  {
    id: '1',
    name: '技术讨论',
    description: '讨论编程、技术相关话题',
    icon: '💻'
  },
  {
    id: '2',
    name: '生活分享',
    description: '分享日常生活、兴趣爱好',
    icon: '🌟'
  },
  {
    id: '3',
    name: '学习交流',
    description: '交流学习经验、资源分享',
    icon: '📚'
  },
  {
    id: '4',
    name: '游戏天地',
    description: '讨论游戏、游戏攻略',
    icon: '🎮'
  }
]

// 模拟数据：根据频道ID设置频道名称
const channelNames = {
  '1': '技术讨论',
  '2': '生活分享',
  '3': '学习交流',
  '4': '游戏天地'
}

// 模拟数据：不同频道的消息
const channelMessages = {
  '1': [
    {
      id: 1,
      sender: '用户1',
      content: '大家好！欢迎来到技术讨论频道',
      time: '10:00'
    },
    {
      id: '2',
      sender: '用户2',
      content: '你好！这里可以讨论编程相关的话题',
      time: '10:01'
    }
  ],
  '2': [
    {
      id: 1,
      sender: '用户A',
      content: '大家好！欢迎来到生活分享频道',
      time: '14:00'
    },
    {
      id: '2',
      sender: '用户B',
      content: '你好！这里可以分享日常生活',
      time: '14:01'
    }
  ],
  '3': [
    {
      id: 1,
      sender: '学生1',
      content: '大家好！欢迎来到学习交流频道',
      time: '09:00'
    },
    {
      id: '2',
      sender: '学生2',
      content: '你好！这里可以交流学习经验',
      time: '09:01'
    }
  ],
  '4': [
    {
      id: 1,
      sender: '玩家1',
      content: '大家好！欢迎来到游戏天地频道',
      time: '18:00'
    },
    {
      id: '2',
      sender: '玩家2',
      content: '你好！这里可以讨论游戏相关的话题',
      time: '18:01'
    }
  ]
}

const updateChannel = () => {
  // 设置频道名称
  if (channelNames[channelId.value]) {
    channelName.value = channelNames[channelId.value]
  }
  // 加载历史消息
  loadMessages()
}

onMounted(() => {
  updateChannel()
})

// 监听路由参数变化
watch(() => route.params.channelId, (newChannelId) => {
  channelId.value = newChannelId
  updateChannel()
})

const sendMessage = () => {
  if (newMessage.value.trim()) {
    const message = {
      id: Date.now(),
      sender: '我',
      content: newMessage.value,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    messages.value.push(message)
    newMessage.value = ''
    // 滚动到底部
    scrollToBottom()
    // 调用发送消息的API
    // sendMessageToServer(message)
  }
}

const loadMessages = () => {
  // 加载对应频道的消息
  if (channelMessages[channelId.value]) {
    messages.value = channelMessages[channelId.value]
  } else {
    messages.value = []
  }
  // 调用加载历史消息的API
  // fetchMessagesFromServer()
}

const scrollToBottom = () => {
  setTimeout(() => {
    const chatMessages = document.querySelector('.chat-messages')
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }, 100)
}

/*
需要实现的API：
1. 发送消息API
   - 路径：/api/chat/send
   - 方法：POST
   - 参数：channelId, content, sender
   - 返回：发送成功的消息对象

2. 接收消息API（WebSocket）
   - 路径：/api/chat/ws
   - 方法：WebSocket
   - 功能：实时接收新消息

3. 加载历史消息API
   - 路径：/api/chat/history
   - 方法：GET
   - 参数：channelId, limit, offset
   - 返回：历史消息列表

4. 获取频道信息API
   - 路径：/api/chat/channel/{id}
   - 方法：GET
   - 返回：频道信息对象
*/
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
    margin: 0;
  }

  .back-btn {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .back-btn:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: white;
    border-bottom: 1px solid var(--color-border);
  }

  .message {
    margin-bottom: 16px;
    padding: 12px;
    background-color: var(--color-bg-light);
    border-radius: var(--radius-md);
  }

  .message-sender {
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--color-primary);
  }

  .message-content {
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .message-time {
    font-size: 12px;
    color: var(--color-text-secondary);
    text-align: right;
  }

  .chat-input {
    display: flex;
    padding: 16px;
    background-color: white;
    border-top: 1px solid var(--color-border);
    border-radius: 0 0 var(--radius-lg) 0;
  }

  .chat-input input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ced4da;
    border-radius: var(--radius-sm);
    margin-right: 12px;
  }

  .chat-input button {
    padding: 0 24px;
    background-color: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .chat-input button:hover {
    background-color: #0069d9;
  }

  @media(max-width: 768px) {
    .chat-page {
      width: 100%;
    }

    .chat-header {
      border-radius: 0;
    }

    .chat-page {
      height: 75vh;
    }

    .chat-input {
      border-radius: 0;
      padding: 8px 4px;
    }

    .chat-input button {
      padding: 8px 12px;
    }
  }
</style>