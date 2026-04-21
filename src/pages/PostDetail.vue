<template>
  <div class="bg-content">
    <div class="bg-image"></div>
    <div class="post-detail">
      <!-- 加载中 -->
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <!-- 文章不存在 -->
      <div v-else-if="error" class="error-state">
        <h2>文章未找到</h2>
        <p>{{ error }}</p>
        <button class="back-btn" @click="goBack">← 返回首页</button>
      </div>

      <!-- 文章内容 -->
      <article v-else-if="article" class="article">
        <!-- 返回按钮 -->
        <button class="back-btn" @click="goBack">← 返回</button>

        <!-- 文章头部 -->
        <header class="article-header">
          <div class="article-tags" v-if="article.tags && article.tags.length">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span v-if="article.author" class="meta-item">
              <el-icon><User /></el-icon> {{ article.author }}
            </span>
            <span v-if="article.publishDate" class="meta-item">
              <el-icon><Calendar /></el-icon> {{ formatDate(article.publishDate) }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon> {{ article.views }}
            </span>
          </div>
        </header>

        <!-- 封面图 -->
        <div class="article-cover" v-if="article.coverImage">
          <img :src="article.coverImage" :alt="article.title">
        </div>

        <!-- 文章正文 -->
        <div class="article-content" v-html="article.content"></div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPostcardById } from '../api/postcard'
import { User, Calendar, View } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const article = ref(null)
const loading = ref(true)
const error = ref('')

// 获取文章详情
const fetchArticle = async () => {
  const id = route.params.id
  if (!id) {
    error.value = '无效的文章ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const response = await getPostcardById(id)
    if (response.data.success) {
      article.value = response.data.data
    } else {
      error.value = '文章不存在'
    }
  } catch (err) {
    error.value = err.response?.data?.message || '加载文章失败'
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// 视差滚动
const parallaxScroll = () => {
  const scrollTop = window.scrollY
  const bg = document.querySelector('.bg-image')
  if (bg) {
    bg.style.transform = `translateY(${scrollTop * -0.3}px)`
  }
}

onMounted(() => {
  fetchArticle()
  window.addEventListener('scroll', parallaxScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', parallaxScroll)
})
</script>

<style scoped>
.bg-image {
  background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
        url('../assets/ECNUSakura/3.png') center/cover no-repeat;
}

.post-detail {
  width: min(80%, 900px);
  min-height: 60vh;
}

/* ---- 加载状态 ---- */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  color: var(--color-text-secondary);
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ---- 错误状态 ---- */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.error-state h2 {
  color: var(--color-text);
  margin-bottom: 8px;
}

.error-state p {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

/* ---- 返回按钮 ---- */
.back-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 15px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 16px;
}

.back-btn:hover {
  text-decoration: underline;
}

/* ---- 文章容器 ---- */
.article {
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: 32px 40px;
}

/* ---- 文章头部 ---- */
.article-header {
  margin-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 20px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tag {
  background-color: var(--color-bg-lighter);
  color: var(--color-text-muted);
  padding: 2px 10px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.4;
  margin: 0 0 16px 0;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item .el-icon {
  font-size: 15px;
}

/* ---- 封面图 ---- */
.article-cover {
  margin-bottom: 24px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

/* ---- 文章正文排版 ---- */
.article-content {
  color: var(--color-text);
  font-size: 16px;
  line-height: 1.8;
}

.article-content h2 {
  font-size: 22px;
  font-weight: 700;
  margin: 32px 0 16px 0;
  color: var(--color-text);
}

.article-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: var(--color-text);
}

.article-content p {
  margin: 0 0 16px 0;
}

.article-content img {
  max-width: 100%;
  border-radius: var(--radius-sm);
  margin: 16px 0;
  display: block;
}

.article-content ul,
.article-content ol {
  padding-left: 24px;
  margin: 0 0 16px 0;
}

.article-content li {
  margin-bottom: 6px;
}

.article-content strong {
  font-weight: 600;
}

.article-content code {
  background: var(--color-bg-lighter);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 14px;
  font-family: Consolas, Monaco, monospace;
}

.article-content a {
  color: var(--color-primary);
  text-decoration: none;
}

.article-content a:hover {
  text-decoration: underline;
}

.article-content blockquote {
  border-left: 4px solid var(--color-primary);
  padding: 8px 16px;
  margin: 16px 0;
  color: var(--color-text-secondary);
  background: var(--color-bg-lighter);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

/* ---- 响应式 ---- */
@media (max-width: 768px) {
  .post-detail {
    width: 95%;
  }

  .article {
    padding: 20px 16px;
  }

  .article-title {
    font-size: 22px;
  }

  .article-content h2 {
    font-size: 18px;
  }

  .article-content h3 {
    font-size: 16px;
  }
}
</style>
