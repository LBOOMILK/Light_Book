<template>
  <div class="order-list">
    <div v-if="orders.length === 0" class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无订单</div>
    </div>

    <div v-for="order in orders" :key="order.id" class="order-card">
      <div class="order-header">
        <span class="order-no">{{ order.order_no }}</span>
        <span class="order-status" :class="'status-' + order.status">{{ getStatusText(order.status) }}</span>
      </div>

      <div v-for="item in order.items" :key="item.id" class="order-item">
        <img :src="item.cover" class="item-cover" />
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-meta">x{{ item.quantity }}</div>
        </div>
        <div class="item-price">¥{{ item.price }}</div>
      </div>

      <div class="order-footer">
        <div class="order-total">
          共 {{ getTotalQty(order) }} 件，合计 <span class="total-amount">¥{{ order.total_amount }}</span>
        </div>
        <div class="order-actions">
          <van-button v-if="order.status === 'pending'" type="primary" size="small" class="action-btn" @click="handlePay(order.id)">去付款</van-button>
          <van-button v-if="order.status === 'pending'" plain size="small" class="action-btn" @click="handleCancel(order.id)">取消</van-button>
          <van-button v-if="order.status === 'shipped'" type="primary" size="small" class="action-btn" @click="handleConfirm(order.id)">确认收货</van-button>
          <van-button v-if="order.status === 'completed'" plain size="small" class="action-btn" @click="handleReview(order.id)">去评价</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { showToast } from 'vant'
import { getOrders } from '../../api'
import { fillCovers } from '../../mock'

const props = defineProps({ status: { type: String, default: '' } })
const orders = ref([])

onMounted(async () => { await loadOrders() })
watch(() => props.status, async () => { await loadOrders() })

const loadOrders = async () => {
  try {
    const data = await getOrders({ status: props.status })
    orders.value = Array.isArray(data) ? fillCovers(data) : []
  } catch (e) { console.error('Load orders failed:', e) }
}

const getStatusText = (status) => ({ pending: '待付款', paid: '待发货', shipped: '待收货', completed: '已完成', canceled: '已取消' }[status] || status)
const getTotalQty = (order) => order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
const handlePay = (id) => showToast({ message: '支付功能开发中', type: 'info' })
const handleCancel = (id) => showToast({ message: '订单已取消', type: 'success' })
const handleConfirm = (id) => showToast({ message: '已确认收货', type: 'success' })
const handleReview = (id) => showToast({ message: '评价功能开发中', type: 'info' })
</script>

<style scoped>
.order-list { padding: 12px 16px; max-width: 768px; margin: 0 auto; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
.empty-text { font-size: 14px; color: var(--lb-text-light); }

.order-card { background: var(--lb-bg-card); border-radius: var(--lb-radius-lg); margin-bottom: 12px; overflow: hidden; box-shadow: var(--lb-shadow-sm); }

.order-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid var(--lb-border); }
.order-no { font-size: 12px; color: var(--lb-text-light); }
.order-status { font-size: 13px; font-weight: 600; }
.status-pending { color: var(--lb-warning); }
.status-paid { color: var(--lb-info); }
.status-shipped { color: var(--lb-primary); }
.status-completed { color: var(--lb-success); }

.order-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--lb-border); }
.order-item:last-of-type { border-bottom: none; }

.item-cover { width: 60px; height: 80px; object-fit: cover; border-radius: var(--lb-radius-sm); flex-shrink: 0; background: #f0ebe5; }
.item-info { flex: 1; min-width: 0; }
.item-title { font-size: 14px; font-weight: 500; color: var(--lb-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.item-meta { font-size: 12px; color: var(--lb-text-light); margin-top: 4px; }
.item-price { font-size: 14px; font-weight: 600; color: var(--lb-text); flex-shrink: 0; }

.order-footer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--lb-bg); }
.order-total { font-size: 13px; color: var(--lb-text-secondary); }
.total-amount { font-size: 16px; font-weight: 700; color: var(--lb-danger); }
.order-actions { display: flex; gap: 8px; }
.action-btn { border-radius: var(--lb-radius-xl) !important; padding: 0 16px !important; height: 32px !important; font-size: 12px !important; }

@media (max-width: 374px) {
  .order-item { padding: 10px 12px; gap: 8px; }
  .item-cover { width: 50px; height: 66px; }
  .item-title { font-size: 13px; }
  .order-footer { flex-direction: column; gap: 10px; align-items: flex-start; }
}
</style>
