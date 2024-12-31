<template>
  <div class="data-analysis">
    <!-- 统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="statistics-card">
          <div class="card-content">
            <div class="card-title">巡检完成率</div>
            <div class="card-value">{{ statisticsData.inspectionCompletion.rate }}</div>
            <div class="card-trend" :class="statisticsData.inspectionCompletion.trend">
              <el-icon>
                <component :is="statisticsData.inspectionCompletion.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
              较上周{{ statisticsData.inspectionCompletion.lastWeek }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="statistics-card">
          <div class="card-content">
            <div class="card-title">问题发现数</div>
            <div class="card-value">{{ statisticsData.issuesFound.total }}</div>
            <div class="card-trend" :class="statisticsData.issuesFound.trend">
              <el-icon>
                <component :is="statisticsData.issuesFound.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
              较上周{{ statisticsData.issuesFound.lastWeek }}个
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="statistics-card">
          <div class="card-content">
            <div class="card-title">平均处理时长</div>
            <div class="card-value">{{ statisticsData.averageTime.resolution.average }}</div>
            <div class="card-trend" :class="statisticsData.averageTime.trend">
              <el-icon>
                <component :is="statisticsData.averageTime.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
              效率提升{{ statisticsData.averageTime.improvement }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="statistics-card">
          <div class="card-content">
            <div class="card-title">设备完好率</div>
            <div class="card-value">{{ statisticsData.equipmentStatus.rate }}</div>
            <div class="card-trend up">
              <el-icon><ArrowUp /></el-icon>
              状态良好
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>巡检趋势分析</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>问题分布分析</span>
              <el-select v-model="distributionType" size="small">
                <el-option label="按区域" value="area" />
                <el-option label="按类型" value="type" />
              </el-select>
            </div>
          </template>
          <div ref="distributionChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 人员绩效 -->
    <el-card class="performance-card">
      <template #header>
        <div class="card-header">
          <span>巡检人员绩效</span>
          <el-button type="primary" @click="exportData">导出数据</el-button>
        </div>
      </template>

      <el-table :data="statisticsData.personnelPerformance.inspectors" style="width: 100%">
        <el-table-column prop="name" label="巡检员" width="120" />
        <el-table-column prop="completionRate" label="完成率" width="120" />
        <el-table-column prop="issuesFound" label="发现问题数" width="120" />
        <el-table-column prop="avgTime" label="平均巡检时长" width="150" />
        <el-table-column label="绩效评级" width="120">
          <template #default="scope">
            <el-tag :type="getPerformanceType(scope.row.completionRate)">
              {{ getPerformanceLevel(scope.row.completionRate) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'

// 图表相关
const timeRange = ref('week')
const distributionType = ref('area')
const trendChartRef = ref(null)
const distributionChartRef = ref(null)
let trendChart = null
let distributionChart = null

// 统计数据
const statisticsData = ref({
  inspectionCompletion: {
    total: 256,
    completed: 248,
    rate: '96.9%',
    trend: 'up',
    lastWeek: '95.2%',
    details: {
      production: {
        total: 120,
        completed: 116,
        rate: '96.7%'
      },
      storage: {
        total: 80,
        completed: 78,
        rate: '97.5%'
      },
      packaging: {
        total: 56,
        completed: 54,
        rate: '96.4%'
      }
    }
  },
  issuesFound: {
    total: 85,
    critical: 15,
    major: 35,
    minor: 35,
    trend: 'down',
    lastWeek: 92,
    byType: {
      equipment: 38,
      safety: 22,
      environment: 15,
      quality: 10
    },
    byArea: {
      production: 45,
      storage: 20,
      packaging: 20
    }
  },
  averageTime: {
    inspection: {
      production: '38分钟',
      storage: '25分钟',
      packaging: '32分钟',
      overall: '32分钟'
    },
    response: {
      critical: '10分钟',
      major: '20分钟',
      minor: '30分钟',
      average: '18分钟'
    },
    resolution: {
      equipment: '2.5小时',
      safety: '1.5小时',
      environment: '3.0小时',
      average: '2.3小时'
    },
    trend: 'up',
    improvement: '15.8%'
  },
  equipmentStatus: {
    total: 386,
    normal: 365,
    warning: 15,
    fault: 6,
    rate: '94.6%',
    byArea: {
      production: {
        total: 180,
        normal: 168,
        warning: 8,
        fault: 4
      },
      storage: {
        total: 120,
        normal: 115,
        warning: 4,
        fault: 1
      },
      packaging: {
        total: 86,
        normal: 82,
        warning: 3,
        fault: 1
      }
    }
  },
  personnelPerformance: {
    inspectors: [
      { name: '张明华', completionRate: '98.5%', issuesFound: 12, avgTime: '30分钟' },
      { name: '李志强', completionRate: '97.8%', issuesFound: 8, avgTime: '35分钟' },
      { name: '王建国', completionRate: '96.5%', issuesFound: 15, avgTime: '32分钟' },
      { name: '赵秀芳', completionRate: '98.2%', issuesFound: 10, avgTime: '28分钟' },
      { name: '陈志明', completionRate: '97.1%', issuesFound: 9, avgTime: '33分钟' },
      { name: '刘丽华', completionRate: '98.8%', issuesFound: 11, avgTime: '31分钟' },
      { name: '周国强', completionRate: '96.9%', issuesFound: 14, avgTime: '34分钟' },
      { name: '杨光', completionRate: '97.5%', issuesFound: 7, avgTime: '29分钟' },
      { name: '郑秀兰', completionRate: '98.1%', issuesFound: 13, avgTime: '30分钟' },
      { name: '孙志伟', completionRate: '97.3%', issuesFound: 9, avgTime: '32分钟' }
    ]
  }
})

// 初始化趋势图表
const initTrendChart = async () => {
  if (!trendChartRef.value) return
  
  await nextTick()
  
  if (trendChart) {
    trendChart.dispose()
  }

  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['巡检完成率', '问题发现数']
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: [
      {
        type: 'value',
        name: '完成率',
        min: 80,
        max: 100,
        axisLabel: {
          formatter: '{value}%'
        }
      },
      {
        type: 'value',
        name: '问题数',
        min: 0,
        max: 20,
        interval: 5
      }
    ],
    series: [
      {
        name: '巡检完成率',
        type: 'line',
        data: [95, 93, 98, 96, 95, 97, 99],
        yAxisIndex: 0,
        itemStyle: {
          color: '#409eff'
        }
      },
      {
        name: '问题发现数',
        type: 'bar',
        data: [12, 8, 15, 10, 13, 8, 6],
        yAxisIndex: 1,
        itemStyle: {
          color: '#67c23a'
        }
      }
    ]
  }
  trendChart.setOption(option)
}

// 初始化分布图表
const initDistributionChart = async () => {
  if (!distributionChartRef.value) return
  
  await nextTick()
  
  if (distributionChart) {
    distributionChart.dispose()
  }

  distributionChart = echarts.init(distributionChartRef.value)
  const option = distributionType.value === 'area' ? {
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
          { 
            value: 45, 
            name: '生产区',
            itemStyle: { color: '#409eff' }
          },
          { 
            value: 20, 
            name: '储存区',
            itemStyle: { color: '#67c23a' }
          },
          { 
            value: 20, 
            name: '包装区',
            itemStyle: { color: '#e6a23c' }
          }
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
  } : {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '问题类型',
        type: 'pie',
        radius: '50%',
        data: [
          { 
            value: 38, 
            name: '设备故障',
            itemStyle: { color: '#409eff' }
          },
          { 
            value: 22, 
            name: '安全隐患',
            itemStyle: { color: '#f56c6c' }
          },
          { 
            value: 15, 
            name: '环境异常',
            itemStyle: { color: '#67c23a' }
          },
          { 
            value: 10, 
            name: '质量问题',
            itemStyle: { color: '#e6a23c' }
          }
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
  distributionChart.setOption(option)
}

// 初始化所有图表
const initCharts = async () => {
  await Promise.all([
    initTrendChart(),
    initDistributionChart()
  ])
}

// 获取绩效等级
const getPerformanceLevel = (rate) => {
  const percentage = parseFloat(rate)
  if (percentage >= 98) return '优秀'
  if (percentage >= 95) return '良好'
  return '一般'
}

// 获取绩效标签类型
const getPerformanceType = (rate) => {
  const percentage = parseFloat(rate)
  if (percentage >= 98) return 'success'
  if (percentage >= 95) return 'warning'
  return 'info'
}

// 导出数据处理
const exportData = () => {
  const workbook = XLSX.utils.book_new()
  
  // 巡检完成情况
  const inspectionSheet = XLSX.utils.json_to_sheet([{
    '总计划巡检数': statisticsData.value.inspectionCompletion.total,
    '已完成巡检数': statisticsData.value.inspectionCompletion.completed,
    '完成率': statisticsData.value.inspectionCompletion.rate,
    '环比上周': statisticsData.value.inspectionCompletion.lastWeek,
    '趋势': statisticsData.value.inspectionCompletion.trend === 'up' ? '上升' : '下降'
  }])
  
  // 问题统计
  const issuesSheet = XLSX.utils.json_to_sheet([{
    '问题总数': statisticsData.value.issuesFound.total,
    '严重问题': statisticsData.value.issuesFound.critical,
    '主要问题': statisticsData.value.issuesFound.major,
    '轻微问题': statisticsData.value.issuesFound.minor,
    '环比上周': statisticsData.value.issuesFound.lastWeek,
    '趋势': statisticsData.value.issuesFound.trend === 'up' ? '上升' : '下降'
  }])
  
  // 时间统计
  const timeSheet = XLSX.utils.json_to_sheet([{
    '平均巡检时间': statisticsData.value.averageTime.inspection.overall,
    '平均响应时间': statisticsData.value.averageTime.response.average,
    '平均解决时间': statisticsData.value.averageTime.resolution.average,
    '效率提升': statisticsData.value.averageTime.improvement
  }])
  
  // 设备状态
  const equipmentSheet = XLSX.utils.json_to_sheet([{
    '设备总数': statisticsData.value.equipmentStatus.total,
    '正常运行': statisticsData.value.equipmentStatus.normal,
    '预警状态': statisticsData.value.equipmentStatus.warning,
    '故障设备': statisticsData.value.equipmentStatus.fault,
    '设备完好率': statisticsData.value.equipmentStatus.rate
  }])
  
  // 人员绩效
  const performanceSheet = XLSX.utils.json_to_sheet(
    statisticsData.value.personnelPerformance.inspectors.map(person => ({
      '巡检员': person.name,
      '完成率': person.completionRate,
      '发现问题数': person.issuesFound,
      '平均巡检时长': person.avgTime,
      '绩效评级': getPerformanceLevel(person.completionRate)
    }))
  )
  
  // 设置列宽并添加工作表
  const setColumnWidths = (sheet) => {
    sheet['!cols'] = Object.keys(sheet).filter(key => key !== '!ref').map(() => ({ wch: 15 }))
  }
  
  setColumnWidths(inspectionSheet)
  setColumnWidths(issuesSheet)
  setColumnWidths(timeSheet)
  setColumnWidths(equipmentSheet)
  setColumnWidths(performanceSheet)
  
  XLSX.utils.book_append_sheet(workbook, inspectionSheet, '巡检完成情况')
  XLSX.utils.book_append_sheet(workbook, issuesSheet, '问题统计')
  XLSX.utils.book_append_sheet(workbook, timeSheet, '时间统计')
  XLSX.utils.book_append_sheet(workbook, equipmentSheet, '设备状态')
  XLSX.utils.book_append_sheet(workbook, performanceSheet, '人员绩效')
  
  const today = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `数据分析报表_${today}.xlsx`)
}

// 监听分布类型变化
watch(distributionType, () => {
  initDistributionChart()
})

// 处理窗口大小变化
const handleResize = () => {
  trendChart?.resize()
  distributionChart?.resize()
}

onMounted(async () => {
  await initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  trendChart?.dispose()
  distributionChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.data-analysis {
  padding: 20px;
}

.statistics-card {
  margin-bottom: 20px;
}

.card-content {
  text-align: center;
}

.card-title {
  color: #666;
  font-size: 14px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.card-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.card-trend.up {
  color: #67c23a;
}

.card-trend.down {
  color: #f56c6c;
}

.chart-row {
  margin: 20px 0;
}

.chart-card,
.performance-card {
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
</style> 