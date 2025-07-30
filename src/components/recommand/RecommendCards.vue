<script setup>
import BaseCard from '../common/BaseCard.vue';
import { computed } from 'vue';

// 추천 상품 카드 콘텐츠 커스텀
const props = defineProps({
  userName: {
    type: String,
    default: '사용자',
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  hasPadding: {
    type: Boolean,
    default: true,
  },
});

const userName = computed(() => props.userName);
const items = computed(() => props.items || []);

// 카테고리 매핑
const categoryMap = {
  D: '예금',
  S: '적금',
  A: '연금',
  C: '연금',
  F: '펀드',
  X: '외환',
};

// 상세페이지 이동
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDetail(id) {
  router.push(`/products/detail/${id}`);
} // 상세페이지 구현 이후 라우터 수정

// 패딩값 여부
const wrapperClass = computed(() => {
  return props.hasPadding ? 'scroller-wrapper pl-[10.8%]' : 'scroller-wrapper';
});
</script>

<template>
  <div class="scroller">
    <div :class="wrapperClass">
      <BaseCard
        v-for="item in props.items"
        :key="item.productId"
        @click="goToDetail(item.productId)"
        variant="tinted"
        size="lg"
        ratio="lg"
        class="scroller-item cursor-pointer"
      >
        <div class="relative">
          <span class="text-body02 mb-1">{{
            categoryMap[item.productId[0]]
          }}</span>
          <p class="title02 mb-2">{{ item.name }}</p>
          <div class="mt-20 absolute top-28 right-0 text-right">
            <span class="text-body02">적합도</span>
            <p class="title-lg">{{ item.matchScore }}%</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  overflow: hidden;
  position: relative;
  padding-bottom: 10rem;
}
.scroller-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.scroller-wrapper::-webkit-scrollbar {
  display: none;
}
.scroller-item {
  min-width: 360px;
  margin-right: 1.5rem;
}
</style>
