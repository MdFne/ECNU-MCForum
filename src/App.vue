<script setup>
import AppHeader from './components/AppHeader.vue'
import FloatingSettings from './components/FloatingSettings.vue'
import { useSettingsStore } from './stores/settings'
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.init()
})
</script>

<template>
    <AppHeader />
    <RouterView />
    <FloatingSettings />
</template>

<style scoped>

</style>
