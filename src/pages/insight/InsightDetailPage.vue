<script setup>
import RegretInsightCard from '@/components/insight/RegretInsightCard.vue';
import RegretWeatherCard from '@/components/insight/RegretWeatherCard.vue';
import AISummaryCard from '@/components/common/AISummaryCard.vue';
import RegretFeedbackCard from '@/components/insight/RegretFeedbackCard.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  getInsightDetail,
  mapRegretSimulationResponse,
  mapRegretWeatherResponse,
  mapAISummaryResponse,
  mapRegretFeedbackResponse,
  mapSimilarProductsResponse,
} from '@/api/insight-detail';

const route = useRoute();
const round = computed(() => Number(route.query.round));
const productId = computed(() => route.query.productId);

const isLoading = ref(true);
const error = ref(null);
const detailData = ref(null);

// 후회 시뮬레이션 그래프: 추후 추가

// 후회 시뮬레이션 카드
const regretSimulation = ref({
  prefix: null,
  asset: 0,
  isCompound: false,
  rate: null,
  saveTerm: 12,
  minLimit: 10000,
  maxLimit: 50000000,
});

// 후회 날씨
const regretWeather = ref({
  regretScore: 0,
  missAmount: 0,
});

// AI 요약
const aiSummary = ref({
  summary: '',
  good: '',
  bad: '',
});

// 후회 피드백 설문
const regretFeedback = ref({
  userName: '사용자',
  isSurveyed: false,
  isRegretted: false,
  regrettedReason: null,
});

// 유사상품
const similarProducts = ref([]);

const loadDetailData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await getInsightDetail(round.value, productId.value);

    if (!response) {
      throw new Error('API 응답이 없습니다.');
    }

    detailData.value = response;

    regretSimulation.value = mapRegretSimulationResponse(response);
    regretWeather.value = mapRegretWeatherResponse(response);
    aiSummary.value = mapAISummaryResponse(response);
    regretFeedback.value = mapRegretFeedbackResponse(response);
    similarProducts.value = mapSimilarProductsResponse(response);
  } catch (e) {
    console.error('getInsightDetail 실패:', e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

watch(
  [round, productId],
  () => {
    if (round.value && productId.value) {
      loadDetailData();
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- 로딩/에러 처리 -->
  <div v-if="isLoading" class="mt-40">
    <span class="loading loading-spinner loading-sm"></span>
    <p class="text-callout">회고를 분석하고 있어요</p>
  </div>

  <div v-else-if="error" class="title03 -scroll-mt-40">
    회고 분석을 실패했어요
  </div>

  <div v-else>
    <div class="mt-40 flex gap-6">
      <RegretInsightCard
        :prefix="regretSimulation.prefix"
        :asset="regretSimulation.asset"
        :is-compound="regretSimulation.isCompound"
        :interest-rate="regretSimulation.rate"
        :save-term="regretSimulation.saveTerm"
        :min-limit="regretSimulation.minLimit"
        :max-limit="regretSimulation.maxLimit"
      />
      <RegretWeatherCard
        :regret-score="regretWeather.regretScore"
        :miss-amount="regretWeather.missAmount"
      />
    </div>
    <!-- AI 요약 -->
    <h2 class="mt-40 pb-12 title02">AI 요약</h2>
    <AISummaryCard
      :summary="aiSummary.summary"
      :good="aiSummary.good"
      :bad="aiSummary.bad"
    />
    <!-- 피드백(Request) -->
    <RegretFeedbackCard
      :product-id="regretFeedback.productId"
      :user-name="regretFeedback.userName"
      :is-surveyed="regretFeedback.isSurveyed"
      :is-regretted="regretFeedback.isRegretted"
      :regretted-reason="regretFeedback.regrettedReason"
    />
    <!-- 유사상품 -->
    <h2 class="title01 pb-12 pt-40">놓친 상품과 유사한 상품</h2>
    <RecommendCards :items="similarProducts" :has-padding="false" />
  </div>
</template>
