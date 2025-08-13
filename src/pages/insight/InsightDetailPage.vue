<script setup>
import RegretInsightCard from '@/components/insight/RegretInsightCard.vue';
import RegretWeatherCard from '@/components/insight/RegretWeatherCard.vue';
import AISummaryCard from '@/components/common/AISummaryCard.vue';
import RegretFeedbackCard from '@/components/insight/RegretFeedbackCard.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import { computed } from 'vue';
import {
  mapRegretSimulationResponse,
  mapRegretWeatherResponse,
  mapAISummaryResponse,
  mapRegretFeedbackResponse,
  mapSimilarProductsResponse,
} from '@/api/insight-detail';

const props = defineProps({
  detailData: {
    type: Object,
    default: () => null,
  },
});

const regretSimulation = computed(() =>
  mapRegretSimulationResponse(props.detailData)
);
const regretWeather = computed(() =>
  mapRegretWeatherResponse(props.detailData)
);
const aiSummary = computed(() => mapAISummaryResponse(props.detailData));
const regretFeedback = computed(() =>
  mapRegretFeedbackResponse(props.detailData)
);
const similarProducts = computed(() =>
  mapSimilarProductsResponse(props.detailData)
);
</script>

<template>
  <div v-if="props.detailData" class="px-1">
    <div class="mt-20 flex gap-6">
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
