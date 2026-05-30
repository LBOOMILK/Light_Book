<template>
  <div class="admin-login-page">
    <div class="admin-login-container">
      <div class="admin-login-header">
        <div class="admin-logo">📖</div>
        <h1 class="admin-title">Light Book</h1>
        <p class="admin-subtitle">后台管理系统</p>
      </div>

      <div class="admin-login-card">
        <div class="admin-form-title">管理员登录</div>
        
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="form.username"
              placeholder="请输入管理员账号"
              size="large"
              prefix-icon="User"
              class="admin-input"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              prefix-icon="Lock"
              show-password
              @keyup.enter="handleLogin"
              class="admin-input"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="admin-login-btn"
              @click="handleLogin"
            >
              登 录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="admin-login-footer">
          <router-link to="/login" class="admin-back-link">
            <el-icon><ArrowLeft /></el-icon>
            返回用户登录
          </router-link>
        </div>
      </div>

      <div class="admin-demo-section">
        <div class="admin-demo-title">🔑 演示账户</div>
        <div class="admin-demo-card">
          <div class="admin-demo-info">
            <div class="admin-demo-name">
              <el-icon><User /></el-icon>
              超级管理员
            </div>
            <div class="admin-demo-detail">
              <span class="admin-detail-label">账号</span>
              <span class="admin-detail-value">{{ demoAccount.username }}</span>
            </div>
            <div class="admin-demo-detail">
              <span class="admin-detail-label">密码</span>
              <span class="admin-detail-value">{{ demoAccount.password }}</span>
            </div>
          </div>
          <el-button size="small" class="admin-fill-btn" @click="fillAccount">
            一键填入
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const demoAccount = { username: 'admin', password: 'admin123' }

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const fillAccount = () => {
  form.username = demoAccount.username
  form.password = demoAccount.password
  ElMessage.success('已填入账户信息')
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    
    try {
      setTimeout(() => {
        localStorage.setItem('admin_token', 'mock_admin_token')
        localStorage.setItem('admin_user', JSON.stringify({
          id: 1,
          username: form.username,
          role: 'admin'
        }))
        
        ElMessage.success('登录成功')
        router.push('/admin')
      }, 1000)
      
    } catch (error) {
      ElMessage.error('登录失败，请检查账号密码')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f4f8 0%, #d9e2ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 40px 0;
}

.admin-login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
}

.admin-login-header {
  text-align: center;
  margin-bottom: 32px;
}

.admin-logo {
  font-size: 56px;
  margin-bottom: 12px;
}

.admin-title {
  font-family: "Georgia", "STSong", "SimSun", "Songti SC", serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #334e68;
  margin: 0;
}

.admin-subtitle {
  font-family: "STSong", "SimSun", "Songti SC", serif;
  font-size: 15px;
  color: #627d98;
  margin-top: 10px;
  letter-spacing: 2px;
}

.admin-login-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 125, 152, 0.2);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(99, 125, 152, 0.1);
}

.admin-form-title {
  font-size: 20px;
  font-weight: 700;
  color: #334e68;
  text-align: center;
  margin-bottom: 28px;
  font-family: "Georgia", "STSong", "SimSun", "Songti SC", serif;
}

.admin-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(99, 125, 152, 0.15);
}

.admin-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(99, 125, 152, 0.2);
}

.admin-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(99, 125, 152, 0.3);
  border-color: #627d98;
}

.admin-input :deep(.el-input__inner) {
  color: #334e68;
}

.admin-input :deep(.el-input__inner::placeholder) {
  color: rgba(99, 125, 152, 0.4);
}

.admin-input :deep(.el-input__prefix) {
  color: #627d98;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

.admin-login-btn {
  width: 100%;
  height: 50px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 8px;
  background: linear-gradient(135deg, #334e68 0%, #1f2937 100%);
  border: none;
  box-shadow: 0 4px 20px rgba(51, 78, 104, 0.25);
  transition: all 0.3s;
}

.admin-login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(51, 78, 104, 0.3);
}

.admin-login-footer {
  text-align: center;
  margin-top: 24px;
}

.admin-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #627d98;
  text-decoration: none;
  transition: all 0.2s;
}

.admin-back-link:hover {
  color: #334e68;
}

.admin-demo-section {
  margin-top: 24px;
}

.admin-demo-title {
  text-align: center;
  font-size: 13px;
  color: rgba(51, 78, 104, 0.6);
  margin-bottom: 12px;
  font-family: "STSong", "SimSun", "Songti SC", serif;
  letter-spacing: 1px;
}

.admin-demo-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(99, 125, 152, 0.15);
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(99, 125, 152, 0.06);
}

.admin-demo-info {
  flex: 1;
}

.admin-demo-name {
  font-size: 14px;
  font-weight: 600;
  color: #334e68;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.admin-demo-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.admin-detail-label {
  font-size: 11px;
  color: rgba(51, 78, 104, 0.5);
  background: rgba(51, 78, 104, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
}

.admin-detail-value {
  font-size: 12px;
  color: #627d98;
  font-family: 'Monaco', 'Menlo', monospace;
}

.admin-fill-btn {
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(51, 78, 104, 0.15) 0%, rgba(31, 41, 55, 0.2) 100%);
  border: 1px solid rgba(51, 78, 104, 0.2);
  color: #334e68;
  border-radius: 10px;
  padding: 0 18px;
  height: 38px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.admin-fill-btn:hover {
  background: linear-gradient(135deg, #334e68 0%, #1f2937 100%);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(51, 78, 104, 0.2);
}

@media (max-width: 480px) {
  .admin-login-card {
    padding: 32px 20px;
  }
  
  .admin-title {
    font-size: 28px;
  }
  
  .admin-logo {
    font-size: 48px;
  }
  
  .admin-demo-card {
    padding: 14px 16px;
  }
  
  .admin-demo-detail {
    flex-wrap: wrap;
  }
}
</style>
