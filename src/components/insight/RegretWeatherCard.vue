<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import RainHeavy from '../icons/RainHeavy.vue';
import Rain from '../icons/Rain.vue';
import Cloudy from '../icons/Cloudy.vue';
import SunWithCloud from '../icons/SunWithCloud.vue';
import MostlySunny from '../icons/MostlySunny.vue';
import Sunny from '../icons/Sunny.vue';

const props = defineProps({
  regretScore: Number,
  missAmount: Number,
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
  <BaseCard ratio="lg" :shadow="true" class="flex-[1]">
    <p class="title03 relative">
      나의 후회 날씨
      <span class="inline-block relative group ml-1 align-top">
        <i class="text-caption text-gray-400 cursor-pointer">ⓘ</i>
        <!-- 툴팁 박스 수정 -->
        <div
          class="absolute left-full top-1/2 z-10 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-black px-3 py-1 text-footnote text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          후회 날씨 설명
        </div>
      </span>
    </p>
    <div class="icon-area w-1/3 my-6">
      <!-- 후회 날씨 아이콘 크기 조절로 수정 -->
      <Sunny v-if="getWeatherLevel(props.regretScore) === 'Sunny'" />
      <MostlySunny
        v-if="getWeatherLevel(props.regretScore) === 'MostlySunny'"
      />
      <SunWithCloud
        v-else-if="getWeatherLevel(props.regretScore) === 'SunWithCloud'"
      />
      <Cloudy v-else-if="getWeatherLevel(props.regretScore) === 'Cloudy'" />
      <Rain v-else-if="getWeatherLevel(props.regretScore) === 'Rain'" />
      <RainHeavy v-else />
    </div>
    <!-- 후회지수 좋음, 보통, 나쁨으로 수정 -->
    <p class="text-body02 mb-2">후회지수 {{ props.regretScore }}</p>
    <!-- RegretMomentCards와 같은 데이터 사용 -->
    <p class="text-body02">
      놓친 금액 {{ (props.missAmount / 10000).toLocaleString() }}만원
    </p>
  </BaseCard>
</template>
