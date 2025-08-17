<script setup>
import { defineOptions } from 'vue';

defineOptions({
  name: 'AppHeader',
});
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { extendLogin, logout } from '@/api/user';
import { isReverifiedToken, getAccessToken } from '@/utils/authUtil';
import SearchModal from '../common/SearchModal.vue';
import ExtendLoginModal from '../user/auth/ExtendLoginModal.vue';
import UserModal from '../user/mypage/UserModal.vue';
import User from '@/assets/icons/auth/User.vue';
import Search from '@/assets/icons/common/Search.vue';

const authStore = useAuthStore();
let interval = null;
const WARNING_THRESHOLD_SECONDS = 60 * 5;

const remainingMinutes = computed(() =>
  Math.floor(Math.max(0, authStore.tokenRemainingSeconds / 60))
);

const remainingSeconds = computed(() =>
  Math.floor(Math.max(0, authStore.tokenRemainingSeconds % 60))
);

const route = useRoute();
const router = useRouter();

const navItems = [
  { to: '/', label: '홈', exact: true },
  { to: '/insight', label: '회고 인사이트' },
  { to: '/products', label: '금융상품 둘러보기' },
];
const isActive = (to, exact = false) =>
  exact ? route.path === to : route.path.startsWith(to);

// 검색 모달 관련 상태
const isSearchModalOpen = ref(false); // 검색 모달 열림/닫힘 상태

// 로그인 시간 연장 모달 관련 상태
const isExtendLoginModalOpen = ref(false);
const hasDeclinedExtendModal = ref(false); // 로그인 시간 연장 모달 닫기 버튼 클릭 여부

// 마이페이지 모달 관련 상태
const isUserModalOpen = ref(false); // 마이페이지 모달 열림/닫힘 상태
// const menuRef = ref(null);

const handleSearch = query => {
  console.log('헤더에서 검색 실행:', query);
  // 실제 검색 로직 (예: 검색 결과 페이지로 이동 또는 검색 결과 표시)
  router.push({ path: '/products', query: { keyword: query } });
};

const handleCancel = () => {
  isExtendLoginModalOpen.value = false;
  hasDeclinedExtendModal.value = true;
};

const toggleUserMenu = () => {
  isUserModalOpen.value = !isUserModalOpen.value;
};

const closeUserModal = () => {
  isUserModalOpen.value = false;
};

const goTo = path => {
  closeUserModal();
  router.push(path);
};

async function handleLogout() {
  closeUserModal();
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  await logout();

  authStore.logout();
  router.push('/login');
}

async function handleExtendLogin() {
  try {
    const response = await extendLogin();

    authStore.extendLogin(response.data?.accessToken);
    isExtendLoginModalOpen.value = false;
  } catch (error) {
    console.error('토큰 만료: ', error);
    handleLogout();
  }
}

// 남은 로그인 시간 갱신
watch(
  () => authStore.isLoggedIn,
  isLoggedIn => {
    if (isLoggedIn) {
      authStore.updateTokenRemainingSeconds();

      interval = setInterval(() => {
        authStore.updateTokenRemainingSeconds();
      }, 1000);
    } else {
      clearInterval(interval);
      interval = null;
    }
  },
  { immediate: true }
);

const showRemainingTimeText = computed(() => {
  if (authStore.tokenRemainingSeconds <= 600) {
    return `${remainingMinutes.value}분 ${remainingSeconds.value}초`;
  } else if (authStore.tokenRemainingSeconds >= 1740) {
    return `${remainingMinutes.value}분 ${remainingSeconds.value}초`;
  }
  return '로그인 연장';
});

