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
  router.push(`/forum/${props.channel.id}`)
}
</script>

<style scoped>
.channel {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.channel:hover {
  background-color: var(--color-bg-hover);
  transform: translateX(5px);
}

.channel.active {
  background-color: #cce5ff;
  border-left: 4px solid var(--color-primary);
  transform: translateX(5px);
}

/* .channel.active {
  background-color: #8dc6ff;
} */

.channel-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
}

.channel-info {
  flex: 1;
}

.channel-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.channel-description {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

@media(max-width: 768px) {
  .channel {
    width: 2rem;
    padding: 12px;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  }

  .channel.active {
    border: none;
    /* transform: translate(0, -5px); */
    transform: translateX(0px);
    width: 4rem;
    transition: all 0.3s linear-in-out;
    background-color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .channel-info {
    display: none;
  }

  .channel-icon {
    width: 30px;
    height: 30px;
    margin: 0;
  }
}
</style>