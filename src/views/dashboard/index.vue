<template>
  <div class="dashboard-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="24" class="stat-cards">
      <el-col :span="6" v-for="card in statCards" :key="card.title">
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <div class="stat-card">
            <div class="icon-wrapper" :class="card.type">
              <el-icon :size="24">
                <component :is="card.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ card.title }}</div>
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-change" :class="card.trend">
                {{ card.change }}
                <el-icon>
                  <component :is="card.trend === 'up' ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="24" class="chart-section">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="title">安全指标趋势</span>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="day">今日</el-radio-button>
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div id="trendChart" style="height: 380px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="title">区域安全状态</span>
            </div>
          </template>
          <div id="areaChart" style="height: 380px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部活动区域 -->
    <el-row :gutter="24" class="activity-section">
      <el-col :span="12">
        <el-card class="list-card">
          <template #header>
            <div class="card-header">
              <span class="title">最近报警</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="alert in recentAlerts"
              :key="alert.id"
              :type="alert.level"
              :timestamp="alert.time"
              :color="getAlertColor(alert.level)"
            >
              <h4 class="alert-title">{{ alert.title }}</h4>
              <p class="alert-desc">{{ alert.description }}</p>
              <p class="alert-location">位置：{{ alert.location }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="list-card">
          <template #header>
            <div class="card-header">
              <span class="title">待处理事项</span>
              <el-button type="primary" link>处理全部</el-button>
            </div>
          </template>
          <el-table :data="todoList" style="width: 100%" :max-height="400">
            <el-table-column prop="time" label="时间" width="150" />
            <el-table-column prop="task" label="任务" show-overflow-tooltip />
            <el-table-column prop="priority" label="优先级" width="100">
              <template #default="scope">
                <el-tag :type="getPriorityType(scope.row.priority)" size="small">
                  {{ scope.row.priority }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="scope">
                <el-button type="primary" link size="small" @click="handleTask(scope.row)">
                  处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 统计卡片数据
const statCards = ref([
  {
    title: '设备在线率',
    value: '98.5%',
    change: '+2.1%',
    trend: 'up',
    type: 'success',
    icon: 'Monitor'
  },
  {
    title: '今日报警',
    value: '3',
    change: '-25%',
    trend: 'down',
    type: 'warning',
    icon: 'Warning'
  },
  {
    title: '巡检完成率',
    value: '95.8%',
    change: '+1.2%',
    trend: 'up',
    type: 'primary',
    icon: 'Check'
  },
  {
    title: '安全评分',
    value: '92',
    change: '+3.1%',
    trend: 'up',
    type: 'info',
    icon: 'DataLine'
  }
])

// 时间范围选择
const timeRange = ref('day')

// 最近报警数据
const recentAlerts = ref([
  {
    id: 1,
    title: '温度超标警告',
    description: '储存区A温度超过阈值（30℃）',
    time: '2024-03-20 10:30:00',
    level: 'warning',
    location: '化学品储存区A'
  },
  {
    id: 2,
    title: '压力异常报警',
    description: '生产线2号压力异常',
    time: '2024-03-20 09:15:00',
    level: 'danger',
    location: '生产车间B'
  }
])

// 待处理事项
const todoList = ref([
  {
    time: '2024-03-20 11:00',
    task: '巡检任务-储存区日常检查',
    priority: '高'
  },
  {
    time: '2024-03-20 14:00',
    task: '设备维护-定期检修',
    priority: '中'
  },
  {
    time: '2024-03-20 16:00',
    task: '安全培训-新员工培训',
    priority: '低'
  }
])

// 图表实例
let trendChart: echarts.ECharts | null = null
let areaChart: echarts.ECharts | null = null

// 初始化趋势图表
const initTrendChart = () => {
  const chartDom = document.getElementById('trendChart')
  if (!chartDom) return

  trendChart = echarts.init(chartDom)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['温度', '压力', '湿度']
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
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '温度',
        type: 'line',
        smooth: true,
        data: [23, 24, 25, 26, 25, 24, 23]
      },
      {
        name: '压力',
        type: 'line',
        smooth: true,
        data: [1.0, 1.1, 1.0, 1.2, 1.1, 1.0, 1.0]
      },
      {
        name: '湿度',
        type: 'line',
        smooth: true,
        data: [45, 46, 47, 45, 44, 45, 46]
      }
    ]
  }
  trendChart.setOption(option)
}

// 初始化区域图表
const initAreaChart = () => {
  const chartDom = document.getElementById('areaChart')
  if (!chartDom) return

  areaChart = echarts.init(chartDom)
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '区域状态',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 40, name: '储存区A' },
          { value: 30, name: '生产区B' },
          { value: 30, name: '仓储区C' }
        ]
      }
    ]
  }
  areaChart.setOption(option)
}

// 获取报警颜色
const getAlertColor = (level: string) => {
  const colorMap: Record<string, string> = {
    warning: '#E6A23C',
    danger: '#F56C6C',
    info: '#909399'
  }
  return colorMap[level] || '#409EFF'
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const typeMap: Record<string, string> = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return typeMap[priority] || 'info'
}

// 处理任务
const handleTask = (task: any) => {
  console.log('处理任务', task)
}

onMounted(() => {
  initTrendChart()
  initAreaChart()
  
  // 自动更新数据
  setInterval(() => {
    // TODO: 更新实时数据
  }, 5000)
})

onUnmounted(() => {
  trendChart?.dispose()
  areaChart?.dispose()
})
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);

  .stat-cards {
    margin-bottom: 24px;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 20px;

      .icon-wrapper {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        
        &.success { 
          background-color: #f0f9eb; 
          color: #67c23a;
          &:hover { background-color: #e1f3d8; }
        }
        &.warning { 
          background-color: #fdf6ec; 
          color: #e6a23c;
          &:hover { background-color: #faecd8; }
        }
        &.primary { 
          background-color: #ecf5ff; 
          color: #409eff;
          &:hover { background-color: #d9ecff; }
        }
        &.info { 
          background-color: #f4f4f5; 
          color: #909399;
          &:hover { background-color: #e9e9eb; }
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

  .chart-section {
    margin-bottom: 24px;

    .chart-card {
      height: 100%;
      .card-header {
        .title {
          font-size: 16px;
          font-weight: 500;
        }
      }
    }
  }

  .activity-section {
    .list-card {
      .card-header {
        .title {
          font-size: 16px;
          font-weight: 500;
        }
      }

      .alert-title {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 8px;
        color: #303133;
      }

      .alert-desc {
        font-size: 13px;
        color: #606266;
        margin: 0 0 4px;
      }

      .alert-location {
        font-size: 12px;
        color: #909399;
        margin: 0;
      }
    }
  }

  :deep(.el-card) {
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0,21,41,.12);
    }
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid #ebeef5;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 