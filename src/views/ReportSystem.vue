<template>
  <el-container>
    <el-main>
      <el-form :inline="true">
        <el-form-item label="报表类型">
          <el-select v-model="reportType">
            <el-option label="日报" value="daily" />
            <el-option label="周报" value="weekly" />
            <el-option label="月报" value="monthly" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="generateReport">
            生成报表
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 报表预览 -->
      <el-card v-if="showPreview">
        <template #header>
          <div class="report-header">
            <h2>安全管理报表</h2>
            <p>报表类型：{{ reportType }}</p>
            <p>生成时间：{{ new Date().toLocaleString() }}</p>
          </div>
        </template>
        
        <el-table :data="reportData">
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="incidents" label="事件数" />
          <el-table-column prop="alerts" label="预警数" />
          <el-table-column prop="status" label="处理状态" />
        </el-table>
        
        <div class="report-footer">
          <el-button type="primary" @click="exportPDF">
            导出PDF
          </el-button>
          <el-button type="success" @click="exportExcel">
            导出Excel
          </el-button>
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const reportType = ref('daily')
const dateRange = ref([])
const showPreview = ref(false)
const reportData = ref([])

const generateReport = () => {
  // 模拟生成报表数据
  reportData.value = [
    { 
      date: '2024-03-20',
      incidents: 2,
      alerts: 5,
      status: '已处理'
    },
    // ... 更多数据
  ]
  showPreview.value = true
}

const exportPDF = () => {
  // 实现PDF导出逻辑
  console.log('导出PDF')
}

const exportExcel = () => {
  // 实现Excel导出逻辑
  console.log('导出Excel')
}
</script>

<style scoped>
.report-header {
  text-align: center;
}
.report-footer {
  margin-top: 20px;
  text-align: right;
}
</style> 