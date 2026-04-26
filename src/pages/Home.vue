<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Activity from '../components/Activity.vue'
import AppSideBarr from '../components/AppSideBarr.vue'
import PostCard from '../components/PostCard.vue'
import SakuraPetals from '../components/SakuraPetals.vue'
import { getPostcards, getPostcardTags } from '../api/postcard'
import { ElMessage } from 'element-plus'
import { useSettingsStore } from '../stores/settings'
import { Search } from '@element-plus/icons-vue'
import { MasonryWall } from '@yeger/vue-masonry-wall'

const settingsStore = useSettingsStore()

const activities = ref([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const limit = 9

// 筛选状态
const searchKeyword = ref('')
const selectedTag = ref('')
const sortBy = ref('publishDate')
const sortOrder = ref('desc')
const tagOptions = ref([])

// 搜索防抖
let searchTimer = null
const debouncedSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    resetAndLoad()
  }, 300)
}

// 加载标签
const loadTags = async () => {
  try {
    const response = await getPostcardTags()
    if (response.data.success) {
      tagOptions.value = response.data.data.filter(Boolean)
    }
  } catch (error) {
    console.error('加载标签失败:', error)
  }
}

// 加载文章数据
const loadPostcards = async (isLoadMore = false) => {
  if (loading.value) return
  if (isLoadMore && !hasMore.value) return

  loading.value = true
  try {
    const params = {
      page: page.value,
      limit: limit,
      isActive: true,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    }
    if (searchKeyword.value) params.search = searchKeyword.value
    if (selectedTag.value) params.tag = selectedTag.value

    const response = await getPostcards(params)

    if (response.data.success) {
      const { postcards, totalPages } = response.data.data

      if (isLoadMore) {
        activities.value = [...activities.value, ...postcards]
      } else {
        activities.value = postcards
      }

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

// 筛选条件变化时重置并重新加载
const resetAndLoad = () => {
  page.value = 1
  hasMore.value = true
  activities.value = []
  loadPostcards()
}

// 加载更多
const loadMoreData = () => {
  loadPostcards(true)
}

// 滚动事件处理函数
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight = document.documentElement.clientHeight

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMoreData()
  }
}

// 视差滚动
const parallaxScroll = () => {
  const scrollTop = window.scrollY
  const bg = document.querySelector('.bg-image')

  bg.style.transform = `translateY(${scrollTop * -0.3}px)`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', parallaxScroll)
  loadPostcards()
  loadTags()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scroll', parallaxScroll)
  clearTimeout(searchTimer)
})
</script>

<template>
  <div class="bg-content">
    <div class="bg-image"></div>
    <SakuraPetals v-if="settingsStore.sakuraEnabled" />
    <div class="main">
      <Activity />
      <div class="container">
        <div class="post-area">
          <div class="toolbar glass">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索文章..."
              :prefix-icon="Search"
              clearable
              @input="debouncedSearch"
              @clear="resetAndLoad"
              class="toolbar-search"
            />
            <el-select
              v-model="selectedTag"
              placeholder="全部标签"
              clearable
              popper-class="dark-popper"
              @change="resetAndLoad"
              class="toolbar-select"
            >
              <el-option
                v-for="tag in tagOptions"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
            <el-select
              v-model="sortBy"
              popper-class="dark-popper"
              @change="resetAndLoad"
              class="toolbar-select"
            >
              <el-option label="最新发布" value="publishDate" />
              <el-option label="最多浏览" value="views" />
            </el-select>
          </div>
          <div class="content glass">
            <MasonryWall
              :items="activities"
              :column-width="220"
              :gap="20"
              :min-columns="1"
              :max-columns="4"
            >
              <template #default="{ item }">
                <PostCard
                  :key="item._id"
                  :id="item._id"
                  :title="item.title"
                  :summary="item.summary"
                  :coverImage="item.coverImage"
                  :publishDate="item.publishDate"
                  :author="item.author"
                  :views="item.views"
                  :tags="item.tags"
                />
              </template>
            </MasonryWall>

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
        </div>
        <AppSideBarr />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .main {
    height: 100%;
    width: min(80%, 1200px);
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

  .post-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    box-shadow: var(--el-box-shadow-light);
  }

  .toolbar-search {
    flex: 1;
  }

  .toolbar-search :deep(.el-input__wrapper) {
    height: 30px;     /* 高度 */
    line-height: 30px;/* 垂直居中 */
    background-color: var(--color-bg-white);
  }

  .toolbar-select {
    width: 140px;
    flex-shrink: 0;
  }

  .toolbar-select :deep(.el-select__wrapper) {
    background-color: var(--color-bg-white);
  }

  .content {
    height: auto;

    flex: 1;
    padding: 20px;

    /* background-color: var(--color-bg-lighter); */
    box-shadow: var(--el-box-shadow-light);
    border-radius: var(--radius-md);
  }

  .bg-image {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
          url('../assets/ECNUSakura/3.png') center/cover no-repeat;
  }

  html.dark .bg-image {
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
          url('../assets/ECNUSakura/3_night.jpg') center/cover no-repeat;
  }

  /* 暗色模式下工具栏输入框/选择框边框颜色 */
  html.dark .toolbar-search :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--color-border) inset;
  }

  html.dark .toolbar-select :deep(.el-select__wrapper) {
    box-shadow: 0 0 0 1px var(--color-border) inset;
  }

  @media(max-width: 768px) {
    .container {

    }
    .toolbar {
      flex-wrap: wrap;
    }
    .toolbar-select {
      width: 100%;
    }
    .content {
      padding: 16px;
    }
  }
</style>

<style>
/* 暗色模式下下拉弹框深色背景 */
html.dark .dark-popper {
  background: var(--color-bg-light) !important;
  border: 1px solid var(--color-border) !important;
}

html.dark .dark-popper .el-select-dropdown__item {
  color: var(--color-text) !important;
}

html.dark .dark-popper .el-select-dropdown__item.hover,
html.dark .dark-popper .el-select-dropdown__item:hover {
  background-color: var(--color-bg-hover) !important;
}

html.dark .dark-popper .el-select-dropdown__item.is-selected {
  color: var(--color-primary) !important;
}

html.dark .dark-popper .el-popper__arrow::before {
  background: var(--color-bg-light) !important;
  border-color: var(--color-border) !important;
}
</style>
