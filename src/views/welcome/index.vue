<template>
  <div class="welcome-container">
    <!-- 欢迎区域 -->
    <div class="welcome-header">
      <div class="welcome-content">
        <h1 class="title">凯米拉天成万丰智慧安全管理平台</h1>
        <p class="subtitle">Camira Intelligent Safety Management Platform</p>
        <div class="quick-stats">
          <div class="stat-item" v-for="stat in quickStats" :key="stat.label">
            <div class="stat-value" :class="stat.type">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速入口 -->
    <div class="quick-access">
      <el-row :gutter="24">
        <el-col :span="6" v-for="item in quickAccess" :key="item.title">
          <el-card 
            shadow="hover" 
            class="access-card"
            @click="handleNavigation(item.path)"
          >
            <div class="card-content">
              <el-icon :size="32" :class="item.type">
                <component :is="item.icon" />
              </el-icon>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 系统信息 -->
    <div class="system-info">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card class="info-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>系统概况</span>
                <el-tag type="success">运行正常</el-tag>
              </div>
            </template>
            <div class="info-list">
              <div class="info-item" v-for="info in systemInfo" :key="info.label">
                <span class="label">{{ info.label }}</span>
                <span class="value">{{ info.value }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="notice-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>系统公告</span>
                <el-button type="primary" link>查看全部</el-button>
              </div>
            </template>
            <div class="notice-list">
              <div 
                v-for="notice in notices" 
                :key="notice.id" 
                class="notice-item"
                @click="viewNotice(notice)"
              >
                <div class="notice-content">
                  <el-tag 
                    size="small" 
                    :type="notice.type"
                    class="notice-tag"
                  >
                    {{ notice.tag }}
                  </el-tag>
                  <span class="notice-title">{{ notice.title }}</span>
                </div>
                <span class="notice-time">{{ notice.time }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Monitor,
  Warning,
  DataLine,
  Setting,
  Document
} from '@element-plus/icons-vue'

const router = useRouter()

// 快速统计数据
const quickStats = ref([
  { label: '设备总数', value: '168', type: 'primary' },
  { label: '运行设备', value: '142', type: 'success' },
  { label: '待维护', value: '12', type: 'warning' },
  { label: '报警数量', value: '3', type: 'danger' }
])

// 快速访问入口
const quickAccess = [
  {
    title: '实时监控',
    description: '查看设备运行状态和实时数据',
    icon: Monitor,
    path: '/monitoring',
    type: 'success'
  },
  {
    title: '预警管理',
    description: '处理异常和报警信息',
    icon: Warning,
    path: '/alerts',
    type: 'danger'
  },
  {
    title: '巡检管理',
    description: '巡检统计',
    icon: DataLine,
    path: '/inspection',
    type: 'primary'
  },
  {
    title: '报表统计',
    description: '报表自定义生成与导出',
    icon: Setting,
    path: '/reports',
    type: 'info'
  }
]

// 系统信息
const systemInfo = ref([
  { label: '系统版本', value: 'V2.1.0' },
  { label: '上次更新', value: '2025-01-08' },
  { label: '运行时间', value: '180天' },
  { label: '在线用户', value: '12人' },
  { label: '数据库状态', value: '正常' },
  { label: '磁盘使用率', value: '46.2%' }
])

// 系统公告
const notices = ref([
  {
    id: 1,
    title: '系统将于本周日进行例行维护',
    time: '2025-01-03',
    type: 'warning',
    tag: '维护'
  },
  {
    id: 2,
    title: '新增设备数据分析模块',
    time: '2024-12-13',
    type: 'success',
    tag: '更新'
  },
  {
    id: 3,
    title: '关于加强设备维护管理的通知',
    time: '2024-12-10',
    type: 'info',
    tag: '通知'
  },
  {
    id: 4,
    title: '预警规则配置指南发布',
    time: '2024-12-05',
    type: 'primary',
    tag: '指南'
  }
])

// 方法
const handleNavigation = (path: string) => {
  router.push(path)
}

const viewNotice = (notice: any) => {
  // TODO: 查看公告详情
  console.log('查看公告:', notice)
}
</script>

<style scoped lang="scss">
.welcome-container {
  padding: 24px;
  background-color: var(--el-bg-color-page);
  min-height: calc(100vh - 60px);

  .welcome-header {
    background: linear-gradient(135deg, var(--el-color-primary-light-3), var(--el-color-primary));
    border-radius: 12px;
    padding: 48px;
    margin-bottom: 24px;
    color: #fff;
    text-align: center;

    .title {
      font-size: 32px;
      margin: 0;
      font-weight: 600;
    }

    .subtitle {
      font-size: 16px;
      opacity: 0.8;
      margin: 12px 0 32px;
    }

    .quick-stats {
      display: flex;
      justify-content: center;
      gap: 48px;

      .stat-item {
        .stat-value {
          font-size: 36px;
          font-weight: bold;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
  }

  .quick-access {
    margin-bottom: 24px;

    .access-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      .card-content {
        text-align: center;
        padding: 24px;

        .el-icon {
          margin-bottom: 16px;
          
          &.success { color: var(--el-color-success); }
          &.danger { color: var(--el-color-danger); }
          &.primary { color: var(--el-color-primary); }
          &.info { color: var(--el-color-info); }
        }

        h3 {
          margin: 0 0 12px;
          font-size: 18px;
          color: var(--el-text-color-primary);
        }

        p {
          margin: 0;
          font-size: 14px;
          color: var(--el-text-color-secondary);
          line-height: 1.5;
        }
      }
    }
  }

  .system-info {
    .info-card {
      .info-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            color: var(--el-text-color-secondary);
          }

          .value {
            color: var(--el-text-color-primary);
            font-weight: 500;
          }
        }
      }
    }

    .notice-card {
      .notice-list {
        .notice-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          cursor: pointer;
          transition: all 0.3s;

          &:not(:last-child) {
            border-bottom: 1px solid var(--el-border-color-lighter);
          }

          &:hover {
            background-color: var(--el-fill-color-light);
          }

          .notice-content {
            display: flex;
            align-items: center;
            gap: 8px;

            .notice-tag {
              flex-shrink: 0;
            }

            .notice-title {
              color: var(--el-text-color-primary);
            }
          }

          .notice-time {
            color: var(--el-text-color-secondary);
            font-size: 13px;
          }
        }
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

// 响应式布局
@media screen and (max-width: 1200px) {
  .welcome-container {
    .quick-access {
      :deep(.el-col) {
        width: 50%;
        margin-bottom: 16px;
      }
    }

    .system-info {
      :deep(.el-col) {
        width: 100%;
        margin-bottom: 16px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .welcome-container {
    padding: 16px;

    .welcome-header {
      padding: 32px 24px;

      .quick-stats {
        flex-wrap: wrap;
        gap: 24px;

        .stat-item {
          width: calc(50% - 12px);
        }
      }
    }

    .quick-access {
      :deep(.el-col) {
        width: 100%;
      }
    }
  }
}
</style> 