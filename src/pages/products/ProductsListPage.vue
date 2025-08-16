<template>
  <div class="flex items-start mr-[10.8%] tablet:mr-5">
    <ProductFilter
      class="flex-shrink-0 w-64 wide:w-80 transition-all duration-300"
      :initialFilters="currentFilters"
      :isOpen="isFilterOpen"
      @filtersChanged="handleFilterChange"
      @close="isFilterOpen = false"
    />
    <div class="flex-1 py-5 pl-5 h-screen overflow-y-auto">
      <div class="flex justify-between items-start mb-6 gap-4">
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
          <h2 class="title02 text-fg-primary">상품 목록</h2>
        </div>

        <ProductSort
          class="mt-6"
          :modelValue="currentSort"
          @update:sort="handleSortChange"
        />
      </div>

      <div v-if="searchQuery" class="mb-4 text-gray-600">
        <span class="font-bold">"{{ searchQuery }}"</span>에 대한 검색
        결과입니다.
      </div>

      <LoadingPage v-if="loading" />

      <div v-else-if="error" class="text-center py-10 text-red-600">
        <p>{{ error }}</p>
        <button
          @click="fetchProducts"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>

      <div
        v-else-if="products.length === 0"
        class="text-body02 text-gray-600 text-center py-10"
      >
        <p v-if="searchQuery">검색 결과가 없습니다.</p>
        <p v-else>해당 조건에 맞는 상품이 없습니다.</p>
      </div>

      <div v-else class="space-y-0">
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
import LoadingPage from '../common/LoadingPage.vue';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(false);
const error = ref(null);
const scrapedProductIds = ref(new Set());
const searchQuery = ref('');
const isScrapLoading = ref(false);
const isFilterOpen = ref(false);

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
    if (searchQuery.value) params.append('keyword', searchQuery.value);
    if (currentFilters.value.types.length > 0)
      params.append('types', currentFilters.value.types.join(','));
    if (currentFilters.value.fSectors.length > 0)
      params.append('fSectors', currentFilters.value.fSectors.join(','));
    if (currentFilters.value.saveTerm !== null)
      params.append('saveTerm', currentFilters.value.saveTerm);
    if (currentFilters.value.minAmount !== null)
      params.append('minAmount', currentFilters.value.minAmount);
    if (currentSort.value) params.append('sort', currentSort.value);

    const apiUrl = `https://54.175.115.255:8080/backend-1.0-SNAPSHOT/api/products?${params.toString()}`;
    // const apiUrl = `http://localhost:8080/api/products?${params.toString()}`;
    const [productsResponse, scrapedIdsResponse] = await Promise.all([
      api.get(apiUrl),
      getScrapedProductIds(),
    ]);
    products.value = productsResponse.data;
    scrapedProductIds.value = new Set(scrapedIdsResponse);
  } catch (error) {
    error.value = '상품 목록을 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

const handleFilterChange = filters => {
  router.push({
    query: {
      ...route.query,
      types: filters.types?.length > 0 ? filters.types.join(',') : undefined,
      fSectors:
        filters.fSectors?.length > 0 ? filters.fSectors.join(',') : undefined,
      saveTerm: filters.saveTerm !== null ? filters.saveTerm : undefined,
      minAmount: filters.minAmount !== null ? filters.minAmount : undefined,
    },
  });
};

const handleSortChange = sort => {
  router.push({ query: { ...route.query, sort } });
};

const handleToggleLike = async ({ productId, isLiked }) => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  if (isScrapLoading.value) return;

  if (isLiked) scrapedProductIds.value.delete(productId);
  else scrapedProductIds.value.add(productId);

  isScrapLoading.value = true;
  try {
    if (isLiked) await delScrap(productId);
    else await addScrap(productId);
  } catch {
    if (isLiked) scrapedProductIds.value.add(productId);
    else scrapedProductIds.value.delete(productId);
  } finally {
    isScrapLoading.value = false;
  }
};

const handleProductClick = product => {
  if (product?.productId) {
    router.push({
      name: 'products-detail',
      params: { productId: product.productId },
    });
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
</script>
