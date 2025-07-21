import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import NotFound from '@/pages/NotFound.vue'

const commonRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false },
  },

  // 404 Not Found 페이지
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
]

const routes = [...commonRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 전역 가드 (로그인 여부 확인 등)
// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !localStorage.getItem('userToken')) {
//     next('/login') // 토큰이 없으면 로그인 페이지로 리다이렉트
//   } else {
//     next()
//   }
// })

export default router
