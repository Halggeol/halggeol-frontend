<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import AssetCard from '@/components/dashboard/AssetCard.vue';
import AssetPortfolioCard from '@/components/dashboard/AssetPortfolioCard.vue';
import RegretScoreCard from '@/components/dashboard/RegretScoreCard.vue';
import RankCards from '@/components/recommand/RankCards.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import router from '@/router';
import { ref, onMounted, provide } from 'vue';
import { useAuthStore } from '@/stores/authStore';

import { getDashboardMain } from '@/api/dashboard';

const authStore = useAuthStore();
const isLoggedIn = authStore.isLoggedIn;

function onLoginClick() {
  router.push('/login');
}

const dashboardData = ref(null);
const isLoading = ref(true);
const isError = ref(false);
const retryCount = ref(0); // New: Track retry attempts
const maxRetries = 3; // New: Maximum number of retries
const retryDelay = 1000; // New: Delay in milliseconds between retries

const fetchDashboard = async () => {
  try {
    isLoading.value = true;
    isError.value = false;
    // Reset retryCount only on the initial call, not on retries
    if (retryCount.value === 0) {
      retryCount.value = 0;
    }

    // API 호출
    const response = await getDashboardMain();
    dashboardData.value = response.data;
    retryCount.value = 0; // Reset retry count on success
  } catch (error) {
    console.error('대시보드 로딩 실패:', error);
    if (retryCount.value < maxRetries) {
      retryCount.value++;
      console.log(`Retrying... Attempt ${retryCount.value} of ${maxRetries}`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      fetchDashboard(); // Retry the fetch
    } else {
      isError.value = true; // Set error state after max retries
      retryCount.value = 0; // Reset retry count
    }
  } finally {
    isLoading.value = false;
  }
};

provide('dashboardData', dashboardData);

onMounted(() => {
  fetchDashboard();
});
</script>

<template>
  <!-- 로딩 상태 -->
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center min-h-screen space-y-6"
  >
    <span class="loading loading-spinner loading-xl"></span>
    <p class="text-callout text-fg-primary">자산을 확인하고 있어요</p>
  </div>

  <!-- 에러 상태 -->
  <div
    v-else-if="isError"
    class="flex flex-col items-center justify-center min-h-screen space-y-6"
  >
    <p class="text-callout text-fg-primary">데이터를 불러오는 데 실패했습니다.</p>
    <BaseButton @click="fetchDashboard">다시 시도</BaseButton>
  </div>

  <!-- {{ dashboardData }} -->
  <!-- 대시보드 영역 -->
  <div v-else>
    <div class="dashboard w-full bg-base-200 px-[10.8%]">
      <div
        :class="[
          { 'filter blur pointer-events-none select-none': !isLoggedIn },
        ]"
      >
        <h2 class="title01 pb-12 pt-20">
          {{ dashboardData?.userName }} 님, 안녕하세요
        </h2>
        <div class="pb-40 grid grid-rows-2 grid-cols-3 gap-6">
          <RegretScoreCard
            :regret-score="dashboardData?.avgRegretScore"
            :feedback-ratio="dashboardData?.feedbackRatio"
          />
          <AssetCard
            class="row-span-2 col-span-2"
            :assets="dashboardData?.assets"
          />
          <AssetPortfolioCard :portfolio="dashboardData?.portfolio" />
        </div>
      </div>
      <!-- 블러 영역 -->
      <div
        v-if="!isLoggedIn"
        class="absolute inset-0 flex flex-col justify-center items-center"
      >
        <p class="mb-4 title01 text-fg-primary">그때 할 걸</p>
        <p class="mb-6 text-body01 text-fg-primary text-center">
          늦었다고 생각했을 때가 빠르다.
          <br />
          회고형 금융상품 추천 서비스
        </p>
        <BaseButton @click="onLoginClick"></BaseButton>
      </div>
    </div>
    <!-- 추천상품 영역 -->
    <div class="mx-[10.8%]">
      <RankCards :ranking="dashboardData?.regretRanking" />
    </div>
    <h2 class="title01 pb-12 pt-40 mx-[10.8%]" v-if="isLoggedIn">
      {{ dashboardData?.userName }} 님을 위한 추천 상품
    </h2>
    <RecommendCards
      v-if="isLoggedIn"
      :user-name="dashboardData?.userName"
      :items="dashboardData?.recommendItems"
      :has-padding="true"
    />
  </div>
</template>
