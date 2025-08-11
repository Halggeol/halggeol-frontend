<template>
  <div class="flex items-start">
    <!-- ProductFilter 컴포넌트에 currentFilters 상태를 Prop으로 전달 -->
    <ProductFilter
      :initialFilters="currentFilters"
      @filtersChanged="handleFilterChange"
    />

    <div class="flex-1 p-5 h-screen overflow-y-auto">
      <div class="flex justify-end mb-4">
        <ProductSort
          :modelValue="currentSort"
          @update:sort="handleSortChange"
        />
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
          @product-click="handleProductClick"
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
import { useRoute, useRouter } from 'vue-router';
import { addScrap, delScrap } from '@/api/product-detail';
import { getScrapedProductIds } from '@/api/scrap';
import api from '@/api';

const route = useRoute();
const router = useRouter();

// 상태 관리
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const scrapedProductIds = ref(new Set());
const searchQuery = ref('');
const isScrapLoading = ref(false);

// 현재 필터와 정렬 상태
const currentFilters = ref({
  types: [],
  fSectors: [],
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
    // `types`가 빈 배열이 아닐 때만 파라미터에 추가합니다.
    if (currentFilters.value.types && currentFilters.value.types.length > 0) {
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

    const [productsResponse, scrapedIdsResponse] = await Promise.all([
      api.get(apiUrl),
      getScrapedProductIds(), // 관심상품 ID 목록 요청
    ]);

    products.value = productsResponse.data;
    scrapedProductIds.value = new Set(scrapedIdsResponse);
    error.value = null;
  } catch (err) {
    error.value = '상품 목록을 불러오는 데 실패했습니다.';
    console.error('API 호출 중 오류 발생:', err);
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = filters => {
  console.log('Filters changed:', filters);
  router.push({
    query: {
      ...route.query,
      types:
        filters.types && filters.types.length > 0
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

const handleSortChange = sort => {
  console.log('Sort changed:', sort);
  router.push({
    query: {
      ...route.query,
      sort: sort,
    },
  });
};

const handleToggleLike = async ({ productId, isLiked }) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    router.push('/login'); // 로그인 페이지로 이동
    return; // 함수 실행을 여기서 중단합니다.
  }

  if (isScrapLoading.value) return;
  console.log('버튼 클릭 - 현재 isLiked:', isLiked);

  // 1. (낙관적 업데이트) UI 상태를 즉시 변경
  if (isLiked) {
    // UI에서 먼저 하트를 비움
    scrapedProductIds.value.delete(productId);
  } else {
    // UI에서 먼저 하트를 채움
    scrapedProductIds.value.add(productId);
  }

  isScrapLoading.value = true;
  try {
    // 2. 백엔드에 실제 작업을 요청
    if (isLiked) {
      console.log('delScrap 호출');
      await delScrap(productId); // 실제 찜 해제 요청
      // scrapedProductIds.value.delete(productId);
      console.log(
        '관심상품 해제 완료, scrapedProductIds:',
        scrapedProductIds.value
      );
    } else {
      console.log('addScrap 호출');
      await addScrap(productId); // 실제 찜하기 요청
      // scrapedProductIds.value.add(productId);
      console.log(
        '관심상품 등록 완료, scrapedProductIds:',
        scrapedProductIds.value
      );
    }
  } catch (error) {
    console.error('관심상품 처리 실패:', error);
    alert('관심상품 처리 중 오류가 발생했습니다.');

    // 3. (롤백) 요청 실패 시, 변경했던 UI 상태를 다시 원래대로 되돌립니다.
    if (isLiked) {
      // 비웠던 하트를 다시 채움
      scrapedProductIds.value.add(productId);
    } else {
      // 채웠던 하트를 다시 비움
      scrapedProductIds.value.delete(productId);
    }
  } finally {
    isScrapLoading.value = false;
  }
};

const handleProductClick = product => {
  console.log('Product clicked:', product);
  if (product && product.productId) {
    // 라우터의 파라미터 이름인 'productId'와 일치하도록 수정
    router.push({
      name: 'products-detail',
      params: { productId: product.productId },
    });
  } else {
    console.error('상품 ID가 누락되었습니다.');
  }
};

watch(
  () => route.query,
  newQuery => {
    searchQuery.value = newQuery.keyword || '';
    currentFilters.value = {
      types: newQuery.types ? newQuery.types.split(',') : [],
      fSectors: newQuery.fSectors
        ? newQuery.fSectors.split(',').map(Number)
        : [],
      saveTerm: newQuery.saveTerm ? Number(newQuery.saveTerm) : null,
      minAmount: newQuery.minAmount ? Number(newQuery.minAmount) : null,
    };
    currentSort.value = newQuery.sort || 'popularDesc';

    fetchProducts();
  },
  { deep: true, immediate: true }
);

defineExpose({
  fetchProducts,
});
</script>

<style scoped>
/* Tailwind CSS 사용 시 추가 스타일은 최소화 */
</style>
