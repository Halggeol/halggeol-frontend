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

const regretSimulation = computed(() =>
  mapRegretSimulationResponse(detailData.value)
);
const regretWeather = computed(() =>
  mapRegretWeatherResponse(detailData.value)
);
const aiSummary = computed(() => mapAISummaryResponse(detailData.value));
const regretFeedback = computed(() =>
  mapRegretFeedbackResponse(detailData.value)
);
const similarProducts = computed(() =>
  mapSimilarProductsResponse(detailData.value)
);

const loadDetailData = async () => {
  isLoading.value = true;
  error.value = null;
  detailData.value = null; // 이전 데이터 초기화

  try {
    const response = await getInsightDetail(round.value, productId.value);
    if (!response) {
      throw new Error('API 응답이 없습니다.');
    }
    detailData.value = response;
  } catch (e) {
    console.error('getInsightDetail 실패:', e);
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

watch(
  [round, productId],
  newVal => {
    const [newRound, newProductId] = newVal;
    if (newRound && newProductId) {
      loadDetailData();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div v-if="isLoading" class="mt-40 text-center">
    <span class="loading loading-spinner loading-sm"></span>
    <p class="text-callout">회고를 분석하고 있어요</p>
  </div>

  <div v-else-if="error" class="title03 mt-40 text-center">
    회고 분석을 실패했어요
  </div>

  <div v-else-if="detailData">
    <div class="mt-40 flex gap-6">
      <RegretInsightCard v-bind="regretSimulation" />
      <RegretWeatherCard v-bind="regretWeather" />
    </div>

    <h2 class="title02 mt-40 pb-12">AI 요약</h2>
    <AISummaryCard v-bind="aiSummary" />

    <RegretFeedbackCard v-bind="regretFeedback" />

    <h2 class="title01 pt-40 pb-12">놓친 상품과 유사한 상품</h2>
    <RecommendCards
      :items="similarProducts"
      :has-padding="false"
      is-similar="유사도"
    />
  </div>
</template>
