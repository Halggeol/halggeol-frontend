<script setup>
import BaseCard from '../common/BaseCard.vue';
import Good from '../icons/regretScore/good.vue';
import Bad from '../icons/regretScore/bad.vue';
import Normal from '../icons/regretScore/normal.vue';
import { ref, computed } from 'vue';

// flip card
const isFlipped = ref(false);

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
  const regretScore = Math.floor(props.regretScore);
  return regretScore; // api 호출값이 null이면 0 처리
});

// 후회 관련 차트
import { Doughnut } from 'vue-chartjs';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

const getRegretColor = score => {
  if (score >= 60) return '#F23F3F';
  if (score < 40) return '#287EFF';
  return '#FFD338';
};

const getRegretFace = score => {
  if (score >= 60) return Bad;
  if (score < 40) return Good;
  return Normal;
};

// 후회지수 차트
const regretChartData = computed(() => ({
  labels: ['후회지수'],
  datasets: [
    {
      data: [avgRegretScore.value, 100 - avgRegretScore.value],
      backgroundColor: [getRegretColor(avgRegretScore), '#e5e7eb'],
      borderWidth: 0,
      cutout: '60%',
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
  <BaseCard
    size="lg"
    class="flip-wrapper cursor-pointer"
    @click="isFlipped = !isFlipped"
  >
    <div class="flip-inner" :class="{ flipped: isFlipped }">
      <!-- 후회지수 -->
      <div class="card-face">
        <p class="title03 mb-6">
          후회지수
          <span
            class="inline-block relative group ml-1 align-top tooltip"
            data-tip="내 자산 대비 놓친 기회를 반영한 점수"
          >
            <i class="text-caption text-gray-400 cursor-pointer">ⓘ</i>
          </span>
        </p>
        <div class="relative w-24 h-24 mx-auto">
          <Doughnut :data="regretChartData" :options="regretChartOptions" />
          <div class="absolute inset-0 flex items-center justify-center">
            <component
              :is="getRegretFace(avgRegretScore)"
              class="w-10 h-10 mb-2"
            />
          </div>
        </div>
      </div>
      <!-- 후회상품비율 -->
      <div class="card-face back">
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
