<script setup>
import Good from '@/components/icons/regretScore/GoodFace.vue';
import Normal from '@/components/icons/regretScore/NormalFace.vue';
import Bad from '@/components/icons/regretScore/BadFace.vue';
import { onMounted, onUnmounted, ref } from 'vue';

defineProps({
  loadingText: {
    type: String,
    default: '로딩중',
  },
});

const visibleIcons = ref(0);
let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    visibleIcons.value += 1;
    if (visibleIcons.value > 3) {
      visibleIcons.value = 0;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="flex items-center justify-center gap-6 mb-3">
      <!-- 시간에 따라 하나하나씩 생성? 색깔 주입? -->
      <Bad v-if="visibleIcons >= 0" class="w-9 h-9" />
      <Normal v-if="visibleIcons >= 1" class="w-9 h-9" />
      <Good v-if="visibleIcons >= 2" class="w-9 h-9" />
    </div>
    <p class="text-callout text-fg-primary">{{ loadingText }}</p>
  </div>
</template>
