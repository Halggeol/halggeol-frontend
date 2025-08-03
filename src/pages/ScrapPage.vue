<template>
  <div class="flex">
    <ScrapFilter @filtersChanged="handleFilterChange" />

    <div class="flex-1 p-5">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">스크랩 상품 목록</h2>
        <ProductSort @update:sort="handleSortChange" />
      </div>

      <div v-if="loading" class="text-center py-10">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <p class="mt-4 text-gray-600">스크랩 상품을 불러오는 중...</p>
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
        스크랩한 상품이 없습니다.
      </div>

      <ScrapSection
        v-else
        :scrapedProducts="products"
        :selectedFilters="currentFilters"
        @toggle-like="handleToggleLike"
        @product-click="handleProductClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductSort from '@/components/products/ProductSort.vue';
import ScrapFilter from '@/components/scrap/ScrapFilter.vue';
import ScrapSection from '@/components/scrap/ScrapSection.vue';

// 목 데이터는 스크립트 블록 최상단에 정의
const mockProducts = [
  {
    productId: 1,
    type: 'deposit',
    name: 'KB Star 정기예금',
    company: 'KB국민은행',
    tag1: 12,
    tag2: 36,
    tag3: null,
    fSector: 1,
    minAmount: 100000,
    saveTerm: null,
    min_save_term: 12,
    max_save_term: 36,
    viewCnt: 150,
    scrapCnt: 50,
    title: '3.55',
    subTitle: '2.50',
  },
  {
    productId: 2,
    type: 'savings',
    name: '신한 쏠편한 적금',
    company: '신한은행',
    tag1: 6,
    tag2: 24,
    tag3: null,
    fSector: 1,
    minAmount: 50000,
    saveTerm: null,
    min_save_term: 6,
    max_save_term: 24,
    viewCnt: 200,
    scrapCnt: 70,
    title: '4.10',
    subTitle: '3.00',
  },
  {
    productId: 3,
    type: 'fund',
    name: '미래에셋 인디펜던스 펀드',
    company: '미래에셋',
    tag1: '국내주식형',
    tag2: '성장주',
    tag3: 2,
    fSector: 2,
    minAmount: 10000,
    saveTerm: 0,
    min_save_term: null,
    max_save_term: null,
    viewCnt: 300,
    scrapCnt: 90,
    title: '15.20',
    subTitle: '1개월',
  },
  {
    productId: 4,
    type: 'pension',
    name: '한화생명 e연금저축',
    company: '한화생명',
    tag1: 1,
    tag2: '연금저축',
    tag3: 4,
    fSector: 2,
    minAmount: null,
    saveTerm: 120,
    min_save_term: null,
    max_save_term: null,
    viewCnt: 80,
    scrapCnt: 30,
    title: '12.80',
    subTitle: '4.00',
  },
  {
    productId: 5,
    type: 'forex',
    name: '우리은행 환율우대',
    company: '우리은행',
    tag1: 1,
    tag2: 12,
    tag3: null,
    fSector: 1,
    minAmount: 100,
    saveTerm: null,
    min_save_term: 1,
    max_save_term: 12,
    viewCnt: 120,
    scrapCnt: 40,
    title: '1.20',
    subTitle: '주요통화 90%',
  },
  {
    productId: 6,
    type: 'deposit',
    name: '하나 정기예금',
    company: '하나은행',
    tag1: 6,
    tag2: 24,
    tag3: null,
    fSector: 1,
    minAmount: 500000,
    saveTerm: 24,
    min_save_term: null,
    max_save_term: null,
    viewCnt: 180,
    scrapCnt: 60,
    title: '3.40',
    subTitle: '2.40',
  },
  {
    productId: 7,
    type: 'savings',
    name: '카카오 자유적금',
    company: '카카오뱅크',
    tag1: 1,
    tag2: 36,
    tag3: null,
    fSector: 2,
    minAmount: 1000,
    saveTerm: 12,
    min_save_term: null,
    max_save_term: null,
    viewCnt: 500,
    scrapCnt: 150,
    title: '4.50',
    subTitle: '3.20',
  },
  {
    productId: 8,
    type: 'fund',
    name: '삼성 글로벌 주식형 펀드',
    company: '삼성증권',
    tag1: '해외주식형',
    tag2: '가치주',
    tag3: 3,
    fSector: 1,
    minAmount: 100000,
    saveTerm: 0,
    min_save_term: null,
    max_save_term: null,
    viewCnt: 250,
    scrapCnt: 80,
    title: '-5.10',
    subTitle: '1개월',
  },
];

const products = ref([]);
const loading = ref(false);
const error = ref(null);

// 필터 상태를 'productTypes'만 포함하도록 변경
const currentFilters = ref({
  productTypes: ['all'], // 'all'로 초기화하여 처음에는 전체 목록을 보여줌
});
const currentSort = ref('popularDesc');

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredProducts = [...mockProducts];

  // 1. 필터링 로직: productTypes 필터만 적용
  const selectedTypes = currentFilters.value.productTypes;
  if (
    selectedTypes &&
    selectedTypes.length > 0 &&
    !selectedTypes.includes('all')
  ) {
    filteredProducts = filteredProducts.filter(p =>
      selectedTypes.includes(p.type)
    );
  }

  // 2. 정렬 로직
  filteredProducts.sort((a, b) => {
    switch (currentSort.value) {
      case 'popularDesc':
        return b.scrapCnt - a.scrapCnt;
      case 'rateDesc':
        return parseFloat(b.title) - parseFloat(a.title);
      default:
        return 0;
    }
  });

  products.value = filteredProducts;
  loading.value = false;
};

// 필터 변경 핸들러
const handleFilterChange = filters => {
  console.log('Filters changed:', filters);
  // ScrapFilter에서 보낸 filters 객체를 그대로 사용
  currentFilters.value = filters;
  fetchProducts();
};

const handleSortChange = sort => {
  console.log('Sort changed:', sort);
  currentSort.value = sort;
  fetchProducts();
};

const handleToggleLike = ({ productId, isLiked }) => {
  // `ProductCard`에서 보낸 `isLiked` 상태가 `true`일 때,
  // 즉, 관심상품 페이지에서 하트를 눌러 찜을 해제하려는 경우
  if (isLiked) {
    console.log(`찜 해제 요청: productId ${productId}`);
    // 목 데이터에서 해당 상품 제거
    products.value = products.value.filter(p => p.productId !== productId);
    // 실제 API에서는 여기서 찜 해제 API를 호출하고,
    // 성공 시 목록을 업데이트하는 로직이 필요합니다.
  }
};

const handleProductClick = product => {
  console.log('Product clicked:', product);
};

onMounted(() => {
  fetchProducts();
});

defineExpose({
  fetchProducts,
});
</script>
