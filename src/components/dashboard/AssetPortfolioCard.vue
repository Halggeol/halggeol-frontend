<script setup>
import { computed } from 'vue';
import BaseCard from '../common/BaseCard.vue';

const props = defineProps({
  portfolio: {
    type: Array,
    default: () => [],
  },
});

const portfolioData = computed(() => {
  if (!props.portfolio || props.portfolio.length === 0) {
    return [];
  }
  return props.portfolio;
});

// 자산 비율 합계 1 유지
const normalizedPortfolio = computed(() => {
  const portfolio = portfolioData.value;
  if (!portfolio || portfolio.length === 0) {
    return [];
  }
  const total = portfolio.reduce((sum, item) => sum + item.ratio, 0);
  if (total < 1) {
    return [...portfolio, { type: 'cash', ratio: 1 - total }];
  }
  return portfolio;
});

// 공격형 자산 비율 계산
const aggressiveTypes = ['fund', 'aggressive pension', 'stock'];
const aggressiveRatio = computed(() =>
  normalizedPortfolio.value
    .filter(item => aggressiveTypes.includes(item.type))
    .reduce((sum, item) => sum + item.ratio, 0)
);

const type = computed(() =>
  aggressiveRatio.value > 0.5 ? '공격형' : '안정형'
);
</script>

<template>
  <BaseCard size="lg" ratio="sm">
    <p class="title03 mb-1">자산비율</p>
    <span class="text-body02">{{ type }} 자산 비율이 높아요</span>
    <div class="mt-6 w-full">
      <div class="h-8 w-full bg-status-red/20 rounded-full overflow-hidden">
        <div
          class="h-full bg-status-red"
          :style="{ width: `${(aggressiveRatio * 100).toFixed(1)}%` }"
        ></div>
      </div>
      <div class="mt-1 text-right text-footnote text-fg-secondary">
        공격형 {{ (aggressiveRatio * 100).toFixed(0) }}%
      </div>
    </div>
  </BaseCard>
</template>
