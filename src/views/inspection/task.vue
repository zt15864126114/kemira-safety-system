<template>
    <div class="inspection-task">
      <!-- 搜索条件 -->
      <el-card class="search-card">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="任务状态">
            <el-select v-model="searchForm.status" placeholder="请选择">
              <el-option label="待执行" value="待执行" />
              <el-option label="进行中" value="进行中" />
              <el-option label="已完成" value="已完成" />
              <el-option label="已超时" value="已超时" />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检区域">
            <el-select v-model="searchForm.area" placeholder="请选择">
              <el-option label="生产区A" value="生产区A" />
              <el-option label="生产区B" value="生产区B" />
              <el-option label="储存区A" value="储存区A" />
              <el-option label="储存区B" value="储存区B" />
              <el-option label="包装区" value="包装区" />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检人员">
            <el-select v-model="searchForm.inspector" placeholder="请选择">
              <el-option
                v-for="inspector in inspectorOptions"
                :key="inspector.value"
                :label="inspector.label"
                :value="inspector.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="计划时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  
      <!-- 任务列表 -->
      <el-card class="task-card">
        <template #header>
          <div class="card-header">
            <span>巡检任务列表</span>
            <div class="header-btns">
              <el-button type="success" @click="exportTasks">导出任务</el-button>
              <el-button type="primary" @click="createTask">新建任务</el-button>
            </div>
          </div>
        </template>
  
        <el-table :data="paginatedTableData" style="width: 100%" v-loading="loading">
          <el-table-column type="expand">
            <template #default="props">
              <el-form label-position="left" inline class="task-detail">
                <el-form-item label="巡检路线">
                  <span>{{ props.row.route }}</span>
                </el-form-item>
                <el-form-item label="巡检点位">
                  <span>{{ props.row.checkPoints }}个</span>
                </el-form-item>
                <el-form-item label="预计用时">
                  <span>{{ props.row.estimatedDuration }}</span>
                </el-form-item>
                <el-form-item label="实际用时" v-if="props.row.actualDuration">
                  <span>{{ props.row.actualDuration }}</span>
                </el-form-item>
                <el-form-item label="任务备注">
                  <span>{{ props.row.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="taskNo" label="任务编号" width="120" />
          <el-table-column prop="area" label="巡检区域" width="120" />
          <el-table-column prop="inspector" label="巡检人员" width="100" />
          <el-table-column prop="planTime" label="计划时间" width="160" />
          <el-table-column prop="type" label="任务类型" width="100">
            <template #default="scope">
              <el-tag :type="getTaskTypeTag(scope.row.type)">
                {{ scope.row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="100">
            <template #default="scope">
              <el-tag :type="getPriorityType(scope.row.priority)">
                {{ scope.row.priority }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button 
                type="primary" 
                link
                @click="startTask(scope.row)"
                v-if="scope.row.status === '待执行'"
              >
                开始
              </el-button>
              <el-button 
                type="success" 
                link
                @click="viewDetail(scope.row)"
              >
                详情
              </el-button>
              <el-button 
                type="danger" 
                link
                @click="deleteTask(scope.row)"
                v-if="scope.row.status === '待执行'"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
  
      <!-- 新建任务弹窗 -->
      <el-dialog
        v-model="createDialogVisible"
        title="新建巡检任务"
        width="700px"
      >
        <el-form :model="taskForm" :rules="taskRules" ref="taskFormRef" label-width="100px">
          <el-form-item label="任务类型" prop="type">
            <el-select v-model="taskForm.type" placeholder="请选择任务类型">
              <el-option label="日常巡检" value="daily" />
              <el-option label="专项巡检" value="special" />
              <el-option label="临时巡检" value="temporary" />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检区域" prop="area">
            <el-cascader
              v-model="taskForm.area"
              :options="areaOptions"
              :props="{ checkStrictly: true }"
              placeholder="请选择巡检区域"
            />
          </el-form-item>
          <el-form-item label="巡检路线" prop="route">
            <el-select v-model="taskForm.route" placeholder="请选择巡检路线">
              <el-option
                v-for="route in routeOptions"
                :key="route.value"
                :label="route.label"
                :value="route.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="巡检人员" prop="inspectors">
            <el-select
              v-model="taskForm.inspectors"
              multiple
              placeholder="请选择巡检人员"
            >
              <el-option
                v-for="inspector in inspectorOptions"
                :key="inspector.value"
                :label="inspector.label"
                :value="inspector.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="计划时间" prop="planTime">
            <el-date-picker
              v-model="taskForm.planTime"
              type="datetime"
              placeholder="请选择计划时间"
            />
          </el-form-item>
          <el-form-item label="优先级" prop="priority">
            <el-radio-group v-model="taskForm.priority">
              <el-radio-button label="高">高</el-radio-button>
              <el-radio-button label="中">中</el-radio-button>
              <el-radio-button label="低">低</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="预计用时" prop="estimatedDuration">
            <el-input-number 
              v-model="taskForm.estimatedDuration" 
              :min="1"
              :max="480"
            />
            <span class="unit-text">分钟</span>
          </el-form-item>
          <el-form-item label="任务描述" prop="description">
            <el-input
              v-model="taskForm.description"
              type="textarea"
              rows="3"
              placeholder="请输入任务描述"
            />
          </el-form-item>
          <el-form-item label="任务备注">
            <el-input
              v-model="taskForm.remark"
              type="textarea"
              rows="2"
              placeholder="请输入任务备注"
            />
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :on-change="handleAttachmentChange"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="createDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitTask">确认</el-button>
          </span>
        </template>
      </el-dialog>
  
      <!-- 任务详情弹窗 -->
      <el-dialog
        v-model="detailDialogVisible"
        title="任务详情"
        width="800px"
      >
        <el-descriptions :column="2" border>
          <el-descriptions-item label="任务编号">{{ currentTask?.taskNo }}</el-descriptions-item>
          <el-descriptions-item label="任务类型">{{ currentTask?.type }}</el-descriptions-item>
          <el-descriptions-item label="巡检区域">{{ currentTask?.area }}</el-descriptions-item>
          <el-descriptions-item label="巡检路线">{{ currentTask?.route }}</el-descriptions-item>
          <el-descriptions-item label="巡检人员">{{ currentTask?.inspector }}</el-descriptions-item>
          <el-descriptions-item label="计划时间">{{ currentTask?.planTime }}</el-descriptions-item>
          <el-descriptions-item label="优先级">{{ currentTask?.priority }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ currentTask?.status }}</el-descriptions-item>
          <el-descriptions-item label="预计用时">{{ currentTask?.estimatedDuration }}</el-descriptions-item>
          <el-descriptions-item label="实际用时" v-if="currentTask?.actualDuration">
            {{ currentTask?.actualDuration }}
          </el-descriptions-item>
          <el-descriptions-item label="任务描述" :span="2">{{ currentTask?.description }}</el-descriptions-item>
          <el-descriptions-item label="任务备注" :span="2">{{ currentTask?.remark }}</el-descriptions-item>
        </el-descriptions>
        
        <div class="task-attachments" v-if="currentTask?.attachments?.length">
          <div class="attachment-title">任务附件：</div>
          <el-image
            v-for="(img, index) in currentTask.attachments"
            :key="index"
            :src="img"
            :preview-src-list="currentTask.attachments"
            fit="cover"
            class="attachment-image"
          />
        </div>
      </el-dialog>
    </div>
  </template>
  <script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/inspection'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

// Store
const taskStore = useTaskStore()

// 基础状态
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const createDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const currentTask = ref(null)
const taskFormRef = ref(null)

// 搜索表单
const searchForm = ref({
  status: '',
  area: '',
  inspector: '',
  dateRange: []
})

// 任务表单
const taskForm = ref({
  type: '',
  area: [],
  route: '',
  inspectors: [],
  planTime: '',
  priority: '中',
  estimatedDuration: 30,
  description: '',
  remark: '',
  attachments: []
})

// 工具函数
const generateTaskNo = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = String(Math.floor(Math.random() * 9999)).padStart(4, '0')
  return `T${year}${month}${day}${random}`
}

const formatDateTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 计算属性
const paginatedTableData = computed(() => {
  const filteredData = taskStore.searchTasks(searchForm.value)
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.slice(start, end)
})

const total = computed(() => {
  return taskStore.searchTasks(searchForm.value).length
})

// 选项数据
const inspectorOptions = [
  { label: '张明华', value: 'zhangmh' },
  { label: '李志强', value: 'lizq' },
  { label: '王建国', value: 'wangjg' },
  { label: '赵秀芳', value: 'zhaoxf' },
  { label: '陈志明', value: 'chenzm' },
  { label: '刘丽华', value: 'liulh' },
  { label: '周国强', value: 'zhougq' },
  { label: '杨光', value: 'yangg' }
]

const areaOptions = [
  {
    value: 'production',
    label: '生产区',
    children: [
      { value: 'productionA', label: '生产区A' },
      { value: 'productionB', label: '生产区B' }
    ]
  },
  {
    value: 'storage',
    label: '储存区',
    children: [
      { value: 'storageA', label: '储存区A' },
      { value: 'storageB', label: '储存区B' }
    ]
  },
  {
    value: 'packaging',
    label: '包装区',
    children: [
      { value: 'packagingA', label: '包装区A' },
      { value: 'packagingB', label: '包装区B' }
    ]
  }
]

const routeOptions = [
  { label: '生产线巡检路线A', value: 'productionA' },
  { label: '生产线巡检路线B', value: 'productionB' },
  { label: '仓储巡检路线A', value: 'storageA' },
  { label: '仓储巡检路线B', value: 'storageB' },
  { label: '包装线巡检路线A', value: 'packagingA' },
  { label: '包装线巡检路线B', value: 'packagingB' }
]

// 表单校验规则
const taskRules = {
  type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  area: [{ required: true, message: '请选择巡检区域', trigger: 'change' }],
  route: [{ required: true, message: '请选择巡检路线', trigger: 'change' }],
  inspectors: [{ required: true, message: '请选择巡检人员', trigger: 'change' }],
  planTime: [{ required: true, message: '请选择计划时间', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  estimatedDuration: [{ required: true, message: '请输入预计用时', trigger: 'blur' }],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }]
}

// 方法定义
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const handleSearch = () => {
  currentPage.value = 1
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const resetSearch = () => {
  searchForm.value = {
    status: '',
    area: '',
    inspector: '',
    dateRange: []
  }
  handleSearch()
}

// 获取任务类型样式
const getTaskTypeTag = (type) => {
  const typeMap = {
    '日常巡检': '',
    '专项巡检': 'warning',
    '临时巡检': 'danger'
  }
  return typeMap[type]
}

// 获取优先级样式
const getPriorityType = (priority) => {
  const priorityMap = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return priorityMap[priority]
}

// 获取状态样式
const getStatusType = (status) => {
  const statusMap = {
    '待执行': 'info',
    '进行中': 'warning',
    '已完成': 'success',
    '已超时': 'danger'
  }
  return statusMap[status]
}

// 新建任务
const createTask = () => {
  taskForm.value = {
    type: '',
    area: [],
    route: '',
    inspectors: [],
    planTime: '',
    priority: '中',
    estimatedDuration: 30,
    description: '',
    remark: '',
    attachments: []
  }
  createDialogVisible.value = true
}

// 提交任务
const submitTask = async () => {
  if (!taskFormRef.value) return
  
  await taskFormRef.value.validate((valid) => {
    if (valid) {
      const newTask = {
        taskNo: generateTaskNo(),
        type: taskForm.value.type,
        area: taskForm.value.area[taskForm.value.area.length - 1],
        route: taskForm.value.route,
        inspector: taskForm.value.inspectors[0],
        planTime: formatDateTime(taskForm.value.planTime),
        priority: taskForm.value.priority,
        status: '待执行',
        checkPoints: 10,
        estimatedDuration: `${taskForm.value.estimatedDuration}分钟`,
        description: taskForm.value.description,
        remark: taskForm.value.remark,
        attachments: taskForm.value.attachments,
        createTime: formatDateTime(new Date())
      }

      taskStore.addTask(newTask)
      ElMessage.success('任务创建成功')
      createDialogVisible.value = false
      resetTaskForm()
    }
  })
}

// 开始任务
const startTask = (row) => {
  ElMessageBox.confirm(
    '确认开始此巡检任务？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    taskStore.startTask(row.taskNo)
    ElMessage.success('任务已开始')
  })
}

// 查看详情
const viewDetail = (row) => {
  currentTask.value = row
  detailDialogVisible.value = true
}

// 删除任务
const deleteTask = (row) => {
  ElMessageBox.confirm(
    '确认删除此巡检任务？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    taskStore.deleteTask(row.taskNo)
    ElMessage.success('任务已删除')
  })
}

// 处理附件变化
const handleAttachmentChange = (file) => {
  // 这里处理附件上传逻辑
  console.log('附件变化:', file)
}

// 导出任务
const exportTasks = () => {
  const workbook = XLSX.utils.book_new()
  
  // 准备导出数据
  const exportDataList = tableData.value.map(item => ({
    '任务编号': item.taskNo,
    '任务类型': item.type,
    '巡检区域': item.area,
    '巡检路线': item.route,
    '巡检人员': item.inspector,
    '计划时间': item.planTime,
    '优先级': item.priority,
    '状态': item.status,
    '预计用时': item.estimatedDuration,
    '实际用时': item.actualDuration || '',
    '巡检点位': item.checkPoints,
    '任务描述': item.description,
    '任务备注': item.remark
  }))
  
  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportDataList)
  
  // 设置列宽
  const columnWidths = [
    { wch: 15 }, // 任务编号
    { wch: 10 }, // 任务类型
    { wch: 12 }, // 巡检区域
    { wch: 20 }, // 巡检路线
    { wch: 10 }, // 巡检人员
    { wch: 20 }, // 计划时间
    { wch: 8 },  // 优先级
    { wch: 10 }, // 状态
    { wch: 10 }, // 预计用时
    { wch: 10 }, // 实际用时
    { wch: 10 }, // 巡检点位
    { wch: 40 }, // 任务描述
    { wch: 30 }  // 任务备注
  ]
  worksheet['!cols'] = columnWidths
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '巡检任务')
  
  // 导出文件
  const today = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `巡检任务_${today}.xlsx`)
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.inspection-task {
  padding: 20px;
}

.search-card,
.task-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-btns {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.task-detail {
  padding: 20px;
}

.unit-text {
  margin-left: 10px;
  color: #666;
}

.task-attachments {
  margin-top: 20px;
}

.attachment-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.attachment-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-cascader) {
  width: 100%;
}
</style>