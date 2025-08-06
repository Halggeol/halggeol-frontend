import { createRouter, createWebHistory } from 'vue-router';
// Layout
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import SideBarLayout from '@/layouts/SideBarLayout.vue';
import UserLayout from '@/layouts/UserLayout.vue';

// 미리 로딩할 페이지
import HomePage from '@/pages/HomePage.vue';
import NotFound from '@/pages/NotFound.vue';
import LoginPage from '@/pages/user/auth/LoginPage.vue';
import SignupPage from '@/pages/user/auth/SignupPage.vue';

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
      {
        path: 'products',
        name: 'products-list',
        component: () => import('@/pages/products/ProductsListPage.vue'),
      },
      {
        path: 'products/detail/:productId',
        name: 'products-detail',
        component: () => import('@/pages/products/ProductsDetailPage.vue'),
      },
    ],
  },
  // 회고 인사이트
  {
    path: '/insight',
    component: SideBarLayout,
    meta: { navItems: insightNavItems },
    children: [
      {
        path: '',
        name: 'insight-monthly',
        component: () => import('@/pages/insight/InsightPage.vue'),
      },
      {
        path: 'fund',
        name: 'collection-fund',
        component: () => import('@/pages/insight/InsightCollectionPage.vue'),
      },
      {
        path: 'forex',
        name: 'collection-forex',
        component: () => import('@/pages/insight/InsightCollectionPage.vue'),
      },
    ],
  },
  // 마이페이지
  {
    path: '/mypage',
    component: SideBarLayout,
    meta: { navItems: mypageNavItems },
    children: [
      {
        path: '',
        name: 'mypage',
        component: () => import('@/pages/user/mypage/MyPage.vue'),
      },
      {
        path: 'terms',
        name: 'mypage/terms',
        component: () => import('@/pages/user/mypage/TermsPage.vue'),
      },
    ],
  },
  // 관심상품
  {
    path: '/scrap',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'scrap',
        component: () => import('@/pages/ScrapPage.vue'),
      },
    ],
  },
  // 가입상품
  {
    path: '/myproduct',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'myproduct',
        component: () => import('@/pages/user/myproduct/MyProductPage.vue'),
      },
    ],
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
      {
        path: '',
        name: 'find',
        component: () => import('@/pages/user/auth/FindPage.vue'),
      },
      {
        path: 'password/reset',
        name: 'find/password/reset',
        component: () => import('@/pages/user/auth/PasswordResetPage.vue'),
      },
    ],
  },

  // 회원가입+설문+마이데이터
  {
    path: '/signup',
    component: UserLayout,
    children: [
      { path: '', name: 'signup', component: SignupPage },
      {
        path: 'request',
        name: 'signup/request',
        component: () => import('@/pages/user/auth/SignupRequestPage.vue'),
      },
      {
        path: 'mydata',
        name: 'mydata',
        component: () => import('@/pages/user/auth/SyncMydataPage.vue'),
      },
      {
        path: 'survey/:type', // knowledge, tendency
        name: 'signup/survey',
        component: () => import('@/pages/user/survey/SurveyPage.vue'),
      },
    ],
  },

  // 마이페이지-재설문
  {
    path: '/mypage',
    component: UserLayout,
    children: [
      {
        path: 'survey/:type', // knowledge, tendency
        name: 'mypage/survey',
        component: () => import('@/pages/user/survey/SurveyPage.vue'),
      },
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

// 첫 페이지 로딩에 불필요한 페이지 이후 로딩
router.afterEach((to, from) => {
  setTimeout(() => {
    import('@/pages/products/ProductsDetailPage.vue');
    import('@/pages/user/myproduct/MyProductPage.vue');
    import('@/pages/products/ProductsListPage.vue');
    import('@/pages/insight/InsightPage.vue');
    import('@/pages/insight/InsightCollectionPage.vue');
    import('@/pages/user/mypage/MyPage.vue');
    import('@/pages/user/mypage/TermsPage.vue');
    import('@/pages/user/survey/SurveyPage.vue');
    import('@/pages/ScrapPage.vue');
    import('@/pages/user/auth/SyncMydataPage.vue');
    import('@/pages/user/auth/FindPage.vue');
  }, 3000);
});

export default router;
