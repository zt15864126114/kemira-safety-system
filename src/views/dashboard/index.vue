<template>
  <div class="dashboard">
    <!-- 测试区域 -->
    <el-card class="chart-card">
      <div ref="chartContainer" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// 使用 Vite 的动态导入
const echarts = await import('echarts')

const chartContainer = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartContainer.value) {
    console.error('Chart container not found')
    return
  }

  try {
    // 销毁已存在的实例
    if (chartInstance) {
      chartInstance.dispose()
    }

    // 创建新实例
    chartInstance = echarts.init(chartContainer.value)
    
    // 简单的配置
    const option = {
      grid: {
        top: 30,
        right: 30,
        bottom: 30,
        left: 40,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    }

    // 设置配置项
    chartInstance.setOption(option)
    
    console.log('Chart initialized successfully')
  } catch (error) {
    console.error('Chart initialization failed:', error)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

onMounted(() => {
  console.log('Component mounted')
  console.log('Chart container:', chartContainer.value)
  
  // 使用 setTimeout 确保 DOM 已完全渲染
  setTimeout(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  }, 300)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  width: 100%;
  height: 400px;
  background-color: #fff;
}
</style> 