<template>
  <div class="system-monitor">
    <!-- 系统状态概览 -->
    <el-row :gutter="20" class="status-cards">
      <el-col :span="6" v-for="stat in statusStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="32" :class="stat.status">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 系统连接状态 -->
    <el-card class="connection-card">
      <template #header>
        <div class="card-header">
          <span>系统连接状态</span>
          <el-button type="primary" size="small" @click="refreshStatus">
            刷新状态
          </el-button>
        </div>
      </template>
      
      <el-table :data="store.systems" style="width: 100%">
        <el-table-column prop="name" label="系统名称" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag>{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastSync" label="最后同步">
          <template #default="{ row }">
            {{ formatTime(row.lastSync) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link 
              @click="testConnection(row.id)"
            >
              测试连接
            </el-button>
            <el-button 
              type="primary" 
              link 
              @click="showMetrics(row.id)"
            >
              性能指标
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 性能指标对话框 -->
    <el-dialog
      v-model="metricsVisible"
      title="系统性能指标"
      width="600px"
    >
      <template v-if="currentMetrics">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="CPU使用率">
            {{ currentMetrics.cpu.toFixed(1) }}%
          </el-descriptions-item>
          <el-descriptions-item label="内存使用率">
            {{ currentMetrics.memory.toFixed(1) }}%
          </el-descriptions-item>
          <el-descriptions-item label="网络使用率">
            {{ currentMetrics.network.toFixed(1) }}%
          </el-descriptions-item>
          <el-descriptions-item label="响应时间">
            {{ currentMetrics.responseTime.toFixed(0) }}ms
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useIntegrationStore } from '@/stores/integration'
import { integrationApi } from '@/api/integration'
import type { SystemMetrics } from '@/types/integration'
import { ElMessage } from 'element-plus'

const store = useIntegrationStore()
const metricsVisible = ref(false)
const currentMetrics = ref<SystemMetrics | null>(null)

// 状态统计
const statusStats = computed(() => [
  {
    label: '已连接系统',
    value: `${store.connectedSystems}/${store.systems.length}`,
    icon: 'Connection',
    status: 'success'
  },
  {
    label: '数据点数',
    value: store.totalDataPoints.toLocaleString(),
    icon: 'DataLine',
    status: 'primary'
  },
  {
    label: '活跃告警',
    value: store.activeAlerts.length,
    icon: 'Warning',
    status: store.activeAlerts.length > 0 ? 'warning' : 'info'
  }
])

// 工具函数
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'connected': 'success',
    'disconnected': 'info',
    'error': 'danger'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'connected': '已连接',
    'disconnected': '未连接',
    'error': '异常'
  }
  return textMap[status] || status
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString()
}

// 操作方法
const refreshStatus = async () => {
  for (const system of store.systems) {
    try {
      const status = await integrationApi.getSystemStatus(system.id)
      store.updateSystemStatus(system.id, status)
    } catch (error) {
      console.error(`Failed to update status for ${system.id}:`, error)
    }
  }
}

const testConnection = async (systemId: string) => {
  try {
    const result = await integrationApi.testConnection(systemId)
    ElMessage({
      type: result ? 'success' : 'error',
      message: result ? '连接测试成功' : '连接测试失败'
    })
  } catch (error) {
    ElMessage.error('连接测试失败')
  }
}

const showMetrics = async (systemId: string) => {
  try {
    currentMetrics.value = await integrationApi.getSystemMetrics(systemId)
    metricsVisible.value = true
  } catch (error) {
    ElMessage.error('获取性能指标失败')
  }
}

// 自动更新
let updateTimer: number | null = null

onMounted(() => {
  refreshStatus()
  updateTimer = window.setInterval(refreshStatus, 30000) // 每30秒更新一次
})

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style scoped lang="scss">
.system-monitor {
  .status-cards {
    margin-bottom: 24px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 16px;

    .el-icon {
      &.success { color: #67c23a; }
      &.primary { color: #409eff; }
      &.warning { color: #e6a23c; }
      &.info { color: #909399; }
    }

    .stat-info {
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .connection-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style> 