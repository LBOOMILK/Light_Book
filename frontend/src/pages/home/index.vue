<template>
  <div class="home">
    <!-- 桌面端轮播图 -->
    <div class="desktop-banner-wrap">
      <van-swipe :autoplay="4000" lazy-render indicator-color="#fff" class="desktop-banner-swipe">
        <van-swipe-item v-for="banner in banners" :key="banner.id">
          <div class="desktop-banner-item" :style="{ background: banner.bg }">
            <div class="banner-content">
              <div class="banner-text">
                <div class="banner-title">{{ banner.title }}</div>
                <div class="banner-desc">{{ banner.desc }}</div>
              </div>
              <div class="banner-icon">{{ banner.emoji }}</div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 移动端轮播图 -->
    <div class="mobile-banner-wrap">
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

    <!-- 内容区域 -->
    <div class="home-content">
      <!-- 分类入口 -->
      <div class="section category-section">
        <div class="section-header desktop-section-header">
          <div class="section-title">
            <span class="title-icon">📚</span> 精选分类
          </div>
          <div class="section-more" @click="goCategory">查看全部 →</div>
        </div>
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
        <div class="section-header desktop-section-header">
          <div class="section-title">
            <span class="title-icon">✨</span> 新书上架
          </div>
          <div class="section-more" @click="goCategory">更多新书 →</div>
        </div>
        <div class="book-grid">
          <BookCard v-for="book in newBooks" :key="book.id" :book="book" />
        </div>
      </div>

      <!-- 热门推荐 -->
      <div class="section">
        <div class="section-header desktop-section-header">
          <div class="section-title">
            <span class="title-icon">🔥</span> 热门推荐
          </div>
          <div class="section-more" @click="goCategory">更多推荐 →</div>
        </div>
        <div class="book-grid">
          <BookCard v-for="book in hotBooks" :key="book.id" :book="book" />
        </div>
      </div>

      <!-- 电子书专区 -->
      <div class="section">
        <div class="section-header desktop-section-header">
          <div class="section-title">
            <span class="title-icon">📱</span> 电子书专区
          </div>
        </div>
        <div class="ebook-grid">
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
      getBooks({ sort: 'new', limit: 8 }),
      getBooks({ sort: 'hot', limit: 8 }),
      getBooks({ type: 'ebook', limit: 8 })
    ])
    categories.value = cats
    newBooks.value = Array.isArray(newB) ? fillCovers(newB) : []
    hotBooks.value = Array.isArray(hotB) ? fillCovers(hotB) : []
    ebookBooks.value = Array.isArray(ebookB) ? fillCovers(ebookB) : []
  } catch (e) {
    console.error('Load data failed:', e)
  }
})

const goCategory = (id) => router.push({ name: 'category', params: { id } })
const goBookDetail = (id) => router.push({ name: 'book', params: { id } })
</script>

<style scoped>
.home {
  background: var(--lb-bg);
}

/* ========== 桌面端样式 ========== */
.desktop-banner-wrap {
  display: block;
  width: 100%;
}

.desktop-banner-swipe {
  border-radius: 0;
  overflow: hidden;
}

.desktop-banner-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  min-height: 380px;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
}

.banner-text {
  color: #fff;
}

.banner-title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 12px;
}

.banner-desc {
  font-size: 20px;
  opacity: 0.95;
}

.banner-icon {
  font-size: 120px;
  opacity: 0.3;
}

.home-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 40px;
}

.section {
  margin-bottom: 56px;
}

.desktop-section-header {
  margin-bottom: 24px;
  padding: 0;
}

.desktop-section-header .section-title {
  font-size: 24px;
  font-weight: 800;
}

.desktop-section-header .section-more {
  font-size: 15px;
  color: #8B5E3C;
  font-weight: 500;
}

.desktop-section-header .section-more:hover {
  opacity: 0.8;
}

/* 分类网格 */
.category-section {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(139, 94, 60, 0.06);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 24px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item:hover {
  background: var(--lb-bg);
  transform: translateY(-4px);
}

.category-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: #f7f4f1;
  border-radius: 14px;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--lb-text);
}

/* 图书网格 */
.book-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* 电子书网格 */
.ebook-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.ebook-item {
  display: flex;
  gap: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s;
}

.ebook-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(139, 94, 60, 0.12);
}

.ebook-cover {
  width: 86px;
  height: 116px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  background: #f0ebe5;
}

.ebook-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.ebook-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--lb-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ebook-author {
  font-size: 13px;
  color: var(--lb-text-light);
  margin-top: 4px;
}

.ebook-price {
  font-size: 18px;
  font-weight: 800;
  color: var(--lb-danger);
}

.home-footer {
  text-align: center;
  padding: 40px 0 20px;
  font-size: 14px;
  color: var(--lb-text-light);
  letter-spacing: 2px;
}

/* ========== 移动端样式 ========== */
.mobile-banner-wrap {
  display: none;
}

@media (max-width: 768px) {
  .desktop-banner-wrap {
    display: none;
  }

  .mobile-banner-wrap {
    display: block;
    padding: 14px 16px;
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

  .banner-text {
    color: #fff;
  }

  .banner-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .banner-desc {
    font-size: 13px;
    opacity: 0.9;
  }

  .banner-icon {
    font-size: 48px;
    opacity: 0.3;
  }

  .home-content {
    padding: 0 16px 70px;
    max-width: 768px;
  }

  .section {
    margin-bottom: 24px;
  }

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

  .title-icon {
    font-size: 18px;
  }

  .section-more {
    font-size: 13px;
    color: var(--lb-text-light);
    cursor: pointer;
  }

  /* 分类 */
  .category-section {
    background: var(--lb-bg-card);
    margin: 0 0 24px;
    border-radius: var(--lb-radius-lg);
    padding: 16px 12px;
    box-shadow: var(--lb-shadow-sm);
  }

  .category-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 14px 0;
  }

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 0;
    border-radius: 0;
    transition: transform 0.2s;
  }

  .category-item:hover {
    background: none;
    transform: none;
  }

  .category-item:active {
    transform: scale(0.9);
  }

  .category-icon {
    width: 44px;
    height: 44px;
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

  /* 图书网格 */
  .book-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  /* 电子书网格 */
  .ebook-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ebook-item {
    display: flex;
    gap: 12px;
    background: var(--lb-bg-card);
    border-radius: var(--lb-radius-md);
    padding: 14px;
    box-shadow: var(--lb-shadow-sm);
    transition: all 0.2s;
  }

  .ebook-item:hover {
    transform: none;
    box-shadow: var(--lb-shadow-md);
  }

  .ebook-item:active {
    transform: scale(0.98);
  }

  .ebook-cover {
    width: 70px;
    height: 94px;
    object-fit: cover;
    border-radius: var(--lb-radius-sm);
    flex-shrink: 0;
    background: #f0ebe5;
  }

  .ebook-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .ebook-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--lb-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ebook-author {
    font-size: 12px;
    color: var(--lb-text-light);
    margin-top: 4px;
  }

  .ebook-price {
    font-size: 16px;
    font-weight: 700;
    color: var(--lb-danger);
    margin-top: 8px;
  }

  .home-footer {
    text-align: center;
    padding: 20px 0 10px;
    font-size: 12px;
    color: var(--lb-text-light);
    letter-spacing: 2px;
  }
}

@media (max-width: 374px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 500px) and (max-width: 768px) {
  .category-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .book-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
