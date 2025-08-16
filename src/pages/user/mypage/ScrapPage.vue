<template>
  <div class="flex items-start mr-[10.8%] tablet:mr-5">
    <MyProductFilter
      @filtersChanged="handleFilterChange"
      :initialFilters="currentFilters"
      :isOpen="isFilterOpen"
      @close="isFilterOpen = false"
    />

    <div class="flex-1 py-5 pl-5 h-screen overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-4">
          <!-- 모바일/태블릿용 필터 열기 버튼 -->
          <button
            @click="isFilterOpen = true"
            class="hidden tablet:block p-2 border rounded-md hover:bg-gray-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-seed-icon="true"
              data-seed-icon-version="0.0.23"
              width="18"
              height="18"
            >
              <g>
                <g>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.99331 7.24609H3C2.44772 7.24609 2 6.79838 2 6.24609C2 5.69381 2.44772 5.24609 3 5.24609H9.99331C10.443 3.38141 12.1222 1.99609 14.125 1.99609C16.1278 1.99609 17.807 3.38141 18.2567 5.24609H21C21.5523 5.24609 22 5.69381 22 6.24609C22 6.79838 21.5523 7.24609 21 7.24609H18.2567C17.807 9.11078 16.1278 10.4961 14.125 10.4961C12.1222 10.4961 10.443 9.11078 9.99331 7.24609ZM11.875 6.24609C11.875 5.00345 12.8824 3.99609 14.125 3.99609C15.3676 3.99609 16.375 5.00345 16.375 6.24609C16.375 7.48873 15.3676 8.49609 14.125 8.49609C12.8824 8.49609 11.875 7.48873 11.875 6.24609Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.25 13.4956C3.90279 13.4956 2 15.3984 2 17.7456C2 20.0928 3.90279 21.9956 6.25 21.9956C8.25016 21.9956 9.92761 20.6139 10.3799 18.7529L20.9996 18.7456C21.5518 18.7452 21.9993 18.2972 21.9989 17.7449C21.9985 17.1926 21.5505 16.7452 20.9982 16.7456L10.3834 16.7529C9.93635 14.8845 8.25537 13.4956 6.25 13.4956ZM4 17.7456C4 16.503 5.00736 15.4956 6.25 15.4956C7.49264 15.4956 8.5 16.503 8.5 17.7456C8.5 18.9882 7.49264 19.9956 6.25 19.9956C5.00736 19.9956 4 18.9882 4 17.7456Z"
                    fill="currentColor"
                  ></path>
                </g>
              </g>
            </svg>
          </button>
          <h2 class="title02 text-fg-primary">관심 상품 목록</h2>
        </div>
        <ProductSort
          :modelValue="currentSort"
          @update:sort="handleSortChange"
        />
      </div>

      <LoadingPage v-if="loading" />

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
// import ScrapFilter from '@/components/scrap/ScrapFilter.vue';
import ScrapSection from '@/components/scrap/ScrapSection.vue';
import { useRoute, useRouter } from 'vue-router';
import { delScrap } from '@/api/product-detail';
import api from '@/api';
import MyProductFilter from '@/components/products/MyProductFilter.vue';
import LoadingPage from '@/pages/common/LoadingPage.vue';

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
const isFilterOpen = ref(false);

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
