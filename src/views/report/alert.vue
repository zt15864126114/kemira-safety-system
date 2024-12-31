<template>
  <div class="alert-report">
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
        <el-form-item label="预警等级">
          <el-select v-model="searchForm.level" placeholder="请选择">
            <el-option label="严重" value="critical" />
            <el-option label="一般" value="normal" />
            <el-option label="轻微" value="minor" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计图表 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预警趋势分析</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
                <el-radio-button label="year">年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>预警类型分布</span>
            </div>
          </template>
          <div ref="typeChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>预警详细数据</span>
          <el-button type="primary" @click="exportData">导出数据</el-button>
        </div>
      </template>

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="date" label="时间" width="180" />
        <el-table-column prop="type" label="预警类型" width="120" />
        <el-table-column prop="level" label="预警等级" width="100">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="预警描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="location" label="发生位置" width="120" />
        <el-table-column prop="handler" label="处理人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="solution" label="处理方案" min-width="200" show-overflow-tooltip />
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'

// 搜索表单
const searchForm = ref({
  dateRange: [],
  type: '',
  level: ''
})

// 图表相关
const timeRange = ref('week')
const trendChartRef = ref(null)
const typeChartRef = ref(null)
let trendChart = null
let typeChart = null

// 表格数据
const loading = ref(false)
const tableData = ref([
  {
    date: '2024-03-20 10:15:00',
    type: '设备故障',
    level: '严重',
    description: '1号生产线注塑机温度异常超标',
    location: '生产区A线',
    handler: '张明华',
    solution: '更换温度传感器，重新校准温控系统，更新控制参数',
    status: '已处理'
  },
  {
    date: '2024-03-20 09:30:00',
    type: '环境异常',
    level: '一般',
    description: '3号仓库湿度超标',
    location: '储存区B区',
    handler: '李志强',
    solution: '开启除湿系统，检查防潮设施，增加通风频率',
    status: '处理中'
  },
  {
    date: '2024-03-19 15:20:00',
    type: '安全隐患',
    level: '严重',
    description: '包装区消防通道堵塞',
    location: '包装区C线',
    handler: '王建国',
    solution: '立即清理通道，重新规划物料放置区域，加强安全教育',
    status: '已处理'
  },
  {
    date: '2024-03-19 14:45:00',
    type: '设备故障',
    level: '一般',
    description: '2号包装机传感器异常',
    location: '包装区A线',
    handler: '刘丽华',
    solution: '更换传感器，调试设备参数，测试运行状态',
    status: '已处理'
  },
  {
    date: '2024-03-19 11:30:00',
    type: '质量异常',
    level: '严重',
    description: '产品尺寸超差',
    location: '生产区B线',
    handler: '赵秀芳',
    solution: '停机检查，调整模具参数，更换损耗部件',
    status: '已处理'
  },
  {
    date: '2024-03-19 10:20:00',
    type: '设备故障',
    level: '一般',
    description: '标签打印机校准偏差',
    location: '包装区A线',
    handler: '郑秀兰',
    solution: '重新校准打印参数，更换打印头，测试打印质量',
    status: '已处理'
  },
  {
    date: '2024-03-18 16:40:00',
    type: '环境异常',
    level: '一般',
    description: '车间噪音超标',
    location: '生产区C线',
    handler: '周国强',
    solution: '检查设备减震装置，更换降噪材料，优化工艺流程',
    status: '处理中'
  },
  {
    date: '2024-03-18 15:15:00',
    type: '安全隐患',
    level: '严重',
    description: '配电箱异常发热',
    location: '生产区D线',
    handler: '孙志伟',
    solution: '断电检修，更换老化线路，测试供电稳定性',
    status: '已处理'
  },
  {
    date: '2024-03-18 14:30:00',
    type: '设备故障',
    level: '一般',
    description: '空调系统制冷效果差',
    location: '储存区A区',
    handler: '陈志明',
    solution: '清洗过滤网，检查制冷系统，补充制冷剂',
    status: '已处理'
  },
  {
    date: '2024-03-18 09:50:00',
    type: '质量异常',
    level: '严重',
    description: '原材料含水量超标',
    location: '储存区C区',
    handler: '杨光',
    solution: '隔离不合格材料，联系供应商更换，改善存储条件',
    status: '已处理'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 初始化趋势图表
const initTrendChart = async () => {
  if (!trendChartRef.value) return
  
  await nextTick()
  
  if (trendChart) {
    trendChart.dispose()
  }

  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['严重', '一般', '轻微']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '严重',
        type: 'line',
        data: [2, 3, 1, 4, 2, 1, 2],
        itemStyle: {
          color: '#f56c6c'
        }
      },
      {
        name: '一般',
        type: 'line',
        data: [5, 4, 6, 3, 5, 4, 3],
        itemStyle: {
          color: '#e6a23c'
        }
      },
      {
        name: '轻微',
        type: 'line',
        data: [3, 5, 4, 6, 4, 5, 4],
        itemStyle: {
          color: '#909399'
        }
      }
    ]
  }
  trendChart.setOption(option)
}

