<script setup>
import Good from '@/assets/icons/insight/regretScore/GoodFace.vue';
import Normal from '@/assets/icons/insight/regretScore/NormalFace.vue';
import Bad from '@/assets/icons/insight/regretScore/BadFace.vue';
import { onMounted, onUnmounted, ref } from 'vue';

defineProps({
  loadingText: {
    type: String,
    default: '잠시만 기다려 주세요',
  },
  fullscreen: {
    type: Boolean,
    default: true,
  },
});

const visibleIcons = ref(1);
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    visibleIcons.value += 1;
    if (visibleIcons.value > 3) {
      visibleIcons.value = 1;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center pb-40"
    :class="[fullscreen ? 'min-h-screen' : 'h-full']"
  >
    <div class="flex items-center justify-center gap-6 mb-3">
      <Bad
        class="w-12 h-12 tablet:w-10 tablet:h-10 transition-opacity duration-500 text-gray-300"
        :class="{
          'opacity-100 !text-status-red animate-pulse-slow': visibleIcons >= 0,
          'opacity-0': visibleIcons === 1,
        }"
      />
      <Normal
        class="w-12 h-12 tablet:w-10 tablet:h-10 transition-opacity duration-500 text-gray-300"
        :class="{
          'opacity-100 !text-primary animate-pulse-slow': visibleIcons > 1,
          'opacity-0': visibleIcons < 2 && visibleIcons !== 0,
        }"
      />
      <Good
        class="w-12 h-12 tablet:w-10 tablet:h-10 transition-opacity duration-500 text-gray-300"
        :class="{
          'opacity-100 !text-status-blue animate-pulse-slow': visibleIcons > 2,
          'opacity-0': visibleIcons < 3 && visibleIcons !== 0,
        }"
      />
    </div>
    <p class="text-callout text-fg-primary">{{ loadingText }}</p>
  </div>
</template>
