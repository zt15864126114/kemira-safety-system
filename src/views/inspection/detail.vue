<template>
  <div class="inspection-detail">
    <!-- 返回按钮 -->
    <div class="page-header">
      <el-button @click="goBack" icon="Back">返回列表</el-button>
      <div class="header-actions">
        <el-button type="primary" @click="printReport" icon="Printer">打印报告</el-button>
        <el-button type="success" @click="exportPDF" icon="Download">导出PDF</el-button>
      </div>
    </div>

    <!-- 任务基本信息 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="title">任务信息</span>
          <el-tag :type="getStatusType(taskInfo.status)" size="large">
            {{ taskInfo.status }}
          </el-tag>
        </div>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="任务编号">{{ taskInfo.taskNo }}</el-descriptions-item>
        <el-descriptions-item label="巡检区域">{{ taskInfo.area }}</el-descriptions-item>
        <el-descriptions-item label="巡检人员">
          {{ getInspectorLabel(taskInfo.inspector) }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ taskInfo.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ taskInfo.endTime }}</el-descriptions-item>
        <el-descriptions-item label="任务进度">
          <el-progress 
            :percentage="taskInfo.progress"
            :status="getProgressStatus(taskInfo)"
          />
        </el-descriptions-item>
      </el-descriptions>

      <div class="content-section">
        <h4>巡检内容：</h4>
        <p>{{ taskInfo.content }}</p>
      </div>

      <div class="content-section" v-if="taskInfo.remark">
        <h4>备注：</h4>
        <p>{{ taskInfo.remark }}</p>
      </div>
    </el-card>

    <!-- 巡检记录 -->
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="title">巡检记录</span>
          <el-button 
            type="primary" 
            @click="addRecord"
            v-if="taskInfo.status === '进行中'"
          >
            添加记录
          </el-button>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="record in inspectionRecords"
          :key="record.id"
          :type="record.type"
          :timestamp="record.time"
          :hollow="record.type === 'primary'"
        >
          <el-card class="record-card">
            <template #header>
              <div class="record-header">
                <span>{{ record.title }}</span>
                <el-tag :type="record.type" size="small">
                  {{ record.category }}
                </el-tag>
              </div>
            </template>
            <div class="record-content">
              <p>{{ record.content }}</p>
              <div class="record-images" v-if="record.images && record.images.length">
                <el-image
                  v-for="img in record.images"
                  :key="img"
                  :src="img"
                  :preview-src-list="record.images"
                  fit="cover"
                  class="record-image"
                />
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>

    <!-- 异常记录 -->
    <el-card class="detail-card" v-if="abnormalRecords.length">
      <template #header>
        <div class="card-header">
          <span class="title">异常记录</span>
          <el-tag type="danger">{{ abnormalRecords.length }} 条异常</el-tag>
        </div>
      </template>
      
      <el-table :data="abnormalRecords" style="width: 100%">
        <el-table-column prop="time" label="发现时间" width="180" />
        <el-table-column prop="location" label="具体位置" width="180" />
        <el-table-column prop="type" label="异常类型" width="120">
          <template #default="scope">
            <el-tag type="danger" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="异常描述" />
        <el-table-column prop="status" label="处理状态" width="120">
          <template #default="scope">
            <el-tag 
              :type="scope.row.status === '已处理' ? 'success' : 'warning'"
              size="small"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button 
              type="primary" 
              link
              size="small"
              @click="handleAbnormal(scope.row)"
              v-if="scope.row.status === '未处理'"
            >
              处理
            </el-button>
            <el-button 
              type="primary" 
              link
              size="small"
              @click="viewAbnormalDetail(scope.row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加记录对话框 -->
    <el-dialog
      v-model="recordDialogVisible"
      title="添加巡检记录"
      width="600px"
    >
      <el-form
        ref="recordFormRef"
        :model="recordForm"
        :rules="recordRules"
        label-width="100px"
      >
        <el-form-item label="记录类型" prop="category">
          <el-select v-model="recordForm.category" placeholder="请选择记录类型">
            <el-option label="常规检查" value="normal" />
            <el-option label="设备检查" value="equipment" />
            <el-option label="安全隐患" value="danger" />
            <el-option label="其他情况" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="recordForm.title" placeholder="请输入记录标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            v-model="recordForm.content"
            rows="4"
            placeholder="请输入记录内容"
          />
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="recordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRecord">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useInspectionStore } from '@/stores/inspection'

