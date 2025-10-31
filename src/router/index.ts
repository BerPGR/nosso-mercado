import { useAuth } from '@/composables/useAuth'
import CheckList from '@/pages/CheckList.vue'
import CreateList from '@/pages/CreateList.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Group from '@/pages/Group.vue'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/list',
      component: CreateList,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/check-list',
      component: CheckList,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/group/:id',
      component: Group,
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach(async (to) => {
  const { isAuthenticated, initReady } = useAuth()
  await initReady

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

export default router
