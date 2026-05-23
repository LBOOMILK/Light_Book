<template>
  <div class="cart-page">
    <div v-if="cartStore.items.length === 0" class="empty-state">
      <div class="empty-icon">🛒</div>
      <div class="empty-text">购物车空空如也</div>
      <div class="empty-hint">去发现好书吧</div>
      <van-button type="primary" class="empty-btn" @click="goCategory">去逛逛</van-button>
    </div>

    <div v-else class="cart-list">
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <van-checkbox v-model="item.checked" checked-color="var(--lb-primary)" class="item-check" />
        <img :src="item.cover" class="item-cover" @click="goDetail(item.id)" />
        <div class="item-info">
          <div class="item-title" @click="goDetail(item.id)">{{ item.title }}</div>
          <div class="item-author">{{ item.author }}</div>
          <div class="item-bottom">
            <span class="item-price">¥{{ item.price }}</span>
            <van-stepper v-model="item.quantity" button-size="26" theme="round" min="1"
              @change="updateQty(item.id, item.quantity)" class="item-stepper" />
          </div>
        </div>
        <van-icon name="delete-o" size="18" color="#ccc" class="item-delete" @click="removeItem(item.id)" />
      </div>
    </div>

    <div class="settle-bar" v-if="cartStore.items.length > 0">
      <div class="settle-left">
        <van-checkbox v-model="allChecked" checked-color="var(--lb-primary)" @change="handleCheckAll">全选</van-checkbox>
      </div>
      <div class="settle-right">
        <div class="settle-total">
          <span class="total-label">合计</span>
          <span class="total-price">¥{{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <van-button type="primary" class="settle-btn" @click="goCheckout">
          结算{{ cartStore.totalCount > 0 ? `(${cartStore.totalCount})` : '' }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../../stores/cart'

const router = useRouter()
const cartStore = useCartStore()
const allChecked = ref(true)

watch(() => cartStore.items, () => { cartStore.loadCart() }, { immediate: true })

const updateQty = (id, qty) => cartStore.updateQuantity(id, qty)
const removeItem = (id) => cartStore.removeItem(id)
const handleCheckAll = () => { cartStore.items.forEach(item => { item.checked = allChecked.value }) }
const goCategory = () => router.push({ name: 'category' })
const goDetail = (id) => router.push({ name: 'book', params: { id } })
const goCheckout = () => router.push({ name: 'orders' })
</script>

<style scoped>
.cart-page { min-height: 100vh; background: var(--lb-bg); padding-bottom: 80px; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 80px 40px 40px; }
.empty-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.6; }
.empty-text { font-size: 18px; font-weight: 600; color: var(--lb-text); }
.empty-hint { font-size: 13px; color: var(--lb-text-light); margin-top: 6px; }
.empty-btn { margin-top: 24px; border-radius: var(--lb-radius-xl) !important; padding: 0 40px; height: 42px; }

.cart-list { padding: 12px 16px; }

.cart-item {
  display: flex; align-items: center; gap: 12px;
  background: var(--lb-bg-card); border-radius: var(--lb-radius-md);
  padding: 14px; margin-bottom: 10px; box-shadow: var(--lb-shadow-sm);
}

.item-check { flex-shrink: 0; }

.item-cover {
  width: 70px; height: 94px; object-fit: cover;
  border-radius: var(--lb-radius-sm); flex-shrink: 0; background: #f0ebe5;
}

.item-info { flex: 1; min-width: 0; }

.item-title {
  font-size: 14px; font-weight: 600; color: var(--lb-text);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; line-height: 1.4;
}

.item-author { font-size: 12px; color: var(--lb-text-light); margin-top: 4px; }
.item-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
.item-price { font-size: 16px; font-weight: 700; color: var(--lb-danger); }

.item-stepper :deep(.van-stepper__minus),
.item-stepper :deep(.van-stepper__plus) {
  background: var(--lb-bg) !important; border-color: var(--lb-border) !important;
}

.item-delete { flex-shrink: 0; padding: 8px; cursor: pointer; }

.settle-bar {
  position: fixed; bottom: 70px; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between;
  background: var(--lb-bg-card); padding: 10px 16px;
  border-top: 1px solid var(--lb-border);
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06); z-index: 10;
  max-width: 768px; margin: 0 auto;
}

.settle-left { display: flex; align-items: center; }
.settle-right { display: flex; align-items: center; gap: 12px; }
.settle-total { text-align: right; }
.total-label { font-size: 13px; color: var(--lb-text-secondary); }
.total-price { font-size: 18px; font-weight: 800; color: var(--lb-danger); margin-left: 4px; }
.settle-btn { border-radius: var(--lb-radius-xl) !important; padding: 0 24px; height: 40px; font-weight: 600; }

@media (max-width: 374px) {
  .cart-item { padding: 10px; gap: 8px; }
  .item-cover { width: 60px; height: 80px; }
  .item-title { font-size: 13px; }
  .item-price { font-size: 14px; }
  .settle-bar { padding: 8px 12px; }
  .total-price { font-size: 16px; }
}
</style>
