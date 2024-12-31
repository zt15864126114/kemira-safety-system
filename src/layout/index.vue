<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside-menu">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
        <span class="logo-text">安全管理系统</span>
      </div>
      <div class="custom-menu">
        <div 
          class="menu-item" 
          :class="{ active: route.path === '/dashboard' }"
          @click="navigateTo('/dashboard')"
        >
          <el-icon><Monitor /></el-icon>
          <span>控制台</span>
        </div>

        <div class="menu-group">
          <div class="menu-group-title" @click="toggleMenu('data')">
            <el-icon><DataLine /></el-icon>
            <span>数据采集</span>
            <el-icon class="arrow" :class="{ 'is-active': openMenus.includes('data') }">
              <ArrowDown />
            </el-icon>
          </div>
          <div class="menu-sub" v-show="openMenus.includes('data')">
            <div 
              class="menu-item" 
              :class="{ active: route.path === '/data-collection/realtime' }"
              @click="navigateTo('/data-collection/realtime')"
            >实时数据</div>
            <div 
              class="menu-item"
              :class="{ active: route.path === '/data-collection/history' }"
              @click="navigateTo('/data-collection/history')"
            >历史数据</div>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-group-title" @click="toggleMenu('inspection')">
            <el-icon><Search /></el-icon>
            <span>巡检管理</span>
            <el-icon class="arrow" :class="{ 'is-active': openMenus.includes('inspection') }">
              <ArrowDown />
            </el-icon>
          </div>
          <div class="menu-sub" v-show="openMenus.includes('inspection')">
            <div 
              class="menu-item"
              :class="{ active: route.path === '/inspection/task' }"
              @click="navigateTo('/inspection/task')"
            >巡检任务</div>
            <div 
              class="menu-item"
              :class="{ active: route.path === '/inspection/record' }"
              @click="navigateTo('/inspection/record')"
            >巡检记录</div>
            <div 
              class="menu-item"
              :class="{ active: route.path === '/inspection/route' }"
              @click="navigateTo('/inspection/route')"
            >巡检路线</div>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-group-title" @click="toggleMenu('alert')">
            <el-icon><Warning /></el-icon>
            <span>预警处置</span>
            <el-icon class="arrow" :class="{ 'is-active': openMenus.includes('alert') }">
              <ArrowDown />
            </el-icon>
          </div>
          <div class="menu-sub" v-show="openMenus.includes('alert')">
            <div 
              class="menu-item"
              :class="{ active: route.path === '/alert/monitor' }"
              @click="navigateTo('/alert/monitor')"
            >预警监控</div>
            <div 
              class="menu-item"
              :class="{ active: route.path === '/alert/handle' }"
              @click="navigateTo('/alert/handle')"
            >预警处置</div>
            <div 
              class="menu-item"
              :class="{ active: route.path === '/alert/rules' }"
              @click="navigateTo('/alert/rules')"
            >预警规则</div>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-group-title" @click="toggleMenu('report')">
            <el-icon><Document /></el-icon>
            <span>报表分析</span>
            <el-icon class="arrow" :class="{ 'is-active': openMenus.includes('report') }">
              <ArrowDown />
            </el-icon>
          </div>
          <div class="menu-sub" v-show="openMenus.includes('report')">
            <div 
              class="menu-item"
              :class="{ active: route.path === '/report/inspection' }"
              @click="navigateTo('/report/inspection')"
            >巡检报表</div>
            <div 
              class="menu-item"
              :class="{ active: route.path === '/report/alert' }"
              @click="navigateTo('/report/alert')"
            >预警报表</div>
            <div 
              class="menu-item"
              :class="{ active: route.path === '/report/analysis' }"
              @click="navigateTo('/report/analysis')"
            >数据分析</div>
          </div>
        </div>

        <div class="menu-item" @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          <span>退出登录</span>
        </div>
      </div>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-content">
          <div class="breadcrumb">
            <el-icon><HomeFilled /></el-icon>
            <span>{{ currentRoute }}</span>
          </div>
          <div class="user-info">
            <el-badge :value="3" class="notice-badge">
              <el-icon><Bell /></el-icon>
            </el-badge>
            <el-avatar :size="32" src="../assets/avatar.png" />
            <span>{{ username }}</span>
          </div>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const username = ref('管理员')
const openMenus = ref([])

// 切换菜单展开状态
const toggleMenu = (menuName) => {
  const index = openMenus.value.indexOf(menuName)
  if (index === -1) {
    openMenus.value.push(menuName)
  } else {
    openMenus.value.splice(index, 1)
  }
}

// 导航方法
const navigateTo = async (path) => {
  try {
    console.log('Navigating to:', path)
    // 确保路径以 / 开头
    const targetPath = path.startsWith('/') ? path : `/${path}`
    await router.push(targetPath)
    console.log('Current route:', route.path)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

const currentRoute = computed(() => {
  const matched = route.matched
  if (matched.length > 0) {
    return matched[matched.length - 1].meta?.title || ''
  }
  return ''
})

const handleLogout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  background: #f0f2f5;
}

.aside-menu {
  background: var(--gradient-bg);
  box-shadow: 2px 0 6px rgba(0,21,41,.35);
  transition: all 0.3s;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: white;
}

.logo {
  width: 32px;
  margin-right: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
}

.layout-header {
  background: white;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  padding: 0;
}

.header-content {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.layout-main {
  padding: 20px;
}

.el-menu {
  border-right: none;
}

.el-menu-item {
  margin: 4px 0;
  transition: all 0.3s;
}

.el-menu-item:hover {
  background: rgba(255,255,255,0.1) !important;
}

.notice-badge :deep(.el-badge__content) {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-menu {
  padding: 10px 0;
  color: #fff;
}

.menu-item {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-item.active {
  background: #409EFF;
}

.menu-item .el-icon {
  margin-right: 10px;
}

.menu-group-title {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-group-title:hover {
  background: rgba(255, 255, 255, 0.1);
}

.menu-group-title .el-icon {
  margin-right: 10px;
}

.menu-group-title .arrow {
  margin-left: auto;
  transition: transform 0.3s;
}

.menu-group-title .arrow.is-active {
  transform: rotate(180deg);
}

.menu-sub {
  background: rgba(0, 0, 0, 0.1);
}

.menu-sub .menu-item {
  padding-left: 48px;
}
</style> 