<template>
  <div class="flex items-start">
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
      <h2 class="text-body01 font-bold mb-6 text-gray-800">상품 목록</h2>

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

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(false);
const error = ref(null);
const scrapedProductIds = ref(new Set());
const searchQuery = ref('');
const isScrapLoading = ref(false);

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

    const apiUrl = `http://localhost:8080/api/products?${params.toString()}`;
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
