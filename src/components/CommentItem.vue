<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user'
import defaultAvatar from '../assets/avatar.webp'

const userStore = useUserStore()

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['reply', 'delete'])

// 头像处理
const avatarUrl = computed(() => {
  if (!props.comment.author?.avatar) return defaultAvatar
  const avatar = props.comment.author.avatar
  if (avatar.startsWith('/uploads/')) {
    return `http://localhost:3000${avatar}`
  }
  return avatar
})

const handleAvatarError = (e) => {
  e.target.src = defaultAvatar
}

// 是否是自己的评论
const isOwner = computed(() => {
  return userStore.userId && props.comment.author?._id === userStore.userId
})

// 是否是管理员
const isAdmin = computed(() => {
  return ['admin', 'moderator'].includes(userStore.role)
})

// 角色标签
const roleLabel = computed(() => {
  const role = props.comment.author?.role
  if (role === 'admin') return '管理员'
  if (role === 'moderator') return '版主'
  return ''
})

// 回复给谁
const replyToName = computed(() => {
  if (props.depth >= 2 && props.comment.replyTo?.author?.username) {
    return props.comment.replyTo.author.username
  }
  return ''
})

// 时间格式化
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="comment-item" :class="{ 'comment-reply': depth >= 1 }">
    <img
      :src="avatarUrl"
      @error="handleAvatarError"
      class="comment-avatar"
      alt="头像"
    />
    <div class="comment-body">
      <div class="comment-header">
        <span class="comment-author">{{ comment.author?.username || '未知用户' }}</span>
        <span v-if="roleLabel" class="comment-role">{{ roleLabel }}</span>
        <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
      </div>
      <div style="display: flex; flex-direction: row;">
        <div v-if="replyToName" class="reply-reference">
          回复给 <span class="reply-name">@{{ replyToName }}</span>:&nbsp
        </div>
        <div class="comment-content">{{ comment.content }}</div>
      </div>
      <div class="comment-actions">
        <button class="action-btn" @click="emit('reply', comment)">回复</button>
        <button
          v-if="isOwner || isAdmin"
          class="action-btn action-delete"
          @click="emit('delete', comment._id)"
        >删除</button>
      </div>
    </div>
  </div>

  <!-- 子回复列表 -->
  <div v-if="comment.replies && comment.replies.length" class="comment-children">
    <CommentItem
      v-for="reply in comment.replies"
      :key="reply._id"
      :comment="reply"
      :depth="depth + 1"
      @reply="emit('reply', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
</template>

<style scoped>
.comment-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.comment-reply {
  /* 统一缩进，不再随 depth 增加 */
  margin-left: 40px;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.comment-author {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.comment-role {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
}

.comment-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.reply-reference {
  font-size: 14px;
  text-align: left;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}

.reply-name {
  color: var(--color-primary);
}

.comment-content {
  font-size: 14px;
  color: var(--color-text);
  /* line-height: 1.6; */
  text-align: left;
  margin-bottom: 6px;
  word-break: break-word;
}

.comment-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.action-btn:hover {
  color: var(--color-primary);
}

.action-delete:hover {
  color: var(--color-danger);
}

.comment-children {
  /* 子回复容器不需要额外样式 */
}
</style>
