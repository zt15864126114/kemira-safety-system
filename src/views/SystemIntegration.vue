<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="8" v-for="system in systems" :key="system.id">
          <el-card>
            <template #header>
              <div class="system-header">
                <span>{{ system.name }}</span>
                <el-tag :type="system.status === 'online' ? 'success' : 'danger'">
                  {{ system.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </div>
            </template>
            
            <div class="system-info">
              <p>最后更新：{{ system.lastUpdate }}</p>
              <p>连接状态：{{ system.connection }}</p>
              <el-progress 
                :percentage="system.performance"
                :status="system.performance < 60 ? 'exception' : 'success'"
              />
              
              <el-button 
                :type="system.status === 'online' ? 'danger' : 'success'"
                @click="toggleSystem(system)"
              >
                {{ system.status === 'online' ? '停止' : '启动' }}
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 系统日志 -->
      <el-card style="margin-top: 20px">
        <template #header>系统日志</template>
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in logs"
            :key="index"
            :timestamp="log.time"
            :type="log.type"
          >
            {{ log.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const systems = ref([
  {
    id: 1,
    name: '数据采集系统',
    status: 'online',
    lastUpdate: '2024-03-20 10:00',
    connection: '正常',
    performance: 85
  },
  {
    id: 2,
    name: '预警处理系统',
    status: 'online',
    lastUpdate: '2024-03-20 09:55',
    connection: '正常',
    performance: 90
  },
  {
    id: 3,
    name: '报表管理系统',
    status: 'online',
    lastUpdate: '2024-03-20 09:50',
    connection: '正常',
    performance: 95
  }
])

const logs = ref([
  {
    time: '2024-03-20 10:00',
    type: 'success',
    content: '数据采集系统连接成功'
  },
  {
    time: '2024-03-20 09:55',
    type: 'warning',
    content: '预警系统检测到异常数据'
  }
])

const toggleSystem = (system) => {
  system.status = system.status === 'online' ? 'offline' : 'online'
  logs.value.unshift({
    time: new Date().toLocaleString(),
    type: system.status === 'online' ? 'success' : 'warning',
    content: `${system.name}${system.status === 'online' ? '启动' : '停止'}`
  })
}
</script>

<style scoped>
.system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.system-info {
  text-align: center;
}
</style> 