<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  getProductDetail,
  addScrap,
  delScrap,
  checkRecommendProductStatus,
  analyzeProductWithGemini,
} from '@/api/product-detail';
import { useNavigationStore } from '@/stores/navigation';

import ProductHeader from '@/components/products/ProductHeader.vue';
import ProductSummaryCard from '@/components/products/ProductSummaryCard.vue';
import ProductInfo from '@/components/products/ProductInfo.vue';
import ProfitCalculator from '@/components/products/ProfitCalculator.vue';
import AISummaryCard from '@/components/common/AISummaryCard.vue';
import ProductSurveyCard from '@/components/products/ProductSurveyCard.vue';

const productDetail = ref(null);
const isLoading = ref(true);
const error = ref(null);
const renewDate = '25.06.20';
const isScrolled = ref(false);

const route = useRoute();
const navigationStore = useNavigationStore();

// 상품 상태 확인
const productStatus = ref(null);
const isStatusLoading = ref(false);

// ✅ 추가: AI 요약 데이터와 로딩 상태를 별도로 관리할 변수
const geminiData = ref({ advantage: null, disadvantage: null });
const isGeminiLoading = ref(false);
const geminiError = ref(null);

const navigateToLink = () => {
  window.open(productDetail.value.regLink, '_blank');
};

const handleAddScrap = productId => {
  addScrap(productId);
};

let isChangingState = false;

const handleScroll = () => {
  if (isChangingState) return;

  const scrollY = window.scrollY;

  if (!isScrolled.value && scrollY > 360) {
    isChangingState = true;
    const currentScrollY = window.scrollY;
    isScrolled.value = true;
    requestAnimationFrame(() => {
      const heightDifference = 280;
      window.scrollTo(0, currentScrollY - heightDifference);
      setTimeout(() => {
        isChangingState = false;
      }, 100);
    });
  } else if (isScrolled.value && scrollY < 80) {
    isChangingState = true;
    const currentScrollY = window.scrollY;
    isScrolled.value = false;
    requestAnimationFrame(() => {
      const heightDifference = 280;
      window.scrollTo(0, currentScrollY + heightDifference);
      setTimeout(() => {
        isChangingState = false;
      }, 100);
    });
  }
};

// ✅ 추가: AI 요약 정보만 불러오는 비동기 함수
const fetchGeminiData = async product => {
  isGeminiLoading.value = true;
  geminiError.value = null;
  try {
    const geminiResponse = await analyzeProductWithGemini(product);
    geminiData.value.advantage = geminiResponse.advantage;
    geminiData.value.disadvantage = geminiResponse.disadvantage;
  } catch (err) {
    console.error('Gemini API 호출 실패:', err);
    geminiError.value = 'AI 요약 정보를 불러오는데 실패했습니다.';
  } finally {
    isGeminiLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const productId = route.params.productId;

    // 상품 상세 정보와 상태 정보를 병렬로 요청하여 메인 데이터를 빠르게 로드합니다.
    const [productResponse, statusResponse] = await Promise.all([
      getProductDetail(productId),
      navigationStore.shouldShowSurvey
        ? checkRecommendProductStatus(productId).catch(() => null)
        : Promise.resolve(null),
    ]);

    productDetail.value = productResponse.data;
    productStatus.value = statusResponse;

    isLoading.value = false;

    if (!productDetail.value.advantage || !productDetail.value.disadvantage) {
      await fetchGeminiData(productDetail.value);
    }
  } catch (err) {
    error.value = '상품 상세 정보를 불러오는데 실패했습니다: ' + err.message;
    console.error(err);
    isLoading.value = false;
  }

  // 스크롤 이벤트 리스너 추가
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="product-detail-page">
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center min-h-[400px] space-y-4"
    >
      <span class="loading loading-spinner loading-lg"></span>
      <p class="text-callout text-fg-secondary">
        상품 상세 정보를 불러오는 중...
      </p>
    </div>
    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-[400px] space-y-4"
    >
      <div class="text-status-red text-title-sm">⚠️</div>
      <p class="text-callout text-fg-secondary text-center">{{ error }}</p>
    </div>
    <div v-else-if="productDetail">
      <ProductHeader
        :productDetail="productDetail"
        :renewDate="renewDate"
        :isScrolled="isScrolled"
        @addScrap="handleAddScrap"
        @navigate="navigateToLink"
      />

      <div class="px-[10.8%] space-y-6 py-8">
        <ProductSummaryCard :productDetail="productDetail">
          <AISummaryCard
            :summary="productDetail.description"
            :good="geminiData.advantage"
            :bad="geminiData.disadvantage"
            :is-loading="isGeminiLoading"
            :error="geminiError"
          />
        </ProductSummaryCard>

        <ProductInfo :productDetail="productDetail" />

        <ProfitCalculator
          :productDetail="productDetail"
          :maxAmount="100000000"
        />

        <ProductSurveyCard
          v-if="navigationStore.shouldShowSurvey"
          :product-id="route.params.productId"
          :product-detail="productDetail"
          :product-status="productStatus"
        />
      </div>
    </div>
    <div v-else class="no-data-message">
      <p>상품 정보가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped></style>
