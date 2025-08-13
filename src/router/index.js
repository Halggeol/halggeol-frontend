// import { createRouter, createWebHistory } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router'; // 배포용
import { useAuthStore } from '@/stores/authStore';

// Layout
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import SideBarLayout from '@/layouts/SideBarLayout.vue';
import UserLayout from '@/layouts/UserLayout.vue';

// 미리 로딩할 페이지
import HomePage from '@/pages/HomePage.vue';
import NotFound from '@/pages/NotFoundPage.vue';
import Error500 from '@/pages/Error500Page.vue';
import LoginPage from '@/pages/user/auth/LoginPage.vue';
import SignupPage from '@/pages/user/auth/SignupPage.vue';

// 사이드바 네비게이션 아이템 정의
const insightNavItems = [
  { to: '/insight', label: '회고 인사이트' },
  { to: '/insight/fund', label: '펀드 모아보기' },
  { to: '/insight/aggressive', label: '공격형연금 모아보기' },
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
    meta: { navItems: insightNavItems, requiresAuth: true },
    children: [
      {
        path: '',
        name: 'insight',
        component: () => import('@/pages/insight/InsightPage.vue'),
      },
      {
        path: 'fund',
        name: 'collection-fund',
        component: () => import('@/pages/insight/InsightCollectionPage.vue'),
      },
      {
        path: 'aggressive',
        name: 'collection-aggressive',
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
    meta: { requiresAuth: true },
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
        name: 'signup/mydata',
        component: () => import('@/pages/user/auth/SyncMydataPage.vue'),
      },
      {
        path: 'survey/:type', // knowledge, tendency
        name: 'signup/survey',
        component: () => import('@/pages/user/survey/SurveyPage.vue'),
      },
      {
        path: 'success',
        name: 'signup/success',
        component: () => import('@/pages/user/auth/SignupSuccessPage.vue'),
      },
    ],
  },

  // 404 페이지
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  },
  // 505 페이지
  {
    path: '/500',
    name: '500',
    components: Error500,
  },
];

const routes = [...commonRoutes];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(), // 배포용
  routes,
});

// 로그인 필요 페이지 전역 가드
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !authStore.isLoggedIn) {
    console.log('Unauthorized (Pinia), redirecting to login...');
    next('/login');
  } else {
    next();
  }
});

// 첫 페이지 로딩에 불필요한 페이지 이후 로딩
const modulesToPrefetch = import.meta.glob('@/pages/**/*.vue');

router.afterEach(() => {
  setTimeout(() => {
    for (const importer in modulesToPrefetch) {
      modulesToPrefetch[importer]();
    }
  }, 3000);
});

export default router;
