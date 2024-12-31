<template>
  <div class="alert-monitor">
    <!-- 预警概览 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(stat, index) in alertStats" :key="index">
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

    <!-- 实时预警 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>实时预警监控</span>
              <div class="alert-actions">
                <el-switch
                  v-model="autoRefresh"
                  active-text="自动刷新"
                />
                <el-button type="danger" @click="handleEmergency">
                  紧急处置
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="alert-list">
            <div 
              v-for="alert in activeAlerts" 
              :key="alert.id"
              class="alert-item"
              :class="alert.level"
            >
              <div class="alert-content">
                <div class="alert-header">
                  <span class="alert-time">{{ alert.time }}</span>
                  <el-tag :type="getAlertType(alert.level)">
                    {{ alert.level }}
                  </el-tag>
                </div>
                <div class="alert-body">
                  <h4>{{ alert.title }}</h4>
                  <p>{{ alert.description }}</p>
                </div>
                <div class="alert-footer">
                  <span>位置: {{ alert.location }}</span>
                  <span>设备: {{ alert.device }}</span>
                  <el-button 
                    size="small" 
                    type="primary"
                    @click="handleAlert(alert)"
                  >
                    处理
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 预警分布 -->
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>预警分布</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="area">区域</el-radio-button>
                <el-radio-button label="type">类型</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="distributionChart" style="height: 300px"></div>
        </el-card>

        <!-- 预警趋势 -->
        <el-card style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>预警趋势</span>
              <el-select v-model="trendPeriod" size="small">
                <el-option label="今日" value="today" />
                <el-option label="本周" value="week" />
                <el-option label="本月" value="month" />
              </el-select>
            </div>
          </template>
          <div ref="trendChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 处理对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="预警处理"
      width="50%"
    >
      <div class="alert-detail" v-if="currentAlert">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="预警时间">
            {{ currentAlert.time }}
          </el-descriptions-item>
          <el-descriptions-item label="预警等级">
            <el-tag :type="getAlertType(currentAlert.level)">
              {{ currentAlert.level }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预警位置">
            {{ currentAlert.location }}
          </el-descriptions-item>
          <el-descriptions-item label="设备信息">
            {{ currentAlert.device }}
          </el-descriptions-item>
          <el-descriptions-item label="预警描述" :span="2">
            {{ currentAlert.description }}
          </el-descriptions-item>
        </el-descriptions>

        <el-form :model="handleForm" label-width="100px" style="margin-top: 20px">
          <el-form-item label="处理方案">
            <el-select v-model="handleForm.solution" style="width: 100%">
              <el-option 
                v-for="solution in solutions"
                :key="solution.value"
                :label="solution.label"
                :value="solution.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处理措施">
            <el-input 
              v-model="handleForm.measures" 
              type="textarea" 
              rows="3"
            />
          </el-form-item>
          <el-form-item label="处理人">
            <el-input v-model="handleForm.handler" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitHandle">
            确认处理
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

// 预警统计
const alertStats = ref([
  {
    label: '今日预警',
    value: 12,
    icon: 'Warning',
    type: 'total'
  },
  {
    label: '待处理',
    value: 3,
    icon: 'Timer',
    type: 'pending'
  },
  {
    label: '已处理',
    value: 9,
    icon: 'Select',
    type: 'handled'
  },
  {
    label: '处理率',
    value: '75%',
    icon: 'DataLine',
    type: 'rate'
  }
])

// 活动预警
const activeAlerts = ref([
  {
    id: 'A001',
    time: '2024-03-20 10:30:45',
    level: '严重',
    title: '反应釜温度异常',
    description: '反应釜R-101温度超过设定阈值(85℃)，当前温度87.5℃',
    location: '反应区A区',
    device: 'R-101'
  },
  // ... 更多预警
])

// 自动刷新
const autoRefresh = ref(true)
let refreshTimer = null

onMounted(() => {
  if (autoRefresh.value) {
    startAutoRefresh()
  }
  initCharts()
})

onUnmounted(() => {
  stopAutoRefresh()
})

const startAutoRefresh = () => {
  refreshTimer = setInterval(() => {
    // 更新预警数据
  }, 30000)
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
}

// 图表相关
const distributionChart = ref(null)
const trendChart = ref(null)
const chartType = ref('area')
const trendPeriod = ref('today')

const initCharts = () => {
  // 初始化分布图表
  const distribution = echarts.init(distributionChart.value)
  distribution.setOption({
    title: {
      text: '预警分布'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: '70%',
      data: [
        { value: 5, name: '反应区' },
        { value: 3, name: '储存区' },
        { value: 2, name: '包装区' }
      ]
    }]
  })

  // 初始化趋势图表
  const trend = echarts.init(trendChart.value)
  trend.setOption({
    title: {
      text: '预警趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [3, 1, 5, 2, 4, 1],
      type: 'line',
      smooth: true
    }]
  })
}

// 预警处理
const dialogVisible = ref(false)
const currentAlert = ref(null)
const handleForm = ref({
  solution: '',
  measures: '',
  handler: ''
})

const solutions = [
  { label: '设备调整', value: 'adjust' },
  { label: '停机处理', value: 'shutdown' },
  { label: '维修更换', value: 'repair' }
]

const handleAlert = (alert) => {
  currentAlert.value = alert
  dialogVisible.value = true
}

const submitHandle = () => {
  // 实现处理提交逻辑
  ElMessage.success('处理方案已提交')
  dialogVisible.value = false
}

const getAlertType = (level) => {
  const map = {
    '一般': 'info',
    '警告': 'warning',
    '严重': 'danger'
  }
  return map[level]
}

const handleEmergency = () => {
  ElMessageBox.confirm(
    '确定要启动紧急处置流程吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实现紧急处置逻辑
    ElMessage.success('已启动紧急处置流程')
  })
}
</script>

<style scoped>
.alert-monitor {
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
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

.stat-label {
  color: #666;
}

.stat-card.total { background: linear-gradient(135deg, #1890ff, #096dd9); }
.stat-card.pending { background: linear-gradient(135deg, #ffa940, #fa8c16); }
.stat-card.handled { background: linear-gradient(135deg, #52c41a, #389e0d); }
.stat-card.rate { background: linear-gradient(135deg, #722ed1, #531dab); }

.stat-card {
  color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-actions {
  display: flex;
  gap: 20px;
  align-items: center;
}

.alert-list {
  max-height: 600px;
  overflow-y: auto;
}

.alert-item {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #eee;
}

.alert-item.严重 {
  border-left: 4px solid #f56c6c;
  background: #fef0f0;
}

.alert-item.警告 {
  border-left: 4px solid #e6a23c;
  background: #fdf6ec;
}

.alert-item.一般 {
  border-left: 4px solid #409eff;
  background: #ecf5ff;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.alert-time {
  color: #666;
  font-size: 14px;
}

.alert-body h4 {
  margin: 0 0 10px 0;
}

.alert-body p {
  margin: 0;
  color: #666;
}

.alert-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.alert-item.严重 {
  animation: blink 2s infinite;
}
</style> 