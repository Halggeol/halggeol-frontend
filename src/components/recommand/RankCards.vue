<script setup>
import BaseCard from '../common/BaseCard.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import Tooltiip from '../icons/Tooltiip.vue';
import CheckCircle from '../icons/CheckCircle.vue';

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

const productTypeConfig = {
  D: { name: '예금', bgColor: 'bg-savings', textColor: 'text-fg-savings' },
  S: { name: '적금', bgColor: 'bg-deposit', textColor: 'text-fg-deposit' },
  A: {
    name: '연금',
    bgColor: 'bg-pension',
    textColor: 'text-fg-pension',
  },
  C: { name: '연금', bgColor: 'bg-pension', textColor: 'text-fg-pension' },
  F: { name: '펀드', bgColor: 'bg-fund', textColor: 'text-fg-fund' },
  X: { name: '외환', bgColor: 'bg-forex', textColor: 'text-fg-forex' },
  default: {
    name: '기타',
    bgColor: 'bg-[#F7F7F8]',
    textColor: 'text-fg-primary',
  },
};
</script>

<template>
  <div class="pb-12 pt-40 flex justify-between align-center">
    <h2 class="title01">
      그때 할걸 후회상품 랭킹
      <span
        class="inline-block relative group ml-1 tooltip"
        data-tip="사용자가 놓친 상품 중 가입하지 않아 가장 많이 후회하는 상품"
      >
        <Tooltiip class="text-fg-secondary" />
      </span>
    </h2>
    <!-- 아이콘 추후 수정 -->
    <p class="cursor-pointer flex items-center" @click="hideHighRisk">
      <CheckCircle :checked="!showHighRisk" class="w-5 h-5 mr-2" />
      고위험상품 숨기기
    </p>
  </div>
  <div class="ranking pb-20 grid grid-rows-2 grid-cols-3 gap-6 tablet:gap-4">
    <BaseCard
      v-if="topItem"
      @click="goToDetail(topItem.productId)"
      variant="tinted"
      size="lg"
      :class="[
        'row-span-2 cursor-pointer',
        (productTypeConfig[topItem.productId[0]] || productTypeConfig.default)
          .bgColor,
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
            <span
              class="text-body02 mb-2"
              :class="
                (
                  productTypeConfig[topItem.productId[0]] ||
                  productTypeConfig.default
                ).textColor
              "
            >
              {{
                (
                  productTypeConfig[topItem.productId[0]] ||
                  productTypeConfig.default
                ).name
              }}
            </span>
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
          <span class="text-body02 mb-2 text-fg-primary">
            {{
              (
                productTypeConfig[item.productId[0]] ||
                productTypeConfig.default
              ).name
            }}
          </span>
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
