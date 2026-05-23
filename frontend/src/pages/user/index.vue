<template>
  <div class="user-page">
    <!-- 用户头部 -->
    <div class="user-header">
      <div class="header-bg"></div>
      <div class="user-profile">
        <div class="avatar-wrap">
          <img :src="userStore.user.avatar || defaultAvatar" class="user-avatar" />
        </div>
        <div class="user-info">
          <div class="user-name" @click="goLogin">{{ userStore.user.username || '点击登录' }}</div>
          <div class="user-points" v-if="userStore.isLogin()">
            <van-icon name="points" /> 积分 {{ userStore.user.points || 0 }}
          </div>
        </div>
      </div>
    </div>

    <!-- 未登录 -->
    <div v-if="!userStore.isLogin()" class="login-prompt">
      <van-button block type="primary" class="login-btn" @click="goLogin">登录 / 注册</van-button>
      <div class="prompt-hint">登录后享受更多功能</div>
    </div>

    <!-- 订单快捷入口 -->
    <div class="order-shortcuts" v-if="userStore.isLogin()">
      <div class="shortcut-title">我的订单</div>
      <div class="shortcut-grid">
        <div class="shortcut-item" @click="goOrders('pending')">
          <van-icon name="clock-o" size="24" />
          <span>待付款</span>
        </div>
        <div class="shortcut-item" @click="goOrders('paid')">
          <van-icon name="logistics" size="24" />
          <span>待发货</span>
        </div>
        <div class="shortcut-item" @click="goOrders('shipped')">
          <van-icon name="send-gift-o" size="24" />
          <span>待收货</span>
        </div>
        <div class="shortcut-item" @click="goOrders('completed')">
          <van-icon name="passed" size="24" />
          <span>已完成</span>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="menu-card">
      <div class="menu-item" @click="goBookshelf">
        <van-icon name="bookmark-o" size="20" color="var(--lb-primary)" />
        <span>我的书架</span>
        <van-icon name="arrow" size="14" color="#ccc" class="arrow" />
      </div>
      <div class="menu-item" @click="goOrders()">
        <van-icon name="orders-o" size="20" color="var(--lb-primary)" />
        <span>全部订单</span>
        <van-icon name="arrow" size="14" color="#ccc" class="arrow" />
      </div>
      <div class="menu-item" @click="goReviews">
        <van-icon name="comment-o" size="20" color="var(--lb-primary)" />
        <span>我的书评</span>
        <van-icon name="arrow" size="14" color="#ccc" class="arrow" />
      </div>
      <div class="menu-item" @click="goBooklist">
        <van-icon name="label-o" size="20" color="var(--lb-primary)" />
        <span>我的书单</span>
        <van-icon name="arrow" size="14" color="#ccc" class="arrow" />
      </div>
    </div>

    <div class="menu-card">
      <div class="menu-item" @click="goPoints">
        <van-icon name="gift-o" size="20" color="var(--lb-accent)" />
        <span>积分记录</span>
        <van-icon name="arrow" size="14" color="#ccc" class="arrow" />
      </div>
      <div class="menu-item" @click="goSettings">
        <van-icon name="setting-o" size="20" color="var(--lb-text-light)" />
        <span>账号设置</span>
        <van-icon name="arrow" size="14" color="#ccc" class="arrow" />
      </div>
    </div>

    <div class="menu-card" v-if="userStore.isLogin()">
      <div class="menu-item logout" @click="handleLogout">
        <van-icon name="close" size="20" color="var(--lb-danger)" />
        <span>退出登录</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '../../stores/user'

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI0MCIgZmlsbD0iI0Q0QTU3NCIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMzIiIHI9IjEyIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTSAxOCA2MmMwLTEyIDEwLTIyIDIyLTIyczIyIDEwIDIyIDIyIiBmaWxsPSIjZmZmIi8+PC9zdmc+'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => { userStore.loadUser() })

const goLogin = () => { if (!userStore.isLogin()) router.push({ name: 'login' }) }
const goOrders = () => router.push({ name: 'orders' })
const goBookshelf = () => router.push({ name: 'booklist' })
const goReviews = () => router.push({ name: 'reviews', params: { bookId: 0 } })
const goBooklist = () => router.push({ name: 'booklist' })
const goPoints = () => showToast('积分记录功能开发中')
const goSettings = () => showToast('设置功能开发中')

const handleLogout = () => {
  userStore.logout()
  showToast({ message: '已退出登录', type: 'success' })
}
</script>

<style scoped>
.user-page { min-height: 100vh; background: var(--lb-bg); padding-bottom: 70px; }

.user-header { position: relative; padding: 40px 20px 24px; overflow: hidden; }
.header-bg { position: absolute; inset: 0; background: linear-gradient(135deg, var(--lb-primary) 0%, var(--lb-primary-dark) 100%); }

.user-profile { position: relative; display: flex; align-items: center; gap: 16px; max-width: 768px; margin: 0 auto; }

.avatar-wrap {
  width: 72px; height: 72px; border-radius: 50%; overflow: hidden;
  border: 3px solid rgba(255,255,255,0.3); box-shadow: var(--lb-shadow-md);
}

.user-avatar { width: 100%; height: 100%; object-fit: cover; }

.user-info { color: #fff; }
.user-name { font-size: 20px; font-weight: 700; }
.user-points { font-size: 12px; opacity: 0.8; margin-top: 4px; display: flex; align-items: center; gap: 4px; }

.login-prompt { padding: 20px; text-align: center; }
.login-btn { border-radius: var(--lb-radius-xl) !important; height: 44px; font-weight: 600; }
.prompt-hint { font-size: 12px; color: var(--lb-text-light); margin-top: 8px; }

.order-shortcuts {
  background: var(--lb-bg-card); margin: 0 16px 12px;
  border-radius: var(--lb-radius-lg); padding: 16px; box-shadow: var(--lb-shadow-sm);
}

.shortcut-title { font-size: 15px; font-weight: 600; color: var(--lb-text); margin-bottom: 14px; }
.shortcut-grid { display: grid; grid-template-columns: repeat(4, 1fr); }

.shortcut-item {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 8px 0; color: var(--lb-text-secondary); font-size: 12px;
  cursor: pointer; transition: all 0.2s;
}

.shortcut-item:active { transform: scale(0.92); color: var(--lb-primary); }
.shortcut-item :deep(.van-icon) { color: var(--lb-primary); }

.menu-card {
  background: var(--lb-bg-card); margin: 0 16px 12px;
  border-radius: var(--lb-radius-lg); overflow: hidden; box-shadow: var(--lb-shadow-sm);
}

.menu-item {
  display: flex; align-items: center; gap: 12px; padding: 16px 20px;
  font-size: 15px; color: var(--lb-text); cursor: pointer;
  transition: background 0.15s; border-bottom: 1px solid var(--lb-border);
}

.menu-item:last-child { border-bottom: none; }
.menu-item:active { background: var(--lb-bg); }
.arrow { margin-left: auto; }
.logout { color: var(--lb-danger); justify-content: center; font-weight: 500; }

@media (max-width: 374px) {
  .user-header { padding: 32px 16px 20px; }
  .avatar-wrap { width: 60px; height: 60px; }
  .user-name { font-size: 18px; }
}
</style>
