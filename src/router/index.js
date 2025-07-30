import { createRouter, createWebHistory } from 'vue-router';
// Layout
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import SideBarLayout from '@/layouts/SideBarLayout.vue';
import UserLayout from '@/layouts/UserLayout.vue';

// Page
import HomePage from '@/pages/HomePage.vue';
import NotFound from '@/pages/NotFound.vue';
import ProductsListPage from '@/pages/products/ProductsListPage.vue';
import InsightPage from '@/pages/insight/InsightPage.vue';
import InsightCollectionPage from '@/pages/insight/InsightCollectionPage.vue';
import MyPage from '@/pages/user/mypage/MyPage.vue';
import TermsPage from '@/pages/user/mypage/TermsPage.vue';
import LoginPage from '@/pages/user/auth/LoginPage.vue';
import SignupPage from '@/pages/user/auth/SignupPage.vue';
import SurveyPage from '@/pages/user/survey/SurveyPage.vue';
import ScrapPage from '@/pages/ScrapPage.vue';
import SyncMydataPage from '@/pages/user/auth/SyncMydataPage.vue';
import FindPage from '@/pages/user/auth/FindPage.vue';
import ProductsDetailPage from '@/pages/products/ProductsDetailPage.vue';
import MyProductPage from '@/pages/user/myproduct/MyProductPage.vue';

// 사이드바 네비게이션 아이템 정의
const insightNavItems = [
  { to: '/insight', label: '회고 인사이트' },
  { to: '/insight/fund', label: '펀드 모아보기' },
  { to: '/insight/forex', label: '공격형 연금 모아보기' },
];

const mypageNavItems = [
  { to: '/mypage', label: '내 정보' },
  { to: '/mypage/terms', label: '약관 및 정책' },
];

const commonRoutes = [
  // 홈(메인)+금융상품 둘러보기
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'products', name: 'products-list', component: ProductsListPage },
      {
        path: 'products/detail/:productId',
        name: 'products-detail',
        component: ProductsDetailPage,
      },
    ],
  },
  // 회고 인사이트
  {
    path: '/insight',
    component: SideBarLayout,
    meta: { navItems: insightNavItems },
    children: [
      { path: '', name: 'insight-monthly', component: InsightPage },
      {
        path: 'fund',
        name: 'collection-fund',
        component: InsightCollectionPage,
      },
      {
        path: 'forex',
        name: 'collection-forex',
        component: InsightCollectionPage,
      },
    ],
  },
  // 마이페이지
  {
    path: '/mypage',
    component: SideBarLayout,
    meta: { navItems: mypageNavItems },
    children: [
      { path: '', name: 'mypage', component: MyPage },
      { path: 'terms', name: 'mypage/terms', component: TermsPage },
    ],
  },
  // 관심상품
  {
    path: '/scrap',
    component: DefaultLayout,
    children: [{ path: '', name: 'scrap', component: ScrapPage }],
  },
  // 가입상품
  {
    path: '/myproduct',
    component: DefaultLayout,
    children: [{ path: '', name: 'myproduct', component: MyProductPage }],
  },

  // 로그인
  {
    path: '/login',
    component: UserLayout,
    children: [{ path: '', name: 'login', component: LoginPage }],
  },

  // 아이디/비밀번호 찾기
  {
    path: '/find',
    component: UserLayout,
    children: [
      { path: 'id', name: 'find/id', component: FindPage },
      { path: 'pwd', name: 'find/pwd', component: FindPage },
    ],
  },

  // 회원가입+설문+마이데이터
  {
    path: '/signup',
    component: UserLayout,
    children: [
      { path: '', name: 'signup', component: SignupPage },
      { path: 'mydata', name: 'mydata', component: SyncMydataPage },
      { path: 'survey/:type', name: 'survey/knowledge', component: SurveyPage },
      { path: 'survey/:type', name: 'survey/tendency', component: SurveyPage },
    ],
  },

  // 마이페이지-재설문
  {
    path: '/mypage',
    component: UserLayout,
    children: [
      { path: 'survey/:type', name: 'survey/knowledge', component: SurveyPage },
      { path: 'survey/:type', name: 'survey/tendency', component: SurveyPage },
    ],
  },
  // 404 페이지
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
];

const routes = [...commonRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 전역 가드 (로그인 여부 확인 등)
// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !localStorage.getItem('userToken')) {
//     next('/login') // 토큰이 없으면 로그인 페이지로 리다이렉트
//   } else {
//     next()
//   }
// })

export default router;
