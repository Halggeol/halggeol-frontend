<template>
  <div class="flex">
    <ProductFilter @update:filters="handleFilterChange" />

    <div class="flex-1 p-5">
      <div class="flex justify-end mb-4">
        <ProductSort v-model:sort="currentSort" />
      </div>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">상품 목록</h2>
      <div
        v-if="filteredProducts.length === 0"
        class="text-gray-600 text-center py-10"
      >
        해당 조건에 맞는 상품이 없습니다.
      </div>
      <div v-else class="space-y-4">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import ProductSort from '@/components/products/ProductSort.vue';

// 예시 mock 데이터 (이전과 동일)
const allProducts = ref([
  {
    id: 1,
    company: '국민은행',
    name: 'KB Star 정기예금',
    tags: ['정기예금', '인기'],
    rate: 3.55,
    prime_rate: 3.6,
    product_type: 'deposit',
    bank_code: 'KB',
    min_period: 12,
    max_period: 36,
    min_amount: 1000000,
  },
  {
    id: 2,
    company: '신한은행',
    name: '신한 안심예금',
    tags: ['예금', '추천'],
    rate: 3.2,
    prime_rate: 3.5,
    product_type: 'deposit',
    bank_code: 'Shinhan',
    min_period: 6,
    max_period: 24,
    min_amount: 500000,
  },
  {
    id: 3,
    company: '우리은행',
    name: '우리 SUPER 정기적금',
    tags: ['정기적금', '고금리'],
    rate: 4.1,
    prime_rate: 4.3,
    product_type: 'savings',
    bank_code: 'Woori',
    min_period: 6,
    max_period: 12,
    min_amount: 100000,
  },
  {
    id: 4,
    company: '국민은행',
    name: 'KB Smart 적금',
    tags: ['적금', '모바일'],
    rate: 3.8,
    prime_rate: 4.0,
    product_type: 'savings',
    bank_code: 'KB',
    min_period: 12,
    max_period: 60,
    min_amount: 50000,
  },
]);

const currentFilters = ref({
  productTypes: [],
  banks: [],
  subscriptionPeriods: [],
  subscriptionAmount: 0,
  minAmount: 0,
  maxAmount: 100000000,
});

const currentSort = ref('popularDesc');

const handleFilterChange = filters => {
  currentFilters.value = filters;
  console.log('Parent received filters:', filters);
};

const filteredProducts = computed(() => {
  let productsToFilter = allProducts.value;
  const filters = currentFilters.value;

  if (
    filters.productTypes &&
    filters.productTypes.length > 0 &&
    !filters.productTypes.includes('all')
  ) {
    productsToFilter = productsToFilter.filter(product =>
      filters.productTypes.includes(product.product_type)
    );
  }

  if (
    filters.banks &&
    filters.banks.length > 0 &&
    !filters.banks.includes('all')
  ) {
    productsToFilter = productsToFilter.filter(product =>
      filters.banks.includes(product.bank_code)
    );
  }

  if (
    filters.subscriptionPeriods &&
    filters.subscriptionPeriods.length > 0 &&
    !filters.subscriptionPeriods.includes('all')
  ) {
    productsToFilter = productsToFilter.filter(product => {
      return filters.subscriptionPeriods.some(period => {
        const selectedPeriodInMonths = parseInt(period.replace('M', ''));
        return (
          product.min_period <= selectedPeriodInMonths &&
          product.max_period >= selectedPeriodInMonths
        );
      });
    });
  }

  if (filters.minAmount !== undefined && filters.maxAmount !== undefined) {
    productsToFilter = productsToFilter.filter(
      product =>
        product.min_amount >= filters.minAmount &&
        product.min_amount <= filters.maxAmount
    );
  }

  // 정렬
  switch (currentSort.value) {
    case 'rateDesc':
      productsToFilter = productsToFilter
        .slice()
        .sort((a, b) => b.rate - a.rate);
      break;
    case 'rateAsc':
      productsToFilter = productsToFilter
        .slice()
        .sort((a, b) => a.rate - b.rate);
      break;
    case 'popularDesc':
      productsToFilter = productsToFilter
        .slice()
        .sort((a, b) => (b.viewCnt || 0) - (a.viewCnt || 0));
      break;
  }

  return productsToFilter;
});
</script>

<style scoped>
/* 이전과 동일하게, Tailwind CSS 사용 시 이 곳은 거의 비어있습니다. */
</style>