// 남은 시간 5분 이하일 때 모달 표시
watch(
  () => authStore.tokenRemainingSeconds,
  seconds => {
    if (
      seconds > 0 &&
      seconds <= WARNING_THRESHOLD_SECONDS &&
      !isExtendLoginModalOpen.value &&
      !hasDeclinedExtendModal.value &&
      !isReverifiedToken(getAccessToken())
    )
      isExtendLoginModalOpen.value = true;
    if (seconds < 0) handleLogout();
  }
);

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <!-- 헤더 영역 -->
  <header class="bg-white fixed inset-x-0 top-0 z-50">
    <nav
      aria-label="Global"
      class="px-[10.8%] tablet:px-5 flex my-4 justify-between mobile:hidden"
    >
      <!-- 헤더 - 로고 영역 -->
      <h1 class="flex items-center w-48 tablet:w-36">
        <RouterLink to="/" class="-m-4 p-4 flex items-center gap-2"
          ><svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z"
              fill="#60584C"
            />
            <path
              d="M16.4249 12.0938C17.552 11.8121 17.661 10.2532 16.5841 9.81731L5.82531 5.46255C4.84298 5.06494 3.86513 6.04279 4.26274 7.02512L8.6175 17.7839C9.05336 18.8608 10.6123 18.7518 10.894 17.6247L11.8256 13.8985C11.9331 13.4686 12.2688 13.1329 12.6987 13.0254L16.4249 12.0938Z"
              fill="#FFD338"
            />
            <path
              d="M14.6581 17.1834L12.8931 15.4184C12.5026 15.0279 12.5026 14.3947 12.8931 14.0042C13.2836 13.6137 13.9168 13.6137 14.3073 14.0042L16.0723 15.7692C16.3271 16.024 16.6623 16.1653 16.996 16.173C17.3274 16.1807 17.6286 16.0569 17.8428 15.8427C18.057 15.6285 18.1808 15.3273 18.1732 14.9958C18.1655 14.6622 18.0241 14.327 17.7694 14.0722C17.3788 13.6816 17.3788 13.0485 17.7694 12.658C18.1599 12.2674 18.7931 12.2674 19.1836 12.658C19.7929 13.2673 20.1525 14.0886 20.1724 14.9494C20.1924 15.8125 19.868 16.646 19.2571 17.2569C18.6461 17.8678 17.8126 18.1922 16.9496 18.1723C16.0888 18.1524 15.2674 17.7927 14.6581 17.1834Z"
              fill="#FFD338"
            />
          </svg>
          <p class="text-body02 font-semibold">그때 할걸</p>
        </RouterLink>
      </h1>
      <!-- 헤더 - gnb 영역 -->
      <div class="flex items-center gap-12">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            '-m-4 p-4 text-body02 hover:font-bold hover:text-fg-primary',
            isActive(item.to, item.exact)
              ? 'font-bold text-fg-primary'
              : 'text-fg-secondary',
          ]"
        >
          {{ item.label }}
        </RouterLink>
        <button
          class="-m-4 p-4"
          aria-label="검색"
          @click="isSearchModalOpen = true"
        >
          <Search class="text-fg-primary" />
        </button>
      </div>
      <!-- 헤더 - 유저 영역 -->
      <div class="flex items-center gap-x-4 justify-end w-52 tablet:w-40">
        <template v-if="authStore.isLoggedIn">
          <button
            @click="handleExtendLogin"
            class="btn text-footnote font-normal py-2 bg-gray-primary hover:bg-gray-secondary border-0 shadow-none hover:shadow-none rounded-full text-white h-6 w-24"
          >
            {{ showRemainingTimeText }}
          </button>
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-x-2 max-w-28 truncate hover:font-semibold"
          >
            <span class="tablet:hidden">{{ authStore.username }} 님</span>
            <User
              class="tablet:rounded-full tablet:bg-gray-secondary-200 tablet:text-gray-primary"
            />
          </button>

          <UserModal
            :is-open="isUserModalOpen"
            @close="closeUserModal"
            @go-to="goTo"
            @logout="handleLogout"
          />
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="-m-4 p-4 body02 text-fg-primary hover:font-semibold hover:text-secondary"
            >로그인</RouterLink
          >
          <RouterLink
            to="/signup"
            class="-m-4 p-4 body02 text-fg-primary hover:font-semibold hover:text-secondary"
            >회원가입</RouterLink
          >
        </template>
      </div>
    </nav>
    <SearchModal
      :is-open="isSearchModalOpen"
      :is-logged-in="authStore.isLoggedIn"
      @update:is-open="isSearchModalOpen = $event"
      @search="handleSearch"
    />
  </header>

  <ExtendLoginModal
    :is-open="isExtendLoginModalOpen"
    @confirm="handleExtendLogin"
    @cancel="handleCancel"
  />
</template>
