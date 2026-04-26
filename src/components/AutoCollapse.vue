<template>
  <div class="sidebar-item">
    <!-- 鼠标放这里触发 -->
    <div class="trigger">
      <img :src="items.icon" alt="icon">
      <a :href="items.linkTo" target="_blank">{{ items.title }}</a>
    </div>

    <!-- 要向下展开的内容 -->
    <div class="detail">
      <p>{{ items.content }}</p>
    </div>
  </div>
</template>

<script setup>
    import { defineProps } from 'vue'
    import defaultIcon from '../assets/linkIcon/email.png'

    const items = defineProps({
    icon: {
        type: String,
        default: defaultIcon
    },
    title: {
        type: String,
        default: '在其他社交媒体关注我们'
    },
    linkTo: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: '水杉方块社期待您的加入！\n请通过邮箱联系我们：ecnumc@outlook.com'
    },
    detailBGC: {
        type: String,
        default: 'var(--color-bg-light)'
    },
    triggerBGC: {
        type: String,
        default: 'var(--color-bg-light)'
    },
    triggerHover: {
        type: String,
        default: 'var(--color-bg-light)'
    }
    })
</script>

<style scoped>
    .sidebar-item {
        width: 100%;
        background: v-bind('items.detailBGC');
        border-radius: 8px;
        overflow: hidden;
        /* margin-bottom: 8px; */
    }

    .trigger {
        padding: 12px;
        cursor: pointer;
        background: v-bind('items.triggerBGC');
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
    }

    .trigger:hover {
        box-shadow: var(--el-box-shadow-light);
        background: v-bind('items.triggerHover');
    }

    .trigger img {
        width: 20px;
        height: 20px;
        object-fit: contain;
    }

    .trigger a {
        color: var(--color-text);
        text-decoration: none;
    }

    .detail {
        padding: 0 16px;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: all 0.5s ease;
    }

    .detail p {
        margin: 0;
        font-size: 14px;
        color: var(--color-text-secondary);
        /* 强制长文本/URL自动换行 */
        word-break: break-all;
        white-space: pre-wrap; /* 保留\n换行符，同时自动换行 */
        overflow-wrap: break-word; /* 兼容兜底 */
    }

    .sidebar-item:hover .detail {
        max-height: 120px;
        opacity: 1;
        padding-top: 8px;
        padding-bottom: 12px;
    }
</style>