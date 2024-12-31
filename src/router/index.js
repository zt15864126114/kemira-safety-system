import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'data-collection',
        name: 'DataCollection',
        component: () => import('../views/data-collection/index.vue'),
        meta: { title: '数据采集' },
        children: [
          {
            path: 'realtime',
            name: 'RealtimeData',
            component: () => import('../views/data-collection/realtime.vue'),
            meta: { title: '实时数据' }
          },
          {
            path: 'history',
            name: 'HistoryData',
            component: () => import('../views/data-collection/history.vue'),
            meta: { title: '历史数据' }
          }
        ]
      },
      {
        path: 'inspection',
        name: 'Inspection',
        component: () => import('../views/inspection/index.vue'),
        meta: { title: '巡检管理' },
        children: [
          {
            path: 'task',
            name: 'InspectionTask',
            component: () => import('../views/inspection/task.vue'),
            meta: { title: '巡检任务' }
          },
          {
            path: 'record',
            name: 'InspectionRecord',
            component: () => import('../views/inspection/record.vue'),
            meta: { title: '巡检记录' }
          },
          {
            path: 'route',
            name: 'InspectionRoute',
            component: () => import('../views/inspection/route.vue'),
            meta: { title: '巡检路线' }
          }
        ]
      },
      {
        path: 'alert',
        name: 'Alert',
        component: () => import('../views/alert/index.vue'),
        meta: { title: '预警处置' },
        children: [
          {
            path: 'monitor',
            name: 'AlertMonitor',
            component: () => import('../views/alert/monitor.vue'),
            meta: { title: '预警监控' }
          },
          {
            path: 'handle',
            name: 'AlertHandle',
            component: () => import('../views/alert/handle.vue'),
            meta: { title: '预警处置' }
          },
          {
            path: 'rules',
            name: 'AlertRules',
            component: () => import('../views/alert/rules.vue'),
            meta: { title: '预警规则' }
          }
        ]
      },
      {
        path: 'report',
        name: 'Report',
        component: () => import('../views/report/index.vue'),
        meta: { title: '报表分析' },
        children: [
          {
            path: 'inspection',
            name: 'InspectionReport',
            component: () => import('../views/report/inspection.vue'),
            meta: { title: '巡检报表' }
          },
          {
            path: 'alert',
            name: 'AlertReport',
            component: () => import('../views/report/alert.vue'),
            meta: { title: '预警报表' }
          },
          {
            path: 'analysis',
            name: 'DataAnalysis',
            component: () => import('../views/report/analysis.vue'),
            meta: { title: '数据分析' }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('Route change:', { from: from.path, to: to.path })
  
  const user = localStorage.getItem('user')
  if (to.path !== '/login' && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router 