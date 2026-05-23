<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6" v-for="stat in stats" :key="stat.label">
        <el-card shadow="hover" class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-icon" :style="{ background: stat.bg }">
            <el-icon :size="24"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <span class="card-title">销售趋势</span>
          </template>
          <div class="chart-placeholder">
            <div class="chart-bars">
              <div v-for="(bar, i) in chartData" :key="i" class="bar-item">
                <div class="bar" :style="{ height: bar.height + '%' }"></div>
                <span class="bar-label">{{ bar.label }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <span class="card-title">热门分类</span>
          </template>
          <div class="category-stats">
            <div v-for="cat in categoryStats" :key="cat.name" class="cat-item">
              <div class="cat-info">
                <span class="cat-name">{{ cat.name }}</span>
                <span class="cat-count">{{ cat.count }} 本</span>
              </div>
              <el-progress
                :percentage="cat.percent"
                :stroke-width="8"
                color="#8B5E3C"
                :show-text="false"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近订单 -->
    <el-card shadow="hover" class="recent-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">最近订单</span>
          <el-button type="primary" text size="small" @click="$router.push('/admin/orders')">查看全部</el-button>
        </div>
      </template>
      <el-table :data="recentOrders" stripe style="width: 100%">
        <el-table-column prop="order_no" label="订单号" width="180" />
        <el-table-column prop="user" label="用户" width="120" />
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
        <el-table-column prop="time" label="时间" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ShoppingCart, User, Money, Document,
} from '@element-plus/icons-vue'

const stats = ref([
  { label: '今日订单', value: '128', icon: ShoppingCart, bg: 'linear-gradient(135deg, #8B5E3C, #D4A574)' },
  { label: '活跃用户', value: '1,024', icon: User, bg: 'linear-gradient(135deg, #409EFF, #79BBFF)' },
  { label: '今日收入', value: '¥8,560', icon: Money, bg: 'linear-gradient(135deg, #67C23A, #95D475)' },
  { label: '在售图书', value: '2,486', icon: Document, bg: 'linear-gradient(135deg, #E6A23C, #EEBE77)' }
])

const chartData = ref([
  { label: '一', height: 40 },
  { label: '二', height: 65 },
  { label: '三', height: 50 },
  { label: '四', height: 80 },
  { label: '五', height: 70 },
  { label: '六', height: 95 },
  { label: '日', height: 85 }
])

const categoryStats = ref([
  { name: '文学小说', count: 456, percent: 85 },
  { name: '科技编程', count: 312, percent: 68 },
  { name: '社科历史', count: 289, percent: 58 },
  { name: '艺术设计', count: 178, percent: 42 },
  { name: '商业管理', count: 145, percent: 35 }
])

const recentOrders = ref([
  { order_no: 'LB20260523001', user: '小明', amount: '89.00', status: 'pending', time: '2026-05-23 10:30' },
  { order_no: 'LB20260523002', user: '小红', amount: '156.00', status: 'paid', time: '2026-05-23 09:15' },
  { order_no: 'LB20260522003', user: '老王', amount: '45.00', status: 'shipped', time: '2026-05-22 16:42' },
  { order_no: 'LB20260522004', user: '张三', amount: '238.00', status: 'completed', time: '2026-05-22 14:20' },
  { order_no: 'LB20260521005', user: '李四', amount: '72.00', status: 'completed', time: '2026-05-21 11:08' }
])

const statusType = (s) => ({ pending: 'warning', paid: 'primary', shipped: 'info', completed: 'success', canceled: 'danger' }[s] || 'info')
const statusText = (s) => ({ pending: '待付款', paid: '待发货', shipped: '待收货', completed: '已完成', canceled: '已取消' }[s] || s)
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  border: none;
}

.stat-card .el-card__body {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 2px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 12px;
  border: none;
}

.card-title {
  font-weight: 600;
  color: #1a1a2e;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-placeholder {
  height: 220px;
  display: flex;
  align-items: flex-end;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  width: 100%;
  height: 100%;
  padding: 0 20px 30px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 100%;
  max-width: 48px;
  background: linear-gradient(180deg, #8B5E3C 0%, #D4A574 100%);
  border-radius: 6px 6px 0 0;
  transition: height 0.6s ease;
  min-height: 4px;
}

.bar-label {
  font-size: 12px;
  color: #999;
}

.category-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.cat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cat-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.cat-name {
  color: #333;
  font-weight: 500;
}

.cat-count {
  color: #999;
}

.recent-card {
  border-radius: 12px;
  border: none;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th.el-table__cell) {
  background: #fafafa;
  color: #666;
  font-weight: 600;
}
</style>
