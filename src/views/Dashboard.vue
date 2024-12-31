<template>
    <div class="dashboard-container">
      <!-- 数据卡片 -->
      <el-row :gutter="20">
        <el-col :span="6" v-for="(card, index) in cards" :key="index">
          <div class="data-card" :class="`card-${index + 1}`">
            <div class="card-icon">
              <el-icon><component :is="card.icon" /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value }}</div>
              <div class="card-trend">
                <span :class="card.trend > 0 ? 'up' : 'down'">
                  {{ Math.abs(card.trend) }}%
                </span>
                较上周
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
  
      <!-- 图表区域 -->
      <el-row :gutter="20" class="chart-row">
        <el-col :span="16">
          <div class="chart-card">
            <div class="chart-header">
              <h3>系统运行状态</h3>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
            <div ref="mainChartRef" class="main-chart"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-card">
            <h3>预警分布</h3>
            <div ref="pieChartRef" class="pie-chart"></div>
          </div>
        </el-col>
      </el-row>
  
      <!-- 最新动态 -->
      <el-row :gutter="20" class="activity-row">
        <el-col :span="12">
          <div class="list-card">
            <div class="list-header">
              <h3>待处理预警</h3>
              <el-button type="primary" link>查看全部</el-button>
            </div>
            <el-table :data="alerts" style="width: 100%">
              <el-table-column prop="type" label="类型" width="100">
                <template #default="scope">
                  <el-tag :type="getAlertType(scope.row.type)">
                    {{ scope.row.type }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="content" label="内容" />
              <el-table-column prop="time" label="时间" width="180" />
            </el-table>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="list-card">
            <div class="list-header">
              <h3>今日巡检</h3>
              <el-button type="primary" link>查看全部</el-button>
            </div>
            <el-table :data="inspections" style="width: 100%">
              <el-table-column prop="area" label="区域" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.status)">
                    {{ scope.row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="inspector" label="巡检人" width="120" />
              <el-table-column prop="time" label="时间" width="180" />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import * as echarts from 'echarts'
  
  // 数据卡片
  const cards = [
    { 
      title: '设备总数', 
      value: '156', 
      icon: 'Monitor', 
      trend: 5.2 
    },
    { 
      title: '今日预警', 
      value: '8', 
      icon: 'Warning', 
      trend: -2.3 
    },
    { 
      title: '系统状态', 
      value: '98.5%', 
      icon: 'Connection', 
      trend: 1.4 
    },
    { 
      title: '待处理事项', 
      value: '3', 
      icon: 'Document', 
      trend: -12.5 
    }
  ]
  
  // 图表相关
  const timeRange = ref('week')
  const mainChartRef = ref(null)
  const pieChartRef = ref(null)
  let mainChart = null
  let pieChart = null
  
  // 初始化主图表
  const initMainChart = () => {
    if (mainChartRef.value) {
      mainChart = echarts.init(mainChartRef.value)
      mainChart.setOption({
        title: {
          text: '近7天系统运行状态'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['设备在线率', '预警次数', '处理及时率']
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: [
          {
            type: 'value',
            name: '百分比',
            min: 0,
            max: 100,
            interval: 20
          },
          {
            type: 'value',
            name: '次数',
            min: 0,
            max: 20,
            interval: 5
          }
        ],
        series: [
          {
            name: '设备在线率',
            type: 'line',
            data: [98, 97, 98, 99, 98, 97, 98]
          },
          {
            name: '预警次数',
            type: 'bar',
            yAxisIndex: 1,
            data: [5, 8, 3, 7, 9, 4, 8]
          },
          {
            name: '处理及时率',
            type: 'line',
            data: [95, 93, 97, 96, 94, 95, 96]
          }
        ]
      })
    }
  }
  
  // 初始化饼图
  const initPieChart = () => {
    if (pieChartRef.value) {
      pieChart = echarts.init(pieChartRef.value)
      pieChart.setOption({
        title: {
          text: '预警类型分布',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [
              { value: 35, name: '设备故障' },
              { value: 25, name: '环境异常' },
              { value: 20, name: '安全隐患' },
              { value: 15, name: '操作违规' },
              { value: 5, name: '其他' }
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
      })
    }
  }
  
  // 处理窗口大小变化
  const handleResize = () => {
    mainChart?.resize()
    pieChart?.resize()
  }
  
  // 预警列表
  const alerts = ref([
    {
      type: '设备故障',
      content: '1号反应釜压力异常',
      time: '2024-03-20 10:30:00'
    },
    {
      type: '环境异常',
      content: '储存区温度超标',
      time: '2024-03-20 09:15:00'
    },
    {
      type: '安全隐患',
      content: '气体泄漏预警',
      time: '2024-03-20 08:45:00'
    }
  ])
  
  // 巡检列表
  const inspections = ref([
    {
      area: '反应区',
      status: '已完成',
      inspector: '杨光',
      time: '2024-03-20 10:00:00'
    },
    {
      area: '储存区',
      status: '进行中',
      inspector: '赵建国',
      time: '2024-03-20 09:30:00'
    },
    {
      area: '包装区',
      status: '待开始',
      inspector: '赵明',
      time: '2024-03-20 11:00:00'
    }
  ])
  
  // 获取预警类型样式
  const getAlertType = (type) => {
    const typeMap = {
      '设备故障': 'danger',
      '环境异常': 'warning',
      '安全隐患': 'error',
      '操作违规': 'info'
    }
    return typeMap[type] || 'info'
  }
  
  // 获取状态样式
  const getStatusType = (status) => {
    const statusMap = {
      '已完成': 'success',
      '进行中': 'primary',
      '待开始': 'info'
    }
    return statusMap[status] || 'info'
  }
  
  onMounted(() => {
    // 使用 setTimeout 确保 DOM 已渲染
    setTimeout(() => {
      initMainChart()
      initPieChart()
      window.addEventListener('resize', handleResize)
    }, 0)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    mainChart?.dispose()
    pieChart?.dispose()
  })
  
  // 监听时间范围变化
  watch(timeRange, () => {
    initMainChart()
  })
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 20px;
    background: #f0f2f5;
    min-height: 100vh;
  }
  
  .data-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
    cursor: pointer;
  }
  
  .data-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    font-size: 24px;
  }
  
  .card-1 .card-icon { background: rgba(43,93,255,0.1); color: #2b5dff; }
  .card-2 .card-icon { background: rgba(255,77,79,0.1); color: #ff4d4f; }
  .card-3 .card-icon { background: rgba(82,196,26,0.1); color: #52c41a; }
  .card-4 .card-icon { background: rgba(250,173,20,0.1); color: #faad14; }
  
  .card-info {
    flex: 1;
  }
  
  .card-title {
    font-size: 14px;
    color: #666;
  }
  
  .card-value {
    font-size: 24px;
    font-weight: 600;
    margin: 8px 0;
  }
  
  .card-trend {
    font-size: 12px;
    color: #999;
  }
  
  .card-trend .up { color: #52c41a; }
  .card-trend .down { color: #ff4d4f; }
  
  .chart-row {
    margin-top: 20px;
  }
  
  .chart-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    height: 400px;
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .main-chart, .pie-chart {
    height: calc(100% - 60px);
  }
  
  .activity-row {
    margin-top: 20px;
  }
  
  .list-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .list-header h3 {
    margin: 0;
  }
  
  :deep(.el-table) {
    margin-top: 10px;
  }
  </style>