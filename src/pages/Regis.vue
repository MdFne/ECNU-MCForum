<template>
  <div class="login-container">
    <el-button type="primary" @click="dialogVisible = true">注册</el-button>
    
    <el-dialog
      v-model="dialogVisible"
      title="用户注册"
      center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0px">
        <el-form-item placeholder="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item placeholder="邮箱" prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item placeholder="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item placeholder="确认密码" prop="confirmPassword">
          <el-input v-model="loginForm.confirmPassword" type="password" placeholder="请确认密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const dialogVisible = ref(false)
const loading = ref(false)
const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' }
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

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    // 调用 Pinia store 的 register 方法
    await userStore.register(loginForm.username, loginForm.email, loginForm.password)
    ElMessage.success('注册成功')
    dialogVisible.value = false

    // 清空表单
    loginForm.username = ''
    loginForm.email = ''
    loginForm.password = ''
    loginForm.confirmPassword = ''
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

const openDialog = () => {
  dialogVisible.value = true
}

defineExpose({
  openDialog
})
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
    /* padding: 0 30px; */
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