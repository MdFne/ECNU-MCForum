<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/logo.png" alt="MCForum" />
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
        <button class="menu-toggle" @click="toggleSidebar">
          <span class="menu-line"></span>
          <span class="menu-line"></span>
          <span class="menu-line"></span>
        </button>
      </div>
    </div>
    
    <!-- 移动端侧边栏 -->
    <div class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <h3>菜单</h3>
        <button class="close-btn" @click="toggleSidebar">×</button>
      </div>
      <div class="sidebar-menu">
        <div class="nav-item" @click="navigateTo('/')" :class="{ active: activeIndex === '/' }">首页</div>
        <div class="nav-item" @click="navigateTo('/forum')" :class="{ active: activeIndex === '/forum' }">论坛</div>
        <div class="nav-item" @click="navigateTo('/stats')" :class="{ active: activeIndex === '/stats' }">统计</div>
        <div class="nav-item" @click="navigateTo('/profile')" :class="{ active: activeIndex === '/profile' }">个人中心</div>
      </div>
      <div class="sidebar-auth">
        <button class="auth-btn login-btn" @click="openLogin">登录</button>
        <button class="auth-btn register-btn" @click="openRegister">注册</button>
      </div>
    </div>
    
    <!-- 遮罩层 -->
    <div class="overlay" v-if="sidebarOpen" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import Login from '../pages/Login.vue'
  import Regis from '../pages/Regis.vue'
  
  const router = useRouter()
  const route = useRoute()
  const activeIndex = ref('/')
  const loginRef = ref(null)
  const regisRef = ref(null)
  const sidebarOpen = ref(false)
  
  // 初始化时根据当前路由设置activeIndex
  onMounted(() => {
    activeIndex.value = route.path
  })
  
  // 监听路由变化，更新activeIndex
  watch(() => route.path, (newPath) => {
    activeIndex.value = newPath
  })
  
  const handleSelect = (key) => {
    activeIndex.value = key
  }
  
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }
  
  const navigateTo = (path) => {
    router.push(path)
    activeIndex.value = path
    sidebarOpen.value = false
  }
  
  const openLogin = () => {
    if (loginRef.value) {
      loginRef.value.openDialog()
      sidebarOpen.value = false
    }
  }
  
  const openRegister = () => {
    if (regisRef.value) {
      regisRef.value.openDialog()
      sidebarOpen.value = false
    }
  }
</script>

<style scoped>
@import '../styles/nav.css';
@import '../styles/header.css';

</style>
