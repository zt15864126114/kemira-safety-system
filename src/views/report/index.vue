<template>
  <div class="report-container">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

onMounted(() => {
  console.log('Report index mounted')
})
</script>

<style scoped>
.report-container {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style> 