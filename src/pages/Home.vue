<script setup>
import { ref } from 'vue'
import Activity from '../components/Activity.vue'
import AppSideBarr from '../components/AppSideBarr.vue'

const count = ref(0)
</script>

<template>
  <div class="main">
    <Activity />
      <div class="container">
        <div class="content">
          
        </div>
        <AppSideBarr />  
    </div>
  </div>
</template>

<style scoped> 
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
    height: 120rem;

    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-color: #F1F1F1;
    box-shadow: var(--el-box-shadow-light);
  }
</style>
