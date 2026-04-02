<template>
  <div class="sidebar-bar">
  </div>
</template>

<script setup>
  import { ref } from 'vue'

</script>

<style scoped>
  .sidebar-bar {
    height: 40rem;
    width: 18rem;
    background-color: #f5f5f5;
    box-shadow: var(--el-box-shadow-light);

    /* position: fixed;
    top: 50%;
    transform: translate(0, -50%);
    right: 0; */

    position: sticky;
    top: 5rem;
    left: 0;
    z-index: 99;
  }
  
  @media (max-width: 768px) {
    .sidebar-bar {
      display: none;
    }
  }


</style>
