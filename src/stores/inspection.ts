import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

export interface Task {
  taskNo: string
  area: string
  inspector: string
  startTime: string
  endTime: string
  status: string
  progress: number
  content?: string
  remark?: string
}

export interface InspectionRecord {
  id: number
  type: string
  time: string
  title: string
  category: string
  content: string
  images: string[]
}

export interface AbnormalRecord {
  id: number
  time: string
  location: string
  type: string
  description: string
  status: string
  handleResult?: string
}

// 修改初始测试数据，确保与选择器中的值完全一致
const initialTasks: Task[] = [
  {
    taskNo: 'JX202403180001',
    area: '化学品储存区A',
    inspector: '张明',
    startTime: '2024-03-18 08:00:00',
    endTime: '2024-03-18 17:00:00',
    status: '已完成',
    progress: 100,
    content: '日常安全巡检',
    remark: '无异常'
  },
  {
    taskNo: 'JX202403180002',
    area: '生产车间B',
    inspector: '李伟',
    startTime: '2024-03-18 09:00:00',
    endTime: '2024-03-18 18:00:00',
    status: '进行中',
    progress: 60,
    content: '设备运行状态检查',
    remark: '2号生产线需要维护'
  },
  {
    taskNo: 'JX202403180003',
    area: '仓储区C',
    inspector: '王强',
    startTime: '2024-03-18 10:00:00',
    endTime: '2024-03-18 19:00:00',
    status: '待执行',
    progress: 0,
    content: '库存安全检查',
    remark: ''
  },
  {
    taskNo: 'JX202403170001',
    area: '化学品储存区A',
    inspector: '刘洋',
    startTime: '2024-03-17 08:00:00',
    endTime: '2024-03-17 17:00:00',
    status: '已完成',
    progress: 100,
    content: '危险品存储检查',
    remark: '已完成整改'
  },
  {
    taskNo: 'JX202403170002',
    area: '生产车间B',
    inspector: '陈勇',
    startTime: '2024-03-17 09:00:00',
    endTime: '2024-03-17 18:00:00',
    status: '已超时',
    progress: 80,
    content: '设备维护检查',
    remark: '需要更换零件'
  },
  {
    taskNo: 'JX202403160001',
    area: '仓储区C',
    inspector: '赵静',
    startTime: '2024-03-16 08:00:00',
    endTime: '2024-03-16 17:00:00',
    status: '已完成',
    progress: 100,
    content: '货物堆放检查',
    remark: '已整理完成'
  },
  {
    taskNo: 'JX202403160002',
    area: '化学品储存区A',
    inspector: '孙磊',
    startTime: '2024-03-16 09:00:00',
    endTime: '2024-03-16 18:00:00',
    status: '已完成',
    progress: 100,
    content: '危险品泄漏检查',
    remark: '防泄漏设施完好'
  },
  {
    taskNo: 'JX202403150001',
    area: '生产车间B',
    inspector: '周涛',
    startTime: '2024-03-15 08:00:00',
    endTime: '2024-03-15 17:00:00',
    status: '已完成',
    progress: 100,
    content: '设备维护检查',
    remark: '已更换滤芯'
  },
  {
    taskNo: 'JX202403150002',
    area: '仓储区C',
    inspector: '吴婷',
    startTime: '2024-03-15 09:00:00',
    endTime: '2024-03-15 18:00:00',
    status: '已完成',
    progress: 100,
    content: '货物堆放检查',
    remark: '已整理货架'
  },
  {
    taskNo: 'JX202403140001',
    area: '化学品储存区A',
    inspector: '郑阳',
    startTime: '2024-03-14 08:00:00',
    endTime: '2024-03-14 17:00:00',
    status: '已完成',
    progress: 100,
    content: '通风系统检查',
    remark: '通风正常'
  },
  {
    taskNo: 'JX202403140002',
    area: '生产车间B',
    inspector: '杨帆',
    startTime: '2024-03-14 09:00:00',
    endTime: '2024-03-14 18:00:00',
    status: '已完成',
    progress: 100,
    content: '设备维护检查',
    remark: '已更换滤芯'
  },
  {
    taskNo: 'JX202403130001',
    area: '仓储区C',
    inspector: '黄晓明',
    startTime: '2024-03-13 08:00:00',
    endTime: '2024-03-13 17:00:00',
    status: '已完成',
    progress: 100,
    content: '货物堆放检查',
    remark: '已整理货架'
  },
  {
    taskNo: 'JX202403130002',
    area: '化学品储存区A',
    inspector: '马超',
    startTime: '2024-03-13 09:00:00',
    endTime: '2024-03-13 18:00:00',
    status: '已完成',
    progress: 100,
    content: '通风系统检查',
    remark: '通风正常'
  },
  {
    taskNo: 'JX202403120001',
    area: '生产车间B',
    inspector: '徐亮',
    startTime: '2024-03-12 08:00:00',
    endTime: '2024-03-12 17:00:00',
    status: '已完成',
    progress: 100,
    content: '安全生产检查',
    remark: '已补充防护用品'
  },
  {
    taskNo: 'JX202403120002',
    area: '仓储区C',
    inspector: '朱峰',
    startTime: '2024-03-12 09:00:00',
    endTime: '2024-03-12 18:00:00',
    status: '已完成',
    progress: 100,
    content: '仓库环境检查',
    remark: '温湿度正常'
  },
  {
    taskNo: 'JX202403110001',
    area: '化学品储存区A',
    inspector: '韩雪',
    startTime: '2024-03-11 08:00:00',
    endTime: '2024-03-11 17:00:00',
    status: '已完成',
    progress: 100,
    content: '化学品标签检查',
    remark: '标签完整清晰'
  },
  {
    taskNo: 'JX202403110002',
    area: '生产车间B',
    inspector: '方明',
    startTime: '2024-03-11 09:00:00',
    endTime: '2024-03-11 18:00:00',
    status: '已完成',
    progress: 100,
    content: '机械设备检查',
    remark: '传动装置正常'
  },
  {
    taskNo: 'JX202403100001',
    area: '仓储区C',
    inspector: '董莉',
    startTime: '2024-03-10 08:00:00',
    endTime: '2024-03-10 17:00:00',
    status: '已完成',
    progress: 100,
    content: '应急通道检查',
    remark: '通道畅通'
  },
  {
    taskNo: 'JX202403100002',
    area: '化学品储存区A',
    inspector: '谢峰',
    startTime: '2024-03-10 09:00:00',
    endTime: '2024-03-10 18:00:00',
    status: '已完成',
    progress: 100,
    content: '防护设施检查',
    remark: '防护设施完好'
  },
  {
    taskNo: 'JX202403090001',
    area: '生产车间B',
    inspector: '罗静',
    startTime: '2024-03-09 08:00:00',
    endTime: '2024-03-09 17:00:00',
    status: '已完成',
    progress: 100,
    content: '噪音检测',
    remark: '噪音达标'
  },
  {
    taskNo: 'JX202403090002',
    area: '仓储区C',
    inspector: '唐军',
    startTime: '2024-03-09 09:00:00',
    endTime: '2024-03-09 18:00:00',
    status: '已完成',
    progress: 100,
    content: '货物包装检查',
    remark: '包装完整'
  },
  {
    taskNo: 'JX202403080001',
    area: '化学品储存区A',
    inspector: '邓超',
    startTime: '2024-03-08 08:00:00',
    endTime: '2024-03-08 17:00:00',
    status: '已完成',
    progress: 100,
    content: '泄漏应急演练',
    remark: '演练完成'
  },
  {
    taskNo: 'JX202403080002',
    area: '生产车间B',
    inspector: '范丽',
    startTime: '2024-03-08 09:00:00',
    endTime: '2024-03-08 18:00:00',
    status: '已完成',
    progress: 100,
    content: '工具检查',
    remark: '工具完备'
  },
  {
    taskNo: 'JX202403070001',
    area: '仓储区C',
    inspector: '蒋勇',
    startTime: '2024-03-07 08:00:00',
    endTime: '2024-03-07 17:00:00',
    status: '已完成',
    progress: 100,
    content: '照明系统检查',
    remark: '照明正常'
  },
  {
    taskNo: 'JX202403070002',
    area: '化学品储存区A',
    inspector: '魏明',
    startTime: '2024-03-07 09:00:00',
    endTime: '2024-03-07 18:00:00',
    status: '已完成',
    progress: 100,
    content: '安全警示检查',
    remark: '警示标识完整'
  },
  {
    taskNo: 'JX202403190001',
    area: '生产车间B',
    inspector: '韩雪',
    startTime: '2024-03-19 08:00:00',
    endTime: '2024-03-19 17:00:00',
    status: '待执行',
    progress: 0,
    content: '设备润滑检查',
    remark: ''
  },
  {
    taskNo: 'JX202403190002',
    area: '仓储区C',
    inspector: '方明',
    startTime: '2024-03-19 09:00:00',
    endTime: '2024-03-19 18:00:00',
    status: '待执行',
    progress: 0,
    content: '消防通道检查',
    remark: ''
  },
  {
    taskNo: 'JX202403190003',
    area: '化学品储存区A',
    inspector: '董莉',
    startTime: '2024-03-19 10:00:00',
    endTime: '2024-03-19 19:00:00',
    status: '待执行',
    progress: 0,
    content: '应急设备检查',
    remark: ''
  },
  {
    taskNo: 'JX202403190004',
    area: '生产车间B',
    inspector: '谢峰',
    startTime: '2024-03-19 11:00:00',
    endTime: '2024-03-19 20:00:00',
    status: '待执行',
    progress: 0,
    content: '安全培训检查',
    remark: ''
  }
]

