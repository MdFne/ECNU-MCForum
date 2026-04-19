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
      </el-menu>
    </div>
    <div class="user">
      <!-- 已登录：显示头像和用户中心按钮 -->
      <template v-if="userStore.isLoggedIn">
        <div class="avatar" @click="navigateTo('/profile')" style="cursor: pointer;">
          <img :src="avatarUrl" alt="avatar" />
        </div>
        <!-- <span class="username" @click="navigateTo('/profile')">{{ userStore.username }}</span> -->
      </template>
      <!-- 未登录：显示默认头像 -->
      <div class="avatar" v-else>
        <img src="../assets/avatar.webp" alt="avatar" />
      </div>
      <!-- 桌面端：未登录显示登录注册按钮，已登录显示个人中心按钮 -->
      <div class="auth-buttons">
        <template v-if="!userStore.isLoggedIn">
          <Login ref="loginRef" />
          <Regis ref="regisRef" />
        </template>
        <template v-else>
          <button class="profile-btn" @click="navigateTo('/profile')">个人中心</button>
        </template>
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
      </div>
      <!-- 未登录：显示登录注册按钮 -->
      <div class="sidebar-auth" v-if="!userStore.isLoggedIn">
        <button class="auth-btn login-btn" @click="openLogin">登录</button>
        <button class="auth-btn register-btn" @click="openRegister">注册</button>
      </div>
      <!-- 已登录：显示用户信息和退出按钮 -->
      <div class="sidebar-auth" v-else>
        <div class="sidebar-user-info">
          <span>{{ userStore.username }}</span>
        </div>
        <button class="auth-btn login-btn" @click="navigateTo('/profile')">个人中心</button>
        <button class="auth-btn register-btn" @click="handleLogout">退出登录</button>
      </div>
    </div>
    
    <!-- 遮罩层 -->
    <div class="overlay" v-if="sidebarOpen" @click="toggleSidebar"></div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import Login from '../pages/Login.vue'
  import Regis from '../pages/Regis.vue'
  import { useUserStore } from '../stores/user'
  import { ElMessage } from 'element-plus'

  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const activeIndex = ref('/')
  const loginRef = ref(null)
  const regisRef = ref(null)
  const sidebarOpen = ref(false)

  // 默认头像
  const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar%20simple%20design&image_size=square'

  // 计算头像URL：如果是本地上传的头像（/uploads/开头），拼接后端地址
  const avatarUrl = computed(() => {
    const avatar = userStore.avatar
    if (!avatar) return defaultAvatar
    if (avatar.startsWith('/uploads/')) return 'http://localhost:3000' + avatar
    return avatar
  })
  
  // 初始化时根据当前路由设置activeIndex
  onMounted(async () => {
    activeIndex.value = route.path
    // 如果本地有 token，校验是否仍然有效
    if (userStore.isLoggedIn && userStore.token) {
      await userStore.fetchProfile()
    }
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

  // 退出登录
  const handleLogout = async () => {
    try {
      await userStore.logout()
      ElMessage.success('已退出登录')
      sidebarOpen.value = false
      router.push('/')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }
</script>

<style scoped>
/* ---- 导航容器 ---- */
.nav {
    width: 32rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: -6rem;
}

@media (max-width: 1150px) {
    .nav {
        margin-left: 6rem;
    }
}

@media (max-width: 768px) {
    .nav {
        width: 70%;
        margin: 0;
        padding: 0;
    }
}

/* ---- 头部布局 ---- */
.header {
    height: 3rem;
    width: 100%;
    background-color: #1d1e23;

    margin-bottom: 0px;
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
    height: 3rem;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 16px;
    width: auto;
}

.logo img {
    height: 80%;
}

/* .sub-title {
    font-size: 1.5rem;
    align-self: center;
} */

.title {
    font-size: 1.2rem;
    align-self: center;
    width: auto;
}

.user {
    margin-right: 16px;
    display: flex;
    align-items: center;
    gap: 0px;
}

.avatar {
    margin-right: 4px;
    display: flex;
    align-items: center;
    height: 3rem;
}

.avatar img {
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
    object-fit: cover;
}

.mobile-menu {
    display: none;
}

.menu-toggle {
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 6px;
    padding: 0;
}

.menu-line {
    width: 24px;
    height: 2px;
    background-color: #fff;
    transition: all 0.3s;
    border-radius: 1px;
}

.menu-toggle:hover .menu-line {
    background-color: var(--color-primary);
}

.auth-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 已登录时的用户名显示 */
.username {
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.username:hover {
    color: var(--color-primary);
}

/* 个人中心按钮样式 */
.profile-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    height: 3rem;
    padding: 0 16px;
    border-radius: 0;
    transition: background-color 0.3s;
}

.profile-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* 移动端侧边栏用户信息 */
.sidebar-user-info {
    text-align: center;
    padding: 10px 0;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
}

/* 侧边栏样式 */
.sidebar {
    --sidebar-width: 200px;
    position: fixed;
    top: 0;
    right: calc(-1 * var(--sidebar-width));
    width: var(--sidebar-width);
    height: 100vh;
    background-color: #1d1e23;
    color: #fff;
    transition: right 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
}

.sidebar.sidebar-open {
    right: 0;
}

.sidebar-header {
    padding: 20px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sidebar-header h3 {
    margin: 0;
    font-size: 18px;
}

.close-btn {
    background: transparent;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-menu {
    flex: 1;
    padding: 20px 0;
}

.nav-item {
    padding: 15px 20px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-size: 16px;
}

.nav-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
    background-color: var(--color-primary);
    color: #fff;
}

.sidebar-auth {
    padding: 20px;
    border-top: 1px solid #333;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.auth-btn {
    padding: 10px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
}

.login-btn {
    background-color: var(--color-primary);
    color: #fff;
}

.login-btn:hover {
    background-color: var(--color-primary-hover);
}

.register-btn {
    background-color: transparent;
    color: #fff;
    border: 1px solid var(--color-primary);
}

.register-btn:hover {
    background-color: rgba(64, 158, 255, 0.1);
}

/* 遮罩层 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    transition: opacity 0.3s ease;
}

@media (max-width: 1150px) {
    .title {
        /* font-size: 1rem; */
        display: none;
    }
}

@media (max-width: 900px) {}

@media (max-width: 768px) {
    .header {
        padding: 0;
        display: flex;
        justify-content: space-between;
    }

    /*
    .title,
    .logo {
        display: none;
    } */

    .auth-buttons {
        display: none;
    }

    .mobile-menu {
        display: block;
    }

    .user {

        gap: 8px;
    }

    .nav {
        display: none;
    }
}

/* ---- Element Plus 菜单样式覆盖 ---- */

/* 去掉默认背景和边框 */
.nav :deep(.el-menu) {
    background-color: transparent;
    border-bottom: none !important;
}

.nav :deep(.el-menu-item) {
    background-color: transparent !important;
    border-bottom: none !important;
    color: rgba(255, 255, 255, 0.7);
    position: relative;
    transition: color 0.3s, background-color 0.3s;
    height: 3rem;
    line-height: 3rem;
}

/* 底部横线：默认宽度为0，居中对齐 */
.nav :deep(.el-menu-item)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: var(--color-bg-hover);
    transition: width 0.3s ease, left 0.3s ease;
}

/* hover: 灰色底色 + 横线从中间向两边展开 */
.nav :deep(.el-menu-item:hover) {
    background-color: rgba(255, 255, 255, 0.08) !important;
    color: #fff;
}

.nav :deep(.el-menu-item:hover)::after {
    width: 60%;
    left: 20%;
}

/* 选中状态：横线常驻 */
.nav :deep(.el-menu-item.is-active) {
    color: #fff !important;
    background-color: transparent !important;
    border-bottom: none !important;
}

.nav :deep(.el-menu-item.is-active)::after {
    width: 60%;
    left: 20%;
}
</style>
