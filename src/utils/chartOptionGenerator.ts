import type { ReportConfig, ChartData } from '@/types/report'
import type { EChartsOption } from 'echarts'

export const generateChartOption = (chartData: ChartData, config: ReportConfig): EChartsOption => {
  // 基础配置
  const baseOption: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: chartData.series.map(s => s.name),
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    }
  }

  // 根据图表类型生成不同配置
  switch (config.chartType) {
    case 'bar':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: chartData.xAxis,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {
          type: 'value'
        },
        series: chartData.series.map(series => ({
          name: series.name,
          type: 'bar',
          data: series.data,
          barMaxWidth: 50
        }))
      }

    case 'line':
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: chartData.xAxis,
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        series: chartData.series.map(series => ({
          name: series.name,
          type: 'line',
          data: series.data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          areaStyle: {
            opacity: 0.1
          }
        }))
      }

    case 'pie':
      return {
        ...baseOption,
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: chartData.xAxis.map((key, index) => ({
            name: key,
            value: chartData.series[0].data[index]
          })),
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }

    default:
      return baseOption
  }
}

// 格式化图表数据
export const formatChartData = (data: any[], config: ReportConfig): ChartData => {
  const xAxis = Array.from(new Set(data.map(item => item.time))).sort()
  
  const series = config.metrics.map(metric => ({
    name: getMetricLabel(metric),
    type: config.chartType,
    data: xAxis.map(time => {
      const items = data.filter(item => item.time === time)
      return calculateMetricValue(items, metric)
    })
  }))

  return { xAxis, series }
}

// 获取指标显示名称
const getMetricLabel = (metric: string): string => {
  const labels: Record<string, string> = {
    taskCount: '任务数量',
    completionRate: '完成率',
    abnormalCount: '异常数量',
    avgDuration: '平均耗时'
  }
  return labels[metric] || metric
}

// 计算指标值
const calculateMetricValue = (data: any[], metric: string): number => {
  if (!data.length) return 0

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