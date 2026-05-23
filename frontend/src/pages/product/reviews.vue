<template>
  <div class="reviews-page">
    <div class="review-form-card">
      <div class="form-title">写书评</div>
      <van-field v-model="reviewForm.content" type="textarea" placeholder="分享你的阅读感受..." rows="3" class="review-textarea" />
      <div class="form-bottom">
        <div class="rate-wrap">
          <span class="rate-label">评分</span>
          <van-rate v-model="reviewForm.rating" color="var(--lb-accent)" />
        </div>
        <van-button type="primary" size="small" class="publish-btn" @click="handleSubmit">发布</van-button>
      </div>
    </div>

    <div class="review-list">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <img :src="review.user?.avatar || defaultAvatar" class="review-avatar" />
          <div class="review-user-info">
            <div class="review-user">{{ review.user?.username || '匿名用户' }}</div>
            <van-rate :model-value="review.rating" disabled size="12" color="var(--lb-accent)" />
          </div>
          <div class="review-time">{{ review.created_at }}</div>
        </div>
        <div class="review-content">{{ review.content }}</div>
        <div class="review-footer">
          <div class="like-btn" @click="handleLike(review.id)">
            <van-icon name="good-job-o" size="16" />
            <span>{{ review.likes || 0 }}</span>
          </div>
        </div>
      </div>

      <div v-if="reviews.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <div class="empty-text">暂无书评，快来写第一条吧</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { getReviews, createReview, likeReview } from '../../api'

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0Q0QTU3NCIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMTYiIHI9IjYiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNID6  MzFjMC02IDUtMTIgMTItMTJzMTIgNSAxMiAxMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg=='

const props = defineProps({ bookId: { type: String, default: '0' } })
const reviews = ref([])
const reviewForm = reactive({ content: '', rating: 5 })

onMounted(async () => {
  try { reviews.value = await getReviews({ book_id: props.bookId }) } catch (e) { console.error(e) }
})

const handleSubmit = async () => {
  if (!reviewForm.content.trim()) { showToast({ message: '请输入书评内容', type: 'error' }); return }
  try {
    await createReview({ book_id: props.bookId, content: reviewForm.content, rating: reviewForm.rating })
    showToast({ message: '发布成功', type: 'success' })
    reviewForm.content = ''; reviewForm.rating = 5
    reviews.value = await getReviews({ book_id: props.bookId })
  } catch (e) { showToast({ message: '发布失败', type: 'error' }) }
}

const handleLike = async (reviewId) => {
  try {
    await likeReview(reviewId)
    const review = reviews.value.find(r => r.id === reviewId)
    if (review) review.likes = (review.likes || 0) + 1
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.reviews-page { min-height: 100vh; background: var(--lb-bg); padding: 12px 16px 70px; max-width: 768px; margin: 0 auto; }

.review-form-card { background: var(--lb-bg-card); border-radius: var(--lb-radius-lg); padding: 16px; margin-bottom: 16px; box-shadow: var(--lb-shadow-sm); }
.form-title { font-size: 15px; font-weight: 600; color: var(--lb-text); margin-bottom: 12px; }
.review-textarea { background: var(--lb-bg); border-radius: var(--lb-radius-md); padding: 8px; }
.form-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
.rate-wrap { display: flex; align-items: center; gap: 8px; }
.rate-label { font-size: 13px; color: var(--lb-text-secondary); }
.publish-btn { border-radius: var(--lb-radius-xl) !important; padding: 0 20px; height: 34px; }

.review-list { display: flex; flex-direction: column; gap: 10px; }

.review-card { background: var(--lb-bg-card); border-radius: var(--lb-radius-lg); padding: 16px; box-shadow: var(--lb-shadow-sm); }
.review-header { display: flex; align-items: center; gap: 10px; }
.review-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; background: #f0ebe5; }
.review-user-info { flex: 1; }
.review-user { font-size: 14px; font-weight: 600; color: var(--lb-text); }
.review-time { font-size: 11px; color: var(--lb-text-light); }
.review-content { margin-top: 12px; font-size: 14px; line-height: 1.7; color: var(--lb-text-secondary); }
.review-footer { margin-top: 12px; display: flex; justify-content: flex-end; }
.like-btn {
  display: flex; align-items: center; gap: 4px; font-size: 13px;
  color: var(--lb-text-light); cursor: pointer; padding: 4px 8px;
  border-radius: var(--lb-radius-sm); transition: all 0.2s;
}
.like-btn:active { background: var(--lb-bg); color: var(--lb-primary); }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px 20px; }
.empty-icon { font-size: 40px; margin-bottom: 10px; opacity: 0.5; }
.empty-text { font-size: 13px; color: var(--lb-text-light); }
</style>