const route = useRoute()
const router = useRouter()
const store = useInspectionStore()

// 任务信息
const taskInfo = ref<any>({})

// 加载任务详情
onMounted(async () => {
  const taskId = route.params.id as string
  const task = store.getTaskById(taskId)
  if (task) {
    taskInfo.value = task
  } else {
    ElMessage.error('任务不存在')
    router.push('/inspection')
  }
})

// 巡检记录
const inspectionRecords = ref([
  {
    id: 1,
    type: 'primary',
    time: '2024-01-20 09:00:00',
    title: '开始巡检',
    category: '常规检查',
    content: '按计划开始巡检工作',
    images: []
  },
  {
    id: 2,
    type: 'warning',
    time: '2024-01-20 09:30:00',
    title: '发现安全隐患',
    category: '安全隐患',
    content: '3号储存柜温度偏高，已通知维修人员',
    images: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ]
  }
])

// 异常记录
const abnormalRecords = ref([
  {
    id: 1,
    time: '2024-01-20 09:30:00',
    location: '3号储存柜',
    type: '温度异常',
    description: '温度超过预警值5℃',
    status: '未处理'
  }
])

// 记录表单
const recordFormRef = ref<FormInstance>()
const recordDialogVisible = ref(false)
const recordForm = reactive({
  category: '',
  title: '',
  content: '',
  images: [] as UploadFile[]
})

// 表单验证规则
const recordRules = reactive<FormRules>({
  category: [{ required: true, message: '请选择记录类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入记录标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入记录内容', trigger: 'blur' }]
})

// 获取状态样式
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
const getProgressStatus = (row: any) => {
  if (row.status === '已完成') return 'success'
  if (row.status === '已超时') return 'exception'
  return ''
}

// 返回列表
const goBack = () => {
  router.push('/inspection')
}

// 打印报告
const printReport = () => {
  window.print()
}

// 导出PDF
const exportPDF = async () => {
  try {
    ElMessage.info('正在生成PDF，请稍候...')
    
    const element = document.querySelector('.inspection-detail') as HTMLElement
    if (!element) return
    
    // 临时隐藏不需要导出的元素
    const actionButtons = element.querySelectorAll('.page-header .header-actions')
    actionButtons.forEach(btn => (btn as HTMLElement).style.display = 'none')
    
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许加载跨域图片
      logging: false, // 关闭日志
      backgroundColor: '#ffffff' // 设置背景色
    })
    
    // 恢复隐藏的元素
    actionButtons.forEach(btn => (btn as HTMLElement).style.display = '')
    
    const contentWidth = canvas.width
    const contentHeight = canvas.height
    
    // 设置PDF的尺寸，按A4纸的比例计算
    const pageHeight = (contentWidth / 592.28) * 841.89
    let leftHeight = contentHeight
    let position = 0
    const imgWidth = 592.28
    const imgHeight = (592.28 / contentWidth) * contentHeight
    
    const pdf = new jsPDF('p', 'pt', 'a4')
    
    // 如果内容高度超过一页，需要分页
    if (leftHeight < pageHeight) {
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight
        )
        leftHeight -= pageHeight
        position -= 841.89
        if (leftHeight > 0) {
          pdf.addPage()
        }
      }
    }
    
    // 生成PDF文件名
    const taskNo = route.params.id as string
    const fileName = `巡检报告_${taskNo}_${new Date().toLocaleDateString()}.pdf`
    
    // 保存PDF
    pdf.save(fileName)
    ElMessage.success('PDF导出成功')
  } catch (error) {
    console.error('导出PDF失败:', error)
    ElMessage.error('导出PDF失败，请重试')
  }
}

