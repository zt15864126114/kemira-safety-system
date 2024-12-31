<template>
  <div class="report-detail">
    <!-- 基本信息 -->
    <el-descriptions title="基本信息" :column="3" border>
      <el-descriptions-item label="巡检日期">{{ report.date }}</el-descriptions-item>
      <el-descriptions-item label="巡检区域">{{ report.area }}</el-descriptions-item>
      <el-descriptions-item label="巡检人员">{{ report.inspector }}</el-descriptions-item>
      <el-descriptions-item label="开始时间">{{ report.startTime }}</el-descriptions-item>
      <el-descriptions-item label="结束时间">{{ report.endTime }}</el-descriptions-item>
      <el-descriptions-item label="耗时">{{ report.duration }}分钟</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="getStatusType(report.status)">{{ report.status }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="检查点数">{{ report.checkPoints }}</el-descriptions-item>
      <el-descriptions-item label="发现问题">{{ report.issues }}个</el-descriptions-item>
    </el-descriptions>

    <!-- 巡检路线 -->
    <div class="section">
      <h3>巡检路线</h3>
      <el-steps :active="report.checkPoints" finish-status="success">
        <el-step 
          v-for="point in report.route" 
          :key="point.name" 
          :title="point.name"
          :description="point.time"
        />
      </el-steps>
    </div>

    <!-- 问题记录 -->
    <div class="section">
      <h3>问题记录</h3>
      <el-table :data="report.issueList" style="width: 100%">
        <el-table-column prop="location" label="位置" width="180" />
        <el-table-column prop="type" label="类型" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="level" label="等级" width="100">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getIssueStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 图片记录 -->
    <div class="section">
      <h3>现场图片</h3>
      <el-image-viewer 
        v-if="showViewer" 
        :initial-index="currentImageIndex"
        :url-list="report.images"
        @close="showViewer = false"
      />
      <div class="image-list">
        <div 
          v-for="(image, index) in report.images" 
          :key="index"
          class="image-item"
          @click="previewImage(index)"
        >
          <el-image 
            :src="image" 
            fit="cover"
            :preview-src-list="report.images"
          />
        </div>
      </div>
    </div>

    <!-- 备注信息 -->
    <div class="section">
      <h3>备注信息</h3>
      <el-input
        type="textarea"
        :rows="3"
        v-model="report.remarks"
        readonly
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElImageViewer } from 'element-plus'

const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})

const showViewer = ref(false)
const currentImageIndex = ref(0)

// 状态样式
const getStatusType = (status) => {
  const statusMap = {
    '已完成': 'success',
    '进行中': 'warning',
    '已超时': 'danger',
    '待执行': 'info'
  }
  return statusMap[status] || 'info'
}

// 问题等级样式
const getLevelType = (level) => {
  const levelMap = {
    '严重': 'danger',
    '警告': 'warning',
    '一般': 'info'
  }
  return levelMap[level] || 'info'
}

// 问题状态样式
const getIssueStatusType = (status) => {
  const statusMap = {
    '已解决': 'success',
    '处理中': 'warning',
    '待处理': 'danger'
  }
  return statusMap[status] || 'info'
}

// 预览图片
const previewImage = (index) => {
  currentImageIndex.value = index
  showViewer.value = true
}
</script>

<style scoped>
.report-detail {
  padding: 20px;
}

.section {
  margin-top: 30px;
}

.section h3 {
  margin-bottom: 20px;
  font-weight: normal;
  color: #303133;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  width: 120px;
  height: 120px;
  cursor: pointer;
}

.image-item :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.image-item :deep(.el-image img) {
  object-fit: cover;
}
</style> 