<script setup>
import { defineOptions } from 'vue';

defineOptions({
  name: 'AppHeader',
});
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { extendLogin, logout } from '@/api/user';
import {
  clearAccessToken,
  clearUsername,
  isReverifiedToken,
  getAccessToken,
} from '@/utils/authUtil';
import SearchModal from '../common/SearchModal.vue';
import ExtendLoginModal from '../user/auth/ExtendLoginModal.vue';
import UserModal from '../user/mypage/UserModal.vue';
import UserInHeader from '../icons/UserInHeader.vue';

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
  await logout();

  clearAccessToken();
  clearUsername();
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
      class="px-[10.8%] flex my-4 justify-between mobile:hidden"
    >
      <!-- 헤더 - 로고 영역 -->
      <h1 class="flex items-center w-52">
        <RouterLink to="/" class="-m-4 p-4">그때 할 걸</RouterLink>
      </h1>
      <!-- 헤더 - gnb 영역 -->
      <div class="flex items-center gap-x-12">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            '-m-4 p-4 text-body02',
            isActive(item.to, item.exact)
              ? 'font-bold text-fg-primary'
              : 'text-fg-secondary',
          ]"
        >
          {{ item.label }}
        </RouterLink>
        <button
          class="-m-4 p-4"
          aria-label="Search"
          @click="isSearchModalOpen = true"
        >
          <!-- icon은 svg sprite 방식으로 바꾸기 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5 text-fg-primary"
          >
            <path
              fill-rule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <!-- 헤더 - 유저 영역 -->
      <div class="flex items-center gap-x-4 justify-end w-52">
        <template v-if="authStore.isLoggedIn">
          <button
            @click="handleExtendLogin"
            class="btn text-footnote font-normal py-2 bg-primary border-0 shadow-none hover:shadow-none rounded-full text-white h-6"
          >
            {{ showRemainingTimeText }}
          </button>
          <button
            @click="toggleUserMenu"
            class="flex items-center gap-x-2 max-w-28 truncate"
          >
            {{ authStore.username }} 님 <UserInHeader />
          </button>

          <UserModal
            :is-open="isUserModalOpen"
            @close="closeUserModal"
            @go-to="goTo"
            @logout="handleLogout"
          />
        </template>
        <template v-else>
          <RouterLink to="/login" class="-m-4 p-4 body02 text-fg-primary"
            >로그인</RouterLink
          >
          <RouterLink to="/signup" class="-m-4 p-4 body02 text-fg-primary"
            >회원가입</RouterLink
          >
        </template>
      </div>
    </nav>
    <SearchModal
      :is-open="isSearchModalOpen"
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
