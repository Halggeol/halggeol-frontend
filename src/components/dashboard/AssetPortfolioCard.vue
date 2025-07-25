<script setup>
import { computed } from 'vue';
import BaseCard from '../common/BaseCard.vue';

// 목업 데이터
const portfolio = [
  {
    type: 'savings',
    ratio: 0.4,
  },
  {
    type: 'fund',
    ratio: 0.3,
  },
];

// 자산 비율 합계 1 유지
const normalizedPortfolio = (() => {
  const total = portfolio.reduce((sum, item) => sum + item.ratio, 0);
  if (total < 1) {
    return [...portfolio, { type: 'cash', ratio: 1 - total }];
  }
  return portfolio;
})();

// 공격형 자산 비율 계산
const aggressiveTypes = ['fund', 'aggressive pension', 'stock'];
const aggressiveRatio = computed(() =>
  normalizedPortfolio
    .filter(item => aggressiveTypes.includes(item.type))
    .reduce((sum, item) => sum + item.ratio, 0)
);

const type = computed(() =>
  aggressiveRatio.value > 0.5 ? '공격형' : '안정형'
);

// 자산 비율 차트(공격형/안정형)
// import { Doughnut } from 'vue-chartjs';
// import { Chart, ArcElement } from 'chart.js';
// Chart.register(ArcElement);

// const chartData = computed(() => {
//   const stableRatio = 1 - aggressiveRatio.value;
//   return {
//     labels: ['공격형', '안정형'],
//     datasets: [
//       {
//         data: [aggressiveRatio.value * 100, stableRatio * 100],
//         backgroundColor: ['#f87171', '#60a5fa'],
//         hoverOffset: 4,
//       },
//     ],
//   };
// });

// const chartOptions = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: { display: false },
//     tooltip: { enabled: false },
//     title: { display: false },
//   },
// };
</script>

<template>
  <BaseCard size="lg" ratio="sm">
    <p class="title03 mb-1">자산비율</p>
    <span class="text-body02">{{ type }} 자산이 높아요</span>
    <!-- <div class="mt-4 w-full">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div> -->
    <div class="mt-6 w-full">
      <div class="h-8 w-full bg-gray-200 rounded-full overflow-hidden">
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
