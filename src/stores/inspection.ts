import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { generateMockTasks } from '@/utils/mockInspectionData'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import type { Task } from '@/types/inspection'

dayjs.extend(isBetween)

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

// 使用 mock 数据生成器替换原有的静态数据
const initialTasks = generateMockTasks(100)

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
  
  // 新增：本月任务统计
  const currentMonthTasks = computed(() => 
    tasks.value.filter(task => 
      dayjs(task.startTime).isSame(dayjs(), 'month')
    ).length
  )

  // 新增：按区域统计任务数量
  const tasksByArea = computed(() => {
    const stats: Record<string, number> = {}
    tasks.value.forEach(task => {
      stats[task.area] = (stats[task.area] || 0) + 1
    })
    return stats
  })

  // 方法
  const loadTasks = (refresh = false) => {
    loading.value = true
    try {
      const storedTasks = localStorage.getItem('inspection_tasks')
      if (!storedTasks || refresh) {
        // 如果需要刷新或没有存储数据，则生成新的模拟数据
        tasks.value = generateMockTasks(100)
        localStorage.setItem('inspection_tasks', JSON.stringify(tasks.value))
      } else {
        tasks.value = JSON.parse(storedTasks)
      }
    } catch (error) {
      console.error('加载任务失败:', error)
      tasks.value = generateMockTasks(100)
    } finally {
      loading.value = false
    }
  }

  // 新增：刷新数据方法
  const refreshTasks = () => {
    loadTasks(true)
    ElMessage.success('数据已刷新')
  }

  // 新增：获取指定日期范围的任务
  const getTasksByDateRange = (startDate: string, endDate: string) => {
    return tasks.value.filter(task => 
      dayjs(task.startTime).isBetween(startDate, endDate, 'day', '[]')
    )
  }

  // 新增：获取指定区域的任务
  const getTasksByArea = (area: string) => {
    return tasks.value.filter(task => task.area === area)
  }

  const saveTasks = () => {
    try {
      localStorage.setItem('inspection_tasks', JSON.stringify(tasks.value))
    } catch (error) {
      console.error('保存任务失败:', error)
      ElMessage.error('保存任务失败')
    }
  }

  const addTask = (task: Omit<Task, 'taskNo'>) => {
    const newTask: Task = {
      ...task,
      taskNo: `JX${dayjs().format('YYYYMMDD')}${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`
    }
    tasks.value.unshift(newTask)
    saveTasks()
    ElMessage.success('创建任务成功')
    return newTask
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
    currentMonthTasks,
    tasksByArea,
    loadTasks,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    getTasksByDateRange,
    getTasksByArea,
    loadRecords,
    addRecord,
    loadAbnormals,
    addAbnormal,
    updateAbnormal
  }
}) 