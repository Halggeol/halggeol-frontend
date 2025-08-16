<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import AssetCard from '@/components/dashboard/AssetCard.vue';
import RankCards from '@/components/recommand/RankCards.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import router from '@/router';
import { ref, onMounted, provide } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { getDashboardMain } from '@/api/dashboard';
import LoadingPage from './common/LoadingPage.vue';
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

const fetchDashboard = async () => {
  isLoading.value = true;
  isError.value = false;

  const maxRetries = 3;
  const retryDelay = 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await getDashboardMain();
      dashboardData.value = response.data;
      isError.value = false;
      isLoading.value = false;
      return;
    } catch (error) {
      console.error(
        `대시보드 로딩 실패 (시도 ${attempt}/${maxRetries}):`,
        error
      );
      if (attempt === maxRetries) {
        isError.value = true;
        isLoading.value = false;
        return;
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
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
        <h2 class="title01 pb-8 pt-20">
          {{ dashboardData?.userName }} 님, 안녕하세요
        </h2>
        <!-- <AvgRegretScore :regret-score="dashboardData?.avgRegretScore" /> -->
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
        class="absolute inset-0 flex flex-col justify-center items-center bg-white/70 backdrop-blur-sm"
      >
        <p class="mb-4 title01 text-center text-fg-primary">
          <span class="text-gray-primary">그때 할걸</span>이 <br /><span
            class="text-secondary"
            >하길 잘했다</span
          >가 되도록
        </p>
        <p class="mb-6 text-body01 text-fg-primary text-center">
          과거의 후회와 미래의 기회를 데이터로 연결해
          <br />
          나에게 꼭 맞는 <span class="font-semibold">새로운 기회</span>를
          찾아드려요
        </p>
        <BaseButton
          @click="onLoginClick"
          :label="'그때 할걸 시작하기'"
        ></BaseButton>
      </div>
    </div>
    <!-- 추천상품 영역 -->
    <div class="mx-[10.8%] tablet:mx-5">
      <RankCards :ranking="dashboardData?.regretRanking" />
    </div>
    <h2
      class="title01 pb-12 pt-20 mx-[10.8%] tablet:mx-5"
      v-if="isLoggedIn && dashboardData?.recommendItems?.length"
    >
      {{ dashboardData?.userName }} 님을 위한 추천 상품
    </h2>
    <RecommendCards
      v-if="isLoggedIn"
      :items="dashboardData?.recommendItems"
      :has-padding="true"
    />
  </div>
</template>
