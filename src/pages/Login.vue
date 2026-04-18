<template>
  <div class="login-container">
    <el-button type="primary" @click="dialogVisible = true">登录</el-button>
    
    <el-dialog
      v-model="dialogVisible"
      title="用户登录"
      center
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0px">
        <el-form-item placeholder="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item placeholder="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">登录</el-button>
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

    // 调用 Pinia store 的 login 方法
    await userStore.login(loginForm.username, loginForm.password)
    ElMessage.success('登录成功')
    dialogVisible.value = false

    // 清空表单
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
    width: 4rem;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
