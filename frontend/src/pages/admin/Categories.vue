<template>
  <div class="admin-categories">
    <el-card shadow="hover" class="main-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">分类管理</span>
          <el-button type="primary" @click="showDialog = true">
            <el-icon><Plus /></el-icon>添加分类
          </el-button>
        </div>
      </template>

      <el-table :data="categories" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column label="图标" width="80">
          <template #default="{ row }">
            <span style="font-size: 24px;">{{ row.icon }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="book_count" label="图书数量" width="100" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" text size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" text size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="showDialog" :title="editForm.id ? '编辑分类' : '添加分类'" width="440px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="editForm.name" placeholder="分类名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editForm.icon" placeholder="输入 emoji，如 📖" style="width: 120px" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editForm.sort" :min="0" />
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

const showDialog = ref(false)
const editForm = reactive({ id: null, name: '', icon: '📖', sort: 0 })

const categories = ref([
  { id: 1, name: '文学小说', icon: '📖', book_count: 456, sort: 1 },
  { id: 2, name: '社科历史', icon: '📜', book_count: 289, sort: 2 },
  { id: 3, name: '科技编程', icon: '💻', book_count: 312, sort: 3 },
  { id: 4, name: '艺术设计', icon: '🎨', book_count: 178, sort: 4 },
  { id: 5, name: '商业管理', icon: '💼', book_count: 145, sort: 5 },
  { id: 6, name: '生活休闲', icon: '🌿', book_count: 120, sort: 6 },
  { id: 7, name: '教育考试', icon: '🎓', book_count: 98, sort: 7 }
])

const handleEdit = (row) => {
  Object.assign(editForm, row)
  showDialog.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除分类「${row.name}」吗？`, '提示', { type: 'warning' }).then(() => {
    categories.value = categories.value.filter(c => c.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSave = () => {
  if (!editForm.name) { ElMessage.warning('请输入分类名称'); return }
  if (editForm.id) {
    const idx = categories.value.findIndex(c => c.id === editForm.id)
    if (idx > -1) Object.assign(categories.value[idx], editForm)
  } else {
    categories.value.push({ ...editForm, id: Date.now(), book_count: 0 })
  }
  showDialog.value = false
  Object.assign(editForm, { id: null, name: '', icon: '📖', sort: 0 })
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.admin-categories { max-width: 1400px; }
.main-card { border-radius: 12px; border: none; }
.card-header { display: flex; align-items: center; justify-content: space-between; }
.card-title { font-weight: 600; color: #1a1a2e; font-size: 16px; }
</style>
