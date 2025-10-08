import CheckList from '@/pages/CheckList.vue'
import CreateList from '@/pages/CreateList.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Home from '@/pages/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/list',
      component: CreateList,
    },
    {
      path: '/dashboard',
      component: Dashboard,
    },
    {
      path: '/check-list',
      component: CheckList,
      props: true,
    },
  ],
})

export default router