// 添加记录
const addRecord = () => {
  recordDialogVisible.value = true
}

// 处理图片变化
const handleImageChange = (file: UploadFile) => {
  recordForm.images.push(file)
}

// 处理图片移除
const handleImageRemove = (file: UploadFile) => {
  const index = recordForm.images.indexOf(file)
  if (index !== -1) {
    recordForm.images.splice(index, 1)
  }
}

// 提交记录
const submitRecord = async () => {
  if (!recordFormRef.value) return
  
  await recordFormRef.value.validate((valid, fields) => {
    if (valid) {
      // 这里添加提交记录的逻辑
      const newRecord = {
        id: inspectionRecords.value.length + 1,
        type: recordForm.category === 'danger' ? 'warning' : 'primary',
        time: new Date().toLocaleString(),
        title: recordForm.title,
        category: recordForm.category,
        content: recordForm.content,
        images: recordForm.images.map(file => URL.createObjectURL(file.raw!))
      }
      
      inspectionRecords.value.push(newRecord)
      
      // 如果是安全隐患，添加到异常记录
      if (recordForm.category === 'danger') {
        abnormalRecords.value.push({
          id: abnormalRecords.value.length + 1,
          time: new Date().toLocaleString(),
          location: taskInfo.value.area,
          type: '安全隐患',
          description: recordForm.content,
          status: '未处理'
        })
      }
      
      ElMessage.success('记录添加成功')
      recordDialogVisible.value = false
    } else {
      console.log('验证失败:', fields)
    }
  })
}

// 处理异常
const handleAbnormal = (row: any) => {
  ElMessageBox.prompt('请输入处理结果', '处理异常', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /.+/,
    inputErrorMessage: '处理结果不能为空'
  }).then(({ value }) => {
    row.status = '已处理'
    row.handleResult = value
    ElMessage.success('处理成功')
  }).catch(() => {})
}

// 查看异常详情
const viewAbnormalDetail = (row: any) => {
  ElMessageBox.alert(
    `
    <p><strong>发现时间：</strong>${row.time}</p>
    <p><strong>具体位置：</strong>${row.location}</p>
    <p><strong>异常类型：</strong>${row.type}</p>
    <p><strong>异常描述：</strong>${row.description}</p>
    ${row.handleResult ? `<p><strong>处理结果：</strong>${row.handleResult}</p>` : ''}
    `,
    '异常详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定'
    }
  )
}

// 引入人员选项配置
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

// 获取人员完整信息的方法
const getInspectorLabel = (value: string) => {
  const inspector = inspectorOptions.find(item => item.value === value)
  return inspector ? inspector.label : value
}
</script>

<style scoped lang="scss">
.inspection-detail {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);

  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-card {
    margin-bottom: 24px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 16px;
        font-weight: 500;
      }
    }

    .content-section {
      margin-top: 20px;

      h4 {
        margin-bottom: 12px;
        color: #606266;
      }

      p {
        color: #303133;
        line-height: 1.6;
        white-space: pre-line;
      }
    }
  }

  .record-card {
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .record-content {
      p {
        margin-bottom: 12px;
        line-height: 1.6;
      }

      .record-images {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .record-image {
          width: 100px;
          height: 100px;
          border-radius: 4px;
          cursor: pointer;
        }
      }
    }
  }

  :deep(.el-timeline-item__node--large) {
    width: 16px;
    height: 16px;
  }

  :deep(.el-card) {
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0,21,41,.12);
    }
  }

  @media print {
    .page-header,
    .el-button,
    .el-upload {
      display: none !important;
    }
    
    .detail-card {
      break-inside: avoid;
      margin-bottom: 20px;
    }
    
    .el-card {
      border: none !important;
      box-shadow: none !important;
    }
  }
}
</style> 