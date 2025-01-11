import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
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
    }
  ]
})

export default router 