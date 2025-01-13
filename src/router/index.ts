import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/welcome'
    },
    {
      path:'/welcome',
      name: 'Welcome',
      component: () => import('../views/welcome/index.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/dashboard/index.vue')
    },
    {
      path: '/monitoring',
      name: 'Monitoring',
      component: () => import('../views/monitoring/index.vue')
    },
    {
      path: '/inspection',
      name: 'Inspection',
      component: () => import('../views/inspection/index.vue')
    },
    {
      path: '/inspection/detail/:id',
      name: 'InspectionDetail',
      component: () => import('../views/inspection/detail.vue')
    },
    {
      path: '/reports',
      name: 'Reports',
      component: () => import('../views/reports/index.vue')
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/alerts/index.vue'),
      meta: {
        title: '预警处置',
        icon: 'Warning'
      }
    },
    {
      path: '/integration',
      name: 'Integration',
      component: () => import('../components/integration/SystemMonitor.vue'),
      meta: {
        title: '系统集成',
        icon: 'Connection'
      }
    }
  ]
})

export default router 