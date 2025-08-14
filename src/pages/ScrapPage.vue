<template>
  <div class="flex items-start">
    <ScrapFilter
      @filtersChanged="handleFilterChange"
      :initialFilters="currentFilters"
    />

    <div class="flex-1 p-5 h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-body01 font-bold text-gray-800">관심 상품 목록</h2>
        <ProductSort
          :modelValue="currentSort"
          @update:sort="handleSortChange"
        />
      </div>

      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-4 text-gray-600">관심 상품을 불러오는 중...</p>
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
        등록된 관심 상품이 없습니다.
      </div>

      <div
        v-else-if="filteredProducts.length === 0"
        class="text-gray-600 text-center py-10"
      >
        선택하신 필터에 맞는 상품이 없습니다.
      </div>

      <ScrapSection
        v-else
        :key="currentSort"
        :scrapedProducts="filteredProducts"
        :selectedFilters="currentFilters"
        @toggle-like="handleToggleLike"
        @product-click="handleProductClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import ProductSort from '@/components/products/ProductSort.vue';
import ScrapFilter from '@/components/scrap/ScrapFilter.vue';
import ScrapSection from '@/components/scrap/ScrapSection.vue';
import { useRoute, useRouter } from 'vue-router';
import { delScrap } from '@/api/product-detail';
import api from '@/api';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(false);
const error = ref(null);

// 필터 상태를 URL에서 관리
const currentFilters = ref({
  types: [], // 빈 배열로 초기화
});
const currentSort = ref('popularDesc');
const isScrapLoading = ref(false);

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const params = {
      types:
        currentFilters.value.types.length > 0
          ? currentFilters.value.types.join(',')
          : undefined,
      sort: currentSort.value,
    };

    console.log('API 호출 파라미터:', params);

    const response = await api.get('/api/scrap', { params });
    console.log('API 응답 데이터:', response.data);
    products.value = response.data;
  } catch (err) {
    error.value = '관심 상품 목록을 불러오는 데 실패했습니다.';
    console.error('API 호출 중 오류 발생:', err);
  } finally {
    loading.value = false;
  }
};

// 필터 변경 핸들러
const handleFilterChange = filters => {
  console.log('Filters changed:', filters);
  // ScrapFilter에서 보낸 filters 객체의 types 배열이 비어있으면 undefined로 설정하여 URL에서 제거
  router.push({
    query: {
      ...route.query,
      types: filters.types?.length > 0 ? filters.types.join(',') : undefined,
    },
  });
};

const filteredProducts = computed(() => {
  const selectedTypes = currentFilters.value.types;

  // 선택된 필터가 없으면 전체 상품 목록을 반환합니다.
  if (!selectedTypes || selectedTypes.length === 0) {
    return products.value;
  }

  // 선택된 필터가 있으면, 해당 'type'을 가진 상품만 필터링합니다.
  return products.value.filter(product =>
    // product 객체의 상품 유형 속성 이름이 'type'이라고 가정합니다.
    // 만약 다른 이름(예: productType)이라면 이 부분을 수정해야 합니다.
    selectedTypes.includes(product.type)
  );
});

const handleSortChange = sort => {
  console.log('Sort changed:', sort);
  router.push({
    query: {
      ...route.query,
      sort: sort,
    },
  });
};

// 찜 해제 핸들러 (스크랩 페이지이므로 해제만 가능)
const handleToggleLike = async ({ productId, isLiked }) => {
  if (isScrapLoading.value || !isLiked) return;
  console.log('찜 해제 요청: productId', productId);
  isScrapLoading.value = true;

  // 1. (롤백 대비) 롤백에 사용할 원래 상품과 그 위치(인덱스)를 미리 저장
  const originalProducts = [...products.value];
  const productIndex = originalProducts.findIndex(
    p => p.productId === productId
  );

  // 해당 상품이 목록에 없으면 아무것도 하지 않습니다.
  if (productIndex === -1) {
    isScrapLoading.value = false;
    return;
  }
  const productToRestore = originalProducts[productIndex];

  // 2. (낙관적 업데이트) UI에서 해당 상품을 즉시 제거
  products.value = products.value.filter(p => p.productId !== productId);

  try {
    // 3. 백그라운드에서 실제 '찜 해제' API를 호출
    await delScrap(productId);
    console.log('찜 해제 완료');
  } catch (error) {
    console.error('찜 해제 실패:', error);
    alert('찜 해제 중 오류가 발생했습니다.');

    // 4. (롤백) API 요청이 실패하면, 제거했던 상품을 원래 위치에 다시 삽입
    products.value.splice(productIndex, 0, productToRestore);
  } finally {
    isScrapLoading.value = false;
  }
};

const handleProductClick = product => {
  console.log('Product clicked:', product);
  // 라우터의 파라미터 이름인 'productId'와 일치하도록 수정
  router.push({
    name: 'products-detail',
    params: { productId: product.productId },
  });
};

// URL 쿼리 변경을 감지하여 상태 업데이트 및 API 재호출
watch(
  () => route.query,
  newQuery => {
    currentFilters.value = {
      types: newQuery.types ? newQuery.types.split(',') : [],
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
