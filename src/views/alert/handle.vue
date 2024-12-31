<template>
  <div class="alert-handle">
    <!-- 搜索条件 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="预警类型">
          <el-select v-model="searchForm.type" placeholder="请选择">
            <el-option label="设备故障" value="equipment" />
            <el-option label="环境异常" value="environment" />
            <el-option label="安全隐患" value="safety" />
            <el-option label="质量异常" value="quality" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已处理" value="completed" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预警列表 -->
    <el-card class="alert-card">
      <template #header>
        <div class="card-header">
          <span>预警处置列表</span>
          <div class="header-btns">
            <el-button type="success" @click="exportRecords">导出记录</el-button>
            <el-button type="primary" @click="batchHandle" :disabled="!selectedAlerts.length">
              批量处理
            </el-button>
          </div>
        </div>
      </template>

      <el-table 
        :data="tableData" 
        style="width: 100%" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="alertTime" label="预警时间" width="160" sortable />
        <el-table-column prop="type" label="预警类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="预警等级" width="100">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)">{{ scope.row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="发生位置" width="120" />
        <el-table-column prop="description" label="预警描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link
              @click="handleAlert(scope.row)"
              v-if="scope.row.status !== '已关闭'"
            >
              处理
            </el-button>
            <el-button 
              type="success" 
              link
              @click="viewDetail(scope.row)"
            >
              详情
            </el-button>
            <el-button 
              type="warning" 
              link
              @click="closeAlert(scope.row)"
              v-if="scope.row.status === '已处理'"
            >
              关闭
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

    <!-- 处理弹窗 -->
    <el-dialog
      v-model="handleDialogVisible"
      title="预警处理"
      width="600px"
    >
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="预警描述">
          <div class="alert-desc">{{ currentAlert?.description }}</div>
        </el-form-item>
        <el-form-item label="处理方案" required>
          <el-input
            v-model="handleForm.solution"
            type="textarea"
            rows="3"
            placeholder="请输入处理方案"
          />
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input
            v-model="handleForm.remark"
            type="textarea"
            rows="2"
            placeholder="请输入处理备注"
          />
        </el-form-item>
        <el-form-item label="处理图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHandle">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="预警详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="预警时间">{{ currentAlert?.alertTime }}</el-descriptions-item>
        <el-descriptions-item label="预警类型">{{ currentAlert?.type }}</el-descriptions-item>
        <el-descriptions-item label="预警等级">{{ currentAlert?.level }}</el-descriptions-item>
        <el-descriptions-item label="发生位置">{{ currentAlert?.location }}</el-descriptions-item>
        <el-descriptions-item label="预警描述" :span="2">{{ currentAlert?.description }}</el-descriptions-item>
        <el-descriptions-item label="处理人">{{ currentAlert?.handler }}</el-descriptions-item>
        <el-descriptions-item label="处理状态">{{ currentAlert?.status }}</el-descriptions-item>
        <el-descriptions-item label="处理方案" :span="2">{{ currentAlert?.solution }}</el-descriptions-item>
        <el-descriptions-item label="处理备注" :span="2">{{ currentAlert?.remark }}</el-descriptions-item>
        <el-descriptions-item label="处理时间" :span="2">{{ currentAlert?.handleTime }}</el-descriptions-item>
      </el-descriptions>
      
      <div class="detail-images" v-if="currentAlert?.images?.length">
        <div class="image-title">处理图片：</div>
        <el-image
          v-for="(img, index) in currentAlert.images"
          :key="index"
          :src="img"
          :preview-src-list="currentAlert.images"
          fit="cover"
          class="detail-image"
        />
      </div>

      <div class="handle-history" v-if="currentAlert?.history?.length">
        <div class="history-title">处理记录：</div>
        <el-timeline>
          <el-timeline-item
            v-for="(history, index) in currentAlert.history"
            :key="index"
            :timestamp="history.time"
            :type="history.type"
          >
            {{ history.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

// 搜索表单
const searchForm = ref({
  dateRange: [],
  type: '',
  status: ''
})

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    id: 1,
    alertTime: '2024-03-20 10:15:23',
    type: '设备故障',
    level: '严重',
    location: '生产区A线',
    description: '1号注塑机温度持续异常，超出正常范围20%，可能影响产品质量。',
    handler: '张明华',
    status: '已处理',
    solution: '1. 检查温控系统运行状态\n2. 更换温度传感器\n3. 重新校准温控参数\n4. 测试运行正常',
    remark: '建议加强日常维护，定期检查温控系统',
    handleTime: '2024-03-20 11:30:45',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ],
    history: [
      {
        time: '2024-03-20 10:15:23',
        type: 'warning',
        content: '系统发出预警：设备温度异常'
      },
      {
        time: '2024-03-20 10:20:15',
        type: 'info',
        content: '张明华接收处理任务'
      },
      {
        time: '2024-03-20 11:30:45',
        type: 'success',
        content: '完成处理：更换温度传感器，重新校准系统'
      }
    ]
  },
  {
    id: 2,
    alertTime: '2024-03-20 09:30:12',
    type: '环境异常',
    level: '一般',
    location: '储存区B区',
    description: '3号仓库湿度超标15%，可能影响原材料存储条件。',
    handler: '李志强',
    status: '处理中',
    solution: '开启除湿系统，增加通风频率',
    remark: '需要检查防潮设施是否完好',
    handleTime: '2024-03-20 09:45:30',
    history: [
      {
        time: '2024-03-20 09:30:12',
        type: 'warning',
        content: '系统发出预警：仓库湿度异常'
      },
      {
        time: '2024-03-20 09:45:30',
        type: 'info',
        content: '李志强开始处理：启动除湿措施'
      }
    ]
  },
  // ... 更多预警数据
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 选中的预警
const selectedAlerts = ref([])

// 处理弹窗相关
const handleDialogVisible = ref(false)
const currentAlert = ref(null)
const handleForm = ref({
  solution: '',
  remark: '',
  images: []
})

// 详情弹窗
const detailDialogVisible = ref(false)

// 获取预警类型标签样式
const getTypeTag = (type) => {
  const typeMap = {
    '设备故障': 'danger',
    '环境异常': 'warning',
    '安全隐患': 'error',
    '质量异常': 'info'
  }
  return typeMap[type] || ''
}

// 获取预警等级标签样式
const getLevelType = (level) => {
  const levelMap = {
    '严重': 'danger',
    '一般': 'warning',
    '轻微': 'info'
  }
  return levelMap[level] || ''
}

// 获取状态标签样式
const getStatusType = (status) => {
  const statusMap = {
    '待处理': 'danger',
    '处理中': 'warning',
    '已处理': 'success',
    '已关闭': 'info'
  }
  return statusMap[status] || ''
}

// 表格选择变化
const handleSelectionChange = (selection) => {
  selectedAlerts.value = selection
}

// 处理预警
const handleAlert = (row) => {
  currentAlert.value = row
  handleForm.value = {
    solution: '',
    remark: '',
    images: []
  }
  handleDialogVisible.value = true
}

// 查看详情
const viewDetail = (row) => {
  currentAlert.value = row
  detailDialogVisible.value = true
}

// 关闭预警
const closeAlert = (row) => {
  ElMessageBox.confirm(
    '确认关闭该预警吗？关闭后将不能再次处理。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 这里添加关闭预警的逻辑
    ElMessage.success('预警已关闭')
  })
}

// 批量处理
const batchHandle = () => {
  if (selectedAlerts.value.length === 0) {
    ElMessage.warning('请选择需要处理的预警')
    return
  }
  // 这里添加批量处理的逻辑
}

// 处理图片变化
const handleImageChange = (file) => {
  // 这里处理图片上传逻辑
  console.log('图片变化:', file)
}

// 提交处理
const submitHandle = () => {
  if (!handleForm.value.solution) {
    ElMessage.warning('请输入处理方案')
    return
  }
  // 这里添加提交处理的逻辑
  ElMessage.success('处理成功')
  handleDialogVisible.value = false
}

// 导出记录
const exportRecords = () => {
  const workbook = XLSX.utils.book_new()
  
  // 准备导出数据
  const exportDataList = tableData.value.map(item => ({
    '预警时间': item.alertTime,
    '预警类型': item.type,
    '预警等级': item.level,
    '发生位置': item.location,
    '预警描述': item.description,
    '处理人': item.handler,
    '处理状态': item.status,
    '处理方案': item.solution,
    '处理备注': item.remark,
    '处理时间': item.handleTime
  }))
  
  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportDataList)
  
  // 设置列宽
  const columnWidths = [
    { wch: 20 }, // 预警时间
    { wch: 12 }, // 预警类型
    { wch: 10 }, // 预警等级
    { wch: 15 }, // 发生位置
    { wch: 40 }, // 预警描述
    { wch: 10 }, // 处理人
    { wch: 10 }, // 处理状态
    { wch: 40 }, // 处理方案
    { wch: 30 }, // 处理备注
    { wch: 20 }  // 处理时间
  ]
  worksheet['!cols'] = columnWidths
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '预警处置记录')
  
  // 导出文件
  const today = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `预警处置记录_${today}.xlsx`)
}

// 搜索处理
const handleSearch = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// 重置搜索
const resetSearch = () => {
  searchForm.value = {
    dateRange: [],
    type: '',
    status: ''
  }
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  handleSearch()
}

onMounted(() => {
  handleSearch()
})
</script>

<style scoped>
.alert-handle {
  padding: 20px;
}

.search-card,
.alert-card {
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

.alert-desc {
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.detail-images {
  margin-top: 20px;
}

.image-title,
.history-title {
  font-weight: bold;
  margin-bottom: 10px;
}

.detail-image {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;
}

.handle-history {
  margin-top: 20px;
}
</style> 