import type { ReportConfig } from '@/types/report'
import dayjs from 'dayjs'

// 生成随机数
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 生成随机状态
const randomStatus = () => {
  const statuses = ['completed', 'pending', 'abnormal']
  return statuses[random(0, 2)]
}

// 生成随机区域
const randomArea = () => {
  const areas = ['A区', 'B区', 'C区', 'D区']
  return areas[random(0, 3)]
}

// 生成随机设备
const randomDevice = () => {
  const devices = ['设备1', '设备2', '设备3', '设备4', '设备5']
  return devices[random(0, 4)]
}

// 生成随机人员
const randomStaff = () => {
  const staff = ['张三', '李四', '王五', '赵六']
  return staff[random(0, 3)]
}

// 生成模拟数据
export const generateMockData = (config: ReportConfig) => {
  const { dateRange } = config
  const data = []
  
  if (!dateRange.length) return []
  
  const startDate = dayjs(dateRange[0])
  const endDate = dayjs(dateRange[1])
  const days = endDate.diff(startDate, 'day') + 1
  
  // 每天生成10-20条记录
  for (let i = 0; i < days; i++) {
    const currentDate = startDate.add(i, 'day')
    const recordCount = random(10, 20)
    
    for (let j = 0; j < recordCount; j++) {
      data.push({
        id: `${currentDate.format('YYYYMMDD')}-${j}`,
        time: currentDate.format('YYYY-MM-DD'),
        status: randomStatus(),
        area: randomArea(),
        device: randomDevice(),
        staff: randomStaff(),
        duration: random(1, 8),
        abnormalType: random(1, 5),
        riskLevel: random(1, 3)
      })
    }
  }
  
  return data
}

// Mock API响应
export const mockFetchReportData = async (config: ReportConfig) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  try {
    const mockData = generateMockData(config)
    return mockData
  } catch (error) {
    console.error('生成Mock数据失败:', error)
    throw error
  }
}

// Mock导出响应
export const mockExportReport = async (data: any) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  try {
    // 这里可以返回一个模拟的Blob数据
    const mockBlob = new Blob(['模拟的导出数据'], { type: 'application/vnd.ms-excel' })
    return mockBlob
  } catch (error) {
    console.error('导出Mock数据失败:', error)
    throw error
  }
} 