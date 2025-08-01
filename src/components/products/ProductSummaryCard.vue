<template>
  <div class="space-y-4">
    <BaseCard
      size="lg"
      class="gap-8 flex justify-around items-start w-full p-8"
    >
      <!-- 최고금리 -->
      <div class="text-center">
        <h3 class="text-callout font-medium text-fg-secondary mb-3">
          최고금리
        </h3>
        <p class="text-title-sm font-bold text-fg-primary">
          {{ productDetail.primeRate }} %
        </p>
      </div>

      <!-- 기본금리 -->
      <div class="text-center">
        <h3 class="text-callout font-medium text-fg-secondary mb-3">
          기본금리
        </h3>
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
          <div
            class="tooltip"
            data-tip="서비스에서 고객의 정보를 분석하여 추천하는 금융 상품과의 적합성을 수치로 보여주는 지표입니다."
          >
            <span class="underline"> 나와의 적합도 </span>
          </div>
        </h3>
        <!-- TODO: 이후 연결 -->
        <p class="text-title-sm font-bold text-status-blue">
          {{ productDetail.score }} %
        </p>
      </div>
    </BaseCard>

    <!-- Slot for additional content -->
    <slot></slot>
  </div>
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
