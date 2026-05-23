<template>
  <div class="login">
    <div class="login-header">
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
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { login } from '../../api'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  phone: '',
  password: ''
})

const phoneRules = ref([
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
])

const passwordRules = ref([
  { required: true, message: '请输入密码' },
  { minLength: 6, message: '密码至少6位' }
])

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
.login {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--lb-primary) 0%, var(--lb-primary-dark) 40%, var(--lb-bg) 40%);
  padding: 0 20px;
}

.login-header {
  text-align: center;
  padding: 50px 0 30px;
  color: #fff;
}

.brand-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.brand-name {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
}

.brand-slogan {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 6px;
}

.login-card {
  background: var(--lb-bg-card);
  border-radius: var(--lb-radius-xl);
  padding: 32px 20px;
  box-shadow: var(--lb-shadow-lg);
}

.form-group {
  background: transparent !important;
}

.lb-field {
  background: var(--lb-bg);
  border-radius: var(--lb-radius-md);
  margin-bottom: 14px;
  padding: 4px 0;
}

.lb-field :deep(.van-field__left-icon) {
  color: var(--lb-primary);
}

.submit-wrap {
  margin-top: 24px;
}

.submit-btn {
  height: 48px;
  border-radius: var(--lb-radius-xl) !important;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 8px;
  background: linear-gradient(135deg, var(--lb-primary) 0%, var(--lb-primary-dark) 100%) !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(139, 94, 60, 0.3);
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
  font-size: 13px;
  color: var(--lb-text-light);
}

.link {
  color: var(--lb-primary);
  text-decoration: none;
}

.divider {
  color: var(--lb-border);
}
</style>
