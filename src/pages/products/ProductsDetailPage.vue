<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProductDetail, addScrap, delScrap } from '@/api/product-detail';

import ProductHeader from '@/components/products/ProductHeader.vue';
import ProductSummaryCard from '@/components/products/ProductSummaryCard.vue';
import ProductAISummary from '@/components/products/ProductAISummary.vue';
import ProductInfo from '@/components/products/ProductInfo.vue';
import ProfitCalculator from '@/components/products/ProfitCalculator.vue';

const productDetail = ref(null);
const isLoading = ref(true);
const error = ref(null);
const renewDate = '25.06.20';
const isScrolled = ref(false);

const route = useRoute();

const navigateToLink = () => {
  window.open(productDetail.value.regLink, '_blank');
};

const handleAddScrap = productId => {
  addScrap(productId);
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(async () => {
  try {
    // 라우트에서 productId 가져오기
    const productId = route.params.productId;
    const response = await getProductDetail(productId);
    productDetail.value = response.data;
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
    <div v-if="isLoading" class="loading-message">
      <p>상품 상세 정보를 불러오는 중...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
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
      <div class="space-y-4 py-8">
        <!-- 상품 주요 정보 카드 -->
        <ProductSummaryCard :productDetail="productDetail" />

        <!-- AI 한 줄 요약 -->
        <ProductAISummary :productDetail="productDetail" />

        <AISummaryCard
          summary="AI 한 줄 요약"
          :good="productDetail.advantage"
          :bad="productDetail.disadvantage"
        />

        <!-- 상품 정보 -->
        <ProductInfo :productDetail="productDetail" />

        <!-- 수익 계산기 -->
        <ProfitCalculator
          :productDetail="productDetail"
          :maxAmount="100000000"
        />
      </div>
    </div>
    <div v-else class="no-data-message">
      <p>상품 정보가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped></style>
