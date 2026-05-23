<template>
  <div class="home">
    <!-- 搜索栏 -->
    <div class="search-header" @click="goSearch">
      <div class="search-inner">
        <van-icon name="search" size="18" color="#999" />
        <span class="search-placeholder">搜索书名、作者、ISBN</span>
      </div>
    </div>

    <!-- 轮播 -->
    <div class="banner-wrap">
      <van-swipe :autoplay="4000" lazy-render indicator-color="#fff" class="banner-swipe">
        <van-swipe-item v-for="banner in banners" :key="banner.id">
          <div class="banner-item" :style="{ background: banner.bg }">
            <div class="banner-text">
              <div class="banner-title">{{ banner.title }}</div>
              <div class="banner-desc">{{ banner.desc }}</div>
            </div>
            <div class="banner-icon">{{ banner.emoji }}</div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 分类入口 -->
    <div class="section category-section">
      <div class="category-grid">
        <div
          v-for="item in categories"
          :key="item.id"
          class="category-item"
          @click="goCategory(item.id)"
        >
          <div class="category-icon">{{ item.icon }}</div>
          <span class="category-name">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <!-- 新书上架 -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">✨</span> 新书上架
        </div>
        <div class="section-more" @click="goCategory()">更多</div>
      </div>
      <div class="horizontal-scroll">
        <BookCard v-for="book in newBooks" :key="book.id" :book="book" />
      </div>
    </div>

    <!-- 热门推荐 -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">🔥</span> 热门推荐
        </div>
        <div class="section-more" @click="goCategory()">更多</div>
      </div>
      <div class="book-grid">
        <BookCard v-for="book in hotBooks" :key="book.id" :book="book" />
      </div>
    </div>

    <!-- 电子书专区 -->
    <div class="section">
      <div class="section-header">
        <div class="section-title">
          <span class="title-icon">📱</span> 电子书专区
        </div>
      </div>
      <div class="ebook-list">
        <div
          v-for="book in ebookBooks"
          :key="book.id"
          class="ebook-item"
          @click="goBookDetail(book.id)"
        >
          <img :src="book.cover" class="ebook-cover" />
          <div class="ebook-info">
            <div class="ebook-title">{{ book.title }}</div>
            <div class="ebook-author">{{ book.author }}</div>
            <div class="ebook-price">¥{{ book.price }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="home-footer">— Light Book · 轻阅读 —</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BookCard from '../../components/common/BookCard.vue'
import { getBooks, getCategories } from '../../api'
import { fillCovers } from '../../mock'

const router = useRouter()

const banners = ref([
  { id: 1, title: '春季阅读季', desc: '精选好书 限时特惠', emoji: '📚', bg: 'linear-gradient(135deg, #8B5E3C 0%, #D4A574 100%)' },
  { id: 2, title: '新书首发', desc: '每日上新 发现好书', emoji: '✨', bg: 'linear-gradient(135deg, #6B4226 0%, #E8B86D 100%)' },
  { id: 3, title: '电子书特惠', desc: '海量电子书 低至1折', emoji: '📱', bg: 'linear-gradient(135deg, #A0522D 0%, #DEB887 100%)' }
])

const categories = ref([])
const newBooks = ref([])
const hotBooks = ref([])
const ebookBooks = ref([])

onMounted(async () => {
  try {
    const [cats, newB, hotB, ebookB] = await Promise.all([
      getCategories(),
      getBooks({ sort: 'new', limit: 6 }),
      getBooks({ sort: 'hot', limit: 6 }),
      getBooks({ type: 'ebook', limit: 6 })
    ])
    categories.value = cats
    newBooks.value = Array.isArray(newB) ? fillCovers(newB) : []
    hotBooks.value = Array.isArray(hotB) ? fillCovers(hotB) : []
    ebookBooks.value = Array.isArray(ebookB) ? fillCovers(ebookB) : []
  } catch (e) {
    console.error('Load data failed:', e)
  }
})

const goSearch = () => router.push({ name: 'category', query: { search: true } })
const goCategory = (id) => router.push({ name: 'category', params: { id } })
const goBookDetail = (id) => router.push({ name: 'book', params: { id } })
</script>

<style scoped>
.home {
  padding-bottom: 70px;
  background: var(--lb-bg);
}

/* 搜索 */
.search-header {
  padding: 10px 16px 14px;
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
  max-width: 768px;
  margin: 0 auto;
}

.search-placeholder {
  font-size: 14px;
  color: var(--lb-text-light);
}

/* 轮播 */
.banner-wrap {
  padding: 0 16px 14px;
  margin-top: -2px;
}

.banner-swipe {
  border-radius: var(--lb-radius-lg);
  overflow: hidden;
  box-shadow: var(--lb-shadow-md);
}

.banner-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 20px;
  min-height: 130px;
}

.banner-text { color: #fff; }
.banner-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.banner-desc { font-size: 13px; opacity: 0.9; }
.banner-icon { font-size: 48px; opacity: 0.3; }

/* 分类 */
.category-section {
  background: var(--lb-bg-card);
  margin: 0 16px 14px;
  border-radius: var(--lb-radius-lg);
  padding: 16px 12px;
  box-shadow: var(--lb-shadow-sm);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px 0;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.2s;
}

.category-item:active { transform: scale(0.9); }

.category-icon {
  width: 44px; height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: var(--lb-bg);
  border-radius: var(--lb-radius-md);
}

.category-name {
  font-size: 12px;
  color: var(--lb-text-light);
}

/* 区块 */
.section { margin: 0 16px 16px; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--lb-text);
  display: flex;
  align-items: center;
  gap: 4px;
}

.title-icon { font-size: 18px; }

.section-more {
  font-size: 13px;
  color: var(--lb-text-light);
  cursor: pointer;
}

/* 横向滚动 */
.horizontal-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.horizontal-scroll::-webkit-scrollbar { display: none; }

/* 热门网格 */
.book-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

/* 电子书 */
.ebook-list { display: flex; flex-direction: column; gap: 10px; }

.ebook-item {
  display: flex;
  gap: 12px;
  background: var(--lb-bg-card);
  border-radius: var(--lb-radius-md);
  padding: 14px;
  box-shadow: var(--lb-shadow-sm);
  transition: all 0.2s;
}

.ebook-item:active { transform: scale(0.98); box-shadow: var(--lb-shadow-md); }

.ebook-cover {
  width: 70px; height: 94px;
  object-fit: cover;
  border-radius: var(--lb-radius-sm);
  flex-shrink: 0;
  background: #f0ebe5;
}

.ebook-info {
  display: flex; flex-direction: column; justify-content: center; min-width: 0;
}

.ebook-title {
  font-size: 15px; font-weight: 600; color: var(--lb-text);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.ebook-author { font-size: 12px; color: var(--lb-text-light); margin-top: 4px; }

.ebook-price { font-size: 16px; font-weight: 700; color: var(--lb-danger); margin-top: 8px; }

.home-footer {
  text-align: center; padding: 20px 0 10px;
  font-size: 12px; color: var(--lb-text-light); letter-spacing: 2px;
}

/* ===== 响应式 ===== */
@media (max-width: 374px) {
  .category-grid { grid-template-columns: repeat(4, 1fr); }
  .book-grid { grid-template-columns: repeat(2, 1fr); }
  .banner-title { font-size: 18px; }
  .banner-icon { font-size: 36px; }
}

@media (min-width: 500px) {
  .category-grid { grid-template-columns: repeat(5, 1fr); }
  .book-grid { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 768px) {
  .banner-item { min-height: 160px; padding: 32px 28px; }
  .banner-title { font-size: 26px; }
  .book-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
}
</style>
