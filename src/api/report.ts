import type { ReportConfig } from '@/types/report'
import { mockFetchReportData, mockExportReport } from '@/mock/reportData'

// 数据处理函数
export const processReportData = (rawData: any[], config: ReportConfig) => {
  // 1. 按维度分组数据
  const groupedData = groupDataByDimensions(rawData, config.dimensions)
  
  // 2. 计算概览指标
  const metrics = calculateMetrics(rawData, config.metrics)
  
  // 3. 生成图表数据
  const chartData = generateChartData(groupedData, config)
  
  // 4. 生成图表配置
  const chartOption = generateChartOption(chartData, config)
  
  // 5. 生成表格数据
  const { tableData, columns } = generateTableData(groupedData, config)
  
  return {
    metrics,
    chartData,
    chartOption,
    tableData,
    columns
  }
}

// 工具函数
const groupDataByDimensions = (data: any[], dimensions: string[]) => {
  const grouped = new Map()
  
  data.forEach(item => {
    const key = dimensions.map(dim => {
      if (dim === 'time') {
        return new Date(item.time).toISOString().split('T')[0]
      }
      return item[dim]
    }).join('-')
    
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key).push(item)
  })
  
  return grouped
}

const calculateMetrics = (data: any[], metrics: string[]) => {
  return metrics.map(metric => ({
    key: metric,
    label: getMetricLabel(metric),
    value: calculateMetricValue(data, metric),
    trend: 'stable',
    changeRate: 0
  }))
}

const generateChartData = (groupedData: Map<string, any[]>, config: ReportConfig) => {
  const xAxis = Array.from(groupedData.keys())
  const series = config.metrics.map(metric => ({
    name: getMetricLabel(metric),
    type: config.chartType,
    data: xAxis.map(key => calculateMetricValue(groupedData.get(key) || [], metric))
  }))
  
  return { xAxis, series }
}

const generateTableData = (groupedData: Map<string, any[]>, config: ReportConfig) => {
  const tableData = Array.from(groupedData.entries()).map(([key, items]) => {
    const row: any = { key }
    config.metrics.forEach(metric => {
      row[metric] = calculateMetricValue(items, metric)
    })
    return row
  })
  
  const columns = [
    { prop: 'key', label: '维度' },
    ...config.metrics.map(metric => ({
      prop: metric,
      label: getMetricLabel(metric),
      sortable: true,
      formatter: (row: any) => formatMetricValue(row[metric], metric)
    }))
  ]
  
  return { tableData, columns }
}

const calculateMetricValue = (data: any[], metric: string): number => {
  switch (metric) {
    case 'taskCount':
      return data.length
    case 'completionRate':
      const completed = data.filter(item => item.status === 'completed').length
      return (completed / data.length) * 100
    case 'abnormalCount':
      return data.filter(item => item.status === 'abnormal').length
    case 'avgDuration':
      return data.reduce((sum, item) => sum + item.duration, 0) / data.length
    default:
      return 0
  }
}

const getMetricLabel = (metric: string): string => {
  const labels: Record<string, string> = {
    taskCount: '任务数量',
    completionRate: '完成率',
    abnormalCount: '异常数量',
    avgDuration: '平均耗时'
  }
  return labels[metric] || metric
}

const formatMetricValue = (value: number, metric: string): string => {
  switch (metric) {
    case 'completionRate':
      return value.toFixed(2) + '%'
    case 'avgDuration':
      return value.toFixed(1) + '小时'
    default:
      return value.toString()
  }
}

const generateChartOption = (chartData: any, config: ReportConfig) => {
  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: config.metrics.map(getMetricLabel)
    },
    xAxis: {
      type: 'category',
      data: chartData.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: chartData.series
  }
}

// API函数
export const fetchReportData = async (config: ReportConfig) => {
  try {
    // 使用Mock数据
    const rawData = await mockFetchReportData(config)
    return processReportData(rawData, config)
  } catch (error) {
    console.error('获取报表数据失败:', error)
    throw error
  }
}

// 导出报表
export const exportReport = async (data: any, fileName: string) => {
  try {
    // 使用Mock导出
    const blob = await mockExportReport(data)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${fileName}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出报表失败:', error)
    throw error
  }
}

// 保存报表模板
export const saveReportTemplate = async (template: {
  name: string
  description: string
  config: ReportConfig
  createTime: string
}) => {
  try {
    // 获取现有模板
    const templates = JSON.parse(localStorage.getItem('reportTemplates') || '[]')
    
    // 生成新模板ID
    const newId = templates.length ? Math.max(...templates.map((t: any) => t.id)) + 1 : 1
    
    // 添加新模板
    const newTemplate = {
      id: newId,
      ...template,
      updateTime: new Date().toISOString()
    }
    
    templates.push(newTemplate)
    
    // 保存到本地存储
    localStorage.setItem('reportTemplates', JSON.stringify(templates))
    
    return newTemplate
  } catch (error) {
    console.error('保存模板失败:', error)
    throw error
  }
}

// 获取模板列表
export const getReportTemplates = async () => {
  try {
    const templates = JSON.parse(localStorage.getItem('reportTemplates') || '[]')
    return templates
  } catch (error) {
    console.error('获取模板列表失败:', error)
    throw error
  }
}

// 删除模板
export const deleteReportTemplate = async (id: number) => {
  try {
    const templates = JSON.parse(localStorage.getItem('reportTemplates') || '[]')
    const newTemplates = templates.filter((t: any) => t.id !== id)
    localStorage.setItem('reportTemplates', JSON.stringify(newTemplates))
  } catch (error) {
    console.error('删除模板失败:', error)
    throw error
  }
} 