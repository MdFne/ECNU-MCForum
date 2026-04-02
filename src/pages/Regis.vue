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
    
    // 模拟登录请求
    setTimeout(() => {
      loading.value = false
      dialogVisible.value = false
      console.log('登录成功:', loginForm)
      // 这里可以添加登录成功后的逻辑，比如存储token等
    }, 1000)
  } catch (error) {
    console.error('登录失败:', error)
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
@import '../styles/logBtn.css';
</style>