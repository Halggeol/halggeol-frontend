<script setup>
import { computed } from 'vue';
import { portfolioConfig } from '@/config/portfolioConfig';

const props = defineProps({
  portfolio: {
    type: Array,
    default: () => [],
  },
});

const hasAssets = computed(() => props.portfolio && props.portfolio.length > 0);

// 자산 비율 합계 1 유지
const normalizedPortfolio = computed(() => {
  if (!props.portfolio || props.portfolio.length === 0) return [];
  const total = props.portfolio.reduce((sum, item) => sum + item.ratio, 0);
  if (total > 0 && total < 1) {
    return [...props.portfolio, { type: 'cash', ratio: 1 - total }];
  }
  return props.portfolio;
});

// 공격형 자산 비율 계산
const aggressiveTypes = ['fund', 'aggressive', 'stock'];
const aggressiveRatio = computed(() =>
  normalizedPortfolio.value
    .filter(item => aggressiveTypes.includes(item.type))
    .reduce((sum, item) => sum + item.ratio, 0)
);

const type = computed(() =>
  aggressiveRatio.value > 0.5 ? '공격형' : '안정형'
);

const detailedPortfolio = computed(() => {
  return normalizedPortfolio.value
    .map(item => {
      const config = portfolioConfig[item.type] || portfolioConfig.default;
      const percentage = item.ratio * 100;

      return {
        ...item,
        name: config.name,
        color: config.color,
        percentageText:
          percentage < 0.1 ? '0.1% 미만' : `${percentage.toFixed(2)}%`,
      };
    })
    .sort((a, b) => b.ratio - a.ratio);
});
</script>

<template>
  <div>
    <p class="title03 mb-4">자산 포트폴리오</p>
    <p v-if="hasAssets" class="text-body02 mb-4">
      {{ type }} 자산 비율이 높아요
    </p>
    <p v-else class="text-body02 mb-4">아직 자산 연동을 안했어요</p>
    <div class="flex w-full h-8 rounded-full overflow-hidden mb-4">
      <div
        v-for="item in detailedPortfolio"
        :key="item.type"
        :class="item.color"
        :style="{ width: `${item.ratio * 100}%` }"
        class="transition-all duration-300"
      ></div>
    </div>

    <ul class="space-y-2">
      <li
        v-for="item in detailedPortfolio"
        :key="item.type"
        class="flex items-center text-body02"
      >
        <span class="w-3 h-3 rounded-full mr-2" :class="item.color"></span>
        <span class="text-body02 text-fg-primary">{{ item.name }}</span>
        <span class="ml-auto text-body02 text-fg-secondary">{{
          item.percentageText
        }}</span>
      </li>
    </ul>
  </div>
</template>
