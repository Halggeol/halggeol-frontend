<template>
  <BaseCard size="lg" variant="outline">
    <h3 class="text-title-sm font-semibold text-fg-primary mb-8">상품 정보</h3>

    <div class="space-y-6">
      <div class="flex items-start">
        <span class="w-28 text-callout text-fg-secondary flex-shrink-0"
          >최소 금액</span
        >
        <span class="text-body02 text-fg-primary font-medium"
          >{{ productDetail.minimumCost }} 원 이상</span
        >
      </div>

      <div class="flex items-start">
        <span class="w-28 text-callout text-fg-secondary flex-shrink-0"
          >운용 회사</span
        >
        <span class="text-body02 text-fg-primary font-medium">{{
          productDetail.company
        }}</span>
      </div>

      <div class="flex items-start" v-if="productDetail.joinMember">
        <span class="w-28 text-callout text-fg-secondary flex-shrink-0"
          >가입 대상</span
        >
        <span class="text-body02 text-fg-primary font-medium">{{
          productDetail.joinMember
        }}</span>
      </div>

      <div class="flex items-start" v-if="productDetail.joinWay">
        <span class="w-28 text-callout text-fg-secondary flex-shrink-0"
          >가입 방법</span
        >
        <span class="text-body02 text-fg-primary font-medium">{{
          productDetail.joinWay
        }}</span>
      </div>

      <div class="flex items-start" v-if="productDetail.caution">
        <span class="w-28 text-callout text-fg-secondary flex-shrink-0"
          >기타 사항</span
        >
        <span class="text-body02 text-fg-primary leading-relaxed">{{
          productDetail.caution
        }}</span>
      </div>
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
