<template>
  <div class="login-container">
    <el-button type="primary" @click="dialogVisible = true">登录</el-button>

    <!-- 登录弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="420px"
      class="auth-dialog"
    >
      <div class="dialog-gradient-bar"></div>

      <div class="dialog-header">
        <h2 class="dialog-title">欢迎回来</h2>
        <p class="dialog-subtitle">登录以继续探索 MCForum</p>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password size="large">
            <template #suffix>
              <a class="forgot-link" @click="openResetDialog">忘记密码</a>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="submit-btn">登录</el-button>
        </el-form-item>
      </el-form>

      <div class="dialog-footer-link">
        还没有账号？<a @click="switchToRegister">去注册</a>
      </div>

      <button class="dialog-close-btn" @click="dialogVisible = false">&times;</button>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <ResetPassword ref="resetRef" @back-to-login="openDialog" />
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import ResetPassword from '../components/ResetPassword.vue'

const userStore = useUserStore()
const dialogVisible = ref(false)
const loading = ref(false)
const loginFormRef = ref(null)
const resetRef = ref(null)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    await userStore.login(loginForm.username, loginForm.password)
    ElMessage.success('登录成功')
    dialogVisible.value = false

    loginForm.username = ''
    loginForm.password = ''
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

const openDialog = () => {
  dialogVisible.value = true
}

const openResetDialog = () => {
  dialogVisible.value = false
  resetRef.value?.open()
}

const switchToRegister = () => {
  dialogVisible.value = false
  window.dispatchEvent(new CustomEvent('open-register'))
}

defineExpose({ openDialog })
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* 桌面端登录按钮样式 */
.login-container > .el-button--primary {
    --el-button-bg-color: transparent;
    --el-button-border-color: transparent;
    --el-button-hover-bg-color: rgba(255, 255, 255, 0.1);
    --el-button-hover-border-color: transparent;
    --el-button-active-bg-color: transparent;
    --el-button-active-border-color: transparent;
    font-size: 16px !important;
    font-weight: 400 !important;
    border-radius: 0;
    height: 3rem;
    width: 4rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 桌面端注册按钮样式 */
.login-container > .el-button {
    --el-button-bg-color: transparent;
    --el-button-border-color: transparent;
    --el-button-hover-bg-color: rgba(255, 255, 255, 0.1);
    --el-button-hover-border-color: transparent;
    padding: 0 30px;
    font-size: 20px;
    border-radius: 0;
    height: 4rem;
    width: 3rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

<style>
/* 全局样式：Dialog 毛玻璃 + 圆角 */
/* .auth-dialog.el-dialog {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
  position: relative;
  padding-top: 20px;
} */

.auth-dialog .el-dialog__header {
  display: none;
}

.auth-dialog .el-dialog__body {
  padding: 20px 32px 28px;
}
</style>
