<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInsightStore } from '@/stores/insightStore';
import {
  getInsightDetail,
  mapRegretFeedbackResponse,
} from '@/api/insight-detail';

import InsightDetailPage from '@/pages/insight/InsightDetailPage.vue';
import LoadingPage from '@/pages/LoadingPage.vue';
import PagenationsButton from '@/components/icons/insight/PagenationsButton.vue';
import Error500Page from '../Error500Page.vue';
import EmptyPage from '../EmptyPage.vue';

const props = defineProps({
  filterType: {
    type: String,
    default: null, // 'fund', 'aggressive', 또는 null
  },
});

// 설문 제출 시 캐싱 처리
const detailDataCache = ref(new Map());

const route = useRoute();
const router = useRouter();
const insightStore = useInsightStore();

const detailData = ref(null);
const isLoading = ref(true);
const error = ref(null);
const isEmpty = ref(false);
const selectedCurrency = ref('USD');
const filteredProductsData = computed(() => {
  const originalData = insightStore.products;
  if (!props.filterType) {
    return originalData; // 기본
  }

  const filterPrefix = props.filterType === 'fund' ? 'F' : 'A';

  const mappedData = originalData.map(roundData => ({
    ...roundData,
    products: roundData.products.filter(p =>
      p.productId.startsWith(filterPrefix)
    ),
  }));

  return mappedData.filter(roundData => roundData.products.length > 0);
});

const availableRounds = computed(() => {
  return filteredProductsData.value.map(p => p.round).sort((a, b) => a - b);
});
const currentRound = computed(() =>
  route.query.round ? Number(route.query.round) : null
);
const currentProducts = computed(() => {
  return (
    filteredProductsData.value.find(p => p.round === currentRound.value)
      ?.products ?? []
  );
});
const currentRecDate = computed(() => {
  const date = filteredProductsData.value.find(
    p => p.round === currentRound.value
  )?.recDate;

  if (!date) return null;
  const [year, month, day] = date.split('T')[0].split('-');
  return `${year}년 ${month}월 ${day}일`;
});
const currentProductId = computed(() => route.query.productId || null);

const selectedProductData = computed(() => {
  if (!currentProductId.value) return null;
  return currentProducts.value.find(
    p => p.productId === currentProductId.value
  );
});

async function loadDetail(round, productId) {
  if (detailDataCache.value.has(productId)) {
    detailData.value = detailDataCache.value.get(productId);
    return;
  }
  isLoading.value = true;
  detailData.value = null;
  error.value = null;
  try {
    const dData = await getInsightDetail(round, productId);
    detailData.value = dData;

    // 캐싱 처리
    detailDataCache.value.set(productId, dData);

    // 통화 자동 선택
    if (dData?.forexInfo?.length > 0 && dData.currency) {
      selectedCurrency.value = dData.currency.split(',')[0];
    }
  } catch (e) {
    console.error('상세 정보 로드 실패:', e);
    error.value = e;
  } finally {
    isLoading.value = false;
  }
}

// 후회 피드백 여부 뱃지
const getRegretStatusInfo = product => {
  const cachedData = detailDataCache.value.get(product.productId);

  if (cachedData) {
    const status = mapRegretFeedbackResponse(cachedData);
    if (!status.isSurveyed) {
      return {
        text: '설문하기',
        class: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      };
    }
    return {
      text: status.isRegretted ? '후회함' : '후회안함',
      class: status.isRegretted
        ? 'bg-red-100 text-red-800'
        : 'bg-blue-100 text-blue-800',
    };
  }

  return {
    text: '상태 확인',
    class: 'bg-gray-100 text-gray-500',
  };
};

// 캐시 업데이트(fetch feedback)
const handleSurveyUpdate = feedbackPayload => {
  const { productId, isRegretted } = feedbackPayload;

  const cachedData = detailDataCache.value.get(productId);
  if (!cachedData) return;

  cachedData.isSurveyed = true;
  cachedData.isRegretted = isRegretted;

  detailDataCache.value.set(productId, cachedData);

  if (detailData.value && detailData.value.productId === productId) {
    detailData.value.isSurveyed = true;
    detailData.value.isRegretted = isRegretted;
  }
};

