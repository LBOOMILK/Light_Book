<template>
  <div class="admin-reviews">
    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">书评管理</span>
        </div>
      </template>

      <el-table :data="reviews" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="user" label="用户" width="100" />
        <el-table-column prop="book" label="图书" width="150" show-overflow-tooltip />
        <el-table-column prop="content" label="内容" min-width="250" show-overflow-tooltip />
        <el-table-column label="评分" width="100">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞" width="70" />
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" text size="small" @click="handleDelete(row)">删除</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'

const page = ref(1)

const reviews = ref([
  { id: 1, user: '书虫小王', book: '百年孤独', content: '马尔克斯笔下的马孔多小镇，像一场漫长的梦。读完久久不能平静。', rating: 5, likes: 42, time: '2026-05-20 10:30' },
  { id: 2, user: '深夜读者', book: '百年孤独', content: '第二遍读了，每次都有新的感受。魔幻现实主义的魅力就在于，你知道它是假的，但你愿意相信。', rating: 5, likes: 28, time: '2026-05-18 23:15' },
  { id: 3, user: '慢热型', book: '百年孤独', content: '前50页有点难啃，人物名字太多容易混。但坚持过去之后就停不下来了。', rating: 4, likes: 15, time: '2026-05-15 14:22' },
  { id: 4, user: '码农小李', book: 'JS高级程序设计', content: '前端必读经典，虽然厚但每一章都值得精读。', rating: 5, likes: 35, time: '2026-05-14 09:08' }
])

const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除这条书评吗？', '提示', { type: 'warning' }).then(() => {
    reviews.value = reviews.value.filter(r => r.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.admin-reviews { max-width: 1400px; }
.main-card { border-radius: 12px; border: none; }
.card-header { display: flex; align-items: center; justify-content: space-between; }
.card-title { font-weight: 600; color: #1a1a2e; font-size: 16px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
