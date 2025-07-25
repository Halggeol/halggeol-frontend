<script setup>
import BaseCard from '../common/BaseCard.vue';

// 목업데이터
const userName = '김금융';
const recommendItems = [
  {
    productId: 'S11',
    name: '청년우대적금',
    matchScore: 50,
  },
  {
    productId: 'A11',
    name: 'KB퇴직연금배당40증권자투자신탁(채권혼합)C-E',
    matchScore: 50,
  },
  {
    productId: 'S11',
    name: '청년우대적금',
    matchScore: 50,
  },
  {
    productId: 'F10',
    name: '교보악사 내일환매 초단기우량채증권투자신탁(채권) Ce',
    matchScore: 50,
  },
  {
    productId: 'S11',
    name: '청년우대적금',
    matchScore: 50,
  },
];

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

function goToDetail(productId) {
  // router.push(`/product/${productId}`);
  router.push('/product/detail');
} // 상세페이지 구현 이후 라우터 수정
</script>

<template>
  <h2 class="title01 pb-12 pt-40 mx-[10.8%]">
    {{ userName }} 님을 위한 추천 상품
  </h2>
  <div class="scroller">
    <div class="scroller-wrapper pl-[10.8%]">
      <BaseCard
        v-for="item in recommendItems"
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
