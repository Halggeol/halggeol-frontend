<script setup>
import BaseCard from '@/components/common/BaseCard.vue';

const props = defineProps({
  summary: {
    type: String,
    required: true,
  },
  good: {
    type: String,
    required: true,
  },
  bad: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <BaseCard size="lg" variant="outline">
    <span class="title03">{{ props.summary }}</span>
    <p class="text-body02 py-6">
      <span class="font-semibold text-status-red-400">장점 </span
      >{{ props.good }}
    </p>
    <p class="body02">
      <span class="font-semibold text-status-blue-400">단점 </span
      >{{ props.bad }}
    </p>
  </BaseCard>
  <p class="pt-2 text-caption text-fg-secondary">
    AI를 통해 요약된 정보로, 일부 부정확한 정보나 어색한 표현이 포함될 수
    있습니다. 중요한 정보는 반드시 다시 확인하시기 바랍니다.
  </p>
</template>
