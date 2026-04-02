<template>
  <div class="channel" :class="{ active: active }" @click="navigateToChat">
    <div class="channel-icon">{{ channel.icon }}</div>
    <div class="channel-info">
      <h3 class="channel-name">{{ channel.name }}</h3>
      <p class="channel-description">{{ channel.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  channel: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const navigateToChat = () => {
  router.push({ name: 'chat', params: { channelId: props.channel.id } })
}
</script>

<style scoped>
@import '../styles/forum.css';
</style>