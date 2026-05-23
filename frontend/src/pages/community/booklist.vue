<template>
  <div class="booklist-page">
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

    <van-popup v-model:show="showCreateModal" position="bottom" round :style="{ maxHeight: '60%' }">
      <div class="popup-content">
        <div class="popup-title">创建书单</div>
        <van-field v-model="form.title" placeholder="给书单起个名字" class="popup-field" required />
        <van-field v-model="form.description" type="textarea" placeholder="简单介绍一下这个书单（选填）" rows="3" class="popup-field" />
        <van-button block type="primary" class="popup-submit" @click="handleCreate">创建</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { showToast } from 'vant'
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
.booklist-page { min-height: 100vh; background: var(--lb-bg); padding-bottom: 70px; }
.create-bar { padding: 16px; max-width: 768px; margin: 0 auto; }
.create-btn { width: 100%; border-radius: var(--lb-radius-xl) !important; height: 44px; font-weight: 600; }

.booklist-items { padding: 0 16px; max-width: 768px; margin: 0 auto; }

.booklist-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--lb-bg-card); border-radius: var(--lb-radius-lg);
  padding: 14px; margin-bottom: 10px; box-shadow: var(--lb-shadow-sm);
  cursor: pointer; transition: all 0.2s;
}
.booklist-card:active { transform: scale(0.98); box-shadow: var(--lb-shadow-md); }

.list-cover {
  width: 64px; height: 86px; object-fit: cover;
  border-radius: var(--lb-radius-sm); flex-shrink: 0; background: #f0ebe5;
}

.list-info { flex: 1; min-width: 0; }
.list-title { font-size: 15px; font-weight: 600; color: var(--lb-text); }
.list-desc { font-size: 12px; color: var(--lb-text-light); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.list-meta { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--lb-text-light); margin-top: 8px; }
.list-arrow { flex-shrink: 0; }

.popup-content { padding: 24px 20px; }
.popup-title { font-size: 18px; font-weight: 700; color: var(--lb-text); text-align: center; margin-bottom: 20px; }
.popup-field { background: var(--lb-bg); border-radius: var(--lb-radius-md); margin-bottom: 12px; }
.popup-submit { margin-top: 20px; border-radius: var(--lb-radius-xl) !important; height: 44px; font-weight: 600; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; }
.empty-icon { font-size: 48px; margin-bottom: 12px; opacity: 0.5; }
.empty-text { font-size: 16px; font-weight: 600; color: var(--lb-text); }
.empty-hint { font-size: 13px; color: var(--lb-text-light); margin-top: 6px; }
</style>
