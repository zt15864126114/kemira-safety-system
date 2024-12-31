<template>
  <div class="inspection-route">
    <el-row :gutter="20">
      <!-- 左侧路线列表 -->
      <el-col :span="8">
        <el-card class="route-list">
          <template #header>
            <div class="card-header">
              <span>巡检路线列表</span>
              <div>
                <el-button type="primary" size="small" @click="createRoute">新建路线</el-button>
                <el-button type="success" size="small" @click="importRoute">导入</el-button>
              </div>
            </div>
          </template>
          
          <el-input
            v-model="searchKeyword"
            placeholder="搜索路线"
            clearable
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-menu
            :default-active="activeRoute"
            class="route-menu"
            @select="handleRouteSelect"
          >
            <el-menu-item 
              v-for="route in routeList" 
              :key="route.id" 
              :index="route.id"
            >
              <el-icon><Location /></el-icon>
              <span>{{ route.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧路线详情 -->
      <el-col :span="16">
        <el-card class="route-detail">
          <template #header>
            <div class="card-header">
              <span>路线详情</span>
              <div v-if="currentRoute">
                <el-button type="primary" size="small" @click="editRoute">编辑</el-button>
                <el-button type="danger" size="small" @click="deleteRoute">删除</el-button>
              </div>
            </div>
          </template>

          <div v-if="currentRoute" class="route-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="路线名称">{{ currentRoute.name }}</el-descriptions-item>
              <el-descriptions-item label="巡检区域">{{ currentRoute.area }}</el-descriptions-item>
              <el-descriptions-item label="巡检点数量">{{ currentRoute.points.length }}</el-descriptions-item>
              <el-descriptions-item label="预计用时">{{ currentRoute.duration }}</el-descriptions-item>
            </el-descriptions>

            <!-- 路线地图 -->
            <div ref="mapRef" class="route-map"></div>

            <!-- 巡检点列表 -->
            <div class="points-list">
              <h3>巡检点列表</h3>
              <el-table :data="currentRoute.points" style="width: 100%">
                <el-table-column prop="name" label="巡检点" width="150" />
                <el-table-column prop="type" label="类型" width="120" />
                <el-table-column prop="description" label="描述" />
              </el-table>
            </div>
          </div>
          <div v-else class="empty-route">
            <el-empty description="请选择或创建巡检路线" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

// 搜索关键词
const searchKeyword = ref('')

// 路线列表
const routeList = ref([
  {
    id: '1',
    name: '生产区巡检路线A',
    area: '生产区',
    duration: '30分钟',
    points: [
      { name: '点位1', type: '设备', description: '主设备检查点' },
      { name: '点位2', type: '安全', description: '消防设施检查点' },
      { name: '点位3', type: '环境', description: '环境监测点' }
    ]
  },
  {
    id: '2',
    name: '储存区巡检路线B',
    area: '储存区',
    duration: '45分钟',
    points: [
      { name: '点位4', type: '设备', description: '储存设备检查点' },
      { name: '点位5', type: '安全', description: '安全出口检查点' }
    ]
  }
])

// 当前选中的路线
const activeRoute = ref('')
const currentRoute = ref(null)

// 地图相关
const mapRef = ref(null)
let mapChart = null

// 初始化地图
const initMap = async () => {
  if (!mapRef.value) return

  await nextTick()
  
  if (mapChart) {
    mapChart.dispose()
  }

  mapChart = echarts.init(mapRef.value)
  const option = {
    title: {
      text: '巡检路线图'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        symbolSize: 20,
        roam: true,
        label: {
          show: true
        },
        data: currentRoute.value?.points.map((point, index) => ({
          name: point.name,
          x: 100 + index * 100,
          y: 200
        })) || [],
        links: currentRoute.value?.points.slice(1).map((_, index) => ({
          source: index,
          target: index + 1
        })) || []
      }
    ]
  }
  mapChart.setOption(option)
}

// 选择路线
const handleRouteSelect = (id) => {
  activeRoute.value = id
  currentRoute.value = routeList.value.find(route => route.id === id)
  initMap()
}

// 新建路线
const createRoute = () => {
  console.log('新建路线')
}

// 导入路线
const importRoute = () => {
  console.log('导入路线')
}

// 编辑路线
const editRoute = () => {
  console.log('编辑路线', currentRoute.value)
}

// 删除路线
const deleteRoute = () => {
  console.log('删除路线', currentRoute.value)
}

// 窗口大小变化处理
const handleResize = () => {
  mapChart?.resize()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  mapChart?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.inspection-route {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  margin-bottom: 20px;
}

.route-menu {
  border-right: none;
}

.route-map {
  height: 400px;
  margin: 20px 0;
  border: 1px solid #eee;
}

.points-list {
  margin-top: 20px;
}

.points-list h3 {
  margin-bottom: 15px;
}

.empty-route {
  padding: 40px 0;
}
</style> 