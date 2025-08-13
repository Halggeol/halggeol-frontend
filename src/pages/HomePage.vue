<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import AssetCard from '@/components/dashboard/AssetCard.vue';
import RankCards from '@/components/recommand/RankCards.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import router from '@/router';
import { ref, onMounted, provide } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { getDashboardMain } from '@/api/dashboard';
import LoadingPage from './LoadingPage.vue';
import AvgRegretScore from '@/components/dashboard/AvgRegretScore.vue';
import RegretSummaryCards from '@/components/dashboard/RegretSummaryCards.vue';
import AssetPortfolioCard from '@/components/dashboard/AssetPortfolioCard.vue';

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
      await fetchDashboard(); // Retry the fetch
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
  <LoadingPage v-if="isLoading" />

  <!-- 대시보드 영역 -->
  <div v-else>
    <div class="dashboard relative w-full px-[10.8%] tablet:px-5">
      <div>
        <h2 class="title01 pb-4 pt-20">
          {{ dashboardData?.userName }} 님, 안녕하세요
        </h2>
        <AvgRegretScore :regret-score="dashboardData?.avgRegretScore" />
        <RegretSummaryCards
          :regret-score="dashboardData?.avgRegretScore"
          :feedback-ratio="dashboardData?.feedbackRatio"
          :portfolio="dashboardData?.portfolio"
        />
        <div class="grid tablet:grid-cols-1 grid-cols-3">
          <AssetCard
            class="col-span-2 mr-6 tablet:mr-0 tablet:mb-10"
            :assets="dashboardData?.assets"
          />
          <AssetPortfolioCard :portfolio="dashboardData?.portfolio" />
        </div>
      </div>
      <!-- 블러 영역 -->
      <div
        v-if="!isLoggedIn"
        class="absolute inset-0 flex flex-col justify-center items-center bg-white/60 backdrop-blur-sm"
      >
        <p class="mb-4 title01 text-fg-primary">그때 할걸</p>
        <p class="mb-6 text-body01 text-fg-primary text-center">
          놓친 금융상품이 후회된다면
          <br />
          지금이 다시 가입할 기회
        </p>
        <BaseButton @click="onLoginClick"></BaseButton>
      </div>
    </div>
    <!-- 추천상품 영역 -->
    <div class="mx-[10.8%] tablet:mx-5">
      <RankCards :ranking="dashboardData?.regretRanking" />
    </div>
    <h2 class="title01 pb-12 pt-40 mx-[10.8%] tablet:mx-5" v-if="isLoggedIn">
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
