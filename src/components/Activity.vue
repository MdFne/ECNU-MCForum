<template>
  <div class="roll">
    <el-carousel height="300px" :interval="3000" indicator-position="inside">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="item._id || index">
        <a :href="item.linkUrl || '#'" :target="item.linkUrl ? '_blank' : '_self'" class="carousel-link">
          <div class="carousel-item" :style="`background-image: url(${item.imageUrl});`" :title="item.title">
            <div class="carousel-info" v-if="item.title || item.description">
              <h3>{{ item.title }}</h3>
              <p v-if="item.description">{{ item.description }}</p>
            </div>
          </div>
        </a>
      </el-carousel-item>
      
      <!-- 如果没有轮播图显示默认内容 -->
      <el-carousel-item v-if="carouselItems.length === 0">
        <div class="carousel-item default-item">
          暂无活动信息
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getActiveCarousels } from '../api/carousel'
import { ElMessage } from 'element-plus'

const carouselItems = ref([])

const fetchCarousels = async () => {
  try {
    const response = await getActiveCarousels()
    if (response.data.success) {
      carouselItems.value = response.data.data
    }
  } catch (error) {
    console.error('获取轮播图失败:', error)
    ElMessage.error('获取轮播图失败')
  }
}

onMounted(() => {
  fetchCarousels()
})
</script>

<style scoped>
:deep(.el-carousel) {
  border-radius: 8px; /* 增加一点圆角 */
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);

  @media (max-width: 768px) {
    height: 200px;
  }
}

.carousel-link {
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
}

.carousel-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
}

.carousel-info {
  width: 100%;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
  text-align: left;
}

.carousel-info h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.carousel-info p {
  margin: 5px 0 15px 0;
  font-size: 0.9rem;
  opacity: 0.9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.default-item {
  background-color: #f5f7fa;
  color: #909399;
  font-size: 1.2rem;
  align-items: center;
}
</style>
