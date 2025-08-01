<script setup>
import RegretInsightCard from '@/components/insight/RegretInsightCard.vue';
import RegretWeatherCard from '@/components/insight/RegretWeatherCard.vue';
import AISummaryCard from '@/components/common/AISummaryCard.vue';
import RegretFeedbackCard from '@/components/insight/RegretFeedbackCard.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import { ref, computed } from 'vue';

// 목업데이터
const userName = '김금융';
const productId = 'F123';
const regretScore = 87;
const missAmount = 1000000;
const interestRateData = 0.25;
const interestRateType = null;
const profitsData = [
  { date: '2025-04-19', profit: 0.14 },
  { date: '2025-04-20', profit: 0.13 },
  { date: '2025-04-21', profit: 0.15 },
  { date: '2025-04-22', profit: 0.2 },
  { date: '2025-04-23', profit: 0.25 },
  { date: '2025-04-24', profit: 0.21 },
  { date: '2025-04-25', profit: 0.12 },
];

// prefix에 따라 넘길 데이터 처리
const prefix = productId[0];
const interestRate = computed(() =>
  ['D', 'S', 'C', 'X'].includes(prefix) ? interestRateData : null
);
const rateType = computed(() =>
  ['D', 'S', 'C', 'X'].includes(prefix) ? interestRateType : null
);
const profits = computed(() =>
  ['A', 'F'].includes(prefix) ? profitsData : []
);
const aiReportGood = ref('이 상품에 대한 장점');
const aiReportBad = ref('이 상품에 대한 단점');
const similarProducts = [
  {
    productId: 'S11',
    name: '청년우대적금',
    matchScore: 50,
  },
  {
    productId: 'A11',
    name: 'KB퇴직연금배당40증권자투자신탁(채권혼합)C-E',
    matchScore: 50,
  },
  {
    productId: 'S11',
    name: '청년우대적금',
    matchScore: 50,
  },
  {
    productId: 'F10',
    name: '교보악사 내일환매 초단기우량채증권투자신탁(채권) Ce',
    matchScore: 50,
  },
  {
    productId: 'S11',
    name: '청년우대적금',
    matchScore: 50,
  },
];
const priceOptions = [
  { value: 100000, label: '최소 금액' },
  { value: 500000, label: '중간값' },
  { value: 1000000, label: '최대 금액' },
];
</script>

<template>
  <div class="mt-40 flex gap-6">
    <RegretInsightCard
      :product-id="productId"
      :regret-score="regretScore"
      :interest-rate="interestRate"
      :rate-type="rateType"
      :profits="profits"
      :price-options="priceOptions"
    />
    <RegretWeatherCard :regret-score="regretScore" :miss-amount="missAmount" />
  </div>
  <!-- AI 요약 -->
  <h2 class="mt-40 pb-12 title02">AI 요약</h2>
  <AISummaryCard
    summary="AI 한 줄 요약"
    :good="aiReportGood"
    :bad="aiReportBad"
  />
  <!-- 피드백(Request) -->
  <RegretFeedbackCard :product-id="productId" :user-name="userName" />
  <!-- 유사상품 -->
  <h2 class="title01 pb-12 pt-40">놓친 상품과 유사한 상품</h2>
  <RecommendCards :items="similarProducts" :has-padding="false" />
</template>
