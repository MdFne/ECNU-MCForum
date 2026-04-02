<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Activity from '../components/Activity.vue'
import AppSideBarr from '../components/AppSideBarr.vue'
import PostCard from '../components/PostCard.vue'

const count = ref(0)
const activities = ref([
  {
    id: 1,
    title: '春季校园招聘会',
    info: '为毕业生提供优质就业机会，多家知名企业现场招聘',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20job%20fair%20spring%20students%20recruitment&image_size=landscape_16_9',
    date: '2024-04-15',
    location: '体育馆'
  },
  {
    id: 2,
    title: '科技学术讲座',
    info: '邀请行业专家分享前沿科技发展趋势和研究成果',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=academic%20lecture%20technology%20expert%20audience&image_size=landscape_16_9',
    date: '2024-04-20',
    location: '学术报告厅'
  },
  {
    id: 3,
    title: '社团文化节',
    info: '展示各社团特色活动，丰富校园文化生活',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=student%20club%20culture%20festival%20campus%20activities&image_size=landscape_16_9',
    date: '2024-04-25',
    location: '中心广场'
  },
  {
    id: 4,
    title: '体育运动会',
    info: '一年一度的校园运动会，展现师生运动风采',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20sports%20meeting%20athletes%20competition&image_size=landscape_16_9',
    date: '2024-05-01',
    location: '运动场'
  },
  {
    id: 5,
    title: '艺术展览',
    info: '学生艺术作品展示，包括绘画、雕塑、摄影等',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=art%20exhibition%20student%20paintings%20gallery&image_size=landscape_16_9',
    date: '2024-05-10',
    location: '艺术中心'
  },
  {
    id: 6,
    title: '创业大赛',
    info: '激发学生创业热情，提供创业指导和资金支持',
    imageUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=startup%20competition%20students%20business%20pitch&image_size=landscape_16_9',
    date: '2024-05-15',
    location: '创业孵化中心'
  }
])

const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

// 模拟加载更多数据
const loadMoreData = () => {
  if (loading.value || !hasMore.value) return
  
  loading.value = true
  
  // 模拟 API 请求延迟
  setTimeout(() => {
    const newActivities = [
      {
        id: activities.value.length + 1,
        title: `活动 ${activities.value.length + 1}`,
        info: `这是第 ${activities.value.length + 1} 个活动的详细信息，包含活动的具体内容和安排。`,
        imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20activity%20${activities.value.length + 1}&image_size=landscape_16_9`,
        date: `2024-06-${Math.floor(Math.random() * 30) + 1}`,
        location: `地点 ${Math.floor(Math.random() * 10) + 1}`
      },
      {
        id: activities.value.length + 2,
        title: `活动 ${activities.value.length + 2}`,
        info: `这是第 ${activities.value.length + 2} 个活动的详细信息，包含活动的具体内容和安排。`,
        imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20activity%20${activities.value.length + 2}&image_size=landscape_16_9`,
        date: `2024-06-${Math.floor(Math.random() * 30) + 1}`,
        location: `地点 ${Math.floor(Math.random() * 10) + 1}`
      },
      {
        id: activities.value.length + 3,
        title: `活动 ${activities.value.length + 3}`,
        info: `这是第 ${activities.value.length + 3} 个活动的详细信息，包含活动的具体内容和安排。`,
        imageUrl: `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=campus%20activity%20${activities.value.length + 3}&image_size=landscape_16_9`,
        date: `2024-06-${Math.floor(Math.random() * 30) + 1}`,
        location: `地点 ${Math.floor(Math.random() * 10) + 1}`
      }
    ]
    
    activities.value = [...activities.value, ...newActivities]
    page.value++
    
    // 模拟数据加载完毕
    if (page.value > 3) {
      hasMore.value = false
    }
    
    loading.value = false
  }, 1000)
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
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="main">
    <Activity />
      <div class="container">
        <div class="content">
          <PostCard 
            v-for="activity in activities" 
            :key="activity.id"
            :title="activity.title"
            :info="activity.info"
            :imageUrl="activity.imageUrl"
            :date="activity.date"
            :location="activity.location"
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
</template>

<style scoped> 
  @import '../styles/homeLoading.css';

  .main {
    align-self: center;
    height: 100%;
    width: 80%;
    
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
