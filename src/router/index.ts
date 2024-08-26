import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import GreetingsView from '@/views/GreetingsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard/:id',
      name: 'dashboard',
      component: Dashboard,
      beforeEnter: (to, from, next) => {
        const store = useDashboardStore()
        const dashboardId = Number(to.params.id)

        if (store.dashboards.find((d) => d.id === dashboardId)) {
          next()
        } else {
          next({ path: '/' })
        }
      }
    },
    {
      path: '/',
      name: 'greeting',
      component: GreetingsView
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

export default router
