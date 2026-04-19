<template>
  <div class="bg-content">
    <div class="bg-image"></div>
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
  import { useForumStore } from '../stores/forum'
  import { storeToRefs } from 'pinia'

  const forumStore = useForumStore()
  const { channels } = storeToRefs(forumStore)

  // 视差滚动
  const parallaxScroll = () => {
    const scrollTop = window.scrollY
    const bg = document.querySelector('.bg-image')

    // 慢速移动：scrollY * 0.3
    bg.style.transform = `translateY(${scrollTop * -0.3}px)`
  }

  // 页面加载时添加滚动事件监听
  onMounted(() => {
    forumStore.fetchChannels()
    window.addEventListener('scroll', parallaxScroll);
  });

  // 页面卸载时移除滚动事件监听
  onUnmounted(() => {
    window.removeEventListener('scroll', parallaxScroll);
  });
</script>

<style scoped>
  .bg-image {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
          url('../assets/ECNUSakura/2.png') center/cover no-repeat;
  }

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
  }
</style>