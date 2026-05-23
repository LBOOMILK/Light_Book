<template>
  <div class="search-bar" @click="handleFocus">
    <div class="search-inner">
      <van-icon name="search" size="18" color="#999" />
      <span class="search-placeholder">搜索书名、作者、ISBN</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleFocus = () => {
  router.push({ name: 'category', query: { search: true } })
}
</script>

<style scoped>
.search-bar {
  padding: 8px 16px 12px;
  background: linear-gradient(135deg, var(--lb-primary) 0%, var(--lb-primary-dark) 100%);
}

.search-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--lb-radius-xl);
  box-shadow: var(--lb-shadow-sm);
}

.search-placeholder {
  font-size: 14px;
  color: var(--lb-text-light);
}
</style>
