<template>
  <div class="monitoring-container">
    <!-- 顶部卡片 -->
    <el-row :gutter="24" class="monitor-cards">
      <el-col :span="6" v-for="card in dashboardCards" :key="card.title">
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <div class="monitor-card">
            <div class="card-icon" :class="card.status">
              <el-icon :size="24">
                <component :is="getCardIcon(card.title)" />
              </el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value" :class="card.status">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="24" class="chart-section">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="title">温度实时监控</span>
              <el-tag effect="plain" type="success">实时更新</el-tag>
            </div>
          </template>
          <div id="temperatureChart" style="height: 380px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="title">压力实时监控</span>
              <el-tag effect="plain" type="success">实时更新</el-tag>
            </div>
          </template>
          <div id="pressureChart" style="height: 380px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 报警记录 -->
    <el-card class="alert-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">报警记录</span>
            <el-tag effect="plain" type="danger" class="alert-count">
              {{ alertList.length }} 条未处理
            </el-tag>
          </div>
          <el-button type="primary" link>查看全部</el-button>
        </div>
      </template>
      <el-table 
        :data="alertList" 
        style="width: 100%" 
        :max-height="400"
        :row-class-name="getAlertRowClass"
      >
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="location" label="位置" width="180" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="value" label="数值" width="120" align="center" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="scope">
            <el-tag 
              :type="getAlertLevelType(scope.row.level)"
              :effect="scope.row.status === '未处理' ? 'light' : 'plain'"
              size="small"
            >
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag 
              :type="getAlertStatusType(scope.row.status)"
              :effect="scope.row.status === '未处理' ? 'light' : 'plain'"
              size="small"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link 
              size="small"
              :disabled="scope.row.status === '已处理'"
              @click="handleAlert(scope.row)"
            >
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 仪表板卡片数据
const dashboardCards = ref([
  { title: '当前温度', value: '25.6℃', status: 'normal' },
  { title: '当前压力', value: '1.02MPa', status: 'normal' },
  { title: '湿度', value: '45%', status: 'warning' },
  { title: '设备状态', value: '运行中', status: 'normal' }
])

// 报警记录数据
const alertList = ref([
  {
    time: '2024-03-20 10:00:00',
    location: '储存区A',
    type: '温度异常',
    level: '警告',
    status: '已处理'
  },
  {
    time: '2024-03-20 09:30:00',
    location: '生产区B',
    type: '压力异常',
    level: '危险',
    status: '处理中'
  }
])

// 图表实例
let temperatureChart: echarts.ECharts | null = null
let pressureChart: echarts.ECharts | null = null

// 初始化温度图表
const initTemperatureChart = () => {
  const chartDom = document.getElementById('temperatureChart')
  if (!chartDom) return
  
  temperatureChart = echarts.init(chartDom)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '温度(℃)',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '温度',
      type: 'line',
      smooth: true,
      data: generateMockData()
    }]
  }
  temperatureChart.setOption(option)
}

// 初始化压力图表
const initPressureChart = () => {
  const chartDom = document.getElementById('pressureChart')
  if (!chartDom) return
  
  pressureChart = echarts.init(chartDom)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      name: '压力(MPa)',
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [{
      name: '压力',
      type: 'line',
      smooth: true,
      data: generateMockData()
    }]
  }
  pressureChart.setOption(option)
}

// 生成模拟数据
const generateMockData = () => {
  const now = new Date().getTime()
  const data = []
  for (let i = -20; i <= 0; i++) {
    data.push([
      now + i * 1000,
      Math.random() * 10 + 20
    ])
  }
  return data
}

// 获取报警等级样式
const getAlertLevelType = (level: string): 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    normal: 'success',
    warning: 'warning',
    error: 'danger'
  }
  return typeMap[level] || 'info'
}

// 获取报警状态样式
const getAlertStatusType = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
  const typeMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    '已处理': 'success',
    '处理中': 'warning',
    '未处理': 'danger'
  }
  return typeMap[status] || 'info'
}

// 定时更新数据
let updateTimer: ReturnType<typeof setInterval>
const updateChartData = () => {
  if (temperatureChart && pressureChart) {
    // 更新温度图表
    const temperatureData = generateMockData()
    temperatureChart.setOption({
      series: [{
        data: temperatureData
      }]
    })

    // 更新压力图表
    const pressureData = generateMockData()
    pressureChart.setOption({
      series: [{
        data: pressureData
      }]
    })
  }
}

// 添加图标映射函数
const getCardIcon = (title: string) => {
  const iconMap: Record<string, string> = {
    '当前温度': 'Thermometer',
    '当前压力': 'Odometer',
    '湿度': 'Sunny',
    '设备状态': 'Monitor'
  }
  return iconMap[title] || 'More'
}

// 添加报警行样式
const getAlertRowClass = (row: any) => {
  return row.status === '未处理' ? 'warning-row' : ''
}

const handleAlert = (row: any) => {
  // TODO: 处理报警的逻辑
  console.log('处理报警', row)
}

onMounted(() => {
  initTemperatureChart()
  initPressureChart()
  updateTimer = setInterval(updateChartData, 3000)
})

onUnmounted(() => {
  clearInterval(updateTimer)
  temperatureChart?.dispose()
  pressureChart?.dispose()
})
</script>

<style scoped lang="scss">
.monitoring-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);

  .monitor-cards {
    margin-bottom: 24px;

    .monitor-card {
      display: flex;
      align-items: center;
      gap: 20px;

      .card-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        
        &.normal { 
          background-color: #f0f9eb;
          color: #67c23a;
          &:hover { background-color: #e1f3d8; }
        }
        &.warning { 
          background-color: #fdf6ec;
          color: #e6a23c;
          &:hover { background-color: #faecd8; }
        }
        &.danger { 
          background-color: #fef0f0;
          color: #f56c6c;
          &:hover { background-color: #fde2e2; }
        }
      }

      .card-info {
        flex: 1;

        .card-title {
          font-size: 14px;
          color: #606266;
          margin-bottom: 8px;
        }

        .card-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          
          &.normal { color: #67c23a; }
          &.warning { color: #e6a23c; }
          &.danger { color: #f56c6c; }
        }
      }
    }
  }

  .chart-section {
    margin-bottom: 24px;

    .chart-card {
      height: 100%;
    }
  }

  .alert-card {
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .alert-count {
        font-size: 12px;
      }
    }
  }

  :deep(.el-card) {
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0,21,41,.12);
    }
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  :deep(.el-table) {
    .warning-row {
      --el-table-tr-bg-color: var(--el-color-danger-light-9);
    }

    .el-table__row {
      transition: background-color 0.3s;
    }
  }
}
</style> 