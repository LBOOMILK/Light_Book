<template>
  <div id="mobile-app">
    <main class="main-content" :style="{ paddingBottom: isShowTabbar ? '56px' : '0' }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <TabBar v-if="isShowTabbar" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TabBar from '../components/common/TabBar.vue'

const route = useRoute()
const isShowTabbar = ref(true)

watch(
  () => route.meta,
  (val) => {
    isShowTabbar.value = val.isTab === true
  },
  { immediate: true }
)
</script>

<style scoped>
#mobile-app {
  min-height: 100vh;
  max-width: 768px;
  margin: 0 auto;
  background-color: var(--lb-bg);
  position: relative;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
}

.main-content {
  min-height: 100vh;
  width: 100%;
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
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--lb-primary-light);
  border-radius: 4px;
}

/* 安全区适配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .van-tabbar,
  .settle-bar {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
