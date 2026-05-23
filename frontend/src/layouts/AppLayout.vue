<template>
  <!-- 桌面端布局 -->
  <DesktopLayout v-if="isDesktop" />
  
  <!-- 移动端布局 -->
  <MobileLayout v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useDevice } from '../composables/useDevice'
import DesktopLayout from './DesktopLayout.vue'
import MobileLayout from './MobileLayout.vue'

const { isDesktop } = useDevice()
</script>
