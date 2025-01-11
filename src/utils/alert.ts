import type { AlertType, AlertLevel, AlertStatus } from '@/types/alert'

export const getAlertTypeLabel = (type: AlertType): string => {
  const labels: Record<AlertType, string> = {
    device_error: '设备故障',
    timeout: '超时预警',
    abnormal: '异常行为',
    risk: '安全风险',
    environment: '环境预警'
  }
  return labels[type] || type
}

export const getAlertLevelLabel = (level: AlertLevel): string => {
  const labels: Record<AlertLevel, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '紧急'
  }
  return labels[level] || level
}

export const getAlertStatusLabel = (status: AlertStatus): string => {
  const labels: Record<AlertStatus, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    ignored: '已忽略'
  }
  return labels[status] || status
}

export const getAlertTypeTag = (type: AlertType): string => {
  const tags: Record<AlertType, string> = {
    device_error: 'danger',
    timeout: 'warning',
    abnormal: 'warning',
    risk: 'danger',
    environment: 'info'
  }
  return tags[type]
}

export const getAlertLevelTag = (level: AlertLevel): string => {
  const tags: Record<AlertLevel, string> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return tags[level]
}

export const getAlertStatusTag = (status: AlertStatus): string => {
  const tags: Record<AlertStatus, string> = {
    pending: 'danger',
    processing: 'warning',
    resolved: 'success',
    ignored: 'info'
  }
  return tags[status]
} 