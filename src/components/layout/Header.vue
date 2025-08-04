<script setup>
import { defineOptions } from 'vue';

defineOptions({
  name: 'AppHeader',
});
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { ref, computed, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { extendLogin } from '@/api/user';
import SearchModal from '../common/SearchModal.vue';
import ExtendLoginModal from '../user/ExtendLoginModal.vue';

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
// 모달 닫기 버튼 클릭 여부
const hasDeclinedExtendModal = ref(false);

const handleSearch = query => {
  console.log('헤더에서 검색 실행:', query);
  // 실제 검색 로직 (예: 검색 결과 페이지로 이동 또는 검색 결과 표시)
  router.push({ path: '/products', query: { keyword: query } });
};

const handleCancel = () => {
  isExtendLoginModalOpen.value = false;
  hasDeclinedExtendModal.value = true;
};

async function handleExtendLogin() {
  console.log('===== 로그인 시간 연장 핸들링 =====');
  isExtendLoginModalOpen.value = false;

  try {
    console.log('===== extendLogin API 호출 =====');
    const response = await extendLogin();

    authStore.extendLogin(response.data?.accessToken);
  } catch (error) {
    console.error('토큰 만료: ', error);
    // TODO: 로그아웃 함수에서 /login으로 리다이렉트
    // logout();
    router.push('/login');
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

// 남은 시간 5분 이하일 때 모달 표시
watch(
  () => authStore.tokenRemainingSeconds,
  seconds => {
    if (
      seconds > 0 &&
      seconds <= WARNING_THRESHOLD_SECONDS &&
      !isExtendLoginModalOpen.value &&
      !hasDeclinedExtendModal.value
    )
      isExtendLoginModalOpen.value = true;
    if (seconds < 0) {
      // TODO: 시간 만료 시 로그아웃
      // logout();
      router.push('/login');
    }
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
      class="mx-[10.8%] flex items-center justify-between py-4 mobile:hidden"
    >
      <!-- 헤더 - 로고 영역 -->
      <h1 class="flex">
        <RouterLink to="/" class="-m-4 p-4"> 그때 할 걸 </RouterLink>
      </h1>
      <!-- 헤더 - gnb 영역 -->
      <div class="flex gap-x-12">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            '-m-4 p-4 text-body02 text-fg-primary',
            isActive(item.to, item.exact) ? 'font-bold' : '',
          ]"
        >
          {{ item.label }}
        </RouterLink>
        <button
          class="-m-4 p-4"
          aria-label="Search"
          @click="isSearchModalOpen = true"
        >
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
      <div class="flex gap-x-6 justify-end">
        <template v-if="authStore.isLoggedIn">
          <span class="text-sm text-gray-500">
            남은 시간: {{ remainingMinutes }}분 {{ remainingSeconds }}초
          </span>

          <button @click="handleExtendLogin">로그인 연장</button>
          <button>{{ authStore.username }} 님</button>
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
  </header>

  <SearchModal
    :is-open="isSearchModalOpen"
    @update:is-open="isSearchModalOpen = $event"
    @search="handleSearch"
  />

  <ExtendLoginModal
    :is-open="isExtendLoginModalOpen"
    @confirm="handleExtendLogin"
    @cancel="handleCancel"
  />
</template>