export const useInspectionStore = defineStore('inspection', () => {
  // 状态
  const tasks = ref<Task[]>([]) // 初始为空数组
  const records = ref<Record<string, InspectionRecord[]>>({})
  const abnormals = ref<Record<string, AbnormalRecord[]>>({})
  const loading = ref(false)

  // 计算属性
  const pendingTasks = computed(() => 
    tasks.value.filter(task => task.status === '待执行').length
  )
  const processingTasks = computed(() => 
    tasks.value.filter(task => task.status === '进行中').length
  )
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.status === '已完成').length
  )
  const timeoutTasks = computed(() => 
    tasks.value.filter(task => task.status === '已超时').length
  )

  // 方法
  const loadTasks = () => {
    loading.value = true
    try {
      // 如果本地存储中没有数据，则使用初始测试数据
      const storedTasks = localStorage.getItem('inspection_tasks')
      if (!storedTasks) {
        tasks.value = initialTasks
        // 保存到本地存储
        localStorage.setItem('inspection_tasks', JSON.stringify(initialTasks))
      } else {
        tasks.value = JSON.parse(storedTasks)
      }
    } catch (error) {
      console.error('加载任务失败:', error)
      // 如果出错，使用初始测试数据
      tasks.value = initialTasks
    } finally {
      loading.value = false
    }
  }

  const saveTasks = () => {
    try {
      localStorage.setItem('inspection_tasks', JSON.stringify(tasks.value))
    } catch (error) {
      console.error('保存任务失败:', error)
      ElMessage.error('保存任务失败')
    }
  }

  const addTask = (task: Task) => {
    tasks.value.unshift(task)
    saveTasks()
    ElMessage.success('创建任务成功')
  }

  const updateTask = (taskNo: string, updates: Partial<Task>) => {
    const index = tasks.value.findIndex(t => t.taskNo === taskNo)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updates }
      saveTasks()
      ElMessage.success('更新任务成功')
    }
  }

  const deleteTask = (taskNo: string) => {
    const index = tasks.value.findIndex(t => t.taskNo === taskNo)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      saveTasks()
      ElMessage.success('删除任务成功')
    }
  }

  const getTaskById = (taskNo: string) => {
    const task = tasks.value.find(task => task.taskNo === taskNo)
    if (!task) {
      return null
    }
    // 确保返回的是完整的任务信息
    return {
      ...task,
      inspector: task.inspector // 确保这里的值与列表中的一致
    }
  }

  // 巡检记录相关
  const loadRecords = (taskNo: string) => {
    try {
      const savedRecords = localStorage.getItem(`inspection_records_${taskNo}`)
      if (savedRecords) {
        records.value[taskNo] = JSON.parse(savedRecords)
      }
    } catch (error) {
      console.error('加载记录失败:', error)
      ElMessage.error('加载记录失败')
    }
  }

  const saveRecords = (taskNo: string) => {
    try {
      localStorage.setItem(
        `inspection_records_${taskNo}`,
        JSON.stringify(records.value[taskNo] || [])
      )
    } catch (error) {
      console.error('保存记录失败:', error)
      ElMessage.error('保存记录失败')
    }
  }

  const addRecord = (taskNo: string, record: InspectionRecord) => {
    if (!records.value[taskNo]) {
      records.value[taskNo] = []
    }
    records.value[taskNo].push(record)
    saveRecords(taskNo)
    
    // 更新任务进度
    const task = getTaskById(taskNo)
    if (task) {
      const totalPoints = records.value[taskNo].length * 20
      const progress = Math.min(Math.round(totalPoints), 100)
      updateTask(taskNo, { progress })
    }
  }

  // 异常记录相关
  const loadAbnormals = (taskNo: string) => {
    try {
      const savedAbnormals = localStorage.getItem(`inspection_abnormals_${taskNo}`)
      if (savedAbnormals) {
        abnormals.value[taskNo] = JSON.parse(savedAbnormals)
      }
    } catch (error) {
      console.error('加载异常记录失败:', error)
      ElMessage.error('加载异常记录失败')
    }
  }

  const saveAbnormals = (taskNo: string) => {
    try {
      localStorage.setItem(
        `inspection_abnormals_${taskNo}`,
        JSON.stringify(abnormals.value[taskNo] || [])
      )
    } catch (error) {
      console.error('保存异常记录失败:', error)
      ElMessage.error('保存异常记录失败')
    }
  }

  const addAbnormal = (taskNo: string, abnormal: AbnormalRecord) => {
    if (!abnormals.value[taskNo]) {
      abnormals.value[taskNo] = []
    }
    abnormals.value[taskNo].push(abnormal)
    saveAbnormals(taskNo)
  }

  const updateAbnormal = (taskNo: string, abnormalId: number, updates: Partial<AbnormalRecord>) => {
    const abnormalList = abnormals.value[taskNo]
    if (abnormalList) {
      const index = abnormalList.findIndex(a => a.id === abnormalId)
      if (index !== -1) {
        abnormalList[index] = { ...abnormalList[index], ...updates }
        saveAbnormals(taskNo)
      }
    }
  }

  // 初始化
  loadTasks()

  return {
    tasks,
    records,
    abnormals,
    loading,
    pendingTasks,
    processingTasks,
    completedTasks,
    timeoutTasks,
    loadTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    loadRecords,
    addRecord,
    loadAbnormals,
    addAbnormal,
    updateAbnormal
  }
}) 