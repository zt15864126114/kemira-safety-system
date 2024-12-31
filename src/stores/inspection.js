import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('inspection-task', () => {
  // 初始数据
  const initialTasks = [
    {
      taskNo: 'T202403200001',
      area: '生产区A',
      inspector: '张明华',
      planTime: '2024-03-20 09:00:00',
      type: '日常巡检',
      priority: '高',
      status: '进行中',
      route: '生产线巡检路线A',
      checkPoints: 12,
      estimatedDuration: '45分钟',
      actualDuration: '40分钟',
      remark: '重点关注设备运行状态',
      description: '对生产线A区进行全面巡检，包括设备状态、安全隐患等',
      attachments: ['url1', 'url2']
    },
    // ... 其他初始数据 ...
  ]

  const taskList = ref(JSON.parse(localStorage.getItem('inspection_tasks')) || initialTasks)

  // 保存到本地存储
  const saveToStorage = () => {
    localStorage.setItem('inspection_tasks', JSON.stringify(taskList.value))
  }

  // 添加任务
  const addTask = (task) => {
    taskList.value.push(task)
    saveToStorage()
  }

  // 更新任务
  const updateTask = (taskNo, updates) => {
    const index = taskList.value.findIndex(t => t.taskNo === taskNo)
    if (index !== -1) {
      taskList.value[index] = { ...taskList.value[index], ...updates }
      saveToStorage()
    }
  }

  // 删除任务
  const deleteTask = (taskNo) => {
    taskList.value = taskList.value.filter(t => t.taskNo !== taskNo)
    saveToStorage()
  }

  // 开始任务
  const startTask = (taskNo) => {
    updateTask(taskNo, {
      status: '进行中',
      startTime: new Date().toISOString()
    })
  }

  // 完成任务
  const completeTask = (taskNo) => {
    updateTask(taskNo, {
      status: '已完成',
      endTime: new Date().toISOString()
    })
  }

  // 搜索任务
  const searchTasks = (params) => {
    return taskList.value.filter(task => {
      if (params.status && task.status !== params.status) return false
      if (params.area && task.area !== params.area) return false
      if (params.inspector && task.inspector !== params.inspector) return false
      if (params.dateRange?.length === 2) {
        const taskDate = new Date(task.planTime)
        const [start, end] = params.dateRange
        if (taskDate < start || taskDate > end) return false
      }
      return true
    })
  }

  return {
    taskList,
    addTask,
    updateTask,
    deleteTask,
    startTask,
    completeTask,
    searchTasks
  }
}) 