import type { Component } from 'vue'

// 报表配置
export interface ReportConfig {
  name: string                    // 报表名称
  type: string               // 报表类型
  dateRange: Date[]    // 时间范围
  metrics: string[]               // 统计指标
  dimensions: string[]            // 统计维度
  chartType: 'bar' | 'line' | 'pie'           // 图表类型
  displayMode: 'chart' | 'table' | 'both'        // 展示模式
}

// 报表类型
export type ReportType = 
  | 'inspection'     // 巡检报告
  | 'abnormal'       // 异常统计
  | 'equipment'      // 设备状态
  | 'performance'    // 人员绩效

// 图表类型
export type ChartType = 'bar' | 'line' | 'pie'

// 展示模式
export type DisplayMode = 'chart' | 'table' | 'both'

// 统计指标
export interface Metric {
  key: string        // 指标键名
  label: string      // 显示名称
  value: number      // 指标值
  unit?: string      // 单位
  trend?: 'up' | 'down' | 'stable'  // 趋势
  changeRate?: number // 变化率
}

// 图表数据
export interface ChartData {
  xAxis: string[]    // X轴数据
  series: Series[]   // 数据系列
}

// 数据系列
export interface Series {
  name: string       // 系列名称
  data: number[]     // 系列数据
  type: ChartType    // 图表类型
}

// 表格列
export interface TableColumn {
  prop: string       // 属性名
  label: string      // 显示名称
  width?: number     // 列宽
  sortable?: boolean // 是否可排序
  formatter?: (row: any) => string  // 格式化函数
}

// 报表模板
export interface ReportTemplate {
  id: number
  name: string
  description: string
  config: ReportConfig
  createTime: string
  updateTime?: string
} 