<script setup>
import BaseCard from '../common/BaseCard.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToDetail(productId) {
  router.push(`/products/detail/${productId}`);
}

const props = defineProps({
  ranking: {
    type: Array,
    default: () => [],
  },
});

function isHighRisk(risk) {
  return risk <= 2;
} // 고위험상품 추출
const showHighRisk = ref(true);

const regretRanking = computed(() => {
  // API 데이터가 없으면 빈 배열 반환
  if (!props.ranking || props.ranking.length === 0) return [];
  return props.ranking;
});

const topItem = computed(() => regretRanking.value[0]);
const restItems = computed(() => regretRanking.value.slice(1));

function hideHighRisk() {
  showHighRisk.value = !showHighRisk.value;
}

// 카테고리 매핑
const categoryMap = {
  D: '예금',
  S: '적금',
  A: '연금',
  C: '연금',
  F: '펀드',
  X: '외환',
};
</script>

<template>
  <div class="pb-12 pt-40 flex justify-between align-center">
    <h2 class="title01">
      이때 살 걸 금융상품 랭킹
      <span
        class="inline-block relative group ml-1 tooltip"
        data-tip="많은 사용자가 가입하지 않아 후회한 금융상품"
      >
        <i class="text-caption text-gray-400 cursor-pointer">ⓘ</i>
        <!-- 툴팁 박스 수정 -->
      </span>
    </h2>
    <!-- 아이콘 추후 수정 -->
    <p class="cursor-pointer" @click="hideHighRisk">
      <i>{{ showHighRisk ? ' ⃝' : '⦿' }}</i
      >고위험상품 숨기기
    </p>
  </div>
  <div class="ranking pb-40 grid grid-rows-2 grid-cols-3 gap-6">
    <BaseCard
      v-if="topItem"
      @click="goToDetail(topItem.productId)"
      variant="tinted"
      size="lg"
      class="row-span-2"
      :class="[
        'cursor-pointer',
        !showHighRisk && isHighRisk(topItem.risk)
          ? 'opacity-50 pointer-events-none'
          : '',
      ]"
    >
      <div class="relative">
        <div class="rank">
          <span class="title02 mt-6">1</span>
          <!-- 등락 표기 -->
          <div class="rank-content flex-1">
            <span class="text-body02 mb-1">{{
              categoryMap[topItem.productId[0]]
            }}</span>
            <p class="title02 mb-2 line-clamp-2">
              {{ topItem.productName }}
            </p>
            <span
              v-if="isHighRisk(topItem.risk)"
              class="text-footnote bg-status-red-50 text-status-red py-1 px-2 rounded-full"
            >
              고위험상품
            </span>
          </div>
        </div>
        <div class="rank-1 mt-20 absolute right-0 text-right">
          <p class="title-lg">{{ topItem.rate || 0 }}%</p>
          <p class="text-body02">{{ topItem.period || 0 }}개월 기준</p>
        </div>
      </div>
    </BaseCard>
    <BaseCard
      v-for="item in restItems"
      :key="item.productId"
      @click="goToDetail(item.productId)"
      variant="tinted"
      size="lg"
      ratio="sm"
      :class="[
        'cursor-pointer',
        !showHighRisk && isHighRisk(item.risk)
          ? 'opacity-50 pointer-events-none'
          : '',
      ]"
    >
      <div class="rank">
        <span class="title02 mt-6">{{ item.rank }}</span>
        <!-- 등락 표기 -->
        <div class="rank-content">
          <span class="text-body02 mb-1">{{
            categoryMap[item.productId[0]]
          }}</span>
          <p class="title02 mb-2 line-clamp-2">{{ item.productName }}</p>
          <span
            v-if="isHighRisk(item.risk)"
            class="text-footnote bg-status-red-50 text-status-red py-1 px-2 rounded-full"
          >
            고위험상품
          </span>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<style scoped>
.rank {
  display: flex;
}
.rank-content {
  padding-left: 3rem;
}
</style>
