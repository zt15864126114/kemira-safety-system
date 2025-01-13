import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SystemInfo, SyncStatus, SystemAlert, SystemMetrics, SystemStatus } from '@/types/integration'

export const useIntegrationStore = defineStore('integration', () => {
  // 状态定义
  const systems = ref<SystemInfo[]>([
    {
      id: 'MES',
      name: '制造执行系统',
      type: 'production',
      status: 'connected',
      lastSync: new Date().toISOString(),
      dataPoints: 1250,
      description: '管理生产过程和工单执行'
    },
    {
      id: 'ERP',
      name: '企业资源计划',
      type: 'management',
      status: 'connected',
      lastSync: new Date().toISOString(),
      dataPoints: 850,
      description: '管理企业资源和订单处理'
    },
    {
      id: 'SCADA',
      name: '数据采集与监控系统',
      type: 'production',
      status: 'connected',
      lastSync: new Date().toISOString(),
      dataPoints: 3600,
      description: '实时数据采集和设备监控'
    },
    {
      id: 'WMS',
      name: '仓储管理系统',
      type: 'logistics',
      status: 'connected',
      lastSync: new Date().toISOString(),
      dataPoints: 620,
      description: '仓库库存和物流管理'
    },
    {
      id: 'QMS',
      name: '质量管理系统',
      type: 'quality',
      status: 'connected',
      lastSync: new Date().toISOString(),
      dataPoints: 960,
      description: '产品质量控制和检验管理'
    },
    {
      id: 'PLM',
      name: '产品生命周期管理',
      type: 'product',
      status: 'connected',
      lastSync: new Date().toISOString(),
      dataPoints: 450,
      description: '产品设计和生命周期管理'
    },
    {
      id: 'CRM',
      name: '客户关系管理',
      type: 'customer',
      status: 'error',
      lastSync: new Date().toISOString(),
      dataPoints: 780,
      description: '客户信息和订单管理'
    },
    {
      id: 'APS',
      name: '高级计划排程系统',
      type: 'planning',
      status: 'connected',
      lastSync: new Date().toISOString(),
      dataPoints: 520,
      description: '生产计划和排程优化'
    }
  ])

  const syncStatus = ref<SyncStatus[]>([
    {
      id: 'SYNC-001',
      sourceSystem: 'MES',
      targetSystem: 'ERP',
      direction: 'bidirectional',
      lastSync: new Date().toISOString(),
      syncCount: 1500,
      errorCount: 0,
      status: 'connected'
    },
    {
      id: 'SYNC-002',
      sourceSystem: 'SCADA',
      targetSystem: 'MES',
      direction: 'outbound',
      lastSync: new Date().toISOString(),
      syncCount: 3200,
      errorCount: 12,
      status: 'connected'
    },
    {
      id: 'SYNC-003',
      sourceSystem: 'WMS',
      targetSystem: 'ERP',
      direction: 'bidirectional',
      lastSync: new Date().toISOString(),
      syncCount: 850,
      errorCount: 3,
      status: 'connected'
    },
    {
      id: 'SYNC-004',
      sourceSystem: 'QMS',
      targetSystem: 'MES',
      direction: 'outbound',
      lastSync: new Date().toISOString(),
      syncCount: 960,
      errorCount: 0,
      status: 'connected'
    },
    {
      id: 'SYNC-005',
      sourceSystem: 'PLM',
      targetSystem: 'MES',
      direction: 'outbound',
      lastSync: new Date().toISOString(),
      syncCount: 420,
      errorCount: 5,
      status: 'error'
    },
    {
      id: 'SYNC-006',
      sourceSystem: 'CRM',
      targetSystem: 'ERP',
      direction: 'bidirectional',
      lastSync: new Date().toISOString(),
      syncCount: 780,
      errorCount: 15,
      status: 'error'
    }
  ])

  const alerts = ref<SystemAlert[]>([
    {
      id: 'ALT-001',
      system: 'CRM',
      type: 'connection_lost',
      level: 'error',
      time: new Date().toISOString(),
      description: 'CRM系统连接中断，请检查网络连接',
      status: 'active'
    },
    {
      id: 'ALT-002',
      system: 'PLM',
      type: 'sync_error',
      level: 'warning',
      time: new Date().toISOString(),
      description: 'PLM到MES的数据同步失败，重试次数过多',
      status: 'active'
    },
    {
      id: 'ALT-003',
      system: 'SCADA',
      type: 'performance_issue',
      level: 'warning',
      time: new Date().toISOString(),
      description: 'SCADA系统响应时间超过阈值(>2s)',
      status: 'active'
    },
    {
      id: 'ALT-004',
      system: 'MES',
      type: 'security_alert',
      level: 'critical',
      time: new Date().toISOString(),
      description: '检测到未经授权的系统访问尝试',
      status: 'resolved'
    }
  ])

  const metrics = ref<SystemMetrics[]>([
    {
      systemId: 'MES',
      cpu: 65.2,
      memory: 78.5,
      network: 45.8,
      responseTime: 180,
      timestamp: new Date().toISOString()
    },
    {
      systemId: 'ERP',
      cpu: 55.8,
      memory: 82.3,
      network: 38.6,
      responseTime: 220,
      timestamp: new Date().toISOString()
    },
    {
      systemId: 'SCADA',
      cpu: 88.5,
      memory: 92.1,
      network: 76.4,
      responseTime: 2200,
      timestamp: new Date().toISOString()
    }
  ])

  // 计算属性
  const connectedSystems = computed(() => 
    systems.value.filter(s => s.status === 'connected').length
  )

  const totalDataPoints = computed(() =>
    systems.value.reduce((sum, sys) => sum + sys.dataPoints, 0)
  )

  const activeAlerts = computed(() =>
    alerts.value.filter(a => a.status === 'active')
  )

  // 方法
  const updateSystemStatus = (systemId: string, status: SystemStatus) => {
    const system = systems.value.find(s => s.id === systemId)
    if (system) {
      system.status = status
      system.lastSync = new Date().toISOString()
    }
  }

  const addAlert = (alert: Omit<SystemAlert, 'id' | 'time'>) => {
    const id = `ALERT-${Date.now()}`
    alerts.value.unshift({
      ...alert,
      id,
      time: new Date().toISOString(),
      status: 'active'
    })
  }

  const resolveAlert = (alertId: string) => {
    const alert = alerts.value.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'resolved'
    }
  }

  const updateMetrics = (systemId: string, newMetrics: Omit<SystemMetrics, 'systemId' | 'timestamp'>) => {
    metrics.value.push({
      systemId,
      ...newMetrics,
      timestamp: new Date().toISOString()
    })
  }

  return {
    systems,
    syncStatus,
    alerts,
    metrics,
    connectedSystems,
    totalDataPoints,
    activeAlerts,
    updateSystemStatus,
    addAlert,
    resolveAlert,
    updateMetrics
  }
}) 