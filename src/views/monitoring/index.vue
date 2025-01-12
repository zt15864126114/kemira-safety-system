<template>
  <div class="monitoring-container">
    <!-- 设备选择器 -->
    <div class="device-selector">
      <el-select
          v-if="displayMode === 'single'"
          v-model="selectedDeviceId"
          placeholder="请选择监控设备"
          class="device-select"
          @change="handleDeviceChange"
      >
        <el-option
            v-for="device in deviceList"
            :key="device.id"
            :label="device.name"
            :value="device.id"
        >
          <div class="device-option">
            <span>{{ device.name }}</span>
            <el-tag size="small" :type="device.status === 'running' ? 'success' : 'danger'">
              {{ device.status === 'running' ? '运行中' : '已停止' }}
            </el-tag>
          </div>
        </el-option>
      </el-select>

      <el-radio-group v-model="displayMode" class="display-mode" @change="handleDisplayModeChange">
        <el-radio-button label="single">单设备视图</el-radio-button>
        <el-radio-button label="multiple">多设备对比</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 监控卡片 -->
    <el-row :gutter="24" class="monitor-cards">
      <el-col :span="6" v-for="card in dashboardCards" :key="card.title">
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <div class="monitor-card">
            <div class="card-icon" :class="card.status">
              <el-icon :size="24">
                <component :is="getCardIcon(card.title)" />
              </el-icon>
            </div>
            <div class="card-info">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value" :class="card.status">{{ card.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="24" class="chart-section">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="title">温度实时监控</span>
              <el-tag effect="plain" type="success">实时更新</el-tag>
            </div>
          </template>
          <div id="temperatureChart" style="height: 380px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="title">压力实时监控</span>
              <el-tag effect="plain" type="success">实时更新</el-tag>
            </div>
          </template>
          <div id="pressureChart" style="height: 380px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 报警记录 -->
    <el-card class="alert-card">
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <span class="title">报警记录</span>
            <el-tag effect="plain" type="danger" class="alert-count">
              {{ activeAlarms.length }} 条未处理
            </el-tag>
          </div>
          <div class="header-right">
            <el-radio-group v-model="alarmFilter" size="small">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="active">未处理</el-radio-button>
              <el-radio-button label="resolved">已处理</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <el-table
          :data="filteredAlarms"
          style="width: 100%"
          :max-height="400"
          :row-class-name="getAlarmRowClass"
      >
        <el-table-column prop="time" label="时间" width="160">
          <template #default="{ row }">
            {{ formatTime(row.time) }}
          </template>
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" width="160" />
        <el-table-column prop="typeName" label="报警类型" width="120" />
        <el-table-column label="报警值" width="120" align="center">
          <template #default="{ row }">
            {{ row.value }}{{ row.unit }}
          </template>
        </el-table-column>
        <el-table-column label="报警等级" width="100">
          <template #default="{ row }">
            <el-tag
                :type="row.level === 'error' ? 'danger' : 'warning'"
                :effect="row.status === 'active' ? 'light' : 'plain'"
                size="small"
            >
              {{ row.level === 'error' ? '严重' : '警告' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag
                :type="row.status === 'active' ? 'danger' : 'success'"
                :effect="row.status === 'active' ? 'light' : 'plain'"
                size="small"
            >
              {{ row.status === 'active' ? '未处理' : '已处理' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
                v-if="row.status === 'active'"
                type="primary"
                link
                size="small"
                @click="handleAlarm(row)"
            >
              处理
            </el-button>
            <el-button
                type="primary"
                link
                size="small"
                @click="showAlarmDetail(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 报警详情对话框 -->
    <el-dialog
        v-model="alarmDetailVisible"
        title="报警详情"
        width="600px"
    >
      <template v-if="currentAlarm">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="报警时间">
            {{ formatTime(currentAlarm.time) }}
          </el-descriptions-item>
          <el-descriptions-item label="设备名称">
            {{ currentAlarm.deviceName }}
          </el-descriptions-item>
          <el-descriptions-item label="报警类型">
            {{ currentAlarm.typeName }}
          </el-descriptions-item>
          <el-descriptions-item label="报警值">
            {{ currentAlarm.value }}{{ currentAlarm.unit }}
          </el-descriptions-item>
          <el-descriptions-item label="报警等级">
            <el-tag :type="currentAlarm.level === 'error' ? 'danger' : 'warning'">
              {{ currentAlarm.level === 'error' ? '严重' : '警告' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentAlarm.status === 'active' ? 'danger' : 'success'">
              {{ currentAlarm.status === 'active' ? '未处理' : '已处理' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// 类型定义
interface Device {
  id: string
  name: string
  status: 'running' | 'stopped'
  data: {
    temperature: number
    pressure: number
    humidity: number
    lastUpdate: string
  }
}

interface AlarmRecord {
  id: string
  time: string
  deviceId: string
  deviceName: string
  type: AlarmType
  typeName: string
  value: string
  unit: string
  level: 'error' | 'warning'
  status: 'active' | 'resolved'
}

type AlarmType = 'temperature_high' | 'temperature_low' | 'pressure_high' | 'pressure_low' | 'system_error'

// 设备配置
const deviceConfigs = {
  // 注塑机组（A组）
  'A-101': { 
    name: '双色注塑机-1号',
    temperature: 185, 
    pressure: 12.5, 
    tempAmplitude: 2.0, 
    pressureAmplitude: 0.3, 
    frequency: 0.2 
  },
  'A-102': { 
    name: '立式注塑机-2号',
    temperature: 180, 
    pressure: 12.8, 
    tempAmplitude: 1.8, 
    pressureAmplitude: 0.25, 
    frequency: 0.15 
  },
  'A-103': { 
    name: '卧式注塑机-3号',
    temperature: 178, 
    pressure: 12.3, 
    tempAmplitude: 1.9, 
    pressureAmplitude: 0.28, 
    frequency: 0.18 
  },
  // 挤出机组（B组）
  'B-201': { 
    name: '双螺杆挤出机-1号',
    temperature: 165, 
    pressure: 15.2, 
    tempAmplitude: 1.5, 
    pressureAmplitude: 0.35, 
    frequency: 0.25 
  },
  'B-202': { 
    name: '单螺杆挤出机-2号',
    temperature: 168, 
    pressure: 15.5, 
    tempAmplitude: 1.6, 
    pressureAmplitude: 0.32, 
    frequency: 0.22 
  },
  'B-203': { 
    name: '造粒挤出机-3号',
    temperature: 170, 
    pressure: 15.0, 
    tempAmplitude: 1.7, 
    pressureAmplitude: 0.30, 
    frequency: 0.20 
  },
  // 吹塑机组（C组）
  'C-301': { 
    name: '中空吹塑机-1号',
    temperature: 195, 
    pressure: 10.5, 
    tempAmplitude: 2.2, 
    pressureAmplitude: 0.22, 
    frequency: 0.30 
  },
  'C-302': { 
    name: '片材吹塑机-2号',
    temperature: 192, 
    pressure: 10.8, 
    tempAmplitude: 2.1, 
    pressureAmplitude: 0.25, 
    frequency: 0.28 
  }
} as const

// 设备数据模式配置
const devicePatterns = {
  'A-101': { base: 185, amplitude: 2.0, frequency: 0.2 },
  'A-102': { base: 180, amplitude: 1.8, frequency: 0.15 },
  'A-103': { base: 178, amplitude: 1.9, frequency: 0.18 },
  'B-201': { base: 165, amplitude: 1.5, frequency: 0.25 },
  'B-202': { base: 168, amplitude: 1.6, frequency: 0.22 },
  'B-203': { base: 170, amplitude: 1.7, frequency: 0.20 },
  'C-301': { base: 195, amplitude: 2.2, frequency: 0.30 },
  'C-302': { base: 192, amplitude: 2.1, frequency: 0.28 }
} as const

// 报警配置
const alarmConfigs = {
  temperature_high: {
    name: '温度过高',
    level: 'error' as const,
    threshold: { 'A': 195, 'B': 180, 'C': 205 }
  },
  temperature_low: {
    name: '温度过低',
    level: 'warning' as const,
    threshold: { 'A': 170, 'B': 155, 'C': 180 }
  },
  pressure_high: {
    name: '压力过高',
    level: 'error' as const,
    threshold: { 'A': 14.0, 'B': 17.0, 'C': 12.0 }
  },
  pressure_low: {
    name: '压力过低',
    level: 'warning' as const,
    threshold: { 'A': 11.0, 'B': 13.5, 'C': 9.0 }
  },
  system_error: {
    name: '系统异常',
    level: 'error' as const
  }
}

// 响应式状态
const deviceList = ref<Device[]>(
    Object.entries(deviceConfigs).map(([id, config]) => ({
      id,
      name: config.name,
      status: 'running',
      data: {
        temperature: config.temperature,
        pressure: config.pressure,
        humidity: 45,
        lastUpdate: new Date().toISOString()
      }
    }))
)

const selectedDeviceId = ref(deviceList.value[0].id)
const displayMode = ref<'single' | 'multiple'>('single')
const alarmRecords = ref<AlarmRecord[]>([])
const alarmFilter = ref<'all' | 'active' | 'resolved'>('all')
const alarmDetailVisible = ref(false)
const currentAlarm = ref<AlarmRecord | null>(null)

// 图表实例
let temperatureChart: echarts.EChartsType | null = null
let pressureChart: echarts.EChartsType | null = null
let updateTimer: number | null = null
let alarmUpdateTimer: number | null = null
// 计算属性
const filteredAlarms = computed(() => {
  if (alarmFilter.value === 'all') return alarmRecords.value
  return alarmRecords.value.filter(alarm =>
      alarmFilter.value === 'active' ? alarm.status === 'active' : alarm.status === 'resolved'
  )
})

const activeAlarms = computed(() =>
    alarmRecords.value.filter(alarm => alarm.status === 'active')
)

const dashboardCards = computed(() => {
  const device = deviceList.value.find(d => d.id === selectedDeviceId.value)
  if (!device) return []

  return [
    {
      title: '当前温度',
      value: `${device.data.temperature.toFixed(1)}℃`,
      status: getStatusByValue('temperature', device.data.temperature, device.id.charAt(0) as 'A' | 'B' | 'C')
    },
    {
      title: '当前压力',
      value: `${device.data.pressure.toFixed(2)}MPa`,
      status: getStatusByValue('pressure', device.data.pressure, device.id.charAt(0) as 'A' | 'B' | 'C')
    },
    {
      title: '湿度',
      value: `${device.data.humidity}%`,
      status: device.data.humidity > 60 ? 'warning' : 'normal'
    },
    {
      title: '设备状态',
      value: device.status === 'running' ? '运行中' : '已停止',
      status: device.status === 'running' ? 'normal' : 'warning'
    }
  ]
})

// 工具函数
const getStatusByValue = (type: 'temperature' | 'pressure', value: number, deviceType: 'A' | 'B' | 'C'): 'normal' | 'warning' | 'error' => {
  if (type === 'temperature') {
    if (value >= alarmConfigs.temperature_high.threshold[deviceType]) return 'error'
    if (value <= alarmConfigs.temperature_low.threshold[deviceType]) return 'warning'
  } else if (type === 'pressure') {
    if (value >= alarmConfigs.pressure_high.threshold[deviceType]) return 'error'
    if (value <= alarmConfigs.pressure_low.threshold[deviceType]) return 'warning'
  }
  return 'normal'
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const getCardIcon = (title: string) => {
  const iconMap: Record<string, string> = {
    '当前温度': 'Thermometer',
    '当前压力': 'Odometer',
    '湿度': 'Sunny',
    '设备状态': 'Monitor'
  }
  return iconMap[title] || 'More'
}

const generateRandomValue = (base: number, variance: number) => {
  return +(base + (Math.random() - 0.5) * variance).toFixed(1)
}

const getAlarmRowClass = (row: AlarmRecord) => {
  return row.status === 'active' ? 'warning-row' : ''
}
// 图表相关函数
const getBaseChartOption = (title: string): EChartsOption => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  grid: {
    top: 60,
    left: 50,
    right: 20,
    bottom: 30,
    containLabel: true
  },
  xAxis: {
    type: 'time',
    boundaryGap: false,
    splitLine: { show: false },
    axisLabel: {
      formatter: (value: number) => {
        const date = new Date(value)
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      }
    }
  },
  yAxis: {
    type: 'value',
    name: title,
    nameLocation: 'end',
    nameGap: 15,
    nameRotate: 0,
    nameTextStyle: {
      align: 'right',
      padding: [0, 0, 0, 5]
    },
    splitLine: {
      show: true,
      lineStyle: { type: 'dashed' }
    }
  }
})

const generateChartData = (baseValue: number, variance: number, deviceId: string, type: 'temperature' | 'pressure') => {
  const now = new Date().getTime()
  const result = []
  
  const config = deviceConfigs[deviceId as keyof typeof deviceConfigs]
  if (!config) return result

  // 根据类型选择不同的配置
  const pattern = {
    base: type === 'temperature' ? config.temperature : config.pressure,
    amplitude: type === 'temperature' ? config.tempAmplitude : config.pressureAmplitude,
    frequency: config.frequency * (type === 'temperature' ? 1 : 1.5) // 压力波动频率稍快
  }

  const deviceType = deviceId.charAt(0)
  // 温度和压力的噪声水平不同
  const noiseLevel = type === 'temperature' 
    ? (deviceType === 'A' ? 0.4 : deviceType === 'B' ? 0.3 : 0.2)
    : (deviceType === 'A' ? 0.2 : deviceType === 'B' ? 0.25 : 0.15)

  for (let i = -60; i <= 0; i++) {
    const time = now + i * 1000
    // 使用不同的波动模式
    const value = pattern.base + 
      pattern.amplitude * Math.sin(i * pattern.frequency) + 
      (Math.random() - 0.5) * variance * noiseLevel +
      // 添加一个缓慢变化的趋势
      (type === 'temperature' ? Math.sin(i / 120) : Math.cos(i / 180)) * pattern.amplitude * 0.5

    result.push([time, +value.toFixed(2)])
  }
  
  return result
}

const initCharts = () => {
  const tempDom = document.getElementById('temperatureChart')
  const pressDom = document.getElementById('pressureChart')
  
  if (tempDom) {
    temperatureChart = echarts.init(tempDom)
    temperatureChart.setOption({
      ...getBaseChartOption('温度(℃)'),
      legend: {
        show: displayMode.value === 'multiple',
        top: 10,
        type: 'scroll'
      },
      series: [{
        name: '温度',
        type: 'line',
        smooth: true,
        data: []
      }]
    })
  }

  if (pressDom) {
    pressureChart = echarts.init(pressDom)
    pressureChart.setOption({
      ...getBaseChartOption('压力(MPa)'),
      legend: {
        show: displayMode.value === 'multiple',
        top: 10,
        type: 'scroll'
      },
      series: [{
        name: '压力',
        type: 'line',
        smooth: true,
        data: []
      }]
    })
  }
}

const updateSingleDeviceCharts = (device: Device) => {
  if (!temperatureChart || !pressureChart) return

  const tempData = generateChartData(
    device.data.temperature, 
    2, 
    device.id, 
    'temperature'
  )
  
  const pressData = generateChartData(
    device.data.pressure, 
    0.2, 
    device.id, 
    'pressure'
  )

  temperatureChart.setOption({
    series: [{
      data: tempData
    }]
  })

  pressureChart.setOption({
    series: [{
      data: pressData
    }]
  })
}

const updateMultipleDeviceCharts = () => {
  if (!temperatureChart || !pressureChart) return

  const tempSeries = deviceList.value.map(device => ({
    name: device.name,
    type: 'line',
    smooth: true,
    showSymbol: false,
    data: generateChartData(device.data.temperature, 2, device.id, 'temperature')
  }))

  const pressSeries = deviceList.value.map(device => ({
    name: device.name,
    type: 'line',
    smooth: true,
    showSymbol: false,
    data: generateChartData(device.data.pressure, 0.2, device.id, 'pressure')
  }))

  temperatureChart.setOption({
    legend: {
      show: true,
      top: 10,
      type: 'scroll'
    },
    series: tempSeries
  })

  pressureChart.setOption({
    legend: {
      show: true,
      top: 10,
      type: 'scroll'
    },
    series: pressSeries
  })
}
// 报警相关函数
const checkAndGenerateAlarm = (device: Device) => {
  const deviceType = device.id.charAt(0) as 'A' | 'B' | 'C'
  const { temperature, pressure } = device.data

  // 降低温度报警的触发概率
  if (temperature >= alarmConfigs.temperature_high.threshold[deviceType] && Math.random() < 0.1) {
    generateAlarm(device, 'temperature_high', temperature.toFixed(1), '℃', 'error')
  } else if (temperature <= alarmConfigs.temperature_low.threshold[deviceType] && Math.random() < 0.1) {
    generateAlarm(device, 'temperature_low', temperature.toFixed(1), '℃', 'warning')
  }

  // 降低压力报警的触发概率
  if (pressure >= alarmConfigs.pressure_high.threshold[deviceType] && Math.random() < 0.1) {
    generateAlarm(device, 'pressure_high', pressure.toFixed(2), 'MPa', 'error')
  } else if (pressure <= alarmConfigs.pressure_low.threshold[deviceType] && Math.random() < 0.1) {
    generateAlarm(device, 'pressure_low', pressure.toFixed(2), 'MPa', 'warning')
  }

  // 大幅降低系统异常的触发概率（从1%降到0.1%）
  if (Math.random() < 0.001) {
    const errorTypes = [
      { value: 'E001', desc: '通信总线异常' },
      { value: 'E002', desc: '温度传感器故障' },
      { value: 'E003', desc: '压力传感器故障' },
      { value: 'E004', desc: '伺服电机异常' },
      { value: 'E005', desc: '液压系统故障' },
      { value: 'E006', desc: '加热器故障' },
      { value: 'E007', desc: '冷却系统异常' },
      { value: 'E008', desc: '安全门未关闭' }
    ]
    const errorType = errorTypes[Math.floor(Math.random() * errorTypes.length)]
    generateAlarm(
      device, 
      'system_error', 
      `${errorType.value}: ${errorType.desc}`,
      '', 
      'error'
    )
  }
}

const generateAlarm = (
    device: Device,
    type: AlarmType,
    value: string,
    unit: string,
    level: 'error' | 'warning'
) => {
  const existingAlarm = alarmRecords.value.find(a =>
      a.deviceId === device.id &&
      a.type === type &&
      a.status === 'active'
  )

  if (!existingAlarm) {
    const alarm: AlarmRecord = {
      id: `${type}-${device.id}-${Date.now()}`,
      time: new Date().toISOString(),
      deviceId: device.id,
      deviceName: device.name,
      type,
      typeName: alarmConfigs[type].name,
      value,
      unit,
      level,
      status: 'active'
    }

    alarmRecords.value.unshift(alarm)

    if (alarmRecords.value.length > 100) {
      alarmRecords.value = alarmRecords.value.slice(0, 100)
    }

    ElMessage({
      type: level === 'error' ? 'error' : 'warning',
      message: `${device.name} - ${alarmConfigs[type].name}`,
      duration: 3000
    })
  }
}

// 事件处理函数
const handleDeviceChange = (deviceId: string) => {
  const device = deviceList.value.find(d => d.id === deviceId)
  if (device) {
    updateSingleDeviceCharts(device)
  }
}

const handleDisplayModeChange = async (mode: 'single' | 'multiple') => {
  // 先更新显示模式
  displayMode.value = mode

  // 等待下一个渲染周期
  await nextTick()

  // 重新初始化图表
  if (temperatureChart) {
    temperatureChart.dispose()
  }
  if (pressureChart) {
    pressureChart.dispose()
  }

  // 重新初始化图表
  initCharts()

  // 等待图表初始化完成
  await nextTick()

  // 根据模式更新数据
  if (mode === 'single') {
    const device = deviceList.value.find(d => d.id === selectedDeviceId.value)
    if (device) {
      updateSingleDeviceCharts(device)
    }
  } else {
    updateMultipleDeviceCharts()
  }
}

const handleAlarm = async (alarm: AlarmRecord) => {
  try {
    await ElMessageBox.confirm(
        '确认处理此报警吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
    )

    alarm.status = 'resolved'
    ElMessage.success('报警已处理')
  } catch {
    // 用户取消操作
  }
}

const showAlarmDetail = (alarm: AlarmRecord) => {
  currentAlarm.value = alarm
  alarmDetailVisible.value = true
}

// 数据更新函数
const updateDeviceData = () => {
  deviceList.value.forEach(device => {
    if (device.status === 'running') {
      const config = deviceConfigs[device.id as keyof typeof deviceConfigs]
      if (!config) return

      device.data = {
        temperature: generateRandomValue(config.temperature, config.tempAmplitude),
        pressure: generateRandomValue(config.pressure, config.pressureAmplitude),
        humidity: generateRandomValue(45, 10),
        lastUpdate: new Date().toISOString()
      }

      checkAndGenerateAlarm(device)
    }
  })

  if (displayMode.value === 'single') {
    const device = deviceList.value.find(d => d.id === selectedDeviceId.value)
    if (device) {
      updateSingleDeviceCharts(device)
    }
  } else {
    updateMultipleDeviceCharts()
  }
}

// 生命周期钩子
onMounted(() => {
  initCharts()

  const device = deviceList.value.find(d => d.id === selectedDeviceId.value)
  if (device) {
    updateSingleDeviceCharts(device)
  }

  updateTimer = window.setInterval(() => {
    updateDeviceData()
  }, 1000)

  alarmUpdateTimer = window.setInterval(() => {
    alarmRecords.value.forEach(alarm => {
      if (alarm.status === 'active' && Math.random() < 0.05) {
        alarm.status = 'resolved'
      }
    })
  }, 10000)

  const handleResize = () => {
    temperatureChart?.resize()
    pressureChart?.resize()
  }
  window.addEventListener('resize', handleResize)
  resizeHandler = handleResize
})

onUnmounted(() => {
  if (updateTimer) window.clearInterval(updateTimer)
  if (alarmUpdateTimer) window.clearInterval(alarmUpdateTimer)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  temperatureChart?.dispose()
  pressureChart?.dispose()
})
</script>
<style scoped lang="scss">
.monitoring-container {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);

  // 设备选择器样式
  .device-selector {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .device-select {
      width: 300px;
    }

    .device-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .display-mode {
      margin-left: auto;
    }
  }

  // 监控卡片样式
  .monitor-cards {
    margin-bottom: 24px;

    .monitor-card {
      display: flex;
      align-items: center;
      gap: 20px;

      .card-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;

        &.normal {
          background-color: #f0f9eb;
          color: #67c23a;
          &:hover { background-color: #e1f3d8; }
        }
        &.warning {
          background-color: #fdf6ec;
          color: #e6a23c;
          &:hover { background-color: #faecd8; }
        }
        &.error {
          background-color: #fef0f0;
          color: #f56c6c;
          &:hover { background-color: #fde2e2; }
        }
      }

      .card-info {
        flex: 1;

        .card-title {
          font-size: 14px;
          color: #606266;
          margin-bottom: 8px;
        }

        .card-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;

          &.normal { color: #67c23a; }
          &.warning { color: #e6a23c; }
          &.error { color: #f56c6c; }
        }
      }
    }
  }

  // 图表区域样式
  .chart-section {
    margin-bottom: 24px;

    .chart-card {
      height: 100%;
    }
  }

  // 报警记录样式
  .alert-card {
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .alert-count {
        font-size: 12px;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }

  // 通用卡片样式
  :deep(.el-card) {
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0,21,41,.12);
    }

    .el-card__header {
      padding: 16px 20px;
      border-bottom: 1px solid #ebeef5;
    }
  }

  // 卡片头部样式
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  // 表格样式
  :deep(.el-table) {
    .warning-row {
      --el-table-tr-bg-color: var(--el-color-danger-light-9);
    }

    .el-table__row {
      transition: background-color 0.3s;
    }
  }

  // 对话框样式
  :deep(.el-dialog) {
    .el-dialog__header {
      margin-right: 0;
      padding: 20px;
      border-bottom: 1px solid #ebeef5;
    }

    .el-dialog__body {
      padding: 20px;
    }

    .el-descriptions {
      margin-bottom: 0;
    }
  }
}
</style>