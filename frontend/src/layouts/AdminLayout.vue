<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="admin-aside">
      <div class="logo" :class="{ collapsed: isCollapse }">
        <span class="logo-icon">📖</span>
        <span v-if="!isCollapse" class="logo-text">Light Book</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        router
        background-color="#1a1a2e"
        text-color="#a0a0b8"
        active-text-color="#D4A574"
        class="admin-menu"
      >
        <el-menu-item index="/admin">
          <el-icon><DataBoard /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-sub-menu index="product">
          <template #title>
            <el-icon><ShoppingBag /></el-icon>
            <span>商品管理</span>
          </template>
          <el-menu-item index="/admin/books">图书列表</el-menu-item>
          <el-menu-item index="/admin/categories">分类管理</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/admin/orders">
          <el-icon><List /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/reviews">
          <el-icon><ChatDotRound /></el-icon>
          <span>书评管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container class="admin-main-container">
      <!-- 顶部栏 -->
      <el-header class="admin-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <div class="admin-user">
              <el-avatar :size="32" :src="adminAvatar" />
              <span class="admin-name">管理员</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goHome">前台首页</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="admin-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  DataBoard, ShoppingBag, List, User, ChatDotRound,
  Fold, Expand
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)

const adminAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzhCNUUzQyIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIiIHI9IjUiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNCAyNmMwLTcgNS0xMiAxMi0xMnMxMiA1IDEyIDEyIiBmaWxsPSIjZmZmIi8+PC9zdmc+'

const activeMenu = computed(() => route.path)

const currentTitle = computed(() => {
  const map = {
    '/admin': '',
    '/admin/books': '图书列表',
    '/admin/categories': '分类管理',
    '/admin/orders': '订单管理',
    '/admin/users': '用户管理',
    '/admin/reviews': '书评管理'
  }
  return map[route.path] || ''
})

const goHome = () => router.push('/home')
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.admin-aside {
  background: #1a1a2e;
  transition: width 0.3s ease;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  white-space: nowrap;
}

.logo.collapsed {
  justify-content: center;
  padding: 20px 0;
}

.logo-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #D4A574;
  letter-spacing: 1px;
}

.admin-menu {
  border-right: none;
  margin-top: 8px;
}

.admin-menu:not(.el-menu--collapse) {
  width: 220px;
}

.admin-main-container {
  background: #f5f5f5;
  overflow: hidden;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  height: 56px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.collapse-btn:hover {
  color: #8B5E3C;
}

.header-right {
  display: flex;
  align-items: center;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.admin-user:hover {
  background: #f5f5f5;
}

.admin-name {
  font-size: 14px;
  color: #333;
}

.admin-content {
  padding: 24px;
  overflow-y: auto;
  background: #f5f5f5;
}
</style>
