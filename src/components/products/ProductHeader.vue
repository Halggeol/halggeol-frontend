<template>
  <div
    class="bg-gradient-to-r from-secondary-200 to-secondary-300 py-12 lg:py-16 px-[10.8%]"
  >
    <div class="flex justify-between items-start">
      <!-- 왼쪽 컨텐츠 -->
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-6">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-caption font-medium"
            >{{ productTypeName }}</span
          >
          <span
            v-if="productDetail.joinMember"
            class="inline-flex items-center px-3 py-1 rounded-full bg-fg-secondary-100 text-fg-primary text-caption"
            >{{ productDetail.joinMember }}</span
          >
          <span
            v-if="productDetail.joinWay"
            class="inline-flex items-center px-3 py-1 rounded-full bg-fg-secondary-100 text-fg-primary text-caption"
            >{{ productDetail.joinWay }}</span
          >
        </div>

        <h1
          class="text-title-lg lg:text-title-xl font-bold text-fg-primary mb-6"
        >
          {{ productDetail.name }}
        </h1>

        <div class="flex items-center gap-2 mb-8">
          <span class="text-status-red">❤️</span>
          <span class="text-footnote text-fg-secondary">
            <strong class="text-fg-primary">{{
              productDetail.scrapCnt
            }}</strong
            >명이 관심갖고있음
          </span>
        </div>

        <div
          class="text-body02 text-fg-secondary leading-relaxed max-w-2xl"
        >
          제공되는 정보는 금융감독원
          <strong class="text-fg-primary">{{ renewDate }}</strong
          >일에 공시된 내용을 기반으로 작성되었으며, 금융상품 광고가
          아닙니다. 실제 상품 가입 시점에 변동될 수 있으므로 상품 가입 시 꼭
          다시 확인하시기 바랍니다.
        </div>
      </div>

      <!-- 오른쪽 버튼들 -->
      <div class="flex flex-col gap-3 ml-6 lg:ml-8 mt-auto">
        <BaseButton
          @click="$emit('addScrap', productDetail.id)"
          label="🤍 관심상품"
          size="sm"
          variant="outline"
          class="!w-auto !px-6 md:!px-8 lg:!px-10 !whitespace-nowrap !text-footnote md:!text-callout"
        />
        <BaseButton
          @click="$emit('navigate')"
          label="가입하기"
          size="sm"
          variant="filled"
          class="!w-auto !px-6 md:!px-8 lg:!px-10 !whitespace-nowrap !text-footnote md:!text-callout"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps({
  productDetail: {
    type: Object,
    required: true,
  },
  renewDate: {
    type: String,
    default: '25.06.20',
  },
});

defineEmits(['addScrap', 'navigate']);

const idPrefix = computed(() => {
  if (
    props.productDetail &&
    props.productDetail.id &&
    typeof props.productDetail.id === 'string'
  ) {
    return props.productDetail.id.charAt(0).toUpperCase();
  }
  return '';
});

const productTypeName = computed(() => {
  const typeMapping = {
    D: '예금',
    S: '적금',
    A: '공격형 연금',
    C: '안정형 연금',
    F: '펀드',
    X: '외화',
  };
  return typeMapping[idPrefix.value] || '금융상품';
});
</script>