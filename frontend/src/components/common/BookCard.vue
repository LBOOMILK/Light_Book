<template>
  <div class="book-card" @click="goDetail">
    <div class="book-cover-wrap">
      <img :src="book.cover" :alt="book.title" class="book-cover" />
      <van-tag v-if="book.type === 'ebook'" class="ebook-tag" color="var(--lb-primary-light)" text-color="var(--lb-primary-dark)">电子书</van-tag>
    </div>
    <div class="book-info">
      <div class="book-title">{{ book.title }}</div>
      <div class="book-author">{{ book.author }}</div>
      <div class="book-price">
        <span class="price-current">¥{{ book.price }}</span>
        <span v-if="book.original_price" class="price-original">¥{{ book.original_price }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const goDetail = () => {
  router.push({ name: 'book', params: { id: props.book.id } })
}
</script>

<style scoped>
.book-card {
  flex-shrink: 0;
  width: 130px;
  background: var(--lb-bg-card);
  border-radius: var(--lb-radius-md);
  overflow: hidden;
  box-shadow: var(--lb-shadow-sm);
  transition: all 0.25s ease;
}

.book-card:active {
  transform: scale(0.97);
  box-shadow: var(--lb-shadow-md);
}

.book-cover-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #f0ebe5;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:active .book-cover {
  transform: scale(1.03);
}

.ebook-tag {
  position: absolute;
  top: 6px;
  left: 6px;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
}

.book-info {
  padding: 8px 10px 10px;
}

.book-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--lb-text);
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 11px;
  color: var(--lb-text-light);
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 6px;
}

.price-current {
  font-size: 15px;
  font-weight: 700;
  color: var(--lb-danger);
}

.price-original {
  font-size: 11px;
  color: var(--lb-text-light);
  text-decoration: line-through;
}
</style>
