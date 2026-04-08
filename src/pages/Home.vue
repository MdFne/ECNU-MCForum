<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Activity from '../components/Activity.vue'
import AppSideBarr from '../components/AppSideBarr.vue'
import PostCard from '../components/PostCard.vue'
import { getPostcards } from '../api/postcard'
import { ElMessage } from 'element-plus'

const activities = ref([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const limit = 9 // 每页显示数量

// 加载文章数据
const loadPostcards = async (isLoadMore = false) => {
  if (loading.value || (!isLoadMore && activities.value.length > 0)) return
  if (isLoadMore && !hasMore.value) return

  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: limit,
      isActive: true
    }
    const response = await getPostcards(params)
    
    if (response.data.success) {
      const { postcards, totalPages } = response.data.data
      
      if (isLoadMore) {
        activities.value = [...activities.value, ...postcards]
      } else {
        activities.value = postcards
      }

      // 判断是否还有更多数据
      if (page.value >= totalPages) {
        hasMore.value = false
      } else {
        page.value++
      }
    }
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章失败')
  } finally {
    loading.value = false
  }
}

// 模拟加载更多数据 (改为实际加载)
const loadMoreData = () => {
  loadPostcards(true)
}

// 滚动事件处理函数
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  
  // 当滚动到距离底部 100px 时加载更多
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMoreData()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadPostcards() // 初始加载数据
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="bgIMG">
    <div class="main">
    <Activity />
      <div class="container">
        <div class="content">
          <PostCard 
            v-for="activity in activities" 
            :key="activity._id"
            :title="activity.title"
            :summary="activity.summary"
            :coverImage="activity.coverImage"
            :publishDate="activity.publishDate"
            :author="activity.author"
            :views="activity.views"
            :tags="activity.tags"
          />
          
          <!-- 加载指示器 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <span>加载中...</span>
          </div>
          
          <!-- 没有更多数据提示 -->
          <div v-else-if="!hasMore" class="no-more">
            没有更多活动了
          </div>
        </div>
        <AppSideBarr />  
    </div>
    </div>
  </div>
</template>

<style scoped> 
  @import '../styles/homeLoading.css';
  @import '../styles/bgIMG.css';
  
  .main {
    height: 100%;
    width: min(80%,900px);
    margin: 0;
    
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
    
  .content {
    height: auto;

    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;

    background-color: #F1F1F1;
    box-shadow: var(--el-box-shadow-light);
    border-radius: 8px;
  }

  @media(max-width: 768px) {
    .container {

    }
    .content {
      padding: 16px;
    }
  }
</style>
