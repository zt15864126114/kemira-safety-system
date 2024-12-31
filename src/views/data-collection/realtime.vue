<template>
  <div class="realtime-data">
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>实时数据监控</span>
          <el-radio-group v-model="timeRange" size="small">
            <el-radio-button label="1h">1小时</el-radio-button>
            <el-radio-button label="6h">6小时</el-radio-button>
            <el-radio-button label="24h">24小时</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <!-- 实时数据表格 -->
    <el-card class="data-card">
      <template #header>
        <div class="card-header">
          <span>实时数据列表</span>
          <el-button type="primary" size="small" @click="refreshData">刷新数据</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column label="数值" width="120">
          <template #default="scope">
            {{ scope.row.value }}{{ scope.row.unit }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'

const timeRange = ref('1h')
const chartRef = ref(null)
let chart = null
const loading = ref(false)

// 模拟数据
const tableData = ref([
  // 10:00:00 的数据
  {
    timestamp: '2024-03-20 10:00:00',
    value: '23.5',
    type: '温度',
    unit: '°C',
    status: '正常'
  },
  {
    timestamp: '2024-03-20 10:00:00',
    value: '65',
    type: '湿度',
    unit: '%',
    status: '警告'
  },
  {
    timestamp: '2024-03-20 10:00:00',
    value: '1.2',
    type: '压力',
    unit: 'MPa',
    status: '正常'
  },
  // 09:55:00 的数据
  {
    timestamp: '2024-03-20 09:55:00',
    value: '23.8',
    type: '温度',
    unit: '°C',
    status: '正常'
  },
  {
    timestamp: '2024-03-20 09:55:00',
    value: '67',
    type: '湿度',
    unit: '%',
    status: '警告'
  },
  {
    timestamp: '2024-03-20 09:55:00',
    value: '1.1',
    type: '压力',
    unit: 'MPa',
    status: '正常'
  },
  // 09:50:00 的数据
  {
    timestamp: '2024-03-20 09:50:00',
    value: '24.2',
    type: '温度',
    unit: '°C',
    status: '警告'
  },
  {
    timestamp: '2024-03-20 09:50:00',
    value: '70',
    type: '湿度',
    unit: '%',
    status: '异常'
  },
  {
    timestamp: '2024-03-20 09:50:00',
    value: '1.3',
    type: '压力',
    unit: 'MPa',
    status: '正常'
  },
  // 09:45:00 的数据
  {
    timestamp: '2024-03-20 09:45:00',
    value: '22.9',
    type: '温度',
    unit: '°C',
    status: '正常'
  },
  {
    timestamp: '2024-03-20 09:45:00',
    value: '63',
    type: '湿度',
    unit: '%',
    status: '正常'
  },
  {
    timestamp: '2024-03-20 09:45:00',
    value: '1.0',
    type: '压力',
    unit: 'MPa',
    status: '警告'
  }
])

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    setTimeout(() => {
      chart = echarts.init(chartRef.value)
      const data = generateData()

      const option = {
        title: {
          text: '实时数据趋势'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let result = params[0].axisValue + '<br/>'
            params.forEach(param => {
              result += param.seriesName + ': ' + param.value[1] +
                  (param.seriesName === '温度' ? '°C' :
                      param.seriesName === '湿度' ? '%' : 'MPa') + '<br/>'
            })
            return result
          }
        },
        legend: {
          data: ['温度', '湿度', '压力']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          boundaryGap: false
        },
        yAxis: [
          {
            type: 'value',
            name: '温度(°C)',
            min: 15,
            max: 30,
            position: 'left'
          },
          {
            type: 'value',
            name: '湿度(%)',
            min: 40,
            max: 80,
            position: 'right',
            offset: 0
          },
          {
            type: 'value',
            name: '压力(MPa)',
            min: 0.5,
            max: 2.0,
            position: 'right',
            offset: 80
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {
              opacity: 0.1
            },
            data: data.temperature
          },
          {
            name: '湿度',
            type: 'line',
            smooth: true,
            symbol: 'none',
            yAxisIndex: 1,
            areaStyle: {
              opacity: 0.1
            },
            data: data.humidity
          },
          {
            name: '压力',
            type: 'line',
            smooth: true,
            symbol: 'none',
            yAxisIndex: 2,
            areaStyle: {
              opacity: 0.1
            },
            data: data.pressure
          }
        ]
      }

      chart.setOption(option)
    }, 0)
  }
}

// 生成模拟数据
const generateData = () => {
  const now = new Date()
  const data = {
    temperature: [],
    humidity: [],
    pressure: []
  }

  for (let i = 0; i < 100; i++) {
    const time = new Date(now - i * 1000 * 60) // 每分钟一个数据点

    data.temperature.unshift([
      time,
      Math.round((Math.random() * 5 + 20) * 10) / 10 // 20-25度之间
    ])

    data.humidity.unshift([
      time,
      Math.round(Math.random() * 20 + 50) // 50-70%之间
    ])

    data.pressure.unshift([
      time,
      Math.round((Math.random() * 0.5 + 1) * 10) / 10 // 1.0-1.5之间
    ])
  }

  return data
}

// 获取状态样式
const getStatusType = (status) => {
  const statusMap = {
    '正常': 'success',
    '警告': 'warning',
    '异常': 'danger'
  }
  return statusMap[status] || 'info'
}

// 格式化时间
const formatDateTime = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 刷新数据
const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    // 生成新的一组数据
    const now = new Date()
    const newData = [
      {
        timestamp: formatDateTime(now),
        value: (Math.random() * 5 + 20).toFixed(1),
        type: '温度',
        unit: '°C',
        status: '正常'
      },
      {
        timestamp: formatDateTime(now),
        value: Math.round(Math.random() * 20 + 50),
        type: '湿度',
        unit: '%',
        status: Math.random() > 0.5 ? '正常' : '警告'
      },
      {
        timestamp: formatDateTime(now),
        value: (Math.random() * 0.5 + 1).toFixed(1),
        type: '压力',
        unit: 'MPa',
        status: '正常'
      }
    ]

    // 添加新数据到表格开头
    tableData.value = [...newData, ...tableData.value.slice(0, -3)]

    // 更新图表
    initChart()
    loading.value = false
  }, 1000)
}

// 监听时间范围变化
watch(timeRange, () => {
  initChart()
})

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.realtime-data {
  padding: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-card {
  margin-top: 20px;
}
</style>