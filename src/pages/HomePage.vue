<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import AssetCard from '@/components/dashboard/AssetCard.vue';
import AssetPortfolioCard from '@/components/dashboard/AssetPortfolioCard.vue';
import RegretScoreCard from '@/components/dashboard/RegretScoreCard.vue';
import RankCards from '@/components/recommand/RankCards.vue';
import RecommendCards from '@/components/recommand/RecommendCards.vue';
import router from '@/router';
import { ref } from 'vue';

const isLoggedIn = ref(true);
function onLoginClick() {
  router.push('/login');
}
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
</script>
<template>
  <!-- 대시보드 영역 -->
  <div class="dashboard w-full bg-base-200 px-[10.8%]">
    <div
      :class="[{ 'filter blur pointer-events-none select-none': !isLoggedIn }]"
    >
      <h2 class="title01 pb-12 pt-20">대시보드</h2>
      <div class="pb-40 grid grid-rows-2 grid-cols-3 gap-6">
        <RegretScoreCard />
        <AssetCard class="row-span-2 col-span-2" />
        <AssetPortfolioCard />
      </div>
    </div>
    <!-- 블러 영역 -->
    <div
      v-if="!isLoggedIn"
      class="absolute inset-0 flex flex-col justify-center items-center"
    >
      <p class="mb-4 title01 text-fg-primary">그때 할 걸</p>
      <p class="mb-6 text-body01 text-fg-primary text-center">
        늦었다고 생각했을 때가 빠르다.
        <br />
        회고형 금융상품 추천 서비스
      </p>
      <BaseButton @click="onLoginClick"></BaseButton>
    </div>
  </div>
  <!-- 추천상품 영역 -->
  <div class="mx-[10.8%]">
    <RankCards />
  </div>
  <h2 class="title01 pb-12 pt-40 mx-[10.8%]">
    {{ userName }} 님을 위한 추천 상품
  </h2>
  <RecommendCards
    v-if="isLoggedIn"
    :items="recommendItems"
    :has-padding="true"
  />
</template>
