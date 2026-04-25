<template>
  <div class="sakura-container" aria-hidden="true">
    <div
      v-for="petal in petals"
      :key="petal.id"
      class="petal-fall"
      :style="{
        left: petal.left + '%',
        animationDuration: petal.duration + 's',
        animationDelay: petal.delay + 's',
      }"
    >
      <div
        class="petal"
        :style="{
          width: petal.size + 'px',
          height: petal.size + 'px',
          background: petal.color,
          animationDuration: petal.swayDuration + 's',
          animationDelay: petal.swayDelay + 's',
          '--sway': petal.sway + 'px',
          '--rotate': petal.rotate + 'deg',
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const petals = ref([])
let resizeHandler = null

const colors = [
  'radial-gradient(ellipse at 30% 30%, #ffc0cb, #ff9eae 60%, transparent)',
  'radial-gradient(ellipse at 30% 30%, #ffb7c5, #ff8fa3 60%, transparent)',
  'radial-gradient(ellipse at 30% 30%, #ffd6e0, #ffb7c5 60%, transparent)',
  'radial-gradient(ellipse at 30% 30%, #ffffff, #ffc0cb 60%, transparent)',
]

function getPetalCount() {
  const width = window.innerWidth
  if (width < 480) return 10
  if (width < 768) return 15
  if (width < 1024) return 20
  return 28
}

function generatePetals() {
  const count = getPetalCount()
  return Array.from({ length: count }, (_, i) => {
    // 左右二选一：左 0~35% / 右 65~100%
    const left = Math.random() < 0.5 
      ? Math.random() * 35 
      : 65 + Math.random() * 35

    return {
      id: i,
      left,
      size: Math.random() * 10 + 8,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * -20,
      sway: Math.random() * 60 + 15,       // 15~75px 摇摆幅度
      swayDuration: Math.random() * 4 + 2,  // 2~6s 摇摆周期
      swayDelay: Math.random() * -5,
      rotate: Math.random() * 60 + 20,      // 20~80deg 旋转幅度
      color: colors[Math.floor(Math.random() * colors.length)],
    }
  })
}

onMounted(() => {
  petals.value = generatePetals()
  resizeHandler = () => { petals.value = generatePetals() }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.sakura-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.petal-fall {
  position: absolute;
  top: -20px;
  animation: fall linear infinite;
}

.petal {
  border-radius: 50% 0 50% 0;
  opacity: 0.8;
  animation: sway ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes fall {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(calc(100vh + 40px));
  }
}

@keyframes sway {
  from {
    transform: translateX(calc(var(--sway) * -1)) rotate(calc(var(--rotate) * -1));
  }
  to {
    transform: translateX(var(--sway)) rotate(var(--rotate));
  }
}
</style>
