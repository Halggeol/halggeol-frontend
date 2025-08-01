<template>
  <BaseCard size="lg" class="gap-8 flex justify-around items-start w-full p-8">
    <!-- 최고금리 -->
    <div class="text-center">
      <h3 class="text-callout font-medium text-fg-secondary mb-3">최고금리</h3>
      <p class="text-title-sm font-bold text-fg-primary">
        {{ productDetail.primeRate }} %
      </p>
    </div>

    <!-- 기본금리 -->
    <div class="text-center">
      <h3 class="text-callout font-medium text-fg-secondary mb-3">기본금리</h3>
      <p class="text-title-sm font-bold text-fg-primary">
        {{ productDetail.rate }} %
      </p>
    </div>

    <!-- 기간 -->
    <div class="text-center">
      <h3 class="text-callout font-medium text-fg-secondary mb-3">기간</h3>
      <p class="text-title-sm font-bold text-fg-primary">
        {{ productDetail.saveTerm }} 개월
      </p>
    </div>

    <!-- 나와의 적합도 -->
    <div class="text-center">
      <h3 class="text-callout font-medium text-fg-secondary mb-3">
        나와의 적합도
      </h3>
      <!-- TODO: 이후 연결 -->
      <p class="text-title-sm font-bold text-status-blue">50 %</p>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';

defineProps({
  productDetail: {
    type: Object,
    required: true,
  },
});
</script>
