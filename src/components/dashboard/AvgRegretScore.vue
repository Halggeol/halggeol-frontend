<script setup>
import { computed } from 'vue';
import BadFace from '../icons/regretScore/BadFace.vue';
import GoodFace from '../icons/regretScore/GoodFace.vue';
import NormalFace from '../icons/regretScore/NormalFace.vue';

const props = defineProps({
  regretScore: {
    type: Number,
    default: 0,
  },
});

const regretStatus = computed(() => {
  const score = Math.trunc(props.regretScore);

  if (score >= 60) {
    return {
      component: BadFace,
      text: '나쁨',
      colorClass: 'text-status-red',
    };
  }
  if (score < 40) {
    return {
      component: GoodFace,
      text: '좋음',
      colorClass: 'text-status-blue',
    };
  }
  return {
    component: NormalFace,
    text: '보통',
    colorClass: 'text-primary',
  };
});
</script>

<template>
  <div class="flex items-center justify-start gap-2 mb-4">
    <span class="text-body01">오늘의 후회지수</span>
    <span class="text-body01 font-medium" :class="regretStatus.colorClass">
      {{ regretStatus.text }}
    </span>
    <component :is="regretStatus.component" class="w-6 h-6" />
  </div>
</template>
