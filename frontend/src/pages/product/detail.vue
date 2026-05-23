<template>
  <div class="book-detail" v-if="book">
    <!-- 封面大图 -->
    <div class="cover-section">
      <div class="cover-bg" :style="{ backgroundImage: `url(${book.cover})` }"></div>
      <img :src="book.cover" :alt="book.title" class="cover-main" />
    </div>

    <!-- 价格卡片 -->
    <div class="price-card">
      <div class="price-row">
        <span class="price-current">¥{{ book.price }}</span>
        <span v-if="book.original_price" class="price-original">¥{{ book.original_price }}</span>
        <van-tag v-if="book.type === 'ebook'" class="type-tag" color="var(--lb-primary-light)" text-color="var(--lb-primary-dark)">电子书</van-tag>
      </div>
      <div class="book-title-line">{{ book.title }}</div>
      <div class="book-meta">
        <span>{{ book.author }}</span>
        <span class="meta-dot">·</span>
        <span>{{ book.publisher }}</span>
      </div>
    </div>

    <!-- 商品信息 -->
    <div class="info-card">
      <div class="info-title">商品详情</div>
      <div class="info-row" v-if="book.isbn">
        <span class="info-label">ISBN</span>
        <span class="info-value">{{ book.isbn }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">库存</span>
        <span class="info-value" :class="stockClass">{{ stockStatus }}</span>
      </div>
    </div>

    <!-- 简介 -->
    <div class="desc-card" v-if="book.description">
      <div class="desc-title">内容简介</div>
      <div class="desc-content">{{ book.description }}</div>
    </div>

    <!-- 书评入口 -->
    <div class="review-card" @click="goReviews">
      <span>查看书评</span>
      <van-icon name="arrow" color="#999" />
    </div>

    <!-- 底部操作栏 -->
    <div class="action-bar">
      <div class="action-icon" @click="handleFavorite">
        <van-icon name="heart-o" size="22" />
        <span>收藏</span>
      </div>
      <div class="action-icon" @click="goCart">
        <van-icon name="cart-o" size="22" />
        <span>购物车</span>
        <div v-if="cartStore.totalCount > 0" class="badge">{{ cartStore.totalCount }}</div>
      </div>
      <van-button class="btn-cart" @click="addToCart">加入购物车</van-button>
      <van-button class="btn-buy" type="primary" @click="buyNow">立即购买</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getBookDetail } from '../../api'
import { useCartStore } from '../../stores/cart'
import { fillCovers } from '../../mock'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const cartStore = useCartStore()
const book = ref(null)

onMounted(async () => {
  try {
    const data = await getBookDetail(props.id)
    book.value = data
    if (book.value && !book.value.cover) {
      book.value.cover = fillCovers([book.value])[0].cover
    }
  } catch (e) {
    console.error('Load book detail failed:', e)
  }
})

const stockStatus = computed(() => {
  if (!book.value) return ''
  if (book.value.type === 'ebook') return '无限'
  if (book.value.stock > 10) return '库存充足'
  if (book.value.stock > 0) return '即将售罄'
  return '暂时缺货'
})

const stockClass = computed(() => {
  if (!book.value) return ''
  if (book.value.type === 'ebook' || book.value.stock > 10) return 'stock-ok'
  if (book.value.stock > 0) return 'stock-low'
  return 'stock-out'
})

const handleFavorite = () => showToast({ message: '已收藏', type: 'success' })
const goCart = () => router.push({ name: 'cart' })
const goReviews = () => router.push({ name: 'reviews', params: { bookId: props.id } })

const addToCart = () => {
  cartStore.addItem(book.value)
  showToast({ message: '已加入购物车', type: 'success' })
}

const buyNow = () => {
  cartStore.addItem(book.value)
  router.push({ name: 'cart' })
}
</script>

<style scoped>
.book-detail { padding-bottom: 70px; background: var(--lb-bg); }

.cover-section {
  position: relative; height: 300px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}

.cover-bg {
  position: absolute; inset: -20px;
  background-size: cover; background-position: center;
  filter: blur(30px) brightness(0.6); transform: scale(1.2);
}

.cover-main {
  position: relative; width: 160px; height: 220px;
  object-fit: cover; border-radius: var(--lb-radius-md); box-shadow: var(--lb-shadow-lg);
}

.price-card {
  background: var(--lb-bg-card); margin: -20px 16px 0; position: relative;
  border-radius: var(--lb-radius-lg); padding: 20px; box-shadow: var(--lb-shadow-md);
}

.price-row { display: flex; align-items: baseline; gap: 10px; }
.price-current { font-size: 28px; font-weight: 800; color: var(--lb-danger); }
.price-original { font-size: 14px; color: var(--lb-text-light); text-decoration: line-through; }
.type-tag { margin-left: auto; }

.book-title-line {
  font-size: 18px; font-weight: 700; color: var(--lb-text);
  margin-top: 10px; line-height: 1.4;
}

.book-meta {
  margin-top: 6px; font-size: 13px; color: var(--lb-text-secondary);
  display: flex; align-items: center; gap: 4px;
}

.meta-dot { color: var(--lb-text-light); }

.info-card, .desc-card, .review-card {
  background: var(--lb-bg-card); margin: 12px 16px 0;
  border-radius: var(--lb-radius-lg); padding: 16px 20px; box-shadow: var(--lb-shadow-sm);
}

.info-title, .desc-title {
  font-size: 15px; font-weight: 600; color: var(--lb-text);
  margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid var(--lb-border);
}

.info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
.info-label { color: var(--lb-text-light); }
.info-value { color: var(--lb-text); }
.stock-ok { color: var(--lb-success); }
.stock-low { color: var(--lb-warning); }
.stock-out { color: var(--lb-danger); }

.desc-content { font-size: 14px; line-height: 1.8; color: var(--lb-text-secondary); }

.review-card {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 15px; font-weight: 600; color: var(--lb-text); cursor: pointer;
}
.review-card:active { opacity: 0.7; }

/* 自定义底部操作栏 */
.action-bar {
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; align-items: center; gap: 4px;
  background: var(--lb-bg-card); padding: 8px 12px;
  border-top: 1px solid var(--lb-border);
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06); z-index: 100;
  max-width: 768px; margin: 0 auto;
}

.action-icon {
  position: relative;
  display: flex; flex-direction: column; align-items: center;
  gap: 2px; padding: 4px 10px; font-size: 11px;
  color: var(--lb-text-secondary); cursor: pointer;
}

.action-icon:active { color: var(--lb-primary); }

.badge {
  position: absolute; top: 0; right: 2px;
  background: var(--lb-danger); color: #fff;
  font-size: 10px; min-width: 16px; height: 16px;
  border-radius: 8px; text-align: center; line-height: 16px;
  padding: 0 4px;
}

.btn-cart {
  flex: 1; height: 40px; border-radius: 20px !important;
  background: var(--lb-primary-light) !important; border: none !important;
  color: var(--lb-primary-dark) !important; font-weight: 600; font-size: 14px;
}

.btn-buy {
  flex: 1; height: 40px; border-radius: 20px !important;
  font-weight: 600; font-size: 14px;
}

@media (max-width: 374px) {
  .cover-section { height: 240px; }
  .cover-main { width: 130px; height: 180px; }
  .price-current { font-size: 24px; }
  .action-bar { gap: 2px; padding: 6px 8px; }
  .action-icon { padding: 4px 6px; }
}
</style>
