<script setup>
import { ref, computed, onMounted } from 'vue'
import { getComments, createComment, deleteComment } from '../api/comments'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommentItem from './CommentItem.vue'

const userStore = useUserStore()

const props = defineProps({
  postcardId: {
    type: String,
    required: true
  }
})

const comments = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const total = ref(0)
const sortBy = ref('createdAt')
const sortOrder = ref('asc')
const newContent = ref('')
const submitting = ref(false)
const replyingTo = ref(null)

// 组装评论树：扁平数组 → 父子结构
const commentTree = computed(() => {
  const map = {}
  const roots = []

  // 先建索引
  comments.value.forEach(c => {
    map[c._id] = { ...c, replies: [] }
  })

  // 组装树
  comments.value.forEach(c => {
    const node = map[c._id]
    if (c.replyTo && map[c.replyTo._id || c.replyTo]) {
      const parentId = c.replyTo._id || c.replyTo
      if (map[parentId]) {
        map[parentId].replies.push(node)
        return
      }
    }
    roots.push(node)
  })

  return roots
})

// 加载评论
const loadComments = async (isLoadMore = false) => {
  if (loading.value) return
  if (isLoadMore && !hasMore.value) return

  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: 20,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    }
    const response = await getComments(props.postcardId, params)
    if (response.data.success) {
      const { comments: list, totalPages } = response.data.data
      total.value = response.data.data.total

      if (isLoadMore) {
        comments.value = [...comments.value, ...list]
      } else {
        comments.value = list
      }

      if (page.value >= totalPages) {
        hasMore.value = false
      } else {
        page.value++
      }
    }
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
  }
}

// 切换排序
const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  page.value = 1
  hasMore.value = true
  comments.value = []
  loadComments()
}

// 提交评论
const submitComment = async () => {
  if (!newContent.value.trim()) {
    ElMessage.warning('评论内容不能为空')
    return
  }

  submitting.value = true
  try {
    const data = {
      content: newContent.value.trim()
    }
    if (replyingTo.value) {
      data.replyTo = replyingTo.value._id
    }

    const response = await createComment(props.postcardId, data)
    if (response.data.success) {
      ElMessage.success('评论发表成功')
      newContent.value = ''
      replyingTo.value = null
      // 重新加载评论列表
      page.value = 1
      hasMore.value = true
      comments.value = []
      loadComments()
    }
  } catch (error) {
    console.error('发表评论失败:', error)
  } finally {
    submitting.value = false
  }
}

// 设置回复目标
const setReplyTo = (comment) => {
  replyingTo.value = comment
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
}

// 删除评论
const handleDelete = async (commentId) => {
  try {
    await ElMessageBox.confirm('确定删除这条评论吗？', '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await deleteComment(commentId)
    if (response.data.success) {
      ElMessage.success('评论已删除')
      // 重新加载
      page.value = 1
      hasMore.value = true
      comments.value = []
      loadComments()
    }
  } catch (error) {
    // 用户取消确认
    if (error !== 'cancel') {
      console.error('删除评论失败:', error)
    }
  }
}

onMounted(() => {
  loadComments()
})
</script>

<template>
  <div class="comment-section">
    <!-- 分隔线 -->
    <hr class="section-divider" />

    <!-- 标题栏：评论数 + 排序 -->
    <div class="section-header">
      <h3 class="section-title">评论 ({{ total }})</h3>
      <button class="sort-btn" @click="toggleSort" :title="sortOrder === 'asc' ? '切换为最新优先' : '切换为最早优先'">
        <span v-if="sortOrder === 'asc'">↑ 最早</span>
        <span v-else>↓ 最新</span>
      </button>
    </div>

    <!-- 评论输入框（登录后显示） -->
    <div v-if="userStore.isLoggedIn" class="comment-input-area">
      <!-- 回复预览条 -->
      <div v-if="replyingTo" class="reply-bar">
        <span>回复 <strong>@{{ replyingTo.author?.username }}</strong></span>
        <button class="cancel-reply-btn" @click="cancelReply">✕</button>
      </div>
      <div class="input-row">
        <el-input
          v-model="newContent"
          type="textarea"
          :rows="2"
          :placeholder="replyingTo ? `回复 @${replyingTo.author?.username}...` : '写下你的评论...'"
          maxlength="500"
          show-word-limit
          resize="none"
        />
        <el-button
          type="primary"
          :loading="submitting"
          :disabled="!newContent.trim()"
          @click="submitComment"
          class="submit-btn"
        >发表</el-button>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-else class="login-hint">
      <span>登录后参与讨论</span>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-if="!loading && commentTree.length === 0" class="empty-comments">
        暂无评论，来说两句吧～
      </div>

      <template v-for="root in commentTree" :key="root._id">
        <CommentItem
          :comment="root"
          :depth="0"
          @reply="setReplyTo"
          @delete="handleDelete"
        />
      </template>
    </div>

    <!-- 加载更多 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>
    <div v-else-if="hasMore && comments.length > 0" class="load-more">
      <button class="load-more-btn" @click="loadComments(true)">加载更多</button>
    </div>
    <div v-else-if="!hasMore && comments.length > 0" class="no-more">
      没有更多评论了
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  margin-top: 32px;
}

.section-divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0 0 20px 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.sort-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
  padding: 4px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.sort-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* 评论输入区 */
.comment-input-area {
  margin-bottom: 20px;
}

.reply-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--color-bg-lighter);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.cancel-reply-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 14px;
  padding: 0 4px;
}

.cancel-reply-btn:hover {
  color: var(--color-danger);
}

.input-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}


.input-row :deep(.el-textarea__inner) {
  flex: 1;
  background: var(--color-bg-lighter);
  border-radius: var(--radius-sm);
  font-size: 14px;
  height: 32px;
  transition: all 0.3s;
}

.input-row :deep(.el-input__count) {
  display: none;
  background: none;
}

.input-row :deep(.el-textarea__inner):focus {
  height: 60px;
}

.submit-btn {
  transition: height 0.3s;
  width: 80px;
  height: 32px !important;
  border-radius: var(--radius-sm) !important;
}

/* 输入框获焦时按钮变高 */
.input-row:focus-within .submit-btn {
  height: 60px !important;
}

.input-row:focus-within :deep(.el-input__count) {
  display: block;
}

/* 未登录提示 */
.login-hint {
  text-align: center;
  padding: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  background: var(--color-bg-lighter);
  border-radius: var(--radius-md);
  margin-bottom: 20px;
}

/* 评论列表 */
.comment-list {
  /* 列表容器 */
}

.empty-comments {
  text-align: center;
  padding: 32px;
  color: var(--color-text-muted);
  font-size: 14px;
}

/* 加载状态 */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.load-more {
  text-align: center;
  padding: 16px;
}

.load-more-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  padding: 6px 20px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.load-more-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.no-more {
  text-align: center;
  padding: 16px;
  color: var(--color-text-muted);
  font-size: 13px;
}
</style>
