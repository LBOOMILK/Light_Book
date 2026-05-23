<template>
  <div class="booklist-page">
    <!-- 桌面端布局 -->
    <div class="desktop-booklist-layout">
      <div class="desktop-header">
        <h1 class="page-title">精选书单</h1>
        <p class="page-desc">发现阅读灵感，收藏你的书单</p>
      </div>

      <div class="create-bar-desktop">
        <el-button type="primary" size="large" class="create-btn" @click="showCreateModal = true">
          <el-icon><Plus /></el-icon>
          创建书单
        </el-button>
      </div>

      <div class="booklist-grid">
        <div v-for="list in booklists" :key="list.id" class="booklist-card-desktop" @click="showBooklist(list)">
          <div class="card-cover">
            <img :src="list.cover || defaultCover" class="list-cover" />
            <div class="card-overlay">
              <span class="view-btn">查看详情</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="list-title">{{ list.title }}</h3>
            <p class="list-desc">{{ list.description || '暂无简介' }}</p>
            <div class="list-meta">
              <span class="meta-item">
                <el-icon><Collection /></el-icon>
                {{ list.book_count || 0 }} 本图书
              </span>
              <span class="meta-item">
                <el-icon><User /></el-icon>
                {{ list.user?.username || '匿名用户' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="booklists.length === 0" class="empty-state-desktop">
        <div class="empty-icon">📚</div>
        <div class="empty-title">还没有书单</div>
        <div class="empty-hint">创建一个书单，收集你喜爱的书</div>
        <el-button type="primary" size="large" @click="showCreateModal = true" class="empty-btn">
          立即创建
        </el-button>
      </div>
    </div>

    <!-- 移动端布局 -->
    <div class="mobile-booklist-layout">
      <div class="create-bar">
        <van-button type="primary" class="create-btn" @click="showCreateModal = true">
          <van-icon name="plus" /> 创建书单
        </van-button>
      </div>

      <div class="booklist-items">
        <div v-for="list in booklists" :key="list.id" class="booklist-card" @click="showBooklist(list)">
          <img :src="list.cover || defaultCover" class="list-cover" />
          <div class="list-info">
            <div class="list-title">{{ list.title }}</div>
            <div class="list-desc">{{ list.description || '暂无简介' }}</div>
            <div class="list-meta">
              <van-icon name="bookmark-o" size="12" />
              <span>{{ list.book_count || 0 }} 本</span>
            </div>
          </div>
          <van-icon name="arrow" size="16" color="#ccc" class="list-arrow" />
        </div>

        <div v-if="booklists.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <div class="empty-text">还没有书单</div>
          <div class="empty-hint">创建一个书单，收集你喜爱的书</div>
        </div>
      </div>
    </div>

    <!-- 创建书单弹窗 -->
    <el-dialog
      v-model="showCreateModal"
      title="创建书单"
      width="480px"
      :close-on-click-modal="false"
      class="create-dialog"
      :show-close="false"
      align-center
    >
      <template #header="{ close }">
        <div class="dialog-header">
          <span class="dialog-title">创建书单</span>
          <el-icon class="close-icon" @click="close">
            <Close />
          </el-icon>
        </div>
      </template>
      <div class="dialog-body">
        <el-form :model="form" label-position="top">
          <el-form-item label="书单名称" required>
            <el-input
              v-model="form.title"
              placeholder="给书单起个名字"
              size="large"
              class="custom-input"
            />
          </el-form-item>
          <el-form-item label="简介" class="custom-textarea">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="简单介绍一下这个书单（选填）"
              class="custom-textarea-input"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="large" class="cancel-btn" @click="showCreateModal = false">取消</el-button>
          <el-button type="primary" size="large" class="create-btn-submit" @click="handleCreate">
            创建
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
import { Plus, Collection, User, Close } from '@element-plus/icons-vue'
import { getBooklists, createBooklist } from '../../api'
import { fillCovers } from '../../mock'

const defaultCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHJ4PSI4IiBmaWxsPSIjRDRBNTc0Ii8+PHRleHQgeD0iMzAiIHk9IjQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmIiBmb250LXNpemU9IjIwIj48L3RleHQ+PC9zdmc+'

const booklists = ref([])
const showCreateModal = ref(false)
const form = reactive({ title: '', description: '' })

onMounted(async () => {
  try {
    const data = await getBooklists()
    booklists.value = Array.isArray(data) ? fillCovers(data) : []
  } catch (e) {
    console.error('Load booklists failed:', e)
  }
})

const handleCreate = async () => {
  if (!form.title.trim()) { showToast({ message: '请输入书单名称', type: 'error' }); return }
  try {
    await createBooklist(form)
    showToast({ message: '创建成功', type: 'success' })
    showCreateModal.value = false
    form.title = ''; form.description = ''
    const data = await getBooklists()
    booklists.value = Array.isArray(data) ? fillCovers(data) : []
  } catch (e) { showToast({ message: '创建失败', type: 'error' }) }
}

const showBooklist = (list) => showToast({ message: `书单：${list.title}`, type: 'info' })
</script>

<style scoped>
.booklist-page {
  min-height: 100vh;
  background: var(--lb-bg);
}

/* ========== Element Plus 主题色覆盖 ========== */
:deep(.el-button--primary) {
  --el-button-bg-color: #8B5E3C;
  --el-button-border-color: #8B5E3C;
  --el-button-hover-bg-color: #A0522D;
  --el-button-hover-border-color: #A0522D;
  --el-button-active-bg-color: #6B4226;
  --el-button-active-border-color: #6B4226;
}

/* ========== 对话框样式 ========== */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(139, 94, 60, 0.2);
}

:deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-dialog__footer) {
  padding: 0;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #8B5E3C, #D4A574);
  color: #fff;
}

