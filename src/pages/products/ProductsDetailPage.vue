<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  getProductDetail,
  addScrap,
  delScrap,
  checkRecommendProductStatus,
} from '@/api/product-detail';
import { analyzeProductWithGemini } from '@/api/dashboard';
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

// 이제 ProductSurveyCard 내부에서 블러 처리를 담당하므로 불필요

const navigateToLink = () => {
  window.open(productDetail.value.regLink, '_blank');
};

const handleAddScrap = productId => {
  addScrap(productId);
};

let isChangingState = false;

const handleScroll = () => {
  if (isChangingState) return; // 상태 변경 중에는 스크롤 이벤트 무시

  const scrollY = window.scrollY;

  if (!isScrolled.value && scrollY > 360) {
    isChangingState = true;
    const currentScrollY = window.scrollY;

    isScrolled.value = true;

    // 헤더 높이 변화로 인한 스크롤 위치 보정
    requestAnimationFrame(() => {
      const heightDifference = HEADER_HEIGHT_DIFFERENCE;
      window.scrollTo(0, currentScrollY - heightDifference);

      setTimeout(() => {
        isChangingState = false;
      }, 100);
    });
  } else if (isScrolled.value && scrollY < 80) {
    isChangingState = true;
    const currentScrollY = window.scrollY;

    isScrolled.value = false;

    // 헤더 높이 변화로 인한 스크롤 위치 보정
    requestAnimationFrame(() => {
      const heightDifference = 280; // 360px - 80px = 280px
      window.scrollTo(0, currentScrollY + heightDifference);

      setTimeout(() => {
        isChangingState = false;
      }, 100);
    });
  }
};

onMounted(async () => {
  try {
    // 라우트에서 productId 가져오기
    const productId = route.params.productId;

    // 상품 상세 정보와 상태 정보를 병렬로 요청
    const [productResponse, statusResponse] = await Promise.all([
      getProductDetail(productId),
      navigationStore.shouldShowSurvey
        ? checkRecommendProductStatus(productId).catch(() => null)
        : Promise.resolve(null),
    ]);

    productDetail.value = productResponse.data;
    productStatus.value = statusResponse;

    console.log('API 응답 확인:');
    console.log('isFromRecommend:', navigationStore.shouldShowSurvey);
    console.log('statusResponse:', statusResponse);
    console.log('productStatus.value:', productStatus.value);
    // Removed debug console.log statements for production
    // if (!productDetail.value.advantage || !productDetail.value.disadvantage) {
    //   console.log(
    //     'advantage 또는 disadvantage 값이 없어 Gemini API를 호출합니다.'
    //   );
    //   const geminiResponse = await analyzeProductWithGemini(
    //     productDetail.value
    //   );
    //   // 응답으로 받은 값으로 productDetail 업데이트
    //   productDetail.value.advantage = geminiResponse.advantage;
    //   productDetail.value.disadvantage = geminiResponse.disadvantage;
    // }

    productDetail.value.advantage = '나는 장점';
    if (!productDetail.value.advantage || !productDetail.value.disadvantage) {
      console.log(
        'advantage 또는 disadvantage 값이 없어 Gemini API를 호출합니다.'
      );
      const geminiResponse = await analyzeProductWithGemini(
        productDetail.value
      );
      // 응답으로 받은 값으로 productDetail 업데이트
      productDetail.value.advantage = geminiResponse.advantage;
      productDetail.value.disadvantage = geminiResponse.disadvantage;
    }
  } catch (err) {
    error.value = '상품 상세 정보를 불러오는데 실패했습니다: ' + err.message;
    console.error(err);
  } finally {
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
      <!-- 헤더 섹션 -->
      <ProductHeader
        :productDetail="productDetail"
        :renewDate="renewDate"
        :isScrolled="isScrolled"
        @addScrap="handleAddScrap"
        @navigate="navigateToLink"
      />

      <!-- 메인 컨텐츠 섹션 -->
      <div class="px-[10.8%] space-y-6 py-8">
        <!-- 상품 주요 정보 카드 (AI 요약 포함) -->
        <ProductSummaryCard :productDetail="productDetail">
          <AISummaryCard
            :summary="productDetail.description"
            :good="productDetail.advantage"
            :bad="productDetail.disadvantage"
          />
        </ProductSummaryCard>

        <!-- 상품 정보 -->
        <ProductInfo :productDetail="productDetail" />

        <!-- 수익 계산기 -->
        <ProfitCalculator
          :productDetail="productDetail"
          :maxAmount="100000000"
        />

        <!-- 설문 컴포넌트 (추천에서 온 경우에만 표시) -->
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
