import type { ReportConfig } from '@/types/report'

export const processReportData = (rawData: any[], config: ReportConfig) => {
  // 处理报表数据的逻辑
  return {
    metrics: [],
    chartData: { xAxis: [], series: [] },
    tableData: [],
    columns: []
  }
} 