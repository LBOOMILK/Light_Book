<template>
  <div class="admin-books">
    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">图书管理</span>
          <el-button type="primary" @click="showDialog = true">
            <el-icon><Plus /></el-icon>添加图书
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="filter-bar">
        <el-input v-model="keyword" placeholder="搜索书名、作者、ISBN" prefix-icon="Search" clearable style="width: 280px" />
        <el-select v-model="filterType" placeholder="图书类型" clearable style="width: 140px">
          <el-option label="纸质书" value="paper" />
          <el-option label="电子书" value="ebook" />
        </el-select>
      </div>

      <!-- 表格 -->
      <el-table :data="books" stripe style="width: 100%" class="book-table">
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <div class="book-cover-cell">
              <img v-if="row.cover" :src="row.cover" class="cover-thumb" />
              <div v-else class="cover-placeholder">📖</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="书名" min-width="180" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="price" label="价格" width="90">
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 600;">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'ebook' ? 'primary' : 'success'" size="small">
              {{ row.type === 'ebook' ? '电子书' : '纸质书' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" text size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          :page-size="10"
          :total="50"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </el-card>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="showDialog" :title="editForm.id ? '编辑图书' : '添加图书'" width="600px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="书名">
          <el-input v-model="editForm.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="editForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="价格">
              <el-input-number v-model="editForm.price" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存">
              <el-input-number v-model="editForm.stock" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="类型">
          <el-radio-group v-model="editForm.type">
            <el-radio value="paper">纸质书</el-radio>
            <el-radio value="ebook">电子书</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="editForm.isbn" placeholder="请输入ISBN" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="editForm.description" type="textarea" :rows="3" placeholder="图书简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const keyword = ref('')
const filterType = ref('')
const page = ref(1)
const showDialog = ref(false)

const editForm = reactive({
  id: null,
  title: '',
  author: '',
  price: 0,
  stock: 0,
  type: 'paper',
  isbn: '',
  description: ''
})

const books = ref([
  { id: 1, title: '百年孤独', author: '马尔克斯', price: 45.00, stock: 128, type: 'paper', isbn: '978-7-5442-6018-8', cover: '' },
  { id: 2, title: '三体', author: '刘慈欣', price: 36.00, stock: 256, type: 'paper', isbn: '978-7-5366-9293-0', cover: '' },
  { id: 3, title: 'JS高级程序设计', author: 'Matt Frisbie', price: 89.00, stock: 89, type: 'paper', isbn: '978-7-115-54532-4', cover: '' },
  { id: 4, title: '小王子', author: '圣-埃克苏佩里', price: 22.00, stock: 500, type: 'paper', isbn: '978-7-0201-0382-5', cover: '' },
  { id: 5, title: '活着', author: '余华', price: 28.00, stock: 320, type: 'paper', isbn: '978-7-5063-6052-8', cover: '' },
  { id: 6, title: '人类简史', author: '赫拉利', price: 48.00, stock: 180, type: 'ebook', isbn: '978-7-5086-4735-7', cover: '' }
])

const handleEdit = (row) => {
  Object.assign(editForm, row)
  showDialog.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除《${row.title}》吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    books.value = books.value.filter(b => b.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSave = () => {
  if (!editForm.title) { ElMessage.warning('请输入书名'); return }
  if (editForm.id) {
    const idx = books.value.findIndex(b => b.id === editForm.id)
    if (idx > -1) Object.assign(books.value[idx], editForm)
  } else {
    books.value.push({ ...editForm, id: Date.now() })
  }
  showDialog.value = false
  Object.assign(editForm, { id: null, title: '', author: '', price: 0, stock: 0, type: 'paper', isbn: '', description: '' })
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.admin-books { max-width: 1400px; }

.main-card {
  border-radius: 12px;
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 16px;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.book-table {
  border-radius: 8px;
  overflow: hidden;
}

.book-cover-cell {
  width: 48px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  background: #f0ebe5;
}

.cover-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
