<template>
  <el-container class="desktop-layout">
    <!-- 顶部导航 -->
    <el-header class="desktop-header" height="64px">
      <div class="header-left" @click="goHome">
        <span class="logo-icon">📖</span>
        <span class="logo-text">Light Book</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        router
        mode="horizontal"
        :ellipsis="false"
        background-color="transparent"
        text-color="#5c5c6e"
        active-text-color="#8B5E3C"
        class="nav-menu"
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
      </el-menu>

      <div class="header-right">
        <!-- 搜索框 -->
        <div class="search-container">
          <div 
            class="search-box"
            :class="{ expanded: isSearchExpanded }"
            @click="handleSearchClick"
          >
            <el-icon class="search-icon"><Search /></el-icon>
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              :placeholder="searchPlaceholder"
              :focused="isSearchExpanded"
            />
            <div 
              v-if="searchKeyword.trim()" 
              class="search-button"
              @click.stop="handleSearchSubmit"
            >
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        <el-avatar :size="36" :src="userAvatar" class="user-avatar" @click="goUser" />
      </div>
    </el-header>

    <!-- 主内容 -->
    <el-main class="desktop-content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import {
  HomeFilled, Grid, Notebook, ShoppingCart,
  List, User, Search, ArrowRight
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const userStore = useUserStore()

const isSearchExpanded = ref(false)
const searchKeyword = ref('')

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/book/')) return '/category'
  if (path.startsWith('/reviews/')) return '/category'
  return path
})

const userAvatar = computed(() =>
  userStore.user.avatar || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iI0Q0QTU3NCIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIiIHI9IjUiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNCAyNmMwLTcgNS0xMiAxMi0xMnMxMiA1IDEyIDEyIiBmaWxsPSIjZmZmIi8+PC9zdmc+'
)

const searchPlaceholder = computed(() => {
  return isSearchExpanded.value ? '输入书名/作者' : ''
})

const goHome = () => router.push('/home')
const goUser = () => router.push('/user')

const handleSearchClick = (e) => {
  e.stopPropagation()
  isSearchExpanded.value = true
}

const handleSearchSubmit = () => {
  console.log('搜索关键词:', searchKeyword.value)
}

const handleClickOutside = (e) => {
  if (isSearchExpanded.value && !e.target.closest('.search-box') && !searchKeyword.value.trim()) {
    isSearchExpanded.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.desktop-layout {
  min-height: 100vh;
  background: var(--lb-bg);
}

.desktop-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid var(--lb-border);
  padding: 0 40px;
  box-shadow: 0 2px 8px rgba(139, 94, 60, 0.04);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #8B5E3C;
  letter-spacing: 1px;
}

.nav-menu {
  border-bottom: none;
  flex: 1;
  justify-content: center;
}

.nav-menu :deep(.el-menu-item) {
  height: 64px;
  line-height: 64px;
  font-size: 14px;
  font-weight: 500;
}

.nav-menu :deep(.el-menu-item:hover) {
  color: #8B5E3C;
  background: rgba(139, 94, 60, 0.05);
}

.cart-badge {
  margin-left: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 搜索框容器 */
.search-container {
  position: relative;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--lb-bg);
  border-radius: 24px;
  cursor: pointer;
  color: var(--lb-text-light);
  font-size: 14px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  width: 120px;
  border: 2px solid transparent;
}

.search-box.expanded {
  width: 300px;
  background: #fff;
  border-color: #8B5E3C;
  box-shadow: 0 4px 20px rgba(139, 94, 60, 0.15);
}

.search-icon {
  font-size: 16px;
  color: var(--lb-text-light);
  transition: color 0.3s;
}

.search-box.expanded .search-icon {
  color: #8B5E3C;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: var(--lb-text);
  width: 0;
  opacity: 0;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box.expanded .search-input {
  width: calc(100% - 60px);
  opacity: 1;
}

.search-input::placeholder {
  color: rgba(139, 94, 60, 0.5);
}

/* 搜索按钮 */
.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5E3C, #D4A574);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  opacity: 0;
  transform: translateX(10px);
  animation: fadeInRight 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.search-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(139, 94, 60, 0.3);
}

.search-button :deep(.el-icon) {
  font-size: 14px;
}

.user-avatar {
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.desktop-content {
  padding: 0;
  width: 100%;
}
</style>
