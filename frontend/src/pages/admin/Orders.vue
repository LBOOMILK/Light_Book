<template>
  <div class="admin-orders">
    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">订单管理</span>
        </div>
      </template>

      <div class="filter-bar">
        <el-select v-model="statusFilter" placeholder="订单状态" clearable style="width: 140px">
          <el-option label="待付款" value="pending" />
          <el-option label="待发货" value="paid" />
          <el-option label="待收货" value="shipped" />
          <el-option label="已完成" value="completed" />
          <el-option label="已取消" value="canceled" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索订单号" prefix-icon="Search" clearable style="width: 240px" />
      </div>

      <el-table :data="orders" stripe style="width: 100%">
        <el-table-column prop="order_no" label="订单号" width="180" />
        <el-table-column prop="user" label="用户" width="100" />
        <el-table-column prop="items" label="商品" min-width="200" show-overflow-tooltip />
        <el-table-column prop="amount" label="金额" width="100">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600;">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="下单时间" width="170" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'paid'" type="primary" text size="small" @click="handleShip(row)">发货</el-button>
            <el-button type="info" text size="small">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination v-model:current-page="page" :page-size="10" :total="30" layout="total, prev, pager, next" background />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const keyword = ref('')
const statusFilter = ref('')
const page = ref(1)

const orders = ref([
  { order_no: 'LB20260523001', user: '小明', items: '百年孤独 x1, 活着 x1', amount: '73.00', status: 'pending', time: '2026-05-23 10:30' },
  { order_no: 'LB20260523002', user: '小红', items: 'JS高级程序设计 x1, Vue.js设计与实现 x1', amount: '168.00', status: 'paid', time: '2026-05-23 09:15' },
  { order_no: 'LB20260522003', user: '老王', items: '三体 x1', amount: '36.00', status: 'shipped', time: '2026-05-22 16:42' },
  { order_no: 'LB20260522004', user: '张三', items: '深入理解计算机系统 x1, 设计心理学 x1', amount: '161.00', status: 'completed', time: '2026-05-22 14:20' },
  { order_no: 'LB20260521005', user: '李四', items: '小王子 x2', amount: '44.00', status: 'completed', time: '2026-05-21 11:08' }
])

const statusType = (s) => ({ pending: 'warning', paid: 'primary', shipped: 'info', completed: 'success', canceled: 'danger' }[s] || 'info')
const statusText = (s) => ({ pending: '待付款', paid: '待发货', shipped: '待收货', completed: '已完成', canceled: '已取消' }[s] || s)

const handleShip = (row) => {
  row.status = 'shipped'
  ElMessage.success(`订单 ${row.order_no} 已发货`)
}
</script>

<style scoped>
.admin-orders { max-width: 1400px; }
.main-card { border-radius: 12px; border: none; }
.card-header { display: flex; align-items: center; justify-content: space-between; }
.card-title { font-weight: 600; color: #1a1a2e; font-size: 16px; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
