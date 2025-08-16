<script setup>
import RegretSimulationCard from '@/components/insight/RegretSimulationCard.vue';
import RegretInsightCard from '@/components/insight/RegretInsightCard.vue';
import AISummaryCard from '@/components/common/AISummaryCard.vue';
import RegretFeedbackCard from '@/components/insight/RegretFeedbackCard.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import { ref, computed, watch } from 'vue';
import {
  mapRegretSimulationResponse,
  mapRegretWeatherResponse,
  mapRegretInsightResponse,
  mapAISummaryResponse,
  mapRegretFeedbackResponse,
  mapSimilarProductsResponse,
} from '@/api/insight-detail';
import LoadingPage from '../LoadingPage.vue';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  detailData: {
    type: Object,
    default: () => null,
  },
});

const selectedCurrency = ref('USD');
function handleCurrencyUpdate(newCurrency) {
  selectedCurrency.value = newCurrency;
}

const emit = defineEmits(['survey-submitted']);

const onSurveySubmitted = payload => {
  emit('survey-submitted', payload);
};

const regretWeather = computed(() =>
  mapRegretWeatherResponse(props.detailData)
);
const regretInsightData = computed(() =>
  mapRegretInsightResponse(props.detailData)
);
const isForexProduct = computed(() => props.detailData?.forexInfo?.length > 0);
const currencyOptions = computed(() => {
  if (isForexProduct.value && props.detailData?.currency) {
    return props.detailData.currency.split(',');
  }
  return [];
});

const regretSimulation = computed(() =>
  mapRegretSimulationResponse(props.detailData)
);
const aiSummary = computed(() => mapAISummaryResponse(props.detailData));
const regretFeedback = computed(() =>
  mapRegretFeedbackResponse(props.detailData)
);
const similarProducts = computed(() =>
  mapSimilarProductsResponse(props.detailData)
);

watch(
  () => props.currencyOptions,
  newOptions => {
    if (newOptions && newOptions.length > 0) {
      selectedCurrency.value = newOptions[0];
    }
  },
  { immediate: true }
);
</script>

<template>
  <LoadingPage
    v-if="isLoading || !detailData"
    :loading-text="'인사이트 발행중'"
  />
  <div v-else-if="props.detailData" class="px-1">
    <RegretInsightCard
      :regretScore="regretWeather.regretScore"
      :missAmount="regretWeather.missAmount"
      :regretInsightData="regretInsightData"
      :isForexProduct="isForexProduct"
      :forexInfo="detailData.forexInfo"
      :currencyOptions="currencyOptions"
      :detailData="props.detailData"
      :selectedCurrency="selectedCurrency"
      @update:selectedCurrency="handleCurrencyUpdate"
    />
    <RegretSimulationCard
      v-bind="regretSimulation"
      :selectedCurrency="selectedCurrency"
    />

    <h2 class="title02 mt-20 pb-12">AI 요약</h2>
    <AISummaryCard v-bind="aiSummary" />

    <RegretFeedbackCard
      v-bind="regretFeedback"
      @survey-submitted="onSurveySubmitted"
    />

    <h2 class="title01 pt-40 pb-12">놓친 상품과 유사한 상품</h2>
    <RecommendCards
      :items="similarProducts"
      :has-padding="false"
      is-similar="유사도"
    />
  </div>
</template>
