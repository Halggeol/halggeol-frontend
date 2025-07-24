<script setup>
import { ref, onMounted } from 'vue';
import { getProductDetail } from '@/api/products';

const productDetail = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const productId = 'F0001';
    const userId = 1;

    const response = await getProductDetail(productId, userId);
    productDetail.value = response.data;
  } catch (err) {
    error.value = '상품 상세 정보를 불러오는데 실패했습니다: ' + err.message;
    console.error(err);
  } finally {
    isLoading.value = false;
  }
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
      <h1 class="text-3xl font-bold mb-4">
        {{ productDetail || '상품' }}
      </h1>

      <button
        @click="addScrap(productDetail.id)"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        스크랩 추가
      </button>
    </div>
    <div v-else class="no-data-message">
      <p>상품 정보가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped></style>
