<template>
  <div class="inspection-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="24" class="stat-cards">
      <el-col :span="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover">
          <div class="stat-card">
            <div class="stat-icon" :class="card.type">
              <el-icon :size="24">
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ card.title }}</div>
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-change" :class="card.trend">
                {{ card.change }}
                <el-icon><component :is="card.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 巡检任务列表 -->
    <el-card class="task-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">巡检任务</span>
            <el-tag type="info" effect="plain">共 {{ total }} 条</el-tag>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="createTask">
              <el-icon><Plus /></el-icon>新建任务
            </el-button>
          </div>
        </div>
      </template>

      <!-- 筛选条件 -->
      <el-form :model="filterForm" class="filter-form">
        <div class="form-row">
          <el-form-item label="任务状态">
            <el-select 
              v-model="filterForm.status" 
              placeholder="请选择状态" 
              clearable
              style="width: 220px"
            >
              <el-option
                v-for="option in statusOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <el-tag :type="getStatusType(option.value)" size="small">
                  {{ option.label }}
                </el-tag>
              </el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="巡检区域">
            <el-select 
              v-model="filterForm.area" 
              placeholder="请选择区域" 
              clearable
              style="width: 220px"
            >
              <el-option label="化学品储存区A" value="area-a" />
              <el-option label="生产车间B" value="area-b" />
              <el-option label="仓储区C" value="area-c" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="巡检人员">
            <el-select
              v-model="filterForm.inspector"
              placeholder="请选择巡检人员"
              clearable
              filterable
              :filter-method="filterInspector"
              style="width: 220px"
            >
              <el-option
                v-for="inspector in inspectorOptions"
                :key="inspector.value"
                :label="inspector.label"
                :value="inspector.value"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="form-row">
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 420px"
              :shortcuts="[
                {
                  text: '最近一周',
                  value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                    return [start, end]
                  },
                },
                {
                  text: '最近一个月',
                  value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                    return [start, end]
                  },
                },
                {
                  text: '最近三个月',
                  value: () => {
                    const end = new Date()
                    const start = new Date()
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                    return [start, end]
                  },
                },
              ]"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          
          <div class="form-buttons">
            <el-button type="primary" @click="handleSearch" :icon="Search">查询</el-button>
            <el-button @click="resetForm" :icon="Refresh">重置</el-button>
          </div>
        </div>
      </el-form>

      <!-- 任务列表 -->
      <el-table
        :data="taskList"
        style="width: 100%"
        v-loading="loading"
        element-loading-text="加载中..."
        element-loading-background="rgba(255, 255, 255, 0.7)"
      >
        <el-table-column prop="taskNo" label="任务编号" width="120" />
        <el-table-column prop="area" label="巡检区域" width="150" />
        <el-table-column prop="inspector" label="巡检人员" min-width="150">
          <template #default="{ row }">
            {{ getInspectorLabel(row.inspector) }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="200">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.progress"
              :status="getProgressStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <el-button 
              type="primary" 
              link 
              size="small" 
              @click="viewDetail(scope.row)"
            >
              查看
            </el-button>
            <el-button 
              type="success" 
              link 
              size="small" 
              v-if="scope.row.status === '待执行'"
              @click="startTask(scope.row)"
            >
              开始
            </el-button>
            <el-button 
              type="warning" 
              link 
              size="small" 
              v-if="scope.row.status === '进行中'"
              @click="completeTask(scope.row)"
            >
              完成
            </el-button>
            <el-button 
              type="danger" 
              link 
              size="small"
              v-if="['待执行', '已超时'].includes(scope.row.status)"
              @click="cancelTask(scope.row)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 新建任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="新建巡检任务"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="taskFormRef"
        :model="taskForm"
        :rules="taskRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="巡检区域" prop="area">
          <el-select 
            v-model="taskForm.area" 
            placeholder="请选择区域"
            style="width: 100%"
          >
            <el-option
              v-for="area in areaOptions"
              :key="area.value"
              :label="area.label"
              :value="area.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检人员" prop="inspector">
          <el-select
            v-model="taskForm.inspector"
            placeholder="请选择巡检人员"
            filterable
            :filter-method="filterInspector"
            style="width: 100%"
          >
            <el-option
              v-for="inspector in inspectorOptions"
              :key="inspector.value"
              :label="inspector.label"
              :value="inspector.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="taskForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="taskForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="巡检内容" prop="content">
          <el-input
            type="textarea"
            v-model="taskForm.content"
            rows="4"
            placeholder="请输入巡检内容和要求"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="taskForm.remark"
            placeholder="请输入备注信息"
            show-word-limit
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitTask">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search, Refresh, Timer, List, User, Warning } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useInspectionStore } from '@/stores/inspection'
import type { Task } from '@/stores/inspection'

const store = useInspectionStore()
const router = useRouter()

// 添加loading状态
const loading = computed(() => store.loading)

// 统计卡片数据
const statCards = computed(() => [
  {
    title: '待执行任务',
    value: store.pendingTasks,
    icon: Timer,
    type: 'primary',
    trend: 'up',
    change: '+2 较昨日'
  },
  {
    title: '进行中任务',
    value: store.processingTasks,
    icon: List,
    type: 'success',
    trend: 'up',
    change: '+1 较昨日'
  },
  {
    title: '已完成任务',
    value: store.completedTasks,
    icon: User,
    type: 'warning',
    trend: 'down',
    change: '-1 较昨日'
  },
  {
    title: '超时任务',
    value: store.timeoutTasks,
    icon: Warning,
    type: 'danger',
    trend: 'up',
    change: '+1 较昨日'
  }
])

// 筛选表单
const filterForm = reactive({
  status: '',
  area: '',
  inspector: '',
  dateRange: [] as string[]
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => {
  let filteredTasks = [...store.tasks]
  
  // 应用筛选条件
  if (filterForm.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filterForm.status)
  }
  if (filterForm.area) {
    filteredTasks = filteredTasks.filter(task => task.area === filterForm.area)
  }
  if (filterForm.inspector) {
    filteredTasks = filteredTasks.filter(task => task.inspector === filterForm.inspector)
  }
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = new Date(filterForm.dateRange[0])
    const endDate = new Date(filterForm.dateRange[1])
    endDate.setHours(23, 59, 59, 999)
    
    filteredTasks = filteredTasks.filter(task => {
      const taskStartDate = new Date(task.startTime)
      return taskStartDate >= startDate && taskStartDate <= endDate
    })
  }
  
  return filteredTasks.length
})

