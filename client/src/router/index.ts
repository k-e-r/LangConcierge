import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/listening',
      name: 'listening',
      component: () => import('../views/ListeningView.vue'),
    },
    {
      path: '/reading',
      name: 'reading',
      component: () => import('../views/ReadingView.vue'),
    },
  ],
})

export default router
