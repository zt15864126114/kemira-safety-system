<template>
  <div class="inspection-report">
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
        <el-form-item label="巡检区域">
          <el-select v-model="searchForm.area" placeholder="请选择">
            <el-option v-for="area in areas" :key="area" :label="area" :value="area" />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检人员">
          <el-select v-model="searchForm.inspector" placeholder="请选择">
            <el-option v-for="inspector in inspectors" :key="inspector" :label="inspector" :value="inspector" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="stat in statistics" :key="stat.title">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-trend" :class="stat.trend">
              {{ stat.trend === 'up' ? '↑' : '↓' }} {{ stat.change }}%
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 图表展示 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>巡检完成情况</span>
              <el-select v-model="completionChartType" size="small">
                <el-option label="周统计" value="week" />
                <el-option label="月统计" value="month" />
              </el-select>
            </div>
          </template>
          <div ref="completionChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>问题分布统计</span>
              <el-select v-model="issueChartType" size="small">
                <el-option label="按区域" value="area" />
                <el-option label="按类型" value="type" />
              </el-select>
            </div>
          </template>
          <div ref="issueChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 巡检报告列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>巡检报告列表</span>
          <el-button type="primary" @click="exportReports">导出报告</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="area" label="巡检区域" width="120" />
        <el-table-column prop="inspector" label="巡检人员" width="120" />
        <el-table-column prop="checkPoints" label="检查点数" width="100" />
        <el-table-column prop="duration" label="耗时" width="100" />
        <el-table-column prop="issues" label="发现问题" width="100" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewReport(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="downloadReport(scope.row)">下载</el-button>
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

    <!-- 报告详情对话框 -->
    <el-dialog
      v-model="reportDialogVisible"
      title="巡检报告详情"
      width="70%"
    >
      <report-detail v-if="reportDialogVisible" :report="currentReport" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import ReportDetail from './components/ReportDetail.vue'

// 工具函数
const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getStatusType = (status) => {
  const statusMap = {
    '已完成': 'success',
    '进行中': 'warning',
    '已超时': 'danger',
    '待执行': 'info'
  }
  return statusMap[status] || 'info'
}

// 状态变量
const searchForm = ref({
  dateRange: [],
  area: '',
  inspector: ''
})

const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const completionChartType = ref('week')
const issueChartType = ref('area')
const completionChartRef = ref(null)
const issueChartRef = ref(null)
let completionChart = null
let issueChart = null
const reportDialogVisible = ref(false)
const currentReport = ref(null)

// 基础数据
const areas = ref(['生产区A', '生产区B', '储存区A', '储存区B', '包装区'])
const inspectors = ref(['张明华', '李志强', '王建国', '赵秀芳', '陈志明'])

// 统计数据
const statistics = ref([
  { title: '巡检总数', value: 128, trend: 'up', change: 15 },
  { title: '问题数量', value: 12, trend: 'down', change: 8 },
  { title: '平均耗时', value: '42分钟', trend: 'down', change: 5 },
  { title: '完成率', value: '96%', trend: 'up', change: 3 }
])

// 生成模拟数据
const generateMockReports = () => {
  const reports = []
  const now = new Date()
  
  for (let i = 0; i < 50; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const startTime = '09:00:00'
    const duration = Math.floor(Math.random() * 60) + 30
    
    reports.push({
      date: formatDate(date),
      startTime,
      endTime: '10:30:00',
      area: areas.value[Math.floor(Math.random() * areas.value.length)],
      inspector: inspectors.value[Math.floor(Math.random() * inspectors.value.length)],
      checkPoints: Math.floor(Math.random() * 5) + 5,
      duration: duration,
      issues: Math.floor(Math.random() * 5),
      status: ['已完成', '进行中', '已超时', '待执行'][Math.floor(Math.random() * 4)],
      route: [
        { name: '入口处', time: '09:00' },
        { name: '设备区A', time: '09:15' },
        { name: '储存区', time: '09:30' },
        { name: '包装区', time: '09:45' },
        { name: '出口处', time: '10:00' }
      ],
      issueList: [
        {
          location: '设备区A',
          type: '设备故障',
          description: '设备运行异常，需要维修',
          level: '警告',
          status: '处理中'
        }
      ],
      images: [
        'https://placeholder.co/400x300',
        'https://placeholder.co/400x300'
      ],
      remarks: '巡检过程正常，发现部分设备需要维护。'
    })
  }
  
  return reports
}

// 初始化数据
const allReports = ref(generateMockReports())
const tableData = ref([])

// 初始化完成情况图表
const initCompletionChart = () => {
  if (!completionChartRef.value) return
  
  if (completionChart) {
    completionChart.dispose()
  }
  
  completionChart = echarts.init(completionChartRef.value)
  const option = {
    title: {
      text: '巡检完成情况'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['计划巡检', '实际完成']
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '计划巡检',
        type: 'bar',
        data: [10, 12, 8, 9, 11, 8, 7]
      },
      {
        name: '实际完成',
        type: 'bar',
        data: [9, 11, 8, 9, 10, 7, 7]
      }
    ]
  }
  completionChart.setOption(option)
}

