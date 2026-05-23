<template>
  <div class="category">
    <!-- 桌面端侧边栏 + 内容区布局 -->
    <div class="desktop-category-layout">
      <!-- 左侧分类导航 -->
      <div class="desktop-sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">图书分类</span>
        </div>
        <div class="category-list">
          <div
            v-for="(cat, index) in categoryList"
            :key="cat.id"
            class="category-item"
            :class="{ active: activeTab === index }"
            @click="handleCategoryClick(index)"
          >
            <span class="category-item-name">{{ cat.name }}</span>
            <span v-if="activeTab === index" class="active-indicator"></span>
          </div>
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="desktop-content-area">
        <div class="content-header">
          <h2 class="current-category-name">{{ displayCategories[activeTab]?.name || '全部图书' }}</h2>
          <span class="book-count" v-if="bookList.length > 0">共 {{ bookList.length }} 本图书</span>
        </div>

        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
          class="book-grid"
        >
          <div
            v-for="book in bookList"
            :key="book.id"
            class="book-card"
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
      </div>
    </div>

    <!-- 移动端布局 -->
    <div class="mobile-category-layout">
      <!-- 分类选择器 -->
      <div class="mobile-category-selector">
        <div class="selector-content">
          <div class="current-category">
            <span class="current-label">{{ displayCategories[activeTab]?.name || '全部图书' }}</span>
            <van-icon name="arrow-down" size="14" color="var(--lb-text-light)" />
          </div>
          <div class="quick-categories">
            <span
              v-for="(cat, index) in displayCategories.slice(0, 4)"
              :key="cat.id"
              class="quick-tag"
              :class="{ active: activeTab === index }"
              @click="handleCategoryClick(index)"
            >
              {{ cat.name }}
            </span>
          </div>
        </div>
        <van-button
          size="small"
          type="primary"
          plain
          class="change-btn"
          @click="showCategoryPicker = true"
        >
          <van-icon name="setting-o" />
          切换
        </van-button>
      </div>

      <!-- 图书列表 -->
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

      <!-- 分类选择弹窗 -->
      <van-popup v-model:show="showCategoryPicker" position="bottom" round class="category-popup">
        <div class="popup-header">
          <span class="popup-title">选择分类</span>
          <van-icon name="cross" size="20" @click="showCategoryPicker = false" />
        </div>
        <div class="popup-content">
          <div class="category-grid">
            <div
              v-for="(cat, index) in categoryList"
              :key="cat.id"
              class="category-option"
              :class="{ active: activeTab === index }"
              @click="handleCategorySelect(index)"
            >
              <span class="option-icon">{{ cat.icon }}</span>
              <span class="option-name">{{ cat.name }}</span>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories, getBooks } from '../../api'
import { fillCovers } from '../../mock'
import { useDevice } from '../../composables/useDevice'

const router = useRouter()
const { isMobile } = useDevice()
const activeTab = ref(0)
const categoryList = ref([])
const bookList = ref([])
const loading = ref(false)
const finished = ref(false)
const page = ref(1)
const showCategoryPicker = ref(false)

const displayCategories = computed(() => categoryList.value)

onMounted(async () => {
  try {
    categoryList.value = await getCategories()
    if (categoryList.value.length > 0) {
      loadMore()
    }
  } catch (e) {
    console.error('Load categories failed:', e)
  }
})

