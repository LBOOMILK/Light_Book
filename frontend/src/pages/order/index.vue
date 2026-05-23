<template>
  <div class="orders-page">
    <van-tabs v-model="activeTab" sticky class="lb-tabs">
      <van-tab title="全部" name="all">
        <order-list :status="''" />
      </van-tab>
      <van-tab title="待付款" name="pending">
        <order-list status="pending" />
      </van-tab>
      <van-tab title="待发货" name="paid">
        <order-list status="paid" />
      </van-tab>
      <van-tab title="待收货" name="shipped">
        <order-list status="shipped" />
      </van-tab>
      <van-tab title="已完成" name="completed">
        <order-list status="completed" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrderList from '../../components/business/OrderList.vue'

const activeTab = ref('all')
</script>

<style scoped>
.orders-page { min-height: 100vh; background: var(--lb-bg); }

.lb-tabs :deep(.van-tabs__wrap) { background: var(--lb-bg-card); border-bottom: 1px solid var(--lb-border); }
.lb-tabs :deep(.van-tab) { font-size: 14px; color: var(--lb-text-secondary); }
.lb-tabs :deep(.van-tab--active) { font-weight: 600; color: var(--lb-text); }
</style>