// 初始化问题分布图表
const initIssueChart = () => {
  if (!issueChartRef.value) return
  
  if (issueChart) {
    issueChart.dispose()
  }
  
  issueChart = echarts.init(issueChartRef.value)
  const option = {
    title: {
      text: '问题分布统计'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '问题分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 5, name: '生产区A' },
          { value: 3, name: '生产区B' },
          { value: 2, name: '储存区A' },
          { value: 1, name: '储存区B' },
          { value: 1, name: '包装区' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  issueChart.setOption(option)
}

// 搜索处理
const handleSearch = () => {
  loading.value = true
  
  // 过滤数据
  let filteredData = [...allReports.value]
  
  // 按时间范围过滤
  if (searchForm.value.dateRange?.length === 2) {
    const [startDate, endDate] = searchForm.value.dateRange
    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.date)
      const start = new Date(startDate)
      const end = new Date(endDate)
      // 重置时间部分，只比较日期
      itemDate.setHours(0, 0, 0, 0)
      start.setHours(0, 0, 0, 0)
      end.setHours(0, 0, 0, 0)
      return itemDate >= start && itemDate <= end
    })
  }
  
  // 按区域过滤
  if (searchForm.value.area) {
    filteredData = filteredData.filter(item => 
      item.area === searchForm.value.area
    )
  }
  
  // 按巡检人员过滤
  if (searchForm.value.inspector) {
    filteredData = filteredData.filter(item => 
      item.inspector === searchForm.value.inspector
    )
  }
  
  // 更新总数
  total.value = filteredData.length
  
  // 分页处理
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  
  // 更新统计数据
  updateStatistics(filteredData)
  
  // 更新图表
  updateCharts(filteredData)
  
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 添加统计数据更新函数
const updateStatistics = (data) => {
  const totalInspections = data.length
  const totalIssues = data.reduce((sum, item) => sum + item.issues, 0)
  const avgDuration = Math.round(data.reduce((sum, item) => {
    return sum + parseInt(item.duration)
  }, 0) / data.length)
  const completedCount = data.filter(item => item.status === '已完成').length
  const completionRate = Math.round((completedCount / totalInspections) * 100)

  statistics.value = [
    { 
      title: '巡检总数', 
      value: totalInspections, 
      trend: 'up', 
      change: 15 
    },
    { 
      title: '问题数量', 
      value: totalIssues, 
      trend: totalIssues > 12 ? 'up' : 'down', 
      change: 8 
    },
    { 
      title: '平均耗时', 
      value: `${avgDuration}分钟`, 
      trend: avgDuration > 42 ? 'up' : 'down', 
      change: 5 
    },
    { 
      title: '完成率', 
      value: `${completionRate}%`, 
      trend: completionRate > 95 ? 'up' : 'down', 
      change: 3 
    }
  ]
}

// 添加图表更新函数
const updateCharts = (data) => {
  // 更新完成情况图表
  if (completionChart) {
    const chartData = processCompletionData(data)
    completionChart.setOption({
      series: [
        {
          name: '计划巡检',
          data: chartData.planned
        },
        {
          name: '实际完成',
          data: chartData.completed
        }
      ]
    })
  }

  // 更新问题分布图表
  if (issueChart) {
    const issueData = processIssueData(data)
    issueChart.setOption({
      series: [{
        data: issueData
      }]
    })
  }
}

// 添加图表数据处理函数
const processCompletionData = (data) => {
  // 根据 completionChartType 处理数据
  const result = {
    planned: [10, 12, 8, 9, 11, 8, 7],
    completed: [9, 11, 8, 9, 10, 7, 7]
  }
  return result
}

const processIssueData = (data) => {
  // 根据 issueChartType 处理数据
  const areaIssues = {}
  data.forEach(item => {
    if (!areaIssues[item.area]) {
      areaIssues[item.area] = 0
    }
    areaIssues[item.area] += item.issues
  })

  return Object.entries(areaIssues).map(([name, value]) => ({
    name,
    value
  }))
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    dateRange: [],
    area: '',
    inspector: ''
  }
  currentPage.value = 1
  handleSearch()
}

// 查看报告
const viewReport = (report) => {
  currentReport.value = report
  reportDialogVisible.value = true
}

// 下载报告
const downloadReport = (report) => {
  // 这里可以实现具体的下载逻辑
  console.log('下载报告:', report)
}

// 导出报告
const exportReports = () => {
  loading.value = true
  
  try {
    // 准备导出数据
    const exportData = tableData.value.map(item => ({
      '日期': item.date,
      '巡检区域': item.area,
      '巡检人员': item.inspector,
      '检查点数': item.checkPoints,
      '耗时': item.duration,
      '发现问题': item.issues,
      '状态': item.status
    }))
    
    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // 设置列宽
    const colWidths = [
      { wch: 12 }, // 日期
      { wch: 10 }, // 区域
      { wch: 10 }, // 人员
      { wch: 10 }, // 检查点
      { wch: 10 }, // 耗时
      { wch: 10 }, // 问题
      { wch: 10 }  // 状态
    ]
    ws['!cols'] = colWidths
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '巡检报告')
    
    // 导出文件
    XLSX.writeFile(wb, `巡检报告_${formatDate(new Date())}.xlsx`)
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

// 监听窗口大小变化
const handleResize = () => {
  completionChart?.resize()
  issueChart?.resize()
}

// 生命周期钩子
onMounted(() => {
  handleSearch()
  initCompletionChart()
  initIssueChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  completionChart?.dispose()
  issueChart?.dispose()
  window.removeEventListener('resize', handleResize)
})

// 监听图表类型变化
watch(completionChartType, () => {
  initCompletionChart()
})

watch(issueChartType, () => {
  initIssueChart()
})
</script>

<style scoped>
.inspection-report {
  padding: 20px;
}

.search-card,
.stat-cards,
.chart-row,
.table-card {
  margin-bottom: 20px;
}

.stat-cards {
  margin-top: 20px;
}

.stat-card {
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-title {
  color: #666;
  margin-bottom: 10px;
}

.stat-trend {
  font-size: 14px;
  &.up {
    color: #67c23a;
  }
  &.down {
    color: #f56c6c;
  }
}

.chart-container {
  height: 300px;
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