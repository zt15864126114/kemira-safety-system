<template>
  <el-container class="app-wrapper">
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <img :src="defaultLogo" alt="logo" />
        <span>安全管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>总览</span>
        </el-menu-item>
        <el-menu-item index="/monitoring">
          <el-icon><Monitor /></el-icon>
          <span>实时监控</span>
        </el-menu-item>
        <el-menu-item index="/inspection">
          <el-icon><List /></el-icon>
          <span>巡检管理</span>
        </el-menu-item>
        <el-menu-item index="/reports">
          <el-icon><Document /></el-icon>
          <span>报表统计</span>
        </el-menu-item>
        <el-menu-item index="/alerts">
          <el-icon><Bell /></el-icon>
          <span>预警处置</span>
        </el-menu-item>
        <el-menu-item index="/integration">
          <el-icon><Connection /></el-icon>
          <span>系统集成</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="toggle-sidebar" @click="toggleSidebar">
            <Expand />
          </el-icon>
          <el-breadcrumb>
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" :src="defaultAvatar" />
              <span>管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Odometer, Monitor, List, Document, Expand,Bell,Connection } from '@element-plus/icons-vue'
import { defaultLogo, defaultAvatar } from './assets/images'

const route = useRoute()

const activeMenu = computed(() => route.path)
const currentRoute = computed(() => {
  const routeMap: Record<string, string> = {
    '/welcome': '欢迎',
    '/dashboard': '总览',
    '/monitoring': '实时监控',
    '/inspection': '巡检管理',
    '/reports': '报表统计',
    '/alerts':'预警处置',
    '/integration':'系统集成'
  }
  return routeMap[route.path] || '总览'
})

const toggleSidebar = () => {
  // TODO: 实现侧边栏折叠功能
}
</script>

<style scoped lang="scss">
.app-wrapper {
  height: 100vh;

  .sidebar {
    background-color: #304156;
    color: #fff;
    
    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      font-size: 18px;
      font-weight: bold;
      
      img {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
    }

    :deep(.el-menu) {
      border-right: none;
      background-color: transparent;
    }

    :deep(.el-menu-item) {
      color: #bfcbd9;
      
      &:hover, &.is-active {
        color: #fff;
        background-color: #263445;
      }

      .el-icon {
        color: inherit;
      }
    }
  }

  .header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .toggle-sidebar {
        font-size: 20px;
        cursor: pointer;
        color: #606266;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
  }

  .el-main {
    background-color: #f5f7fa;
    padding: 0;
  }
}
</style> 