<template>
  <div class="activity-trailers">
    <div v-if="loading" class="loading">
      <el-skeleton :rows="3" animated />
    </div>
    <div v-else-if="trailers.length === 0" class="no-data">
      暂无活动预告
    </div>
    <div v-else class="trailer-list">
      <div v-for="(item, index) in trailers" :key="item._id || index" class="trailer-item">
        <div class="time-tag">
          <span class="date">{{ formatDate(item.startTime).date }}</span>
          <span class="time">{{ formatDate(item.startTime).time }}</span>
        </div>
        <div class="content">
          <a :href="item.link" target="_blank" class="title">{{ item.title }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllActivityTrailers } from '../api/activityTrailer'
import { ElMessage } from 'element-plus'

const trailers = ref([])
const loading = ref(true)

const fetchTrailers = async () => {
  try {
    loading.value = true
    const response = await getAllActivityTrailers()
    if (response.data.success) {
      trailers.value = response.data.data
    }
  } catch (error) {
    console.error('获取活动预告失败:', error)
    ElMessage.error('获取活动预告失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  return {
    date: `${month}-${day}`,
    time: `${hours}:${minutes}`
  }
}

onMounted(() => {
  fetchTrailers()
})
</script>

<style scoped>
  .activity-trailers {
    width: 100%;
    padding: 8px 0;
  }

  .loading {
    padding: 10px;
  }

  .no-data {
    text-align: center;
    color: #999;
    font-size: 14px;
    padding: 20px 0;
  }

  .trailer-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .trailer-item {
    width: 95%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    padding: 0px;
    background-color: #fff;
    border-radius: 6px;
    transition: all 0.3s ease;
    border-left: 4px solid #409eff;
  }

  .trailer-item:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }

  .time-tag {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 50px;
    background-color: #f0f7ff;
    padding: 4px;
    border-radius: 4px;
    color: #409eff;
  }

  .date {
    font-size: 14px;
    font-weight: bold;
  }

  .time {
    font-size: 11px;
    opacity: 0.8;
  }

  .content {
    flex: 1;
    overflow: hidden;
  }

  .title {
    font-size: 14px;
    color: #333;
    text-decoration: none;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
    font-weight: 500;
  }

  .title:hover {
    color: #409eff;
  }
</style>
