// 预警级别
export type AlertLevel = 'low' | 'medium' | 'high' | 'critical'

// 预警状态
export type AlertStatus = 'pending' | 'processing' | 'resolved' | 'ignored'

// 预警类型
export type AlertType = 
  | 'device_error'    // 设备故障
  | 'timeout'         // 超时预警
  | 'abnormal'        // 异常行为
  | 'risk'           // 安全风险
  | 'environment'    // 环境预警

// 预警信息
export interface Alert {
  id: number
  title: string
  type: AlertType
  level: AlertLevel
  status: AlertStatus
  source: string
  description: string
  location: string
  createTime: string
  updateTime: string
  handledBy?: string
  handleTime?: string
  handleResult?: string
}

// 查询参数
export interface AlertQueryParams {
  type?: AlertType
  level?: AlertLevel
  status?: AlertStatus
  dateRange?: [Date, Date]
  page: number
  pageSize: number
}

// 查询响应
export interface AlertListResponse {
  data: Alert[]
  total: number
}

// 预警规则
export interface AlertRule {
  id: number
  name: string
  type: AlertType
  level: AlertLevel
  conditions: any[]
  actions: any[]
  enabled: boolean
  createTime: string
  updateTime: string
  updating?: boolean
}

// 处置记录
export interface HandleRecord {
  id: number
  alertId: number
  operator: string
  role?: string
  action: string
  description: string
  time: string
  attachments?: {
    name: string
    url: string
    type: string
  }[]
}

// 规则条件
export interface RuleCondition {
  field: string
  operator: string
  value: any
  unit?: string
}

// 规则动作
export interface RuleAction {
  type: 'notification' | 'webhook' | 'automation'
  config: any
} 