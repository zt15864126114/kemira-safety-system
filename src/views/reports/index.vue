<template>
  <div class="report-container">
    <!-- 配置区域 -->
    <el-card class="config-card">
      <template #header>
        <div class="header-wrapper">
          <span class="title">报表配置</span>
          <el-button-group>
            <el-button type="primary" @click="generateReport" :loading="loading">
              生成报表
            </el-button>
            <el-button @click="resetConfig">
              重置配置
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-form :model="reportConfig" label-width="100px">
        <!-- 报表名称 -->
        <el-form-item label="报表名称">
          <el-input v-model="reportConfig.name" placeholder="请输入报表名称" />
        </el-form-item>

        <!-- 报表类型 -->
        <el-form-item label="报表类型">
          <el-select v-model="reportConfig.type" class="w-full">
            <el-option label="巡检报告" value="inspection" />
            <el-option label="异常统计" value="abnormal" />
            <el-option label="设备状态" value="equipment" />
            <el-option label="人员绩效" value="performance" />
          </el-select>
        </el-form-item>

        <!-- 时间范围 -->
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="reportConfig.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            class="w-full"
          />
        </el-form-item>

        <!-- 统计维度 -->
        <el-form-item label="统计维度">
          <el-checkbox-group v-model="reportConfig.dimensions">
            <el-checkbox label="time">时间维度</el-checkbox>
            <el-checkbox label="area">区域维度</el-checkbox>
            <el-checkbox label="staff">人员维度</el-checkbox>
            <el-checkbox label="device">设备维度</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 统计指标 -->
        <el-form-item label="统计指标">
          <el-checkbox-group v-model="reportConfig.metrics">
            <el-checkbox label="taskCount">任务数量</el-checkbox>
            <el-checkbox label="completionRate">完成率</el-checkbox>
            <el-checkbox label="abnormalCount">异常数量</el-checkbox>
            <el-checkbox label="avgDuration">平均耗时</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 图表类型 -->
        <el-form-item label="图表类型">
          <el-radio-group v-model="reportConfig.chartType">
            <el-radio-button label="bar">柱状图</el-radio-button>
            <el-radio-button label="line">折线图</el-radio-button>
            <el-radio-button label="pie">饼图</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <!-- 展示模式 -->
        <el-form-item label="展示模式">
          <el-radio-group v-model="reportConfig.displayMode">
            <el-radio-button label="chart">图表</el-radio-button>
            <el-radio-button label="table">表格</el-radio-button>
            <el-radio-button label="both">图表+表格</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 报表展示区域 -->
    <el-card v-if="reportData" class="report-card">
      <template #header>
        <div class="header-wrapper">
          <span class="title">{{ reportConfig.name || '报表展示' }}</span>
          <el-button-group>
            <el-button @click="refreshReport">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
            <el-button @click="handleExport">
              <el-icon><Download /></el-icon>
              导出
            </el-button>
          </el-button-group>
        </div>
      </template>

      <!-- 数据概览 -->
      <el-row :gutter="20" class="metrics-overview">
        <el-col :span="6" v-for="metric in reportData.metrics" :key="metric.key">
          <el-card shadow="hover" class="metric-card">
            <div class="metric-value">{{ formatMetricValue(metric) }}</div>
            <div class="metric-label">{{ metric.label }}</div>
            <div v-if="metric.trend" class="metric-trend" :class="metric.trend">
              <el-icon>
                <CaretTop v-if="metric.trend === 'up'" />
                <CaretBottom v-if="metric.trend === 'down'" />
                <Minus v-if="metric.trend === 'stable'" />
              </el-icon>
              <span>{{ formatTrendValue(metric.changeRate) }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 图表展示 -->
      <div v-if="showChart" ref="chartRef" class="chart-container"></div>

      <!-- 表格展示 -->
      <div v-if="showTable" class="table-container">
        <el-table
          :data="reportData.tableData"
          :columns="reportData.columns"
          border
          stripe
          show-summary
        />
      </div>
    </el-card>

    <!-- 空状态 -->
    <el-empty
      v-else
      description="暂无报表数据"
      class="empty-state"
    >
      <el-button type="primary" @click="generateReport">
        生成报表
      </el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import {
  Refresh,
  Download,
  CaretTop,
  CaretBottom,
  Minus
} from '@element-plus/icons-vue'
import type { ReportConfig, Metric } from '@/types/report'
import { fetchReportData, exportReport } from '@/api/report'
import { generateChartOption } from '@/utils/chartOptionGenerator'
import { exportToExcel } from '@/utils/exportUtils'

// 状态定义
const loading = ref(false)
const reportData = ref<any>(null)
const chartRef = ref<HTMLElement | null>(null)
const chart = ref<echarts.ECharts | null>(null)

// 报表配置
const reportConfig = reactive<ReportConfig>({
  name: '',
  type: 'inspection',
  dateRange: [],
  dimensions: ['time'],
  metrics: ['taskCount', 'completionRate'],
  chartType: 'bar',
  displayMode: 'both'
})

// 计算属性
const showChart = computed(() => {
  return reportConfig.displayMode === 'chart' || reportConfig.displayMode === 'both'
})

const showTable = computed(() => {
  return reportConfig.displayMode === 'table' || reportConfig.displayMode === 'both'
})

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近90天',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 方法定义
const generateReport = async () => {
  if (!reportConfig.dateRange.length) {
    ElMessage.warning('请选择时间范围')
    return
  }

  loading.value = true
  try {
    const data = await fetchReportData(reportConfig)
    reportData.value = data
    if (showChart.value) {
      nextTick(() => {
        initChart()
      })
    }
    ElMessage.success('报表生成成功')
  } catch (error) {
    ElMessage.error('报表生成失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const resetConfig = () => {
  Object.assign(reportConfig, {
    name: '',
    type: 'inspection',
    dateRange: [],
    dimensions: ['time'],
    metrics: ['taskCount', 'completionRate'],
    chartType: 'bar',
    displayMode: 'both'
  })
  reportData.value = null
  chart.value?.dispose()
}

const refreshReport = () => {
  generateReport()
}

const handleExport = async () => {
  if (!reportData.value) {
    ElMessage.warning('请先生成报表数据')
    return
  }

  try {
    const fileName = reportConfig.name || '报表导出'
    await exportToExcel({
      fileName,
      data: reportData.value.tableData,
      columns: reportData.value.columns,
      metrics: reportData.value.metrics,
      config: reportConfig
    })
    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  }
}

const initChart = () => {
  if (!chartRef.value || !reportData.value?.chartData) return
  
  if (!chart.value) {
    chart.value = echarts.init(chartRef.value)
  }
  
  const option = generateChartOption(reportData.value.chartData, reportConfig)
  chart.value.setOption(option, true) // 使用 true 清除之前的配置
}

const formatMetricValue = (metric: Metric): string => {
  const { value, unit } = metric
  let formattedValue = value.toString()
  
  switch (metric.key) {
    case 'completionRate':
      formattedValue = value.toFixed(2) + '%'
      break
    case 'avgDuration':
      formattedValue = value.toFixed(1) + '小时'
      break
  }
  
  return unit ? `${formattedValue}${unit}` : formattedValue
}

const formatTrendValue = (value?: number): string => {
  if (!value) return '0%'
  return (value > 0 ? '+' : '') + value.toFixed(2) + '%'
}

// 添加窗口大小变化处理
const handleResize = () => {
  chart.value?.resize()
}

// 更新生命周期钩子
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart.value?.dispose()
})
</script>

<style scoped lang="scss">
.report-container {
  padding: 20px;
  
  .config-card {
    margin-bottom: 20px;
  }
  
  .report-card {
    .metrics-overview {
      margin-bottom: 24px;
      
      .metric-card {
        text-align: center;
        
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #409EFF;
          margin-bottom: 8px;
        }
        
        .metric-label {
          color: #909399;
        }
        
        .metric-trend {
          margin-top: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          
          &.up {
            color: #67C23A;
          }
          
          &.down {
            color: #F56C6C;
          }
          
          &.stable {
            color: #909399;
          }
        }
      }
    }
    
    .chart-container {
      height: 400px;
      margin-bottom: 24px;
    }
  }
  
  .header-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 16px;
      font-weight: 500;
    }
  }
  
  .empty-state {
    margin-top: 100px;
  }
}

.w-full {
  width: 100%;
}
</style>
