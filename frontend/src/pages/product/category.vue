<template>
  <div class="category">
    <div class="search-header">
      <van-search
        v-model="keyword"
        shape="round"
        placeholder="搜索书名、作者、ISBN"
        @search="handleSearch"
        background="transparent"
      />
    </div>

    <van-tabs v-model="activeTab" sticky class="lb-tabs" @change="handleTabChange">
      <van-tab v-for="cat in categoryList" :key="cat.id" :title="cat.name">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
          class="book-list"
        >
          <div
            v-for="book in bookList"
            :key="book.id"
            class="book-row"
            @click="goDetail(book.id)"
          >
            <img :src="book.cover" class="book-cover" />
            <div class="book-info">
              <div class="book-title">{{ book.title }}</div>
              <div class="book-author">{{ book.author }}</div>
              <div class="book-meta">
                <van-tag v-if="book.type === 'ebook'" plain color="var(--lb-primary-light)" text-color="var(--lb-primary)">电子书</van-tag>
              </div>
              <div class="book-price">¥{{ book.price }}</div>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCategories, getBooks } from '../../api'
import { fillCovers } from '../../mock'

const router = useRouter()
const route = useRoute()
const keyword = ref(route.query.keyword || '')
const activeTab = ref(0)
const categoryList = ref([])
const bookList = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)

onMounted(async () => {
  try {
    categoryList.value = await getCategories()
  } catch (e) {
    console.error('Load categories failed:', e)
  }
})

const loadMore = async () => {
  if (loading.value || finished.value) return
  loading.value = true

  try {
    const currentCategory = categoryList.value[activeTab.value]
    const data = await getBooks({
      category_id: currentCategory?.id,
      page: page.value,
      limit: 10,
      keyword: keyword.value
    })
    const books = Array.isArray(data) ? fillCovers(data) : []
    if (books.length === 0) {
      finished.value = true
    } else {
      bookList.value = [...bookList.value, ...books]
      page.value++
    }
  } catch (e) {
    console.error('Load books failed:', e)
    finished.value = true
  } finally {
    loading.value = false
  }
}

const handleSearch = (val) => {
  keyword.value = val
  bookList.value = []
  page.value = 1
  finished.value = false
}

const handleTabChange = () => {
  bookList.value = []
  page.value = 1
  finished.value = false
}

const goDetail = (bookId) => {
  router.push({ name: 'book', params: { id: bookId } })
}
</script>

<style scoped>
.category {
  min-height: 100vh;
  background: var(--lb-bg);
}

.search-header {
  background: linear-gradient(135deg, var(--lb-primary) 0%, var(--lb-primary-dark) 100%);
  padding: 8px 0;
}

.search-header :deep(.van-search__content) {
  background: rgba(255, 255, 255, 0.95);
}

.lb-tabs :deep(.van-tabs__wrap) {
  background: var(--lb-bg-card);
  border-bottom: 1px solid var(--lb-border);
}

.lb-tabs :deep(.van-tab) {
  font-size: 14px;
  color: var(--lb-text-secondary);
}

.lb-tabs :deep(.van-tab--active) {
  font-weight: 600;
  color: var(--lb-text);
}

.book-list { padding: 12px 16px; }

.book-row {
  display: flex;
  gap: 14px;
  background: var(--lb-bg-card);
  border-radius: var(--lb-radius-md);
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: var(--lb-shadow-sm);
  transition: all 0.2s;
}

.book-row:active {
  transform: scale(0.98);
  box-shadow: var(--lb-shadow-md);
}

.book-cover {
  width: 80px; height: 106px;
  object-fit: cover;
  border-radius: var(--lb-radius-sm);
  flex-shrink: 0;
  background: #f0ebe5;
}

.book-info {
  display: flex; flex-direction: column; justify-content: space-between;
  min-width: 0; flex: 1;
}

.book-title {
  font-size: 15px; font-weight: 600; color: var(--lb-text);
  line-height: 1.4;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}

.book-author { font-size: 12px; color: var(--lb-text-light); margin-top: 4px; }
.book-meta { margin-top: 6px; }
.book-price { font-size: 17px; font-weight: 700; color: var(--lb-danger); }

@media (max-width: 374px) {
  .book-cover { width: 66px; height: 88px; }
  .book-title { font-size: 14px; }
  .book-price { font-size: 15px; }
}

@media (min-width: 500px) {
  .book-cover { width: 90px; height: 120px; }
}
</style>
