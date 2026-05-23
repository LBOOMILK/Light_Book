<template>
  <div id="app">
    <!-- 后台管理：独立布局，不参与切换 -->
    <template v-if="isAdmin">
      <router-view />
    </template>

    <!-- 前台：根据断点切换布局 -->
    <template v-else>
      <!-- 移动端布局 -->
      <div v-if="isMobile" class="mobile-shell">
        <NavBar
          v-if="$route.meta.isShowNav"
          :title="$route.meta.title || 'Light Book'"
          :showBack="$route.meta.isShowBack"
          :fixed="true"
        />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
        <TabBar v-if="isShowTabbar" />
      </div>

      <!-- 桌面端布局 -->
      <DesktopLayout v-else />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDevice } from './composables/useDevice'
import TabBar from './components/common/TabBar.vue'
import NavBar from './components/common/NavBar.vue'
import DesktopLayout from './layouts/DesktopLayout.vue'

const route = useRoute()
const { isMobile } = useDevice()
const isShowTabbar = ref(true)

const isAdmin = computed(() => route.path.startsWith('/admin'))

watch(
  () => route.meta,
  (val) => {
    isShowTabbar.value = val.isTab === true
  },
  { immediate: true }
)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--lb-bg);
  color: var(--lb-text);
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  background-color: var(--lb-bg);
  position: relative;
}

/* 移动端限宽居中 */
.mobile-shell {
  max-width: 768px;
  margin: 0 auto;
  min-height: 100vh;
  background: var(--lb-bg);
  position: relative;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.06);
}

/* 页面过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--lb-primary-light);
  border-radius: 4px;
}

img {
  display: block;
  max-width: 100%;
}

/* 安全区 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .tabbar-wrap {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* 桌面端页面不需要给移动 TabBar 留空 */
.desktop-content .cart-page,
.desktop-content .book-detail,
.desktop-content .orders-page,
.desktop-content .booklist-page,
.desktop-content .reviews-page,
.desktop-content .user-page,
.desktop-content .home {
  padding-bottom: 0 !important;
}

.desktop-content .settle-bar,
.desktop-content .action-bar {
  position: static !important;
  max-width: 100%;
  margin: 16px 0 0;
  border-radius: 12px;
  box-shadow: var(--lb-shadow-sm) !important;
}

/* 桌面端首页不显示搜索头部（桌面头部已有搜索） */
.desktop-content .search-header {
  display: none;
}

/* 桌面端首页分类改为 5-6 列 */
.desktop-content .category-grid {
  grid-template-columns: repeat(6, 1fr) !important;
}

/* 桌面端热门书卡更多列 */
.desktop-content .book-grid {
  grid-template-columns: repeat(5, 1fr) !important;
}
</style>
