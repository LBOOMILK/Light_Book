<template>
  <div class="tabbar-wrap">
    <div class="tabbar-inner">
      <div
        v-for="tab in tabs"
        :key="tab.name"
        class="tab-item"
        :class="{ active: isActive(tab.name) }"
        @click="goTo(tab.name)"
      >
        <div class="tab-icon-wrap">
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <!-- 首页 -->
            <template v-if="tab.name === 'home'">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </template>
            <!-- 分类 -->
            <template v-else-if="tab.name === 'category'">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </template>
            <!-- 书单 -->
            <template v-else-if="tab.name === 'booklist'">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              <line x1="8" y1="7" x2="16" y2="7" />
              <line x1="8" y1="11" x2="13" y2="11" />
            </template>
            <!-- 购物车 -->
            <template v-else-if="tab.name === 'cart'">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </template>
            <!-- 我的 -->
            <template v-else-if="tab.name === 'user'">
              <circle cx="12" cy="8" r="4" />
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            </template>
          </svg>
          <div v-if="tab.badge && tab.badge() > 0" class="tab-badge">{{ tab.badge() }}</div>
        </div>
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '../../stores/cart'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()

const tabs = [
  { name: 'home', label: '首页' },
  { name: 'category', label: '分类' },
  { name: 'booklist', label: '书单' },
  { name: 'cart', label: '购物车', badge: () => cartStore.totalCount },
  { name: 'user', label: '我的' }
]

const isActive = (name) => route.name === name

const goTo = (name) => {
  if (route.name !== name) router.push({ name })
}
</script>

<style scoped>
.tabbar-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 10px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.tabbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 56px;
  max-width: 768px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border-radius: 22px;
  box-shadow: 0 4px 28px rgba(139, 94, 60, 0.1),
              0 1px 3px rgba(0, 0, 0, 0.04);
  margin-bottom: 8px;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 0;
  min-width: 52px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  color: #b0a89c;
}

.tab-item:active {
  transform: scale(0.88);
}

.tab-item.active {
  color: var(--lb-primary);
}

.tab-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-item.active .tab-icon-wrap {
  background: linear-gradient(135deg, rgba(139, 94, 60, 0.1) 0%, rgba(212, 165, 116, 0.16) 100%);
  width: 40px;
}

.tab-svg {
  width: 22px;
  height: 22px;
  transition: all 0.25s;
}

.tab-item.active .tab-svg {
  stroke-width: 2.2;
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
  transition: all 0.25s;
  letter-spacing: 0.3px;
}

.tab-item.active .tab-label {
  font-weight: 700;
  font-size: 11px;
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: var(--lb-danger);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(255, 77, 79, 0.35);
}

@media (min-width: 768px) {
  .tabbar-wrap {
    display: none;
  }
}

@media (max-width: 374px) {
  .tab-item { min-width: 46px; }
  .tab-label { font-size: 9px; }
  .tab-svg { width: 20px; height: 20px; }
}
</style>
