<template>
  <div
    class="bg-white rounded-xl shadow-card border border-1/2 border-secondary-200 p-8"
  >
    <h3 class="text-title-sm font-semibold text-fg-primary mb-6">
      AI 한 줄 요약
    </h3>
    <div class="space-y-4">
      <p class="text-body02 text-fg-secondary leading-relaxed">
        <span class="text-callout font-medium text-status-blue">장점</span>
        : {{ productDetail.advantage }}
      </p>
      <p class="text-body02 text-fg-secondary leading-relaxed">
        <span class="text-callout font-medium text-status-red">단점</span>
        : {{ productDetail.disadvantage }}
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  productDetail: {
    type: Object,
    required: true,
  },
});
</script>