// 任务列表
const taskList = computed(() => {
  let filteredTasks = [...store.tasks]
  
  // 应用筛选条件
  if (filterForm.status) {
    filteredTasks = filteredTasks.filter(task => task.status === filterForm.status)
  }
  if (filterForm.area) {
    filteredTasks = filteredTasks.filter(task => task.area === filterForm.area)
  }
  if (filterForm.inspector) {
    filteredTasks = filteredTasks.filter(task => task.inspector === filterForm.inspector)
  }
  if (filterForm.dateRange && filterForm.dateRange.length === 2) {
    const startDate = new Date(filterForm.dateRange[0])
    const endDate = new Date(filterForm.dateRange[1])
    // 设置结束日期为当天的23:59:59
    endDate.setHours(23, 59, 59, 999)
    
    filteredTasks = filteredTasks.filter(task => {
      const taskStartDate = new Date(task.startTime)
      return taskStartDate >= startDate && taskStartDate <= endDate
    })
  }

  // 分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredTasks.slice(startIndex, startIndex + pageSize.value)
})

// 扩充巡检人员选项
const inspectorOptions = [
  { value: '张明', label: '张明 - 安全主管' },
  { value: '李伟', label: '李伟 - 设备工程师' },
  { value: '王强', label: '王强 - 安全员' },
  { value: '刘洋', label: '刘洋 - 设备维护' },
  { value: '陈勇', label: '陈勇 - 安全员' },
  { value: '赵静', label: '赵静 - 质检员' },
  { value: '孙磊', label: '孙磊 - 安全工程师' },
  { value: '周涛', label: '周涛 - 设备维护' },
  { value: '吴婷', label: '吴婷 - 质检员' },
  { value: '郑阳', label: '郑阳 - 安全主管' },
  { value: '杨帆', label: '杨帆 - 设备工程师' },
  { value: '黄晓明', label: '黄晓明 - 安全员' },
  { value: '马超', label: '马超 - 设备维护' },
  { value: '徐亮', label: '徐亮 - 质检主管' },
  { value: '朱峰', label: '朱峰 - 安全员' },
  { value: '韩雪', label: '韩雪 - 质检员' },
  { value: '方明', label: '方明 - 设备工程师' },
  { value: '董莉', label: '董莉 - 安全员' },
  { value: '谢峰', label: '谢峰 - 设备维护' },
  { value: '罗静', label: '罗静 - 质检员' }
]

