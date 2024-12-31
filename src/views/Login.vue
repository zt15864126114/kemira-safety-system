<template>
  <div class="login-container">
    <div class="login-background">
      <div class="circles">
        <div v-for="i in 10" :key="i" class="circle"></div>
      </div>
    </div>
    <el-card class="login-card">
      <div class="login-header">
<!--        <img src="../assets/logo.png" alt="Logo" class="logo" />-->
        <h2>凯米拉天成万丰化学品</h2>
        <h3>安全管理系统</h3>
      </div>
      <el-form 
        :model="loginForm" 
        :rules="rules" 
        ref="loginFormRef"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名"
            prefix-icon="User"
            class="custom-input"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码"
            prefix-icon="Lock"
            class="custom-input"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-button 
          type="primary" 
          @click="handleLogin" 
          class="login-button"
          :loading="loading"
        >
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

// 模拟用户数据
const mockUsers = [
  { username: 'admin', password: '123456' }
]

const loading = ref(false)

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      const user = mockUsers.find(
        u => u.username === loginForm.username && u.password === loginForm.password
      )
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        ElMessage.success('登录成功')
        router.push('/dashboard')
      } else {
        ElMessage.error('用户名或密码错误')
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--gradient-bg);
  position: relative;
  overflow: hidden;
}

.login-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circle {
  position: absolute;
  display: block;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  animation: animate 25s linear infinite;
  bottom: -150px;
  border-radius: 50%;
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}

.circle:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
.circle:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; }
.circle:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
.circle:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; }
.circle:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
.circle:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
.circle:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
.circle:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; }
.circle:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; }
.circle:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; }

.login-card {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  margin-bottom: 20px;
}

.login-header h2 {
  color: #1e3c72;
  margin: 0;
  font-size: 24px;
}

.login-header h3 {
  color: #2a5298;
  margin: 10px 0;
  font-size: 18px;
}

.login-form {
  margin-top: 30px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 25px;
  padding: 0 15px;
  height: 45px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.custom-input :deep(.el-input__inner) {
  height: 45px;
}

.login-button {
  width: 100%;
  height: 45px;
  border-radius: 25px;
  font-size: 16px;
  margin-top: 20px;
  background: var(--gradient-bg);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style> 