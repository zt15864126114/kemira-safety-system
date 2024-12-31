<template>
  <div class="inspection-record">
    <!-- 记录统计 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(stat, index) in recordStats" :key="index">
        <el-card class="stat-card" :class="stat.type">
          <div class="stat-icon">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 记录查询 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <div class="filter-section">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :shortcuts="dateShortcuts"
              style="width: 350px"
            />
            <el-select v-model="areaFilter" placeholder="巡检区域" clearable>
              <el-option label="反应区" value="reaction" />
              <el-option label="储存区" value="storage" />
              <el-option label="包装区" value="package" />
            </el-select>
            <el-select v-model="inspectorFilter" placeholder="巡检人员" clearable>
              <el-option 
                v-for="inspector in inspectors"
                :key="inspector.id"
                :label="inspector.name"
                :value="inspector.id"
              />
            </el-select>
            <el-select v-model="statusFilter" placeholder="状态" clearable>
              <el-option label="正常" value="normal" />
              <el-option label="异常" value="abnormal" />
            </el-select>
            <el-button type="primary" @click="searchRecords">
              查询
            </el-button>
          </div>
          <div class="export-section">
            <el-button type="success" @click="exportRecords">
              导出记录
            </el-button>
          </div>
        </div>
      </template>

      <!-- 记录列表 -->
      <el-table :data="filteredRecords" border style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="record-detail">
              <!-- 巡检项目 -->
              <div class="inspection-items">
                <h4>巡检项目</h4>
                <el-descriptions :column="3" border>
                  <el-descriptions-item 
                    v-for="(item, index) in props.row.items"
                    :key="index"
                    :label="item.name"
                  >
                    <el-tag :type="item.status === 'normal' ? 'success' : 'danger'">
                      {{ item.status === 'normal' ? '正常' : '异常' }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
              </div>

              <!-- 异常情况 -->
              <div class="abnormal-section" v-if="props.row.abnormalItems.length > 0">
                <h4>异常情况</h4>
                <el-timeline>
                  <el-timeline-item
                    v-for="(item, index) in props.row.abnormalItems"
                    :key="index"
                    :type="item.level === 'serious' ? 'danger' : 'warning'"
                    :timestamp="item.time"
                  >
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.description }}</p>
                    <div class="image-list" v-if="item.images">
                      <el-image
                        v-for="(img, imgIndex) in item.images"
                        :key="imgIndex"
                        :src="img"
                        :preview-src-list="item.images"
                        style="width: 100px; height: 100px"
                      />
                    </div>
                  </el-timeline-item>
                </el-timeline>
              </div>

              <!-- 处理情况 -->
              <div class="handle-section" v-if="props.row.handleInfo">
                <h4>处理情况</h4>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="处理人">
                    {{ props.row.handleInfo.handler }}
                  </el-descriptions-item>
                  <el-descriptions-item label="处理时间">
                    {{ props.row.handleInfo.time }}
                  </el-descriptions-item>
                  <el-descriptions-item label="处理方案" :span="2">
                    {{ props.row.handleInfo.solution }}
                  </el-descriptions-item>
                  <el-descriptions-item label="处理结果" :span="2">
                    {{ props.row.handleInfo.result }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="id" label="记录编号" width="120" />
        <el-table-column prop="taskName" label="任务名称" width="180" />
        <el-table-column prop="area" label="巡检区域" width="120" />
        <el-table-column prop="inspector" label="巡检人员" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="duration" label="用时" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'normal' ? 'success' : 'danger'">
              {{ scope.row.status === 'normal' ? '正常' : '异常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button 
              size="small"
              @click="viewRecord(scope.row)"
            >
              查看
            </el-button>
            <el-button 
              size="small"
              type="primary"
              @click="handleAbnormal(scope.row)"
              v-if="scope.row.status === 'abnormal' && !scope.row.handleInfo"
            >
              处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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

    <!-- 异常处理对话框 -->
    <el-dialog
      v-model="handleDialogVisible"
      title="异常处理"
      width="60%"
    >
      <el-form :model="handleForm" label-width="100px">
        <el-form-item label="处理方案">
          <el-input
            v-model="handleForm.solution"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="处理结果">
          <el-input
            v-model="handleForm.result"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="处理时间">
          <el-date-picker
            v-model="handleForm.time"
            type="datetime"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHandle">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

// 记录统计数据
const recordStats = ref([
  {
    label: '今日巡检',
    value: 24,
    icon: 'Calendar',
    type: 'primary'
  },
  {
    label: '异常数量',
    value: 3,
    icon: 'Warning',
    type: 'danger'
  },
  {
    label: '处理完成',
    value: 2,
    icon: 'Check',
    type: 'success'
  },
  {
    label: '待处理',
    value: 1,
    icon: 'Timer',
    type: 'warning'
  }
])

// 查询条件
const dateRange = ref([])
const areaFilter = ref('')
const inspectorFilter = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  }
]

// 巡检人员列表
const inspectors = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' }
]

// 异常处理
const handleDialogVisible = ref(false)
const handleForm = ref({
  solution: '',
  result: '',
  time: new Date()
})
const currentRecord = ref(null)

// 查询记录
const searchRecords = () => {
  // 实现查询逻辑
  ElMessage.success('查询完成')
}

// 导出记录
const exportRecords = () => {
  // 实现导出逻辑
  ElMessage.success('导出成功')
}

// 查看记录
const viewRecord = (record) => {
  // 实现查看逻辑
}

// 处理异常
const handleAbnormal = (record) => {
  currentRecord.value = record
  handleForm.value = {
    solution: '',
    result: '',
    time: new Date()
  }
  handleDialogVisible.value = true
}

// 提交处理
const submitHandle = () => {
  // 实现处理提交逻辑
  ElMessage.success('处理成功')
  handleDialogVisible.value = false
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  searchRecords()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  searchRecords()
}
</script>

<style scoped>
.inspection-record {
  padding: 20px;
}

.stat-card {
  display: flex;
  padding: 20px;
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.record-detail {
  padding: 20px;
}

.inspection-items,
.abnormal-section,
.handle-section {
  margin-top: 30px;
}

.image-list {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

/* 状态颜色 */
.stat-card.primary .stat-icon {
  color: #409EFF;
}

.stat-card.success .stat-icon {
  color: #67C23A;
}

.stat-card.warning .stat-icon {
  color: #E6A23C;
}

.stat-card.danger .stat-icon {
  color: #F56C6C;
}
</style> 