<template>
  <div class="forum-container">
    <div class="channels-sidebar">
      <h2>频道</h2>
      <div class="channels-list">
        <Channel v-for="channel in channels" :key="channel.id" :channel="channel" />
      </div>
    </div>
    <div class="chat-content">
      <h2>选择一个频道开始聊天</h2>
      <p>点击左侧频道进入对应的聊天室</p>
    </div>
  </div>
</template>

<script setup>
import Channel from '../components/channel.vue'

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
</script>

<style scoped>
@import '../styles/forum.css';
</style>