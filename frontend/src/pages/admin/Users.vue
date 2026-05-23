<template>
  <div class="admin-users">
    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">用户管理</span>
        </div>
      </template>

      <el-input v-model="keyword" placeholder="搜索用户名、手机号" prefix-icon="Search" clearable style="width: 280px; margin-bottom: 16px" />

      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="用户" min-width="160">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-avatar :size="32" :src="row.avatar || ''" />
              <span>{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="points" label="积分" width="80" />
        <el-table-column prop="orders" label="订单数" width="80" />
        <el-table-column prop="created_at" label="注册时间" width="170" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination v-model:current-page="page" :page-size="10" :total="20" layout="total, prev, pager, next" background />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const page = ref(1)

const users = ref([
  { id: 1, username: '小明', phone: '138****1234', points: 260, orders: 12, avatar: '', created_at: '2026-01-15 10:30' },
  { id: 2, username: '小红', phone: '139****5678', points: 180, orders: 8, avatar: '', created_at: '2026-02-20 14:22' },
  { id: 3, username: '老王', phone: '136****9012', points: 520, orders: 25, avatar: '', created_at: '2025-11-08 09:15' },
  { id: 4, username: '张三', phone: '137****3456', points: 95, orders: 5, avatar: '', created_at: '2026-04-01 16:40' },
  { id: 5, username: '李四', phone: '135****7890', points: 340, orders: 18, avatar: '', created_at: '2026-03-12 11:08' }
])
</script>

<style scoped>
.admin-users { max-width: 1400px; }
.main-card { border-radius: 12px; border: none; }
.card-header { display: flex; align-items: center; justify-content: space-between; }
.card-title { font-weight: 600; color: #1a1a2e; font-size: 16px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
