<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  publishDate: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  tags: {
    type: Array,
    default: () => []
  }
})

// 格式化日期
const formattedDate = computed(() => {
  if (!props.publishDate) return ''
  const date = new Date(props.publishDate)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
})

// 点击跳转文章详情
const goToDetail = () => {
  if (props.id) {
    router.push(`/post/${props.id}`)
  }
}
</script>

<template>
  <div class="post-card" @click="goToDetail" style="cursor: pointer;">
    <div class="card-image" v-if="coverImage">
      <img :src="coverImage" :alt="title">
    </div>
    <div class="card-content">
      <div class="card-tags" v-if="tags && tags.length">
        <span v-for="tag in tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-info">{{ summary }}</p>
      <div class="card-meta">
        <span v-if="author" class="meta-item author">
          <el-icon><User /></el-icon> {{ author }}
        </span>
        <span v-if="formattedDate" class="meta-item date">
          <el-icon><Calendar /></el-icon> {{ formattedDate }}
        </span>
        <span class="meta-item views">
          <el-icon><View /></el-icon> {{ views }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { User, Calendar, View } from '@element-plus/icons-vue'
export default {
  components: { User, Calendar, View }
}
</script>

<style scoped>
.post-card {
  background-color: var(--color-bg-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: auto;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--color-text);
  line-height: 1.4;
}

.card-info {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.5;
  flex: 1;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  /* gap: 6px; */
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: auto;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item i,
.meta-item .el-icon {
  font-size: 14px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.tag {
  background-color: var(--color-bg-lighter);
  color: var(--color-text-muted);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
}

@media(max-width: 768px) {
  .post-card {
    padding: 0px;
  }

  .card-content {
    padding: 12px;
  }
}
</style>