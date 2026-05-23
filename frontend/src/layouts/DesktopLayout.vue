<template>
  <el-container class="desktop-layout">
    <!-- 侧边导航 -->
    <el-aside width="200px" class="desktop-aside">
      <div class="logo" @click="goHome">
        <span class="logo-icon">📖</span>
        <span class="logo-text">Light Book</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#1a1a2e"
        text-color="#a0a0b8"
        active-text-color="#D4A574"
        class="side-menu"
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <el-icon><Grid /></el-icon>
          <span>分类</span>
        </el-menu-item>
        <el-menu-item index="/booklist">
          <el-icon><Notebook /></el-icon>
          <span>书单</span>
        </el-menu-item>
        <el-menu-item index="/cart">
          <el-icon><ShoppingCart /></el-icon>
          <span>购物车</span>
          <el-badge v-if="cartStore.totalCount > 0" :value="cartStore.totalCount" class="cart-badge" />
        </el-menu-item>
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <span>订单</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon><User /></el-icon>
          <span>我的</span>
        </el-menu-item>
      </el-menu>

      <div class="side-footer">
        <el-button text class="admin-link" @click="goAdmin">
          <el-icon><Setting /></el-icon>后台管理
        </el-button>
      </div>
    </el-aside>

    <!-- 主内容 -->
    <el-container class="desktop-main">
      <!-- 顶部搜索栏 -->
      <el-header class="desktop-header" height="60px">
        <div class="header-search" @click="goSearch">
          <el-icon size="18"><Search /></el-icon>
          <span>搜索书名、作者、ISBN</span>
        </div>
        <div class="header-user" @click="goUser">
          <el-avatar :size="32" :src="userAvatar" />
        </div>
      </el-header>

      <!-- 路由页面 -->
      <el-main class="desktop-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import {
  HomeFilled, Grid, Notebook, ShoppingCart,
  List, User, Setting, Search
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/book/')) return '/category'
  if (path.startsWith('/reviews/')) return '/category'
  return path
})

const userAvatar = computed(() =>
  userStore.user.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Q0QTU3NCIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIiIHI9IjUiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNCAyNmMwLTcgNS0xMiAxMi0xMnMxMiA1IDEyIDEyIiBmaWxsPSIjZmZmIi8+PC9zdmc+'
)

const goHome = () => router.push('/home')
const goSearch = () => router.push({ name: 'category', query: { search: true } })
const goUser = () => router.push('/user')
const goAdmin = () => router.push('/admin')
</script>

<style scoped>
.desktop-layout {
  height: 100vh;
  overflow: hidden;
}

.desktop-aside {
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #D4A574;
  letter-spacing: 1px;
}

.side-menu {
  flex: 1;
  border-right: none;
  padding-top: 8px;
}

.cart-badge {
  margin-left: 8px;
}

.side-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.admin-link {
  color: #a0a0b8 !important;
  width: 100%;
  justify-content: flex-start;
}

.admin-link:hover {
  color: #D4A574 !important;
}

.desktop-main {
  background: var(--lb-bg);
  overflow: hidden;
}

.desktop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid var(--lb-border);
  padding: 0 32px;
}

.header-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--lb-bg);
  border-radius: 20px;
  cursor: pointer;
  color: var(--lb-text-light);
  font-size: 14px;
  width: 360px;
  transition: all 0.2s;
}

.header-search:hover {
  background: #ede8e3;
}

.header-user {
  cursor: pointer;
}

.desktop-content {
  overflow-y: auto;
  padding: 24px 32px;
}
</style>
