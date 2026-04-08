<template>
  <div class="bg-box">
    <div class="bgIMG"></div>
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
  </div>
</template>

<script setup>
  import Channel from '../components/channel.vue'
  import { onMounted, onUnmounted } from 'vue'

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

  // 视差滚动
  const parallaxScroll = () => {
    const scrollTop = window.scrollY
    const bg = document.querySelector('.bgIMG')
    
    // 慢速移动：scrollY * 0.3
    bg.style.transform = `translateY(${scrollTop * -0.3}px)`
  }

  // 页面加载时添加滚动事件监听
  onMounted(() => {
    window.addEventListener('scroll', parallaxScroll);
  });
  
  // 页面卸载时移除滚动事件监听
  onUnmounted(() => {
    window.removeEventListener('scroll', parallaxScroll);
  });
</script>

<style scoped>
  @import '../styles/forum.css';  
  @import '../styles/bgIMG.css';

  .bgIMG {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
          url('../assets/ECNUSakura/2.png') center/cover no-repeat;
  }
</style>