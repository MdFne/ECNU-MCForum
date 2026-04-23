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
    <el-dialog
      v-model="resetDialogVisible"
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
        <h2 class="dialog-title">重置密码</h2>
        <p class="dialog-subtitle">通过邮箱验证码重置你的密码</p>
      </div>

      <el-form :model="resetForm" :rules="resetRules" ref="resetFormRef" label-width="0px">
        <el-form-item prop="email">
          <el-input v-model="resetForm.email" placeholder="请输入邮箱地址" :prefix-icon="Message" size="large" />
        </el-form-item>
        <el-form-item prop="code">
          <div class="code-input-row">
            <el-input v-model="resetForm.code" placeholder="请输入验证码" :prefix-icon="Key" size="large" />
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
        <el-form-item prop="newPassword">
          <el-input v-model="resetForm.newPassword" type="password" placeholder="请输入新密码" :prefix-icon="Lock" show-password size="large" />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="resetForm.confirmPassword" type="password" placeholder="请确认新密码" :prefix-icon="Lock" show-password size="large" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleResetPassword" :loading="resetLoading" class="submit-btn">重置密码</el-button>
        </el-form-item>
      </el-form>

      <div class="dialog-footer-link">
        <a @click="backToLogin">返回登录</a>
      </div>

      <button class="dialog-close-btn" @click="resetDialogVisible = false">&times;</button>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, Message, Key } from '@element-plus/icons-vue'
import { sendResetCodeApi, resetPasswordApi } from '../api/auth'

const userStore = useUserStore()
const dialogVisible = ref(false)
const loading = ref(false)
const loginFormRef = ref(null)

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

const switchToRegister = () => {
  dialogVisible.value = false
  window.dispatchEvent(new CustomEvent('open-register'))
}

const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({
  openDialog
})

// ---- 重置密码逻辑 ----
const resetDialogVisible = ref(false)
const resetFormRef = ref(null)
const resetLoading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
let countdownTimer = null

const resetForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const resetRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const openResetDialog = () => {
  dialogVisible.value = false
  resetDialogVisible.value = true
}

const backToLogin = () => {
  resetDialogVisible.value = false
  dialogVisible.value = true
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

const handleSendCode = async () => {
  // 单独校验邮箱字段
  if (!resetForm.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }

  try {
    sendingCode.value = true
    await sendResetCodeApi(resetForm.email)
    ElMessage.success('验证码已发送')
    startCountdown()
  } catch (error) {
    console.error('发送验证码失败:', error)
  } finally {
    sendingCode.value = false
  }
}

const handleResetPassword = async () => {
  if (!resetFormRef.value) return

  try {
    await resetFormRef.value.validate()
    resetLoading.value = true

    await resetPasswordApi({
      email: resetForm.email,
      code: resetForm.code,
      newPassword: resetForm.newPassword
    })

    ElMessage.success('密码重置成功，请登录')
    resetDialogVisible.value = false

    // 清空表单
    resetForm.email = ''
    resetForm.code = ''
    resetForm.newPassword = ''
    resetForm.confirmPassword = ''

    // 打开登录弹窗
    dialogVisible.value = true
  } catch (error) {
    console.error('重置密码失败:', error)
  } finally {
    resetLoading.value = false
  }
}
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

/* ---- Dialog 内部样式 ---- */

.dialog-gradient-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-primary-hover), #c084fc);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.dialog-header {
  text-align: center;
  margin-bottom: 24px;
}

.dialog-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 6px;
}

.dialog-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

/* 登录表单样式 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  /* background-color: var(--glass-bg); */
  height: 42px;
}

:deep(.el-input__inner) {
  background-color: transparent !important;
}

/* 忘记密码链接 */
.forgot-link {
  font-size: 12px;
  color: var(--color-primary);
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* 验证码输入行 */
.code-input-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.code-input-row .el-input {
  flex: 1;
}

.code-btn {
  width: 120px;
  height: 44px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 42px;
  font-size: 15px;
  border-radius: var(--radius-md);
}

/* 底部切换链接 */
.dialog-footer-link {
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
  /* padding-top: 4px; */
}

.dialog-footer-link a {
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}

.dialog-footer-link a:hover {
  text-decoration: underline;
}

/* 自定义关闭按钮 */
.dialog-close-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: var(--color-text-muted);
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.dialog-close-btn:hover {
  color: var(--color-text);
}
</style>

<style>
/* 全局样式：Dialog 毛玻璃 + 圆角 */
.auth-dialog .el-dialog {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg) !important;
  overflow: hidden;
  position: relative;
  padding-top: 20px;
}

.auth-dialog .el-dialog__header {
  display: none;
}

.auth-dialog .el-dialog__body {
  padding: 20px 32px 28px;
}
</style>
