<template>
  <div class="roll">
    <el-carousel height="300px"  :interval="3000" indicator-position="inside">
        <el-carousel-item>
        <div class="carousel-item" style="background-color: lightblue;">第1页内容</div>
        </el-carousel-item>
        <el-carousel-item>
        <div class="carousel-item" style="background-color: lightgreen;">第2页内容</div>
        </el-carousel-item>
        <el-carousel-item>
        <div class="carousel-item" style="background-color: lightyellow;">第3页内容</div>
        </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
</script>

<style scoped>
    :deep(.el-carousel) {
        border-radius: 0px; /* 圆角大小 */
        overflow: hidden;    /* 必须加！否则圆角不生效 */
        box-shadow: var(--el-box-shadow-light);

        @media (max-width: 768px) {
            height: 200px;
        }
    }
    .carousel-item {
        width: 100%;
        height: 100%;
        background: #409eff;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }
</style>
