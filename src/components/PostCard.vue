<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  date: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="post-card">
    <div class="card-image">
      <img :src="imageUrl" :alt="title">
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-info">{{ info }}</p>
      <div class="card-meta">
        <span v-if="date" class="meta-item">{{ date }}</span>
        <span v-if="location" class="meta-item">{{ location }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../styles/postcard.css';
</style>