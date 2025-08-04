<template>
  <div class="flex">
    <ProductFilter @filtersChanged="handleFilterChange" />

    <div class="flex-1 p-5">
      <div class="flex justify-end mb-4">
        <ProductSort @update:sort="handleSortChange" />
      </div>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">상품 목록</h2>

      <div v-if="searchQuery" class="mb-4 text-gray-600">
        <span class="font-bold">"{{ searchQuery }}"</span>에 대한 검색
        결과입니다.
      </div>

      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-4 text-gray-600">상품을 불러오는 중...</p>
      </div>

      <div v-else-if="error" class="text-center py-10 text-red-600">
        <p>{{ error }}</p>
        <button
          @click="fetchProducts"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          다시 시도
        </button>
      </div>

      <div
        v-else-if="products.length === 0"
        class="text-gray-600 text-center py-10"
      >
        <p v-if="searchQuery">검색 결과가 없습니다.</p>
        <p v-else>해당 조건에 맞는 상품이 없습니다.</p>
      </div>
      <div v-else class="space-y-4">
        <ProductCard
          v-for="product in products"
          :key="product.productId"
          :product="product"
          :isLiked="scrapedProductIds.has(product.productId)"
          @toggle-like="handleToggleLike"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import ProductSort from '@/components/products/ProductSort.vue';
import { useRoute, useRouter } from 'vue-router'; // useRouter 추가
import { addScrap, delScrap } from '@/api/product-detail';

const route = useRoute();
const router = useRouter(); // useRouter 사용

// 상태 관리
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const scrapedProductIds = ref(new Set());
const searchQuery = ref('');
const isScrapLoading = ref(false);

// 현재 필터와 정렬 상태
const currentFilters = ref({
  types: ['all'],
  fSectors: null,
  saveTerm: null,
  minAmount: null,
});
const currentSort = ref('popularDesc');

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const params = new URLSearchParams();

    if (searchQuery.value) {
      params.append('keyword', searchQuery.value);
    }

    if (
      currentFilters.value.types &&
      !currentFilters.value.types.includes('all')
    ) {
      params.append('types', currentFilters.value.types.join(','));
    }
    if (
      currentFilters.value.fSectors &&
      currentFilters.value.fSectors.length > 0
    ) {
      params.append('fSectors', currentFilters.value.fSectors.join(','));
    }
    if (currentFilters.value.saveTerm !== null) {
      params.append('saveTerm', currentFilters.value.saveTerm);
    }
    if (currentFilters.value.minAmount !== null) {
      params.append('minAmount', currentFilters.value.minAmount);
    }

    if (currentSort.value) {
      params.append('sort', currentSort.value);
    }

    const apiUrl = `http://localhost:8080/api/products?${params.toString()}`;

    console.log('API 호출:', apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `네트워크 오류가 발생했습니다. 상태 코드: ${response.status}`
      );
    }

    const data = await response.json();
    products.value = data;
  } catch (err) {
    error.value = '상품 목록을 불러오는 데 실패했습니다.';
    console.error('API 호출 중 오류 발생:', err);
  } finally {
    loading.value = false;
  }
};

// 필터 변경 핸들러
const handleFilterChange = filters => {
  console.log('Filters changed:', filters);
  // URL 쿼리 파라미터를 변경하여 상태를 업데이트
  router.push({
    query: {
      ...route.query, // 기존 쿼리 유지
      types:
        filters.types && !filters.types.includes('all')
          ? filters.types.join(',')
          : undefined,
      fSectors:
        filters.fSectors && filters.fSectors.length > 0
          ? filters.fSectors.join(',')
          : undefined,
      saveTerm: filters.saveTerm !== null ? filters.saveTerm : undefined,
      minAmount: filters.minAmount !== null ? filters.minAmount : undefined,
    },
  });
};

// 정렬 변경 핸들러
const handleSortChange = sort => {
  console.log('Sort changed:', sort);
  // URL 쿼리 파라미터를 변경하여 상태를 업데이트
  router.push({
    query: {
      ...route.query, // 기존 쿼리 유지
      sort: sort,
    },
  });
};

// 라우터 쿼리 변경을 감지하고, searchQuery, currentFilters, currentSort 상태 업데이트 및 API 재호출
watch(
  () => route.query,
  newQuery => {
    // URL 쿼리 파라미터에서 필터와 정렬 상태를 추출하여 상태 변수에 반영
    searchQuery.value = newQuery.keyword || '';
    currentFilters.value = {
      types: newQuery.types ? newQuery.types.split(',') : ['all'],
      fSectors: newQuery.fSectors ? newQuery.fSectors.split(',') : null,
      saveTerm: newQuery.saveTerm ? newQuery.saveTerm : null,
      minAmount: newQuery.minAmount ? newQuery.minAmount : null,
    };
    currentSort.value = newQuery.sort || 'popularDesc';

    // 상태 변경 후 API 재호출
    fetchProducts();
  },
  { deep: true, immediate: true }
);

// 찜하기/찜 해제 핸들러
const handleToggleLike = async ({ productId, isLiked }) => {
  if (isScrapLoading.value) return; // 로딩 중이면 함수 실행 중단

  console.log('버튼 클릭 - 현재 isLiked:', isLiked);
  isScrapLoading.value = true;
  try {
    if (isLiked) {
      // 이미 찜한 상태 -> 찜 해제 API 호출
      console.log('delScrap 호출');
      await delScrap(productId); // API 호출
      scrapedProductIds.value.delete(productId);
      console.log(
        '관심상품 해제 완료, scrapedProductIds:',
        scrapedProductIds.value
      );
    } else {
      // 찜하지 않은 상태 -> 찜하기 API 호출
      console.log('addScrap 호출');
      await addScrap(productId); // API 호출
      scrapedProductIds.value.add(productId);
      console.log(
        '관심상품 등록 완료, scrapedProductIds:',
        scrapedProductIds.value
      );
    }
  } catch (error) {
    console.error('관심상품 처리 실패:', error);
    alert('관심상품 처리 중 오류가 발생했습니다.');
  } finally {
    isScrapLoading.value = false;
  }
};

defineExpose({
  fetchProducts,
});
</script>

<style scoped>
/* Tailwind CSS 사용 시 추가 스타일은 최소화 */
</style>
