<template>
  <div class="register">
    <div class="register-header">
      <div class="brand-icon">📖</div>
      <h1 class="brand-name">创建账号</h1>
      <p class="brand-slogan">开启你的阅读之旅</p>
    </div>

    <div class="register-card">
      <van-form @submit="handleSubmit">
        <van-cell-group inset class="form-group">
          <van-field
            v-model="form.phone"
            placeholder="请输入手机号"
            :rules="phoneRules"
            class="lb-field"
            left-icon="phone-o"
          />
          <van-field
            v-model="form.code"
            placeholder="请输入验证码"
            :rules="codeRules"
            class="lb-field"
            left-icon="shield-o"
          >
            <template #button>
              <van-button size="small" type="primary" class="code-btn" @click="sendCode">发送验证码</van-button>
            </template>
          </van-field>
          <van-field
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            :rules="passwordRules"
            class="lb-field"
            left-icon="lock"
          />
          <van-field
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :rules="confirmPasswordRules"
            class="lb-field"
            left-icon="lock"
          />
        </van-cell-group>

        <div class="submit-wrap">
          <van-button block type="primary" native-type="submit" class="submit-btn" size="large">
            注 册
          </van-button>
        </div>
      </van-form>

      <div class="register-footer">
        <span class="footer-text">已有账号？</span>
        <router-link to="/login" class="link">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { register } from '../../api'

const router = useRouter()

const form = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: ''
})

const phoneRules = ref([
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
])

const codeRules = ref([
  { required: true, message: '请输入验证码' },
  { pattern: /^\d{6}$/, message: '请输入6位验证码' }
])

const passwordRules = ref([
  { required: true, message: '请输入密码' },
  { minLength: 6, message: '密码至少6位' }
])

const confirmPasswordRules = ref([
  { required: true, message: '请确认密码' },
  { validator: (val) => val === form.password, message: '两次输入的密码不一致' }
])

const sendCode = async () => {
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    showToast({ message: '请输入正确的手机号', type: 'error' })
    return
  }
  showToast({ message: '验证码已发送', type: 'success' })
}

const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) {
    showToast({ message: '两次输入的密码不一致', type: 'error' })
    return
  }

  try {
    await register(form)
    showToast({ message: '注册成功', type: 'success' })
    router.push({ name: 'login' })
  } catch (e) {
    showToast({ message: '注册失败', type: 'error' })
  }
}
</script>

<style scoped>
.register {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--lb-primary) 0%, var(--lb-primary-dark) 35%, var(--lb-bg) 35%);
  padding: 0 20px;
}

.register-header {
  text-align: center;
  padding: 40px 0 24px;
  color: #fff;
}

.brand-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.brand-name {
  font-size: 24px;
  font-weight: 700;
}

.brand-slogan {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 4px;
}

.register-card {
  background: var(--lb-bg-card);
  border-radius: var(--lb-radius-xl);
  padding: 28px 20px;
  box-shadow: var(--lb-shadow-lg);
}

.form-group {
  background: transparent !important;
}

.lb-field {
  background: var(--lb-bg);
  border-radius: var(--lb-radius-md);
  margin-bottom: 12px;
  padding: 4px 0;
}

.lb-field :deep(.van-field__left-icon) {
  color: var(--lb-primary);
}

.code-btn {
  background: var(--lb-primary) !important;
  border-color: var(--lb-primary) !important;
  border-radius: var(--lb-radius-sm) !important;
}

.submit-wrap {
  margin-top: 20px;
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

.register-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  font-size: 13px;
}

.footer-text {
  color: var(--lb-text-light);
}

.link {
  color: var(--lb-primary);
  text-decoration: none;
  font-weight: 500;
}
</style>