.dialog-title {
  font-size: 18px;
  font-weight: 700;
}

.close-icon {
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-icon:hover {
  opacity: 1;
}

.dialog-body {
  padding: 24px;
  background: #fff;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--lb-text);
  padding-bottom: 8px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.custom-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(139, 94, 60, 0.15);
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(139, 94, 60, 0.2);
  border-color: #8B5E3C;
}

.custom-textarea-input :deep(.el-textarea__inner) {
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-family: inherit;
}

.custom-textarea-input :deep(.el-textarea__inner:hover) {
  box-shadow: 0 4px 12px rgba(139, 94, 60, 0.15);
}

.custom-textarea-input :deep(.el-textarea__inner:focus) {
  box-shadow: 0 4px 12px rgba(139, 94, 60, 0.2);
  border-color: #8B5E3C;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  flex: 1;
  border-radius: 10px;
  height: 44px;
  font-weight: 600;
}

.create-btn-submit {
  flex: 2;
  border-radius: 10px;
  height: 44px;
  font-weight: 600;
}

/* ========== 桌面端样式 ========== */
.desktop-booklist-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 40px;
}

.desktop-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--lb-text);
  margin: 0 0 12px;
}

.page-desc {
  font-size: 16px;
  color: var(--lb-text-light);
  margin: 0;
}

.create-bar-desktop {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.create-btn {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 12px;
}

.booklist-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.booklist-card-desktop {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.booklist-card-desktop:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(139, 94, 60, 0.15);
}

.card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.list-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(139, 94, 60, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.booklist-card-desktop:hover .card-overlay {
  opacity: 1;
}

.view-btn {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 24px;
  border: 2px solid #fff;
  border-radius: 24px;
}

.card-content {
  padding: 20px;
}

.list-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--lb-text);
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-desc {
  font-size: 14px;
  color: var(--lb-text-light);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.list-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--lb-text-light);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-state-desktop {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-state-desktop .empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state-desktop .empty-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--lb-text);
  margin: 0 0 12px;
}

.empty-state-desktop .empty-hint {
  font-size: 15px;
  color: var(--lb-text-light);
  margin: 0 0 24px;
}

.empty-btn {
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 24px;
}

/* 隐藏移动端布局 */
.mobile-booklist-layout {
  display: none;
}

/* ========== 移动端样式 ========== */
@media (max-width: 768px) {
  .desktop-booklist-layout {
    display: none;
  }

  .mobile-booklist-layout {
    display: block;
    padding-bottom: 70px;
  }

  .create-bar {
    padding: 16px;
  }

  .create-btn {
    width: 100%;
    border-radius: var(--lb-radius-xl) !important;
    height: 44px;
    font-weight: 600;
  }

  .booklist-items {
    padding: 0 16px;
  }

  .booklist-card {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--lb-bg-card);
    border-radius: var(--lb-radius-lg);
    padding: 14px;
    margin-bottom: 10px;
    box-shadow: var(--lb-shadow-sm);
    cursor: pointer;
    transition: all 0.2s;
  }

  .booklist-card:active {
    transform: scale(0.98);
    box-shadow: var(--lb-shadow-md);
  }

  .list-cover {
    width: 64px;
    height: 86px;
    object-fit: cover;
    border-radius: var(--lb-radius-sm);
    flex-shrink: 0;
    background: #f0ebe5;
  }

  .list-info {
    flex: 1;
    min-width: 0;
  }

  .list-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--lb-text);
  }

  .list-desc {
    font-size: 12px;
    color: var(--lb-text-light);
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .list-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--lb-text-light);
    margin-top: 8px;
  }

  .list-arrow {
    flex-shrink: 0;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--lb-text);
  }

  .empty-hint {
    font-size: 13px;
    color: var(--lb-text-light);
    margin-top: 6px;
  }
}

@media (min-width: 500px) and (max-width: 768px) {
  .booklist-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .booklist-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
