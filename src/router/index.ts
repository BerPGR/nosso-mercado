import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateList from '../views/CreateList.vue'
import CheckList from '@/views/CheckList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: CreateList
    },
    {
      path: '/create-list',
      name: 'create-list',
      component: CreateList
    },
      {
    path: '/lists/:id',
    name: 'list.view',
    component: CheckList,
    props: true, // <- transforma route.params em props do componente
  },
  ],
})

export default router
