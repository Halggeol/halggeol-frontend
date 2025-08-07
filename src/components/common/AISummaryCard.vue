<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  summary: {
    type: String,
    required: true,
  },
  good: {
    type: String,
    required: true,
    default: null,
  },
  bad: {
    type: String,
    required: true,
    default: null,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

const loadingTimeout = ref(null);
const timeoutError = ref(false);

watch(
  () => props.isLoading,
  newValue => {
    if (newValue) {
      timeoutError.value = false;
      loadingTimeout.value = setTimeout(() => {
        // 5초 후 아웃!
        if (props.isLoading) {
          timeoutError.value = true;
        }
      }, 5000);
    } else {
      if (loadingTimeout.value) {
        clearTimeout(loadingTimeout.value);
      }
      timeoutError.value = false;
    }
  },
  { immediate: true }
);

// 컴포넌트가 사라질 때 타임아웃을 정리
onUnmounted(() => {
  if (loadingTimeout.value) {
    clearTimeout(loadingTimeout.value);
  }
});
</script>

<template>
  <BaseCard size="lg" variant="outline">
    <div
      v-if="props.isLoading && !timeoutError"
      class="flex flex-col items-center justify-center p-8"
    >
      <span class="loading loading-spinner loading-lg"></span>
      <p class="text-callout text-fg-secondary">AI 요약 정보 생성중..</p>
    </div>
    <!-- 타임아웃 에러가 발생했거나, 부모로부터 에러 prop을 받았을 때 에러 메시지를 보여줍니다. -->
    <div
      v-else-if="timeoutError || props.error"
      class="flex flex-col items-center justify-center p-8 text-red-600"
    >
      <p>불러오는데 실패했습니다.</p>
    </div>
    <div v-else>
      <span class="title03">{{ props.summary }}</span>
      <p class="text-body02 py-6">
        <span class="font-semibold text-status-red-400">장점 </span
        >{{ props.good }}
      </p>
      <p class="body02">
        <span class="font-semibold text-status-blue-400">단점 </span
        >{{ props.bad }}
      </p>
    </div>
  </BaseCard>
  <p class="pt-2 text-caption text-fg-secondary">
    AI를 통해 요약된 정보로, 일부 부정확한 정보나 어색한 표현이 포함될 수
    있습니다. 중요한 정보는 반드시 다시 확인하시기 바랍니다.
  </p>
</template>
