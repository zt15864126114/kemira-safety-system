// 系统连接状态类型
export type SystemStatus = 'connected' | 'disconnected' | 'error'

// 数据同步方向
export type SyncDirection = 'inbound' | 'outbound' | 'bidirectional'

// 系统接口定义
export interface SystemInfo {
  id: string
  name: string
  type: string
  status: SystemStatus
  lastSync: string
  dataPoints: number
  description: string
}

// 数据同步状态
export interface SyncStatus {
  id: string
  sourceSystem: string
  targetSystem: string
  direction: SyncDirection
  lastSync: string
  syncCount: number
  errorCount: number
  status: SystemStatus
}

// 系统告警
export interface SystemAlert {
  id: string
  system: string
  type: 'connection_lost' | 'sync_error' | 'performance_issue' | 'security_alert'
  level: 'info' | 'warning' | 'error' | 'critical'
  time: string
  description: string
  status: 'active' | 'resolved'
}

// 系统性能指标
export interface SystemMetrics {
  systemId: string
  cpu: number
  memory: number
  network: number
  responseTime: number
  timestamp: string
} 