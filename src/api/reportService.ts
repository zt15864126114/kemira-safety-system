import type { ReportConfig, ReportTemplate } from '@/types/report'
import { processReportData } from './report'

// 获取报表数据
export const fetchReportData = async (config: ReportConfig) => {
  try {
    // 这里替换为实际的API调用
    const response = await fetch('/api/reports/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    })
    const rawData = await response.json()
    return processReportData(rawData, config)
  } catch (error) {
    console.error('获取报表数据失败:', error)
    throw error
  }
}

// 获取报表模板列表
export const fetchReportTemplates = async (): Promise<ReportTemplate[]> => {
  try {
    const response = await fetch('/api/reports/templates')
    return await response.json()
  } catch (error) {
    console.error('获取模板列表失败:', error)
    throw error
  }
}

// 保存报表模板
export const saveReportTemplate = async (template: Partial<ReportTemplate>): Promise<ReportTemplate> => {
  try {
    const response = await fetch('/api/reports/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(template)
    })
    return await response.json()
  } catch (error) {
    console.error('保存模板失败:', error)
    throw error
  }
}

// 加载报表模板
export const loadReportTemplate = async (id: number): Promise<ReportTemplate> => {
  try {
    const response = await fetch(`/api/reports/templates/${id}`)
    return await response.json()
  } catch (error) {
    console.error('加载模板失败:', error)
    throw error
  }
}

// 删除报表模板
export const deleteReportTemplate = async (id: number): Promise<void> => {
  try {
    await fetch(`/api/reports/templates/${id}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error('删除模板失败:', error)
    throw error
  }
} 