import type { SystemStatus, SystemMetrics } from '@/types/integration'

// 模拟API调用
export const integrationApi = {
  // 获取系统状态
  async getSystemStatus(systemId: string): Promise<SystemStatus> {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    return Math.random() > 0.1 ? 'connected' : 'error'
  },

  // 获取系统性能指标
  async getSystemMetrics(systemId: string): Promise<SystemMetrics> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      systemId,
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      network: Math.random() * 100,
      responseTime: Math.random() * 1000,
      timestamp: new Date().toISOString()
    }
  },

  // 测试系统连接
  async testConnection(systemId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Math.random() > 0.1
  }
} 