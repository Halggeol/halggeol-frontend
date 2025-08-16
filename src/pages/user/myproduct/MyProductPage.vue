<template>
  <div class="flex mr-[10.8%] tablet:mr-5">
    <MyProductFilter
      :isOpen="isFilterOpen"
      @update:filters="handleFilterChange"
      @close="isFilterOpen = false"
    />
    <div class="flex-1 py-5 pl-5">
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
      <LoadingPage v-if="loading" :loading-text="'가입한 상품 불러오는 중'" />

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
import LoadingPage from '@/pages/common/LoadingPage.vue';

const router = useRouter();

const myProducts = ref([]);
const loading = ref(false);
const error = ref(null);
const isFilterOpen = ref(false);

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
