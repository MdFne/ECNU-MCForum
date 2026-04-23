<template>
  <el-dialog
    v-model="visible"
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

    <el-form :model="form" :rules="rules" ref="formRef" label-width="0px">
      <el-form-item prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱地址" :prefix-icon="Message" size="large" />
      </el-form-item>
      <el-form-item prop="code">
        <div class="code-input-row">
          <el-input v-model="form.code" placeholder="请输入验证码" :prefix-icon="Key" size="large" />
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
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" :prefix-icon="Lock" show-password size="large" />
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" :prefix-icon="Lock" show-password size="large" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleReset" :loading="resetLoading" class="submit-btn">重置密码</el-button>
      </el-form-item>
    </el-form>

    <div class="dialog-footer-link">
      <a @click="backToLogin">返回登录</a>
    </div>

    <button class="dialog-close-btn" @click="close">&times;</button>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Message, Lock, Key } from '@element-plus/icons-vue'
import { sendResetCodeApi, resetPasswordApi } from '../api/auth'

const emit = defineEmits(['back-to-login'])

const visible = ref(false)
const formRef = ref(null)
const resetLoading = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
let countdownTimer = null

const form = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
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
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
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
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearCountdown()
    }
  }, 1000)
}

const handleSendCode = async () => {
  if (!form.email) {
    ElMessage.warning('请先输入邮箱地址')
    return
  }

  try {
    sendingCode.value = true
    await sendResetCodeApi(form.email)
    ElMessage.success('验证码已发送')
    startCountdown()
  } catch (error) {
    console.error('发送验证码失败:', error)
  } finally {
    sendingCode.value = false
  }
}

const handleReset = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    resetLoading.value = true

    await resetPasswordApi({
      email: form.email,
      code: form.code,
      newPassword: form.newPassword
    })

    ElMessage.success('密码重置成功，请登录')
    close()
    emit('back-to-login')
  } catch (error) {
    console.error('重置密码失败:', error)
  } finally {
    resetLoading.value = false
  }
}

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
  clearCountdown()
  form.email = ''
  form.code = ''
  form.newPassword = ''
  form.confirmPassword = ''
}

const backToLogin = () => {
  close()
  emit('back-to-login')
}

onUnmounted(() => {
  clearCountdown()
})

defineExpose({ open })
</script>