const loadMore = async () => {
  if (loading.value || finished.value) return
  loading.value = true

  try {
    const currentCategory = displayCategories.value[activeTab.value]
    const data = await getBooks({
      category_id: currentCategory?.id,
      page: page.value,
      limit: isMobile.value ? 10 : 20
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

const handleCategoryClick = (index) => {
  activeTab.value = index
  bookList.value = []
  page.value = 1
  finished.value = false
  loadMore()
}

const handleCategorySelect = (index) => {
  handleCategoryClick(index)
  showCategoryPicker.value = false
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

/* ========== 桌面端样式 ========== */
.desktop-category-layout {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 40px;
  gap: 32px;
}

.desktop-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  height: fit-content;
  position: sticky;
  top: 96px;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--lb-text);
}

.category-list {
  padding: 12px 0;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.category-item:hover {
  background: var(--lb-bg);
}

.category-item.active {
  background: #faf7f3;
}

.category-item.active .category-item-name {
  color: #8B5E3C;
  font-weight: 700;
}

.category-item-name {
  font-size: 15px;
  color: var(--lb-text);
}

.active-indicator {
  width: 4px;
  height: 20px;
  background: linear-gradient(135deg, #8B5E3C, #D4A574);
  border-radius: 2px;
  position: absolute;
  right: 0;
}

.desktop-content-area {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
}

.current-category-name {
  font-size: 26px;
  font-weight: 800;
  color: var(--lb-text);
  margin: 0;
}

.book-count {
  font-size: 14px;
  color: var(--lb-text-light);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.book-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.book-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(139, 94, 60, 0.12);
}

.book-card .book-cover {
  width: 100%;
  height: auto;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 8px;
  background: #f0ebe5;
  margin-bottom: 12px;
}

.book-card .book-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.book-card .book-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--lb-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-card .book-author {
  font-size: 13px;
  color: var(--lb-text-light);
}

.book-card .book-price {
  font-size: 18px;
  font-weight: 800;
  color: var(--lb-danger);
  margin-top: 4px;
}

/* 隐藏移动端内容 */
.mobile-category-layout {
  display: none;
}

/* ========== 移动端样式 ========== */
@media (max-width: 768px) {
  .desktop-category-layout {
    display: none;
  }

  .mobile-category-layout {
    display: block;
  }

  /* 分类选择器 */
  .mobile-category-selector {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .selector-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .current-category {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 16px;
    font-weight: 700;
    color: var(--lb-text);
    flex-shrink: 0;
  }

  .current-label {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quick-categories {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    flex: 1;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .quick-categories::-webkit-scrollbar {
    display: none;
  }

  .quick-tag {
    padding: 6px 12px;
    background: var(--lb-bg);
    border-radius: 16px;
    font-size: 13px;
    color: var(--lb-text-secondary);
    white-space: nowrap;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.2s;
  }

  .quick-tag.active {
    background: linear-gradient(135deg, #8B5E3C, #D4A574);
    color: #fff;
    font-weight: 600;
  }

  .change-btn {
    flex-shrink: 0;
    border-radius: 16px;
  }

  /* 图书列表 */
  .book-list {
    padding: 12px 16px;
  }

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

  .book-row .book-cover {
    width: 80px;
    height: 106px;
    object-fit: cover;
    border-radius: var(--lb-radius-sm);
    flex-shrink: 0;
    background: #f0ebe5;
  }

  .book-row .book-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    flex: 1;
  }

  .book-row .book-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--lb-text);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .book-row .book-author {
    font-size: 12px;
    color: var(--lb-text-light);
    margin-top: 4px;
  }

  .book-row .book-meta {
    margin-top: 6px;
  }

  .book-row .book-price {
    font-size: 17px;
    font-weight: 700;
    color: var(--lb-danger);
  }

  /* 分类选择弹窗 */
  .category-popup {
    max-height: 70vh;
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid var(--lb-border);
  }

  .popup-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--lb-text);
  }

  .popup-content {
    padding: 20px;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .category-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    background: var(--lb-bg);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-option:active {
    transform: scale(0.95);
  }

  .category-option.active {
    background: linear-gradient(135deg, #8B5E3C, #D4A574);
  }

  .category-option.active .option-icon,
  .category-option.active .option-name {
    color: #fff;
  }

  .option-icon {
    font-size: 32px;
  }

  .option-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--lb-text);
    text-align: center;
    line-height: 1.3;
  }
}

@media (max-width: 374px) {
  .book-row .book-cover {
    width: 66px;
    height: 88px;
  }

  .book-row .book-title {
    font-size: 14px;
  }

  .book-row .book-price {
    font-size: 15px;
  }

  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 500px) and (max-width: 768px) {
  .book-row .book-cover {
    width: 90px;
    height: 120px;
  }
}
</style>
