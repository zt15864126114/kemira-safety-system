import dayjs from 'dayjs'
import { Task } from '@/types/inspection'

// 区域配置
const AREAS = [
  '化学品储存区A', '化学品储存区B', '化学品储存区C',
  '生产车间A', '生产车间B', '生产车间C', '生产车间D',
  '仓储区A', '仓储区B', '仓储区C',
  '原料仓库', '成品仓库', '包装车间',
  '实验室A', '实验室B', '质检区',
  '设备维修间', '动力中心', '污水处理站', '办公区'
]

// 巡检人员配置
const INSPECTORS = [
  '张明', '李伟', '王强', '刘洋', '陈勇', 
  '赵静', '孙磊', '周涛', '吴婷', '郑阳',
  '杨帆', '黄晓明', '马超', '徐亮', '朱峰'
]

// 不同区域的巡检内容配置
const AREA_CONTENTS = {
  '化学品储存区': [
    '危险品存储检查', '泄漏检测', '通风系统检查',
    '安全警示检查', '应急设施检查', '防护设施检查'
  ],
  '生产车间': [
    '设备运行检查', '安全生产检查', '噪音检测',
    '机械设备检查', '工具检查', '设备润滑检查'
  ],
  '仓储区': [
    '货物堆放检查', '消防通道检查', '照明系统检查',
    '货物包装检查', '库存安全检查', '应急通道检查'
  ],
  '实验室': [
    '实验设备检查', '通风柜检查', '试剂存储检查',
    '安全设施检查', '废液处理检查', '仪器校准检查'
  ],
  '其他区域': [
    '日常安全检查', '设备维护检查', '环境检查',
    '卫生检查', '基础设施检查', '安全隐患排查'
  ]
}

// 获取区域对应的巡检内容
const getAreaContent = (area: string) => {
  if (area.includes('化学品')) return AREA_CONTENTS['化学品储存区']
  if (area.includes('生产')) return AREA_CONTENTS['生产车间']
  if (area.includes('仓储') || area.includes('仓库')) return AREA_CONTENTS['仓储区']
  if (area.includes('实验室')) return AREA_CONTENTS['实验室']
  return AREA_CONTENTS['其他区域']
}

// 生成任务编号
const generateTaskNo = (date: string) => {
  const dateStr = date.replace(/[-]/g, '')
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `JX${dateStr}${randomNum}`
}

// 生成随机备注
const generateRemark = (status: string, content: string) => {
  if (status === '待执行') return ''
  if (status === '进行中') return `正在进行${content}`
  if (status === '已完成') {
    const remarks = [
      '检查完成，运行正常',
      '已完成检查，记录已存档',
      '检查无异常',
      '已按要求完成检查',
      '设备状态良好',
      '符合安全标准'
    ]
    return remarks[Math.floor(Math.random() * remarks.length)]
  }
  return ''
}

// 生成单个任务数据
const generateTask = (date: string, timeSlot: number): Task => {
  const startHour = 8 + timeSlot
  const area = AREAS[Math.floor(Math.random() * AREAS.length)]
  const contents = getAreaContent(area)
  const content = contents[Math.floor(Math.random() * contents.length)]
  
  const taskDate = dayjs(date)
  const today = dayjs()
  const isToday = taskDate.isSame(today, 'day')
  const isFuture = taskDate.isAfter(today)
  const isRecent = taskDate.isAfter(today.subtract(7, 'day'))
  
  let status: string
  let progress: number

  if (isFuture) {
    // 未来任务大部分是待执行
    const rand = Math.random()
    if (rand < 0.7) { // 70%待执行
      status = '待执行'
      progress = 0
    } else { // 30%进行中
      status = '进行中'
      progress = Math.floor(Math.random() * 40) + 10
    }
  } else if (isToday) {
    // 今天的任务平衡待执行和进行中
    const statuses = [
      '待执行', '待执行', '待执行', '待执行',  // 4个待执行
      '进行中', '进行中', '进行中', '进行中', '进行中',  // 5个进行中
      '已完成'  // 1个已完成
    ]
    status = statuses[Math.floor(Math.random() * statuses.length)]
    progress = status === '进行中' ? Math.floor(Math.random() * 60) + 20 : 
               status === '已完成' ? 100 : 0
  } else if (isRecent) {
    // 最近7天的任务增加待执行比例
    const rand = Math.random()
    if (rand < 0.35) { // 35%待执行
      status = '待执行'
      progress = 0
    } else if (rand < 0.85) { // 50%进行中
      status = '进行中'
      progress = Math.floor(Math.random() * 40) + 30
    } else if (rand < 0.95) { // 10%已完成
      status = '已完成'
      progress = 100
    } else { // 5%已超时
      status = '已超时'
      progress = Math.floor(Math.random() * 30) + 60
    }
  } else {
    // 历史任务保持一定比例的待执行
    const rand = Math.random()
    if (rand < 0.25) { // 25%待执行
      status = '待执行'
      progress = 0
    } else if (rand < 0.65) { // 40%进行中
      status = '进行中'
      progress = Math.floor(Math.random() * 30) + 40
    } else if (rand < 0.95) { // 30%已完成
      status = '已完成'
      progress = 100
    } else { // 5%已超时
      status = '已超时'
      progress = Math.floor(Math.random() * 20) + 80
    }
  }

  // 进行中状态的进度更加随机化
  if (status === '进行中') {
    progress = Math.floor(Math.random() * 70) + 15 // 15-85%的进度范围
  }

  return {
    taskNo: generateTaskNo(date),
    area,
    inspector: INSPECTORS[Math.floor(Math.random() * INSPECTORS.length)],
    startTime: `${date} ${String(startHour).padStart(2, '0')}:00:00`,
    endTime: `${date} ${String(startHour + 9).padStart(2, '0')}:00:00`,
    status,
    progress,
    content,
    remark: generateRemark(status, content)
  }
}

// 生成指定数量的任务数据
export const generateMockTasks = (count: number = 100): Task[] => {
  const tasks: Task[] = []
  const endDate = dayjs()
  let currentDate = endDate.subtract(90, 'day')
  
  while (tasks.length < count) {
    // 每天生成2-4个任务
    const dailyTaskCount = Math.floor(Math.random() * 3) + 2
    
    for (let i = 0; i < dailyTaskCount && tasks.length < count; i++) {
      tasks.push(generateTask(currentDate.format('YYYY-MM-DD'), i))
    }
    
    currentDate = currentDate.add(1, 'day')
  }
  
  return tasks.sort((a, b) => b.startTime.localeCompare(a.startTime))
} 