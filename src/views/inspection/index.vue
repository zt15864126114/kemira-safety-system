<template>
  <div class="inspection-container">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  console.log('Inspection index mounted, current path:', route.path)
})

onUnmounted(() => {
  console.log('Inspection index unmounted')
})
</script>

<style scoped>
.inspection-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style> 