<script setup>
import BaseCard from '../common/BaseCard.vue';
import { computed } from 'vue';
const props = defineProps({
  feedbackRatio: {
    type: Number,
    default: 0,
  },
});

// 후회 관련 차트
import { Doughnut } from 'vue-chartjs';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

const getRegretColor = score => {
  if (score >= 60) return '#287EFF';
  if (score < 40) return '#F23F3F';
  return '#FFD338';
};

// 후회상품비율 차트
const regretItemRatio = computed(() => {
  return Math.round(props.feedbackRatio * 100);
});

const regretItemChartData = computed(() => ({
  labels: ['후회상품비율'],
  datasets: [
    {
      data: [regretItemRatio.value, 100 - regretItemRatio.value],
      backgroundColor: [getRegretColor(regretItemRatio.value), '#e5e7eb'],
      borderWidth: 0,
      cutout: '60%',
      rotation: -90,
      circumference: 180,
    },
  ],
}));

const regretItemChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  rotation: -90,
  circumference: 180,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
};
</script>

<template>
  <BaseCard size="lg" shadow="true">
    <p class="title03 mb-6">
      후회상품비율
      <span
        class="inline-block relative group ml-1 align-top tooltip"
        data-tip="추천 상품 중 ‘후회해요’라고 응답한 상품의 비율"
      >
        <i class="text-caption text-gray-400 cursor-pointer">ⓘ</i>
      </span>
    </p>
    <div class="relative w-full max-h-24">
      <Doughnut :data="regretItemChartData" :options="regretItemChartOptions" />
    </div>
  </BaseCard>
</template>
