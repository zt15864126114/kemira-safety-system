<template>
  <el-container>
    <el-aside width="200px">
      <el-menu default-active="1">
        <el-menu-item index="1">实时数据监控</el-menu-item>
        <el-menu-item index="2">历史数据分析</el-menu-item>
        <el-menu-item index="3">数据趋势图表</el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-main>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <template #header>温度监控</template>
            <div ref="tempChart" style="height: 300px"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>压力监控</template>
            <div ref="pressureChart" style="height: 300px"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>湿度监控</template>
            <div ref="humidityChart" style="height: 300px"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const tempChart = ref(null)
const pressureChart = ref(null)
const humidityChart = ref(null)

// 模拟实时数据
const generateData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.random() * 100
  }))
}

const initChart = (el, title, data) => {
  const chart = echarts.init(el)
  chart.setOption({
    title: { text: title },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.map(item => item.time)
    },
    yAxis: { type: 'value' },
    series: [{
      data: data.map(item => item.value),
      type: 'line'
    }]
  })
  
  // 模拟实时更新
  setInterval(() => {
    const newData = generateData()
    chart.setOption({
      xAxis: { data: newData.map(item => item.time) },
      series: [{ data: newData.map(item => item.value) }]
    })
  }, 3000)
}

onMounted(() => {
  initChart(tempChart.value, '温度变化', generateData())
  initChart(pressureChart.value, '压力变化', generateData())
  initChart(humidityChart.value, '湿度变化', generateData())
})
</script> 