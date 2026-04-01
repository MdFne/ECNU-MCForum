<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/logo.png" style="height: 3.5rem;" alt="MCForum" />
      <p class="title">ECNU水杉方块社</p>
    </div>
    <div class="nav">
      <el-menu class="el-menu-demo" :default-active="activeIndex" mode="horizontal" @select="handleSelect" router>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/forum">论坛</el-menu-item>
        <el-menu-item index="/stats">统计</el-menu-item>
        <el-menu-item index="/profile">个人中心</el-menu-item>
      </el-menu>
    </div>
    <div class="user">
      <div class="avatar">
        <img src="../assets/avatar.webp" alt="avatar" />
      </div>
      <Login />
      <Regis />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import router from '../router/index.js'
  import Login from '../pages/Login.vue'
  import Regis from '../pages/Regis.vue'
  
  const activeIndex = ref('/')
  
  const handleSelect = (key) => {
    activeIndex.value = key
  }
</script>

<style scoped>
@import '../styles/nav.css';
  .header {
    height: 4rem;
    width: 100%;
    background-color:#1d1e23;

    margin-bottom: 16px;
    padding: 0;

    position: sticky;
    top: 0;
    left: 0;
    z-index: 100;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    height: 4rem;
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: 16px;
  }
  .title {
    font-size: 1.5rem;
  }
  .user {
    margin-right: 16px;
    display: flex;
    align-items: center;
    gap: 0px;
  }
  .avatar {
    margin-right: 16px;
    display: flex;
    align-items: center;
    height: 4rem;
  }
  .avatar img {
    height: 2.5rem;
    border-radius: 50%;
  }
</style>
