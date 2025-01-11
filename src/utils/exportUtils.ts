import * as XLSX from 'xlsx'
import type { TableColumn } from '@/types/report'
import dayjs from 'dayjs'

interface ExportData {
  fileName: string
  data: any[]
  columns: TableColumn[]
  metrics: any[]
  config: any
}

export const exportToExcel = async (exportData: ExportData) => {
  const { fileName, data, columns, metrics, config } = exportData

  try {
    // 1. 创建工作簿
    const wb = XLSX.utils.book_new()

    // 2. 准备报表信息
    const reportInfo = [
      ['报表信息'],
      ['报表名称', config.name || '未命名报表'],
      ['生成时间', dayjs().format('YYYY-MM-DD HH:mm:ss')],
      ['时间范围', `${dayjs(config.dateRange[0]).format('YYYY-MM-DD')} 至 ${dayjs(config.dateRange[1]).format('YYYY-MM-DD')}`],
      ['统计维度', config.dimensions.join(', ')],
      ['统计指标', config.metrics.join(', ')],
      ['', ''],  // 空行
    ]

    // 3. 准备概览数据
    const overviewData = [
      ['指标概览'],
      ['指标名称', '指标值', '环比变化', '变化趋势'],
      ...metrics.map((metric: any) => [
        metric.label,
        formatMetricValue(metric),
        metric.changeRate ? `${metric.changeRate > 0 ? '+' : ''}${metric.changeRate.toFixed(2)}%` : '-',
        metric.trend || '-'
      ]),
      ['', ''],  // 空行
    ]

    // 4. 准备详细数据
    const tableData = data.map(row => {
      const newRow: Record<string, any> = {}
      columns.forEach(col => {
        if (col.formatter) {
          newRow[col.label] = col.formatter(row)
        } else {
          newRow[col.label] = row[col.prop]
        }
      })
      return newRow
    })

    // 5. 创建并设置工作表
    const wsInfo = XLSX.utils.aoa_to_sheet(reportInfo)
    const wsOverview = XLSX.utils.aoa_to_sheet([...reportInfo, ...overviewData])
    const wsData = XLSX.utils.json_to_sheet(tableData)

    // 6. 设置列宽
    const setCellWidth = (ws: any) => {
      const cols: any[] = []
      for (let i = 0; i < 10; i++) {
        cols.push({ wch: 15 })  // 设置列宽为15
      }
      ws['!cols'] = cols
    }

    setCellWidth(wsOverview)
    setCellWidth(wsData)

    // 7. 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, wsOverview, '报表概览')
    XLSX.utils.book_append_sheet(wb, wsData, '详细数据')

    // 8. 导出文件
    const exportFileName = `${fileName}_${dayjs().format('YYYYMMDDHHmmss')}.xlsx`
    XLSX.writeFile(wb, exportFileName)

    return true
  } catch (error) {
    console.error('导出Excel失败:', error)
    throw error
  }
}

// 格式化指标值
const formatMetricValue = (metric: any): string => {
  const { key, value } = metric
  switch (key) {
    case 'completionRate':
      return value.toFixed(2) + '%'
    case 'avgDuration':
      return value.toFixed(1) + '小时'
    case 'abnormalCount':
      return value.toString() + '次'
    default:
      return value.toString()
  }
} 