// 회차 변경
function changeRound(next = true) {
  const rounds = availableRounds.value; // 이미 필터링된 회차 목록
  const currentIndex = rounds.indexOf(currentRound.value);
  const newIndex = next ? currentIndex + 1 : currentIndex - 1;

  if (newIndex >= 0 && newIndex < rounds.length) {
    const newRound = rounds[newIndex];
    // 새 회차의 첫 번째 상품
    const firstProductInNewRound = filteredProductsData.value.find(
      p => p.round === newRound
    )?.products?.[0];

    if (firstProductInNewRound) {
      router.push({
        query: { round: newRound, productId: firstProductInNewRound.productId },
      });
    }
  }
}

function handleProductClick(pid) {
  if (pid !== currentProductId.value) {
    router.push({ query: { round: currentRound.value, productId: pid } });
  }
}

onMounted(async () => {
  try {
    await insightStore.initializeProducts();

    if (filteredProductsData.value.length === 0) {
      isEmpty.value = true;
    } else {
      if (!route.query.round || !route.query.productId) {
        const latestRound = [...filteredProductsData.value].sort(
          (a, b) => b.round - a.round
        )[0];
        const firstProduct = latestRound.products?.[0];
        if (latestRound && firstProduct) {
          router.replace({
            query: {
              round: latestRound.round,
              productId: firstProduct.productId,
            },
          });
        }
      }
    }
  } catch (e) {
    console.error('onMounted 초기화 실패:', e);
    error.value = e;
  } finally {
    isLoading.value = false;
  }
});

watch(
  () => route.query,
  newQuery => {
    if (newQuery.round && newQuery.productId) {
      loadDetail(Number(newQuery.round), newQuery.productId);
    }
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <LoadingPage v-if="isLoading" />
  <Error500Page v-else-if="error" />
  <EmptyPage v-else-if="isEmpty" />
  <div v-else-if="!currentRound" class="flex justify-center items-center h-64">
    <p class="text-fg-secondary">표시할 인사이트가 없습니다.</p>
  </div>
  <div v-else>
    <div class="flex justify-center items-center gap-5 mt-7 pb-4">
      <PagenationsButton
        @click="changeRound(false)"
        :disabled="availableRounds.indexOf(currentRound) === 0"
        class="hover:shadow-card rounded-full"
      />
      <span class="text-body02 font">{{ currentRound }}회차</span>
      <PagenationsButton
        @click="changeRound(true)"
        :disabled="
          availableRounds.indexOf(currentRound) === availableRounds.length - 1
        "
        class="hover:shadow-card rounded-full scale-x-[-1]"
      />
    </div>

    <div class="text-footnote text-fg-secondary pb-10">
      <span class="font-bold">발행일 </span> {{ currentRecDate }}
    </div>
    <div class="mb-8 border-b border-gray-200">
      <div class="-mb-px flex space-x-6 px-4">
        <button
          v-for="product in currentProducts"
          :key="product.productId"
          @click="handleProductClick(product.productId)"
          class="whitespace-nowrap border-b-2 py-3 text-sm font-semibold transition-colors duration-200 ease-in-out"
          :class="[
            product.productId === currentProductId
              ? 'border-primary text-secondary'
              : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300', // 비활성 탭 스타일
          ]"
        >
          {{ product.name }}
        </button>
      </div>
    </div>

    <div v-if="selectedProductData" class="flex items-center mb-12">
      <h3 class="title01 text-fg-primary mr-4">
        {{ selectedProductData.name }}
      </h3>
      <span
        v-if="getRegretStatusInfo(selectedProductData)"
        :class="getRegretStatusInfo(selectedProductData).class"
        class="text-sm font-medium px-3 py-1 rounded-full"
      >
        {{ getRegretStatusInfo(selectedProductData).text }}
      </span>
    </div>
    <InsightDetailPage
      :is-loading="isLoading"
      :detail-data="detailData"
      @survey-submitted="handleSurveyUpdate"
    />
  </div>
</template>
