<script setup>
import { computed } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

import BaseCard from '@/components/common/BaseCard.vue';
import Sunny from '../icons/regretWeather/Sunny.vue';
import MostlySunny from '../icons/regretWeather/MostlySunny.vue';
import SunWithCloud from '../icons/regretWeather/SunWithCloud.vue';
import Cloudy from '../icons/regretWeather/Cloudy.vue';
import Rain from '../icons/regretWeather/Rain.vue';
import RainHeavy from '../icons/regretWeather/RainHeavy.vue';

import InsightLineChart from '@/components/insight/InsightLineChart.vue';
import ForexBarChart from '@/components/insight/InsightBarChart.vue';
import Tooltiip from '../icons/common/Tooltiip.vue';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  regretScore: Number,
  missAmount: Number,
  regretInsightData: Array,
  isForexProduct: Boolean,
  forexInfo: Array,
  currencyOptions: Array,
  detailData: Object,
  selectedCurrency: String,
});

const emit = defineEmits(['update:selectedCurrency']);

const colorClass = computed(() => {
  if (props.regretScore >= 70) return 'text-status-red';
  if (props.regretScore >= 40) return 'text-primary';
  return 'text-status-blue';
});

function getWeatherLevel(score) {
  if (score == 0) return 'Sunny';
  if (score < 20) return 'MostlySunny';
  if (score < 40) return 'SunWithCloud';
  if (score < 60) return 'Cloudy';
  if (score < 80) return 'Rain';
  return 'RainHeavy';
}
</script>

<template>
  <div class="flex items-center gap-6 mb-12">
    <div class="flex flex-col justify-start">
      <p class="text-body02 mr-4 flex items-center">
        그때 가입하지 않아서 놓친 금액
        <span
          class="inline-block relative group ml-1 tooltip"
          data-tip="만약 이 상품에 가입했다면, 지금쯤 이만큼의 수익을 얻을 수 있었을 거예요. 과거의 데이터를 바탕으로 한 예상치이며, 미래 수익을 보장하지는 않아요."
        >
          <Tooltiip class="text-fg-secondary w-5 h-5" />
        </span>
      </p>
      <span :class="colorClass" class="title03">
        {{ Math.floor(props.missAmount / 10000).toLocaleString() }}만원
      </span>
    </div>
    <div class="flex justify-end items-center">
      <div>
        <p class="mr-6 text-body02 flex items-center">
          예상 후회지수
          <span
            class="inline-block relative group ml-1 tooltip"
            data-tip="이 상품을 놓쳤을 때 느낄 수 있는 아쉬움의 크기를 0점에서 100점 사이로 나타낸 예측 점수예요. 나의 다음 결정을 위한 참고자료로 활용해 보세요."
          >
            <Tooltiip class="text-fg-secondary w-5 h-5" />
          </span>
        </p>
        <p :class="colorClass" class="items-end title03">
          {{ props.regretScore }}
        </p>
      </div>
      <p class="flex items-center">
        <Sunny
          v-if="getWeatherLevel(props.regretScore) === 'Sunny'"
          class="w-10 h-10"
        />
        <MostlySunny
          v-else-if="getWeatherLevel(props.regretScore) === 'MostlySunny'"
          class="w-10 h-10"
        />
        <SunWithCloud
          v-else-if="getWeatherLevel(props.regretScore) === 'SunWithCloud'"
          class="w-10 h-10"
        />
        <Cloudy
          v-else-if="getWeatherLevel(props.regretScore) === 'Cloudy'"
          class="w-10 h-10"
        />
        <Rain
          v-else-if="getWeatherLevel(props.regretScore) === 'Rain'"
          class="w-10 h-10"
        />
        <RainHeavy v-else />
        <span
          class="inline-block relative group ml-1 tooltip"
          data-tip="예상 후회지수 날씨 가이드 ☀️맑음 🌤️약간 구름 🌥️구름 많음 ☁️흐림 🌧️약간 비 ⛈️비 많음"
        >
          <Tooltiip class="text-fg-secondary w-5 h-5" />
        </span>
      </p>
    </div>
  </div>
  <BaseCard size="lg" variant="outline" class="mb-20">
    <div v-if="isForexProduct" class="flex justify-start mb-6">
      <div class="flex items-center">
        <button
          v-for="currency in currencyOptions"
          :key="currency"
          @click="emit('update:selectedCurrency', currency)"
          :class="[
            'px-4 py-1 mr-2 rounded-full text-callout',
            props.selectedCurrency === currency
              ? 'bg-primary text-white font-medium'
              : 'text-fg-secondary hover:bg-[#DDE1E4]',
          ]"
        >
          {{ currency }}
        </button>
      </div>
    </div>
    <div v-if="isForexProduct" class="relative">
      <ForexBarChart
        :forexInfo="detailData.forexInfo"
        :selectedCurrency="props.selectedCurrency"
      />
    </div>
    <div v-else class="relative">
      <InsightLineChart :regretInsightData="regretInsightData" />
    </div>
  </BaseCard>
</template>
