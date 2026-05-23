<template>
  <div class="lb-navbar" :class="{ 'is-fixed': fixed, 'is-transparent': transparent, 'is-dark': dark }">
    <div class="navbar-content">
      <!-- 左侧 -->
      <div class="navbar-left" @click="handleLeft">
        <slot name="left">
          <div v-if="showBack" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </div>
          <div v-else-if="showHome" class="home-btn">
            <van-icon name="home-o" size="20" />
          </div>
        </slot>
      </div>

      <!-- 标题区 -->
      <div class="navbar-title">
        <slot name="title">
          <span class="title-text" v-if="!searchMode">{{ title }}</span>
          <div v-else class="title-search" @click="$emit('search-click')">
            <van-icon name="search" size="15" />
            <span class="search-placeholder">{{ searchPlaceholder }}</span>
          </div>
        </slot>
      </div>

      <!-- 右侧 -->
      <div class="navbar-right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
  <!-- 占位 -->
  <div v-if="fixed && !transparent" class="navbar-placeholder"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: { type: String, default: '' },
  fixed: { type: Boolean, default: true },
  transparent: { type: Boolean, default: false },
  dark: { type: Boolean, default: false },
  showBack: { type: Boolean, default: false },
  showHome: { type: Boolean, default: false },
  searchMode: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: '搜索书名、作者、ISBN' }
})

const emit = defineEmits(['back', 'search-click'])
const router = useRouter()

const handleLeft = () => {
  emit('back')
  if (props.showBack) {
    if (history.length > 1) router.back()
    else router.push({ name: 'home' })
  }
}
</script>

<style scoped>
.lb-navbar {
  --navbar-height: 52px;
  width: 100%;
  z-index: 100;
  background: var(--lb-bg-card);
  transition: all 0.3s ease;
  position: relative;
}

.lb-navbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 16px;
  right: 16px;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, var(--lb-border) 20%, var(--lb-border) 80%, transparent 100%);
}

.lb-navbar.is-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 1px 12px rgba(139, 94, 60, 0.06);
}

.lb-navbar.is-transparent {
  background: transparent;
  box-shadow: none;
}

.lb-navbar.is-transparent::after {
  display: none;
}

.lb-navbar.is-dark {
  background: linear-gradient(135deg, var(--lb-primary) 0%, var(--lb-primary-dark) 100%);
  box-shadow: 0 2px 16px rgba(107, 66, 38, 0.15);
}

.lb-navbar.is-dark::after {
  display: none;
}

.lb-navbar.is-dark .back-btn,
.lb-navbar.is-dark .home-btn {
  color: rgba(255, 255, 255, 0.9);
}

.lb-navbar.is-dark .back-btn:active,
.lb-navbar.is-dark .home-btn:active {
  background: rgba(255, 255, 255, 0.15);
}

.lb-navbar.is-dark .title-text {
  color: #fff;
}

.navbar-content {
  display: flex;
  align-items: center;
  height: var(--navbar-height);
  padding: 0 12px;
  max-width: 768px;
  margin: 0 auto;
  position: relative;
}

.navbar-left {
  flex-shrink: 0;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.back-btn,
.home-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--lb-text);
  background: transparent;
  border: none;
  padding: 0;
}

.back-btn:active,
.home-btn:active {
  background: var(--lb-bg);
  transform: scale(0.92);
}

.navbar-title {
  flex: 1;
  min-width: 0;
  text-align: center;
}

.title-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--lb-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

.title-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--lb-bg);
  border-radius: 20px;
  margin: 0 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--lb-text-light);
}

.title-search:active {
  transform: scale(0.98);
  opacity: 0.85;
}

.search-placeholder {
  font-size: 13px;
  color: var(--lb-text-light);
}

.navbar-right {
  flex-shrink: 0;
  width: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.navbar-placeholder {
  height: var(--navbar-height);
}

@media (min-width: 768px) {
  .navbar-content {
    padding: 0 24px;
  }
  .title-text {
    font-size: 18px;
  }
}

@media (max-width: 374px) {
  .navbar-content {
    padding: 0 8px;
  }
  .navbar-left,
  .navbar-right {
    width: 40px;
  }
  .title-text {
    font-size: 15px;
  }
}
</style>