// 表单相关
const taskFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const taskForm = reactive({
  area: '',
  inspector: '',
  startTime: '',
  endTime: '',
  content: '',
  remark: ''
})

// 表单验证规则
const taskRules = reactive<FormRules>({
  area: [{ required: true, message: '请选择巡检区域', trigger: 'change' }],
  inspector: [{ required: true, message: '请选择巡检人员', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  content: [
    { required: true, message: '请输入巡检内容', trigger: 'blur' },
    { min: 10, message: '巡检内容不能少于10个字符', trigger: 'blur' }
  ]
})

// 生成任务编号
const generateTaskNo = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `T${year}${month}${day}${random}`
}

// 新建任务
const createTask = () => {
  dialogVisible.value = true
  if (taskFormRef.value) {
    taskFormRef.value.resetFields()
  }
}

// 提交任务
const submitTask = async () => {
  if (!taskFormRef.value) return
  
  await taskFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (new Date(taskForm.startTime) >= new Date(taskForm.endTime)) {
        ElMessage.error('结束时间必须大于开始时间')
        return
      }

      const newTask: Task = {
        taskNo: generateTaskNo(),
        area: taskForm.area,
        inspector: taskForm.inspector,
        startTime: new Date(taskForm.startTime).toLocaleString(),
        endTime: new Date(taskForm.endTime).toLocaleString(),
        status: '待执行',
        progress: 0,
        content: taskForm.content,
        remark: taskForm.remark
      }

      store.addTask(newTask)
      dialogVisible.value = false
    } else {
      console.log('验证失败:', fields)
      ElMessage.error('请完善表单信息')
    }
  })
}

// 查看详情
const viewDetail = (row: Task) => {
  router.push({
    name: 'InspectionDetail',
    params: { id: row.taskNo }
  })
}

// 开始任务
const startTask = (row: Task) => {
  ElMessageBox.confirm(
    '确认开始此巡检任务吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    store.updateTask(row.taskNo, {
      status: '进行中',
      progress: 0
    })
  }).catch(() => {})
}

// 完成任务
const completeTask = (row: Task) => {
  ElMessageBox.confirm(
    '确认完成此巡检任务吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    store.updateTask(row.taskNo, {
      status: '已完成',
      progress: 100
    })
  }).catch(() => {})
}

// 取消任务
const cancelTask = (row: Task) => {
  ElMessageBox.confirm(
    '确认取消此巡检任务吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }
  ).then(() => {
    store.deleteTask(row.taskNo)
  }).catch(() => {})
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  // 可以添加日志查看筛选条件
  console.log('筛选条件:', filterForm)
}

// 重置表单
const resetForm = () => {
  filterForm.status = ''
  filterForm.area = ''
  filterForm.inspector = ''
  filterForm.dateRange = []
  currentPage.value = 1
}

// 分页相关
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    '待执行': 'info',
    '进行中': 'primary',
    '已完成': 'success',
    '已超时': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取进度条状态
const getProgressStatus = (row: Task) => {
  if (row.status === '已完成') return 'success'
  if (row.status === '已超时') return 'exception'
  return ''
}

// 对话框关闭处理
const handleDialogClose = () => {
  if (taskFormRef.value) {
    taskFormRef.value.resetFields()
  }
  taskForm.area = ''
  taskForm.inspector = ''
  taskForm.startTime = ''
  taskForm.endTime = ''
  taskForm.content = ''
  taskForm.remark = ''
}

