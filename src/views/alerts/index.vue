<template>
  <div class="alert-container">
    <!-- 统计面板 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="item in statistics" :key="item.label">
        <el-card shadow="hover" :class="['stat-card', item.type]">
          <div class="stat-content">
            <div class="icon-wrapper">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="stat-info">
              <div class="label">{{ item.label }}</div>
              <div class="value">{{ item.value }}</div>
              <div class="trend" :class="item.trend">
                {{ item.changeRate }}%
                <el-icon>
                  <component :is="getTrendIcon(item.trend)" />
                </el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="预警类型" class="form-item">
          <el-select v-model="searchForm.type" clearable placeholder="全部类型" class="w-180">
            <el-option label="设备故障" value="device_error">
              <el-icon><Warning /></el-icon>
              <span class="ml-2">设备故障</span>
            </el-option>
            <el-option label="超时预警" value="timeout">
              <el-icon><Timer /></el-icon>
              <span class="ml-2">超时预警</span>
            </el-option>
            <el-option label="异常行为" value="abnormal">
              <el-icon><WarnTriangleFilled /></el-icon>
              <span class="ml-2">异常行为</span>
            </el-option>
            <el-option label="安全风险" value="risk">
              <el-icon><CircleCloseFilled /></el-icon>
              <span class="ml-2">安全风险</span>
            </el-option>
            <el-option label="环境预警" value="environment">
              <el-icon><Sunny /></el-icon>
              <span class="ml-2">环境预警</span>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="预警级别" class="form-item">
          <el-select v-model="searchForm.level" clearable placeholder="全部级别" class="w-180">
            <el-option label="低" value="low">
              <el-tag type="info" size="small">低</el-tag>
            </el-option>
            <el-option label="中" value="medium">
              <el-tag type="warning" size="small">中</el-tag>
            </el-option>
            <el-option label="高" value="high">
              <el-tag type="danger" size="small">高</el-tag>
            </el-option>
            <el-option label="紧急" value="critical">
              <el-tag type="danger" effect="dark" size="small">紧急</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="处理状态" class="form-item">
          <el-select v-model="searchForm.status" clearable placeholder="全部状态" class="w-180">
            <el-option label="待处理" value="pending">
              <el-tag type="info">待处理</el-tag>
            </el-option>
            <el-option label="处理中" value="processing">
              <el-tag type="warning">处理中</el-tag>
            </el-option>
            <el-option label="已解决" value="resolved">
              <el-tag type="success">已解决</el-tag>
            </el-option>
            <el-option label="已忽略" value="ignored">
              <el-tag type="info" effect="dark">已忽略</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="时间范围" class="form-item">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="dateShortcuts"
            class="w-360"
          />
        </el-form-item>
        
        <el-form-item class="form-item">
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="resetSearch">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预警列表 -->
    <el-card class="list-card">
      <template #header>
        <div class="header-wrapper">
          <span class="title">预警列表</span>
          <el-button-group>
            <el-button type="primary" @click="showRuleDialog = true">
              <el-icon><Setting /></el-icon>
              预警规则
            </el-button>
            <el-button @click="handleRefresh">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="alertList"
        border
        stripe
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <el-descriptions :column="3" border>
              <el-descriptions-item label="预警描述">
                {{ row.description }}
              </el-descriptions-item>
              <el-descriptions-item label="位置信息">
                {{ row.location }}
              </el-descriptions-item>
              <el-descriptions-item label="预警来源">
                {{ row.source }}
              </el-descriptions-item>
              <el-descriptions-item label="处理人" v-if="row.handledBy">
                {{ row.handledBy }}
              </el-descriptions-item>
              <el-descriptions-item label="处理时间" v-if="row.handleTime">
                {{ formatTime(row.handleTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="处理结果" v-if="row.handleResult">
                {{ row.handleResult }}
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        
        <el-table-column prop="title" label="预警标题" min-width="200" />
        
        <el-table-column prop="type" label="预警类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getAlertTypeTag(row.type)">
              {{ getAlertTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="level" label="预警级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getAlertLevelTag(row.level)">
              {{ getAlertLevelLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="处理状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getAlertStatusTag(row.status)">
              {{ getAlertStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button 
                type="primary" 
                size="small"
                @click="handleAlert(row)"
                :disabled="!canHandle(row)"
              >
                处置
              </el-button>
              <el-button 
                type="info" 
                size="small"
                @click="viewHistory(row)"
              >
                历史
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 处置对话框 -->
    <el-dialog
      v-model="showHandleDialog"
      title="预警处置"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="handleFormRef"
        :model="handleForm"
        :rules="handleRules"
        label-width="80px"
      >
        <el-form-item label="处置动作" prop="action">
          <el-select v-model="handleForm.action" class="w-full">
            <el-option label="确认处理" value="confirm" />
            <el-option label="转交处理" value="transfer" />
            <el-option label="忽略预警" value="ignore" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="处理人" prop="operator">
          <el-input v-model="handleForm.operator" />
        </el-form-item>
        
        <el-form-item label="处置说明" prop="description">
          <el-input
            v-model="handleForm.description"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        
        <el-form-item label="附件">
          <el-upload
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="handleForm.attachments"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              选择文件
            </el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showHandleDialog = false">取消</el-button>
        <el-button
          type="primary"
          :loading="submitting"
          @click="submitHandle"
        >
          确认
        </el-button>
      </template>
    </el-dialog>

    <!-- 历史记录对话框 -->
    <el-dialog
      v-model="showHistoryDialog"
      title="处置历史"
      width="700px"
    >
      <el-timeline>
        <el-timeline-item
          v-for="record in historyRecords"
          :key="record.id"
          :type="getHistoryItemType(record)"
          :timestamp="formatTime(record.time)"
        >
          <h4>{{ getActionLabel(record.action) }}</h4>
          <p>处理人：{{ record.operator }}</p>
          <p>说明：{{ record.description }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <!-- 规则管理组件 -->
    <RuleManagement v-model="showRuleDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { 
  Search, 
  Refresh, 
  Setting, 
  Upload,
  Warning,
  Bell,
  CircleCheck,
  Timer,
  CaretTop,
  CaretBottom,
  Minus,
  WarnTriangleFilled,
  CircleCloseFilled,
  Sunny
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { Alert, AlertType, AlertLevel, AlertStatus, HandleRecord } from '@/types/alert'
import { 
  fetchAlertList, 
  fetchAlertHistory,
  submitAlertHandle 
} from '@/api/alert'
import { 
  getAlertTypeLabel, 
  getAlertLevelLabel, 
  getAlertStatusLabel,
  getAlertTypeTag,
  getAlertLevelTag,
  getAlertStatusTag
} from '@/utils/alert'
import RuleManagement from '@/components/alert/RuleManagement.vue'
import dayjs from 'dayjs'

// 状态定义
const loading = ref(false)
const submitting = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const alertList = ref<Alert[]>([])
const currentAlert = ref<Alert | null>(null)
const historyRecords = ref<HandleRecord[]>([])
const showHandleDialog = ref(false)
const showHistoryDialog = ref(false)
const showRuleDialog = ref(false)
const handleFormRef = ref<FormInstance>()

// 搜索表单
interface SearchForm {
  type: AlertType | undefined
  level: AlertLevel | undefined
  status: AlertStatus | undefined
  dateRange: [Date, Date] | []
}

const searchForm = reactive<SearchForm>({
  type: undefined,
  level: undefined,
  status: undefined,
  dateRange: []
})

// 处置表单
interface HandleForm {
  action: string
  operator: string
  description: string
  attachments: File[]
}

const handleForm = reactive<HandleForm>({
  action: '',
  operator: '',
  description: '',
  attachments: []
})

// 表单校验规则
const handleRules = {
  action: [
    { required: true, message: '请选择处置动作', trigger: 'change' }
  ],
  operator: [
    { required: true, message: '请输入处理人', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入处置说明', trigger: 'blur' }
  ]
}

// 获取预警列表
const getAlertList = async () => {
  loading.value = true
  try {
    const { data, total: totalCount } = await fetchAlertList({
      page: currentPage.value,
      pageSize: pageSize.value,
      type: searchForm.type,
      level: searchForm.level,
      status: searchForm.status,
      dateRange: searchForm.dateRange.length ? searchForm.dateRange : undefined
    })
    alertList.value = data
    total.value = totalCount
  } catch (error) {
    console.error('获取预警列表失败:', error)
    ElMessage.error('获取预警列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  getAlertList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.type = undefined
  searchForm.level = undefined
  searchForm.status = undefined
  searchForm.dateRange = []
  handleSearch()
}

// 刷新列表
const handleRefresh = () => {
  getAlertList()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getAlertList()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getAlertList()
}

// 处置预警
const handleAlert = (alert: Alert) => {
  currentAlert.value = alert
  showHandleDialog.value = true
  handleForm.action = ''
  handleForm.operator = ''
  handleForm.description = ''
  handleForm.attachments = []
}

// 查看历史
const viewHistory = async (alert: Alert) => {
  try {
    historyRecords.value = await fetchAlertHistory(alert.id)
    showHistoryDialog.value = true
  } catch (error) {
    console.error('获取处置历史失败:', error)
    ElMessage.error('获取处置历史失败')
  }
}

// 文件上传处理
const handleFileChange = (file: any) => {
  handleForm.attachments.push(file.raw)
}

// 提交处置
const submitHandle = async () => {
  if (!handleFormRef.value || !currentAlert.value) return
  
  try {
    await handleFormRef.value.validate()
    submitting.value = true
    
    await submitAlertHandle({
      alertId: currentAlert.value.id,
      ...handleForm
    })
    
    ElMessage.success('处置成功')
    showHandleDialog.value = false
    getAlertList()
  } catch (error) {
    console.error('处置失败:', error)
    ElMessage.error('处置失败')
  } finally {
    submitting.value = false
  }
}

// 判断是否可以处置
const canHandle = (alert: Alert) => {
  return ['pending', 'processing'].includes(alert.status)
}

// 获取趋势图标
const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return CaretTop
    case 'down':
      return CaretBottom
    default:
      return Minus
  }
}

// 格式化时间
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

// 获取历史记录项类型
const getHistoryItemType = (record: HandleRecord): string => {
  const types: Record<string, string> = {
    confirm: 'primary',
    transfer: 'warning',
    ignore: 'info'
  }
  return types[record.action] || 'info'
}

// 获取动作标签
const getActionLabel = (action: string): string => {
  const labels: Record<string, string> = {
    confirm: '确认处理',
    transfer: '转交处理',
    ignore: '忽略预警'
  }
  return labels[action] || action
}

// 初始化
onMounted(() => {
  getAlertList()
})

// 添加在其他状态定义后面
const statistics = ref([
  {
    label: '今日预警',
    value: 2,
    changeRate: -3.5,
    trend: 'down',
    type: 'warning',
    icon: 'Warning'
  },
  {
    label: '待处理',
    value: 15,
    changeRate: -5.2,
    trend: 'down',
    type: 'danger',
    icon: 'Bell'
  },
  {
    label: '已处理',
    value: 83,
    changeRate: 8.3,
    trend: 'up',
    type: 'success',
    icon: 'CircleCheck'
  },
  {
    label: '平均响应',
    value: '15分钟',
    changeRate: -10.5,
    trend: 'down',
    type: 'info',
    icon: 'Timer'
  }
])

// 日期快捷选项
const dateShortcuts = [
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
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
</script>

<style scoped lang="scss">
.alert-container {
  padding: 20px;
  
  .stat-row {
    margin-bottom: 20px;
  }
  
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      
      .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        
        .el-icon {
          font-size: 24px;
          color: #fff;
        }
      }
      
      .stat-info {
        flex: 1;
        
        .label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 4px;
        }
        
        .value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .trend {
          font-size: 12px;
          display: flex;
          align-items: center;
          
          &.up {
            color: #f56c6c;
          }
          
          &.down {
            color: #67c23a;
          }
          
          .el-icon {
            margin-left: 4px;
          }
        }
      }
    }
    
    &.warning .icon-wrapper {
      background-color: #e6a23c;
    }
    
    &.danger .icon-wrapper {
      background-color: #f56c6c;
    }
    
    &.success .icon-wrapper {
      background-color: #67c23a;
    }
    
    &.info .icon-wrapper {
      background-color: #909399;
    }
  }
  
  .search-card {
    margin-bottom: 20px;
    
    .search-form {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      
      .form-item {
        margin-bottom: 0;
        margin-right: 0;
      }
    }
  }
  
  .list-card {
    .header-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .title {
        font-size: 16px;
        font-weight: 500;
      }
    }
    
    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}

.w-full {
  width: 100%;
}

.w-180 {
  width: 180px !important;
}

.w-360 {
  width: 360px !important;
}

.ml-2 {
  margin-left: 8px;
}

:deep(.el-select-dropdown__item) {
  display: flex;
  align-items: center;
}
</style> 