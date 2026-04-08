<script setup>
import { computed } from 'vue'

const props = defineProps({
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
</script>

<template>
  <div class="post-card">
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
@import '../styles/postcard.css';
</style>