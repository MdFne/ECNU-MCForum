<template>
  <div class="login-container">
    <el-button type="primary" @click="dialogVisible = true">注册</el-button>

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
      <!-- 顶部渐变色带 -->
      <div class="dialog-gradient-bar"></div>

      <!-- 装饰区域：标题 + 副标题 -->
      <div class="dialog-header">
        <h2 class="dialog-title">加入我们</h2>
        <p class="dialog-subtitle">注册账号，开始你的 MC 之旅</p>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0px">
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱" :prefix-icon="Message" size="large" />
        </el-form-item>
        <el-form-item prop="code">
          <div class="code-input-row">
            <el-input v-model="loginForm.code" placeholder="请输入验证码" :prefix-icon="Key" size="large" />
            <el-button
              type="primary"
              :disabled="countdown > 0"
              :loading="sendingCode"
              @click="handleSendCode"
              class="code-btn"
            >
              {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" show-password size="large" />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="loginForm.confirmPassword" type="password" placeholder="请确认密码" :prefix-icon="Lock" show-password size="large" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" class="submit-btn">注册</el-button>
        </el-form-item>
      </el-form>

      <!-- 底部切换链接 -->
      <div class="dialog-footer-link">
        已有账号？<a @click="switchToLogin">去登录</a>
      </div>

      <!-- 关闭按钮 -->
      <button class="dialog-close-btn" @click="dialogVisible = false">&times;</button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Key } from '@element-plus/icons-vue'
import { sendRegisterCodeApi } from '../api/auth'

const userStore = useUserStore()
const dialogVisible = ref(false)
const loading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const loginFormRef = ref(null)
let countdownTimer = null

const loginForm = reactive({
  username: '',
  email: '',
  code: '',
  password: '',
  confirmPassword: '',
  remember: false
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== loginForm.password) {
        callback(new Error('两次确认密码不一致'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ]
}

const clearCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

const startCountdown = () => {
  clearCountdown()
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearCountdown()
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!loginForm.email) {
    ElMessage.warning('请先输入邮箱')
    return
  }

  try {
    sendingCode.value = true
    await sendRegisterCodeApi(loginForm.email)
    ElMessage.success('验证码已发送')
    startCountdown()
  } catch (error) {
    console.error('发送验证码失败:', error)
  } finally {
    sendingCode.value = false
  }
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    await userStore.register(loginForm.username, loginForm.email, loginForm.password, loginForm.code)
    ElMessage.success('注册成功')
    dialogVisible.value = false

    loginForm.username = ''
    loginForm.email = ''
    loginForm.code = ''
    loginForm.password = ''
    loginForm.confirmPassword = ''
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

const switchToLogin = () => {
  dialogVisible.value = false
  window.dispatchEvent(new CustomEvent('open-login'))
}

const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({
  openDialog
})

onUnmounted(() => {
  clearCountdown()
})
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* 桌面端注册按钮样式 */
.login-container > .el-button {
    --el-button-bg-color: transparent;
    --el-button-border-color: transparent;
    --el-button-hover-bg-color: rgba(255, 255, 255, 0.1);
    --el-button-hover-border-color: transparent;
    --el-button-active-bg-color: transparent;
    --el-button-active-border-color: transparent;
    padding: 0 30px;
    font-size: 16px !important;
    font-weight: 400 !important;
    border-radius: 0;
    height: 4rem;
    width: 3rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
