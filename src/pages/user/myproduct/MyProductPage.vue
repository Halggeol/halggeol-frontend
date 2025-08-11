<template>
  <div class="flex">
    <MyProductFilter @update:filters="handleFilterChange" />

    <div class="flex-1 p-5">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">가입한 상품</h2>

      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-4 text-gray-600">상품을 불러오는 중...</p>
      </div>

      <div v-else-if="error" class="text-center py-10 text-red-600">
        <p>{{ error }}</p>
        <button
          @click="fetchMyProducts"
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          다시 시도
        </button>
      </div>

      <div
        v-else-if="filteredProducts.length === 0"
        class="text-gray-600 text-center py-10"
      >
        해당 조건에 맞는 상품이 없습니다.
      </div>

      <div v-else class="space-y-4">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          :isLiked="product.isScraped"
          @toggle-like="handleToggleScrap"
          @click="goToDetail(product.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import MyProductFilter from '@/components/products/MyProductFilter.vue';
import { getUserProductsList } from '@/api/list';
import { addScrap, delScrap } from '@/api/product-detail';
import { useRouter } from 'vue-router';

const router = useRouter();

const myProducts = ref([]);
const loading = ref(false);
const error = ref(null);

const currentFilters = ref({
  productTypes: [],
});

const fetchMyProducts = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await getUserProductsList();

    myProducts.value = response.data.map(product => ({
      id: product.productId,
      productId: product.productId,
      company: product.company,
      name: product.name,
      tag2: product.tag2,
      tag3: product.tag3,
      title: product.title,
      subTitle:
        product.productId[0].toUpperCase() === 'pension' ||
        product.productId[0].toUpperCase() === 'fund'
          ? null
          : product.subTitle,
      amount: product.amount,
      type: getProductType(product),
      product_type: getProductType(product),
      isScraped: product.isScraped,
    }));

    loading.value = false;
  } catch (error) {
    console.error('가입 상품 조회 실패:', error);
    error.value = '상품을 불러오는 중 오류가 발생했습니다.';
    loading.value = false;
  }
};

function goToDetail(productId) {
  router.push(`/products/detail/${productId}`);
}

const getProductType = product => {
  if (
    !product.productId ||
    typeof product.productId !== 'string' ||
    product.productId.length === 0
  ) {
    return 'deposit';
  }

  const prefix = product.productId[0].toUpperCase();
  const typeMap = {
    D: 'deposit',
    S: 'savings',
    A: 'pension',
    C: 'pension',
    F: 'fund',
    X: 'forex',
  };

  return typeMap[prefix];
};

const handleFilterChange = filters => {
  currentFilters.value = filters;
  console.log('MyProduct filters:', filters);
};

const handleToggleScrap = async ({ productId, isLiked }) => {
  const productIndex = myProducts.value.findIndex(
    p => p.productId === productId
  );
  if (productIndex === -1) return;

  const productToUpdate = myProducts.value[productIndex];
  const originalIsScraped = productToUpdate.isScraped;

  try {
    productToUpdate.isScraped = !isLiked;

    if (isLiked) {
      console.log(`스크랩 해제 요청: productId ${productId}`);
      await delScrap(productId);
    } else {
      console.log(`스크랩 요청: productId ${productId}`);
      await addScrap(productId);
    }
  } catch (e) {
    console.error('스크랩 처리 실패:', e);
    alert('스크랩 처리 중 오류가 발생했습니다.');
    productToUpdate.isScraped = originalIsScraped;
  }
};

const filteredProducts = computed(() => {
  let productsToFilter = [...myProducts.value];
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

  return productsToFilter;
});

onMounted(() => {
  fetchMyProducts();
});

defineExpose({
  fetchMyProducts,
});
</script>

<style scoped>
/* Tailwind CSS 사용 */
</style>
