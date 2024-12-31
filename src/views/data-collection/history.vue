<template>
  <div class="history-data">
    <!-- 搜索条件 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="searchForm.type" placeholder="请选择">
            <el-option label="温度" value="temperature" />
            <el-option label="湿度" value="humidity" />
            <el-option label="压力" value="pressure" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 历史趋势图 -->
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>历史数据趋势</span>
          <el-radio-group v-model="chartType" size="small">
            <el-radio-button label="line">折线图</el-radio-button>
            <el-radio-button label="bar">柱状图</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
    </el-card>

    <!-- 历史数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>历史数据列表</span>
          <el-button type="primary" @click="exportData">导出数据</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="value" label="数值" width="120" />
        <el-table-column prop="unit" label="单位" width="100" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'

// 工具函数
const formatDateTime = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
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

// 模拟历史数据生成
const generateHistoricalData = () => {
  const data = []
  const now = new Date()
  const types = ['温度', '湿度', '压力']
  const units = { '温度': '°C', '湿度': '%', '压力': 'MPa' }
  
  // 生成最近7天的数据，每天8个时间点
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    
    for (let hour = 8; hour <= 22; hour += 2) {
      const timestamp = new Date(date)
      timestamp.setHours(hour, 0, 0, 0)
      
      types.forEach(type => {
        let value, status
        switch (type) {
          case '温度':
            value = (Math.random() * 5 + 20).toFixed(1)
            status = value > 24 ? '警告' : '正常'
            break
          case '湿度':
            value = Math.round(Math.random() * 20 + 50)
            status = value > 70 ? '警告' : value > 75 ? '异常' : '正常'
            break
          case '压力':
            value = (Math.random() * 0.5 + 1).toFixed(1)
            status = value < 1.0 ? '警告' : '正常'
            break
        }
        
        data.push({
          timestamp: formatDateTime(timestamp),
          type,
          value,
          unit: units[type],
          status
        })
      })
    }
  }
  
  return data
}

// 状态变量
const searchForm = ref({
  dateRange: [],
  type: ''
})

const chartRef = ref(null)
const chartType = ref('line')
let chart = null
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 数据
const allData = ref(generateHistoricalData())
const tableData = ref([])

// 搜索处理
const handleSearch = () => {
  loading.value = true
  
  // 过滤数据
  let filteredData = [...allData.value]
  
  // 按时间范围过滤
  if (searchForm.value.dateRange?.length === 2) {
    const [startDate, endDate] = searchForm.value.dateRange
    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.timestamp)
      return itemDate >= startDate && itemDate <= endDate
    })
  }
  
  // 按类型过滤
  if (searchForm.value.type) {
    const typeMap = {
      'temperature': '温度',
      'humidity': '湿度',
      'pressure': '压力'
    }
    filteredData = filteredData.filter(item => 
      item.type === typeMap[searchForm.value.type]
    )
  }
  
  // 更新总数
  total.value = filteredData.length
  
  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  
  // 更新图表
  initChart(filteredData)
  
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    dateRange: [],
    type: ''
  }
  currentPage.value = 1
  handleSearch()
}

// 导出数据
const exportData = () => {
  loading.value = true
  
  try {
    // 准备导出数据
    const exportData = tableData.value.map(item => ({
      '时间': item.timestamp,
      '类型': item.type,
      '数值': item.value + item.unit,
      '状态': item.status
    }))
    
    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // 设置列宽
    const colWidths = [
      { wch: 20 }, // 时间
      { wch: 10 }, // 类型
      { wch: 10 }, // 数值
      { wch: 10 }  // 状态
    ]
    ws['!cols'] = colWidths
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '历史数据')
    
    // 导出文件
    XLSX.writeFile(wb, `历史数据_${formatDateTime(new Date())}.xlsx`)
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
  
  loading.value = false
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

// 初始化图表
const initChart = async (data = tableData.value) => {
  if (!chartRef.value) return
  
  await nextTick()
  
  if (chart) {
    chart.dispose()
  }
  
  chart = echarts.init(chartRef.value)
  
  // 处理图表数据
  const timestamps = [...new Set(data.map(item => item.timestamp))].sort()
  const temperatureData = []
  const humidityData = []
  const pressureData = []
  
  timestamps.forEach(timestamp => {
    const items = data.filter(item => item.timestamp === timestamp)
    const temp = items.find(item => item.type === '温度')
    const humidity = items.find(item => item.type === '湿度')
    const pressure = items.find(item => item.type === '压力')
    
    temperatureData.push(temp ? parseFloat(temp.value) : null)
    humidityData.push(humidity ? parseFloat(humidity.value) : null)
    pressureData.push(pressure ? parseFloat(pressure.value) : null)
  })
  
  const option = {
    title: {
      text: '历史数据趋势'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>'
        params.forEach(param => {
          if (param.value !== null) {
            result += param.seriesName + ': ' + param.value + 
              (param.seriesName === '温度' ? '°C' : 
               param.seriesName === '湿度' ? '%' : 'MPa') + '<br/>'
          }
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
      type: 'category',
      data: timestamps,
      axisLabel: {
        formatter: (value) => value.split(' ')[1]
      }
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
        type: chartType.value,
        data: temperatureData,
        yAxisIndex: 0
      },
      {
        name: '湿度',
        type: chartType.value,
        data: humidityData,
        yAxisIndex: 1
      },
      {
        name: '压力',
        type: chartType.value,
        data: pressureData,
        yAxisIndex: 2
      }
    ]
  }
  
  chart.setOption(option)
}

// 监听图表类型变化
watch(chartType, () => {
  initChart()
})

// 监听窗口大小变化
const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  handleSearch()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.history-data {
  padding: 20px;
}

.search-card,
.chart-card,
.table-card {
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

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style> 