<template>
  <div class="login-page">
    <FloatingBackground :min-opacity="0.18" :max-opacity="0.3" />
    
    <div class="login-container">
      <div class="login-header">
        <div class="secret-trigger" @click="handleSecretClick">
          <div class="pulse-dot"></div>
        </div>
        <div class="brand-icon">📖</div>
        <h1 class="brand-name">Light Book</h1>
        <p class="brand-slogan">轻阅读，好时光</p>
      </div>

      <div class="login-card">
        <van-form @submit="handleSubmit">
          <van-cell-group inset class="form-group">
            <van-field
              v-model="form.phone"
              label=""
              placeholder="请输入手机号"
              :rules="phoneRules"
              class="lb-field"
              left-icon="phone-o"
            />
            <van-field
              v-model="form.password"
              type="password"
              label=""
              placeholder="请输入密码"
              :rules="passwordRules"
              class="lb-field"
              left-icon="lock"
            />
          </van-cell-group>

          <div class="submit-wrap">
            <van-button block type="primary" native-type="submit" class="submit-btn" size="large">
              登 录
            </van-button>
          </div>
        </van-form>

        <div class="login-footer">
          <router-link to="/register" class="link">注册账号</router-link>
          <span class="divider">|</span>
          <span class="link">忘记密码？</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { login } from '../../api'
import { useUserStore } from '../../stores/user'
import FloatingBackground from '../../components/common/FloatingBackground.vue'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  phone: '',
  password: ''
})

const adminClickCount = ref(0)

const phoneRules = ref([
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
])

const passwordRules = ref([
  { required: true, message: '请输入密码' },
  { minLength: 6, message: '密码至少6位' }
])

const handleSecretClick = () => {
  adminClickCount.value++
  if (adminClickCount.value >= 3) {
    adminClickCount.value = 0
    router.push('/admin/login')
  }
}

const handleSubmit = async () => {
  try {
    const data = await login(form)
    userStore.setToken(data.token)
    userStore.setUser(data.user)
    showToast({ message: '登录成功', type: 'success' })
    router.push({ name: 'user' })
  } catch (e) {
    showToast({ message: '登录失败', type: 'error' })
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f7f0e8 0%, #f0e6d9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
}

.login-header {
  text-align: center;
  color: #5a3c2c;
  position: relative;
  margin-bottom: 32px;
}

.secret-trigger {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  padding: 10px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: rgba(100, 181, 246, 0.7);
  border-radius: 50%;
  position: relative;
}

.pulse-dot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: rgba(100, 181, 246, 0.7);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.pulse-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: rgba(100, 181, 246, 0.5);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite 0.5s;
}

@keyframes pulse {
  0% {
    width: 8px;
    height: 8px;
    opacity: 0.8;
  }
  100% {
    width: 24px;
    height: 24px;
    opacity: 0;
  }
}

.brand-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.brand-name {
  font-family: "Georgia", "STSong", "SimSun", "Songti SC", serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 4px;
  color: #5a3c2c;
  margin: 0;
}

.brand-slogan {
  font-family: "STSong", "SimSun", "Songti SC", serif;
  font-size: 15px;
  color: #8b6a4a;
  margin-top: 10px;
  letter-spacing: 2px;
}

.login-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 94, 60, 0.15);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(139, 94, 60, 0.08);
}

.form-group {
  background: transparent !important;
}

.lb-field {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(139, 94, 60, 0.12);
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 4px 0;
}

.lb-field :deep(.van-field__left-icon) {
  color: #8b6a4a;
}

.lb-field :deep(.van-field__control) {
  color: #4a3520;
}

.lb-field :deep(.van-field__control::placeholder) {
  color: rgba(74, 53, 32, 0.4);
}

.submit-wrap {
  margin-top: 28px;
}

.submit-btn {
  height: 50px;
  border-radius: 24px !important;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 8px;
  background: linear-gradient(135deg, #8B5E3C 0%, #6B4428 100%) !important;
  border: none !important;
  box-shadow: 0 4px 20px rgba(139, 94, 60, 0.25);
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
  font-size: 14px;
  color: #8b6a4a;
}

.link {
  color: #8b6a4a;
  text-decoration: none;
  transition: color 0.2s;
}

.link:hover {
  color: #6B4428;
}

.divider {
  color: rgba(139, 94, 60, 0.3);
}

@media (max-width: 480px) {
  .login-container {
    padding: 0 16px;
  }
  
  .login-card {
    padding: 32px 20px;
  }
  
  .brand-name {
    font-size: 28px;
  }
  
  .brand-icon {
    font-size: 48px;
  }
}
</style>
