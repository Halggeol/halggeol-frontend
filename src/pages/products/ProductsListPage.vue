<template>
  <div class="flex">
    <ProductFilter @filtersChanged="handleFilterChange" />

    <div class="flex-1 p-5">
      <div class="flex justify-end mb-4">
        <ProductSort @update:sort="handleSortChange" />
      </div>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">상품 목록</h2>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-4 text-gray-600">상품을 불러오는 중...</p>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="text-center py-10 text-red-600">
        <p>{{ error }}</p>
        <button
          @click="fetchProducts"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          다시 시도
        </button>
      </div>

      <!-- 상품이 없을 때 -->
      <div
        v-else-if="products.length === 0"
        class="text-gray-600 text-center py-10"
      >
        해당 조건에 맞는 상품이 없습니다.
      </div>

      <!-- 상품 목록 -->
      <div v-else class="space-y-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import ProductSort from '@/components/products/ProductSort.vue';

// 상태 관리
const products = ref([]);
const loading = ref(false);
const error = ref(null);

// 현재 필터와 정렬 상태
const currentFilters = ref({
  types: null,
  fSectors: null,
  saveTerm: null,
  minAmount: null,
});
const currentSort = ref('popularDesc');
const currentKeyword = ref(null);

// API 호출 함수
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams();

    // 정렬
    if (currentSort.value) {
      params.append('sort', currentSort.value);
    }

    // 키워드 (검색 기능이 있다면)
    if (currentKeyword.value) {
      params.append('keyword', currentKeyword.value);
    }

    // 필터 파라미터들
    if (currentFilters.value.types && currentFilters.value.types.length > 0) {
      currentFilters.value.types.forEach(type => {
        params.append('types', type);
      });
    }

    if (
      currentFilters.value.fSectors &&
      currentFilters.value.fSectors.length > 0
    ) {
      currentFilters.value.fSectors.forEach(sector => {
        params.append('fSectors', sector);
      });
    }

    if (currentFilters.value.saveTerm) {
      params.append('saveTerm', currentFilters.value.saveTerm);
    }

    if (currentFilters.value.minAmount) {
      params.append('minAmount', currentFilters.value.minAmount);
    }

    // API 호출
    const response = await fetch(`/api/products?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    products.value = data;
  } catch (err) {
    console.error('Failed to fetch products:', err);
    error.value = '상품을 불러오는데 실패했습니다. 다시 시도해주세요.';
  } finally {
    loading.value = false;
  }
};

// 필터 변경 핸들러
const handleFilterChange = filters => {
  console.log('Filters changed:', filters);
  currentFilters.value = { ...filters };
  fetchProducts();
};

// 정렬 변경 핸들러
const handleSortChange = sort => {
  console.log('Sort changed:', sort);
  currentSort.value = sort;
  fetchProducts();
};

// 검색 핸들러 (검색 기능이 있다면)
const handleSearch = keyword => {
  console.log('Search keyword:', keyword);
  currentKeyword.value = keyword;
  fetchProducts();
};

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  fetchProducts();
});

// 외부에서 사용할 수 있도록 expose (필요한 경우)
defineExpose({
  fetchProducts,
  handleSearch,
});
</script>

<style scoped>
/* Tailwind CSS 사용 시 추가 스타일은 최소화 */
</style>
