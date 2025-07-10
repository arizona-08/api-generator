import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DocumentationView from '../views/DocumentationView.vue'
import ApiTesterView from '../views/ApiTesterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/doc',
      name: 'doc',
      component: DocumentationView,
    },
    {
      path: '/test',
      name: 'test',
      component: ApiTesterView,
    },
  ],
})

export default router