// 定义状态选项
const statusOptions = [
  { value: '待执行', label: '待执行' },
  { value: '进行中', label: '进行中' },
  { value: '已完成', label: '已完成' },
  { value: '已超时', label: '已超时' }
]

// 格式化日期显示
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 扩充区域选项
const areaOptions = [
  { value: '化学品储存区A', label: '化学品储存区A' },
  { value: '化学品储存区B', label: '化学品储存区B' },
  { value: '化学品储存区C', label: '化学品储存区C' },
  { value: '生产车间A', label: '生产车间A' },
  { value: '生产车间B', label: '生产车间B' },
  { value: '生产车间C', label: '生产车间C' },
  { value: '生产车间D', label: '生产车间D' },
  { value: '仓储区A', label: '仓储区A' },
  { value: '仓储区B', label: '仓储区B' },
  { value: '仓储区C', label: '仓储区C' },
  { value: '原料仓库', label: '原料仓库' },
  { value: '成品仓库', label: '成品仓库' },
  { value: '包装车间', label: '包装车间' },
  { value: '实验室A', label: '实验室A' },
  { value: '实验室B', label: '实验室B' },
  { value: '质检区', label: '质检区' },
  { value: '设备维修间', label: '设备维修间' },
  { value: '动力中心', label: '动力中心' },
  { value: '污水处理站', label: '污水处理站' },
  { value: '办公区', label: '办公区' }
]

// 搜索过滤方法
const filterInspector = (query: string, item: { value: string, label: string }) => {
  return item.label.toLowerCase().includes(query.toLowerCase())
}

// 获取人员完整信息的方法
const getInspectorLabel = (value: string) => {
  const inspector = inspectorOptions.find(item => item.value === value)
  return inspector ? inspector.label : value
}

// 初始化
onMounted(() => {
  store.loadTasks()
})
</script>

<style scoped lang="scss">
.inspection-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);

  .stat-cards {
    margin-bottom: 24px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 20px;

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        
        &.primary { 
          background-color: #ecf5ff;
          color: #409eff;
        }
        &.success { 
          background-color: #f0f9eb;
          color: #67c23a;
        }
        &.warning { 
          background-color: #fdf6ec;
          color: #e6a23c;
        }
        &.danger { 
          background-color: #fef0f0;
          color: #f56c6c;
        }
      }

      .stat-info {
        flex: 1;

        .stat-title {
          font-size: 14px;
          color: #606266;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-change {
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;

          &.up { 
            color: #67c23a;
            .el-icon { color: #67c23a; }
          }
          &.down { 
            color: #f56c6c;
            .el-icon { color: #f56c6c; }
          }
        }
      }
    }
  }

  .task-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .title {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }

    .filter-form {
      background-color: #fff;
      padding: 24px;
      border-radius: 4px;
      margin-bottom: 20px;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);

      .form-row {
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        :deep(.el-form-item) {
          margin-bottom: 0;
          margin-right: 40px;
          flex-shrink: 0;

          &:last-child {
            margin-right: 0;
          }

          .el-form-item__label {
            font-weight: normal;
            color: #606266;
            padding-right: 12px;
          }
        }
      }

      .form-buttons {
        margin-left: auto;
        flex-shrink: 0;

        :deep(.el-button) {
          margin-left: 0;
          margin-right: 12px;
          padding: 9px 20px;
          
          &:last-child {
            margin-right: 0;
          }
        }
      }

      :deep(.el-select) {
        .el-input__wrapper {
          box-shadow: 0 0 0 1px #dcdfe6 inset;
        }
      }

      :deep(.el-date-editor) {
        .el-input__wrapper {
          box-shadow: 0 0 0 1px #dcdfe6 inset;
        }
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-card) {
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0,21,41,.12);
    }
  }

  // 添加状态选择下拉框的样式
  :deep(.el-select-dropdown__item) {
    padding: 0 12px;
    height: 34px;
    line-height: 34px;
  }

  :deep(.el-tag) {
    margin: 0 2px;
  }

  :deep(.el-date-editor.el-input) {
    width: 260px;
  }

  :deep(.el-table) {
    .el-table__cell {
      padding: 8px 0;
    }
  }
}
</style> 