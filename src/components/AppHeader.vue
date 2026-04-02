<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/logo.png" style="height: 2.8rem;" alt="MCForum" />
      <!-- <p class="sub-title">ECNU</p> -->
      <p class="title">华东师范大学水杉方块社</p>
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
      <!-- 桌面端显示的登录注册按钮 -->
      <div class="auth-buttons">
        <Login ref="loginRef" />
        <Regis ref="regisRef" />
      </div>
      <!-- 移动端显示的汉堡菜单 -->
      <div class="mobile-menu">
        <el-dropdown @command="handleMobileMenu">
          <button class="menu-toggle">
            <span class="menu-line"></span>
            <span class="menu-line"></span>
            <span class="menu-line"></span>
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="login">登录</el-dropdown-item>
              <el-dropdown-item command="register">注册</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import Login from '../pages/Login.vue'
  import Regis from '../pages/Regis.vue'
  
  const activeIndex = ref('/')
  const loginRef = ref(null)
  const regisRef = ref(null)
  
  const handleSelect = (key) => {
    activeIndex.value = key
  }
  
  const handleMobileMenu = (command) => {
    if (command === 'login' && loginRef.value) {
      loginRef.value.openDialog()
    } else if (command === 'register' && regisRef.value) {
      regisRef.value.openDialog()
    }
  }
</script>

<style scoped>
@import '../styles/nav.css';
@import '../styles/header.css';

</style>
