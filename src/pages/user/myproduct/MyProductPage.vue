<template>
  <div class="flex">
    <MyProductFilter @update:filters="handleFilterChange" />

    <div class="flex-1 p-5">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">가입한 상품</h2>
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
import { ref, computed, onMounted } from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import MyProductFilter from '@/components/products/MyProductFilter.vue';
import { getUserProducts } from '@/api/user';

// 사용자 가입 상품 데이터
const myProducts = ref([]);

const currentFilters = ref({
  productTypes: [],
});

// API에서 사용자 가입 상품 조회
const fetchMyProducts = async () => {
  try {
    // const response = await getUserProducts();
    // myProducts.value = response.data;

    myProducts.value = [
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
    ];
  } catch (error) {
    console.error('가입 상품 조회 실패:', error);
  }
};

const handleFilterChange = filters => {
  currentFilters.value = filters;
  console.log('MyProduct filters:', filters);
};

const filteredProducts = computed(() => {
  let productsToFilter = myProducts.value;
  const filters = currentFilters.value;

  // 상품 유형 필터링만 적용
  if (
    filters.productTypes &&
    filters.productTypes.length > 0 &&
    !filters.productTypes.includes('all')
  ) {
    productsToFilter = productsToFilter.filter(product =>
      filters.productTypes.includes(product.product_type)
    );
  }

  return productsToFilter;
});

onMounted(() => {
  fetchMyProducts();
});
</script>

<style scoped>
/* Tailwind CSS 사용 */
</style>
