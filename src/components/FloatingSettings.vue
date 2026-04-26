<template>
  <div class="floating-settings" @mouseenter="menuVisible = true" @mouseleave="menuVisible = false">
    <transition name="slide">
      <div v-show="menuVisible" class="settings-menu">
        <div class="menu-item">
          <span>樱花效果</span>
          <el-switch :model-value="settingsStore.sakuraEnabled" @change="settingsStore.toggleSakura()" />
        </div>
        <div class="menu-item">
          <span>暗色模式</span>
          <el-switch :model-value="settingsStore.darkMode" @change="settingsStore.toggleDarkMode()" />
        </div>
      </div>
    </transition>
    <div class="settings-icon">
      <el-icon :size="20"><Setting /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()
const menuVisible = ref(false)
</script>

<style scoped>
.floating-settings {
  position: fixed;
  right: 16px;
  top: 90%;
  transform: translateY(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
}

.settings-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: var(--shadow-sm);
}

.settings-icon:hover {
  transform: scale(1.1) rotate(30deg);
  box-shadow: var(--shadow-md);
}

.settings-menu {
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-size: 14px;
  color: var(--color-text);
}

/* 滑入动画 */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(10px);
}
</style>
