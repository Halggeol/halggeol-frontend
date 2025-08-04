<script setup>
import BaseCard from '../common/BaseCard.vue';
import { ref, computed } from 'vue';

// flip card
const isFlipped = ref(false);

// 목업데이터
// const avgRegretScore = ref(87);

const props = defineProps({
  regretScore: {
    type: Number,
    default: 0,
  },
  feedbackRatio: {
    type: Number,
    default: 0,
  },
});

const avgRegretScore = computed(() => {
  return props.regretScore; // api 호출값이 null이면 0 처리
});

// 후회 관련 차트
import { Doughnut } from 'vue-chartjs';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

// 후회지수 차트
const regretChartData = computed(() => ({
  labels: ['후회지수'],
  datasets: [
    {
      data: [avgRegretScore.value, 100 - avgRegretScore.value],
      backgroundColor: ['#f87171', '#e5e7eb'],
      borderWidth: 0,
      cutout: '70%',
    },
  ],
}));
const regretChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
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
      backgroundColor: ['#60a5fa', '#e5e7eb'],
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
  <BaseCard
    size="lg"
    class="flip-wrapper cursor-pointer"
    @click="isFlipped = !isFlipped"
  >
    <div class="flip-inner" :class="{ flipped: isFlipped }">
      <!-- 후회지수 -->
      <div class="card-face">
        <p class="title03 mb-6">후회지수</p>
        <div class="relative w-24 h-24 mx-auto">
          <Doughnut :data="regretChartData" :options="regretChartOptions" />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-body02 text-status-red"
              >{{ avgRegretScore }}%</span
            >
          </div>
        </div>
      </div>
      <!-- 후회상품비율 -->
      <div class="card-face back">
        <p class="title03 mb-6">후회상품비율</p>
        <div class="relative w-full max-h-24">
          <Doughnut
            :data="regretItemChartData"
            :options="regretItemChartOptions"
          />
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<style scoped>
.flip-wrapper {
  position: relative;
  perspective: 1000px;
}
.flip-inner {
  position: relative;
  transform-style: preserve-3d;
}
.flip-inner.flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}
.back {
  transform: rotateY(180deg);
}
</style>
