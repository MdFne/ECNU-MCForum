<template>
  <div class="sidebar-bar">
    <div class="links">
      <div class="link">
        <h2>活动预告</h2>
        <div class="trailer">
          <ActivityTrailer />
        </div>
      </div>
      <div class="link">
        <h2>皮肤站</h2>
        <a href="https://skin.ecnumc.cn" target="_blank">
          https://skin.ecnumc.cn
          <img :src="outLinkIcon" style="width: 20px;" alt="outLinkIcon" class="outLinkIcon" />
        </a>
      </div>
      <div class="link">
        <h2>关注我们！</h2>
        <AutoCollapse v-bind="qqLink" />
        <AutoCollapse v-bind="biliLink" />
        <AutoCollapse />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
import AutoCollapse from './AutoCollapse.vue'
import ActivityTrailer from './ActivityTrailer.vue'
import biliIcon from '../assets/linkIcon/bilibili.png'
  import qqIcon from '../assets/linkIcon/qq.png'
  import outLinkIcon from '../assets/linkIcon/outLink.png'

  const biliLink = {
    icon: biliIcon,
    title: 'B站账号',
    linkTo: 'https://space.bilibili.com/3546821630626010?spm_id_from=333.337.0.0',
    content: 'B站账号：ECNU水杉方块社\nhttps://space.bilibili.com/3546821630626010?spm_id_from=333.337.0.0',
  }

  const qqLink = {
    icon: qqIcon,
    title: '加入QQ群',
    linkTo: 'https://jq.qq.com/?from=1024&k=1234567890',
    content: 'QQ群：1234567890\n加入我们，获取最新动态！',
  }

</script>

<style scoped>
  .sidebar-bar {
    height: 80vh;
    width: 18rem;
    background-color: #f5f5f5;
    box-shadow: var(--el-box-shadow-light);

    /* position: fixed;
    top: 50%;
    transform: translate(0, -50%);
    right: 0; */

    position: sticky;
    top: 4rem;
    left: 0;
    z-index: 99;
    border-radius: 8px;
    
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 16px 0;
    gap: 16px;
    overflow: auto;
  }

  /* 针对 WebKit 浏览器隐藏滚动条 */
  .sidebar-bar::-webkit-scrollbar {
    display: none;
  }

  .links {
    height: auto;
    width: 80%;
    margin: 0;
    /* background-color: lightgray; */
    background-color: none;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .link {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    gap: 8px;
  }

  .link h2 {
    width: 100%;
    font-size: 18px;
    font-weight: bold;
    color: #5d5d5d;
    padding-bottom: 4px;
    margin: 12px 0 8px 0;
    border-bottom: 2px solid lightgray;
  }

  .trailer {
    width: 100%;
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }

  .trailer::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }

  .link a {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
  
  @media (max-width: 768px) {
    .sidebar-bar {
      display: none;
    }
  }


</style>