// 初始化类型分布图表
const initTypeChart = async () => {
  if (!typeChartRef.value) return
  
  await nextTick()
  
  if (typeChart) {
    typeChart.dispose()
  }

  typeChart = echarts.init(typeChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '预警类型',
        type: 'pie',
        radius: '50%',
        data: [
          { 
            value: 38, 
            name: '设备故障',
            itemStyle: { color: '#409eff' }
          },
          { 
            value: 22, 
            name: '安全隐患',
            itemStyle: { color: '#f56c6c' }
          },
          { 
            value: 15, 
            name: '环境异常',
            itemStyle: { color: '#67c23a' }
          },
          { 
            value: 10, 
            name: '质量异常',
            itemStyle: { color: '#e6a23c' }
          }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  typeChart.setOption(option)
}

// 初始化所有图表
const initCharts = async () => {
  await Promise.all([
    initTrendChart(),
    initTypeChart()
  ])
}

// 获取等级样式
const getLevelType = (level) => {
  const levelMap = {
    '严重': 'danger',
    '一般': 'warning',
    '轻微': 'info'
  }
  return levelMap[level] || 'info'
}

// 获取状态样式
const getStatusType = (status) => {
  const statusMap = {
    '已处理': 'success',
    '处理中': 'warning',
    '未处理': 'danger'
  }
  return statusMap[status] || 'info'
}

// 导出数据处理
const exportData = () => {
  const workbook = XLSX.utils.book_new()
  
  // 准备导出数据
  const exportDataList = tableData.value.map(item => ({
    '时间': item.date,
    '预警类型': item.type,
    '预警等级': item.level,
    '预警描述': item.description,
    '发生位置': item.location,
    '处理人': item.handler,
    '处理方案': item.solution,
    '状态': item.status
  }))
  
  // 创建工作表
  const worksheet = XLSX.utils.json_to_sheet(exportDataList)
  
  // 设置列宽
  const columnWidths = [
    { wch: 20 }, // 时间
    { wch: 12 }, // 预警类型
    { wch: 10 }, // 预警等级
    { wch: 30 }, // 预警描述
    { wch: 15 }, // 发生位置
    { wch: 10 }, // 处理人
    { wch: 40 }, // 处理方案
    { wch: 10 }  // 状态
  ]
  worksheet['!cols'] = columnWidths
  
  // 添加工作表到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, '预警报表')
  
  // 导出文件
  const today = new Date().toISOString().split('T')[0]
  XLSX.writeFile(workbook, `预警报表_${today}.xlsx`)
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
    level: ''
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

// 处理窗口大小变化
const handleResize = () => {
  trendChart?.resize()
  typeChart?.resize()
}

onMounted(async () => {
  await initCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  trendChart?.dispose()
  typeChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.alert-report {
  padding: 20px;
}

.search-card,
.chart-card,
.table-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.chart-row {
  margin: 20px 0;
}
</style> 