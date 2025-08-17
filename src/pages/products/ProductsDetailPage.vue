<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  getProductDetail,
  addScrap,
  // delScrap,
  checkRecommendProductStatus,
  analyzeProductWithGemini,
} from '@/api/product-detail';
import { useNavigationStore } from '@/stores/navigationStore';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

import ProductHeader from '@/components/products/ProductHeader.vue';
import ProductSummaryCard from '@/components/products/ProductSummaryCard.vue';
import ProductInfo from '@/components/products/ProductInfo.vue';
import ProfitCalculator from '@/components/products/ProfitCalculator.vue';
import AISummaryCard from '@/components/common/AISummaryCard.vue';
import ProductSurveyCard from '@/components/products/ProductSurveyCard.vue';
import LoadingPage from '../common/LoadingPage.vue';

const productDetail = ref(null);
const isLoading = ref(true);
const error = ref(null);
const renewDate = '25.06.20';
const isScrolled = ref(false);
const isDesktop = ref(true);

const route = useRoute();
const navigationStore = useNavigationStore();

// 상품 상태 확인
const productStatus = ref(null);
// const isStatusLoading = ref(false);

const geminiData = ref({ advantage: null, disadvantage: null });
const isGeminiLoading = ref(false);
const geminiError = ref(null);

const navigateToLink = () => {
  window.open(productDetail.value.regLink, '_blank');
};

const handleAddScrap = productId => {
  addScrap(productId);
};

const handleSurveyCompleted = newStatus => {
  productStatus.value = newStatus;
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

const checkScreenSize = () => {
  const wasDesktop = isDesktop.value;
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value && !wasDesktop) {
    // Resized from mobile to desktop
    window.addEventListener('scroll', handleScroll);
  } else if (!isDesktop.value && wasDesktop) {
    // Resized from desktop to mobile
    window.removeEventListener('scroll', handleScroll);
    isScrolled.value = false; // Reset scroll state on mobile
  }
};

const fetchGeminiData = async product => {
  isGeminiLoading.value = true;
  geminiError.value = null;
  try {
    const geminiResponse = await analyzeProductWithGemini(product);
    geminiData.value.advantage = geminiResponse.advantage;
    geminiData.value.disadvantage = geminiResponse.disadvantage;
    if (geminiResponse.description) {
      productDetail.value.description = geminiResponse.description;
    }
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

    if (
      !productDetail.value.description ||
      !productDetail.value.advantage ||
      !productDetail.value.disadvantage
    ) {
      await fetchGeminiData(productDetail.value);
    }
  } catch (err) {
    error.value = '상품 상세 정보를 불러오는데 실패했습니다: ' + err.message;
    console.error(err);
    isLoading.value = false;
  }

  // Screen size and scroll handling
  checkScreenSize(); // Initial check
  if (isDesktop.value) {
    window.addEventListener('scroll', handleScroll);
  }
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  navigationStore.resetNavigation();
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="product-detail-page">
    <LoadingPage v-if="isLoading" :loading-text="'상품 불러오는 중'" />
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
        :isScrollEffectEnabled="isDesktop"
        @addScrap="handleAddScrap"
        @navigate="navigateToLink"
      />

      <div class="tablet:px-5 px-[10.8%] py-20">
        <ProductSummaryCard :productDetail="productDetail">
          <AISummaryCard
            v-if="authStore.isLoggedIn"
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
          @survey-completed="handleSurveyCompleted"
        />
      </div>
    </div>
    <div v-else class="no-data-message">
      <p>상품 정보가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped></style>
