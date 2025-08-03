<template>
  <div class="flex">
    <ProductFilter @filtersChanged="handleFilterChange" />

    <div class="flex-1 p-5">
      <div class="flex justify-end mb-4">
        <ProductSort @update:sort="handleSortChange" />
      </div>
      <h2 class="text-2xl font-bold mb-6 text-gray-800">상품 목록</h2>

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
        해당 조건에 맞는 상품이 없습니다.
      </div>

      <div v-else class="space-y-4">
        <ProductCard
          v-for="product in products"
          :key="product.productId"
          :product="product"
          :isLiked="scrapedProductIds.has(product.productId)"
          @toggle-like="handleToggleLike"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductCard from '@/components/products/ProductCard.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import ProductSort from '@/components/products/ProductSort.vue';

// 목업 데이터
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

// 상태 관리
const products = ref([]);
const loading = ref(false);
const error = ref(null);
const scrapedProductIds = ref(new Set());

// 현재 필터와 정렬 상태
const currentFilters = ref({
  productTypes: ['all'],
  fSectors: null,
  saveTerm: null,
  minAmount: null,
});
const currentSort = ref('popularDesc');

// API 호출 함수를 목업 데이터 필터링/정렬 함수로 대체
const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  // 비동기 처리를 흉내내기 위해 잠시 대기
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredProducts = [...mockProducts];

  // 1. 필터링 로직
  // 상품 유형 필터링
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

  // 금융권 필터링
  const selectedFSectors = currentFilters.value.fSectors;
  if (selectedFSectors && selectedFSectors.length > 0) {
    filteredProducts = filteredProducts.filter(p =>
      selectedFSectors.includes(p.fSector)
    );
  }

  // 가입 기간 필터링
  const selectedTerm = currentFilters.value.saveTerm;
  if (selectedTerm !== null) {
    filteredProducts = filteredProducts.filter(p => {
      // saveTerm이 있는 경우
      if (p.saveTerm !== null) {
        return p.saveTerm === selectedTerm;
      }
      // 기간 범위가 있는 경우
      if (p.min_save_term !== null && p.max_save_term !== null) {
        return (
          selectedTerm >= p.min_save_term && selectedTerm <= p.max_save_term
        );
      }
      // 최소 기간만 있는 경우
      if (p.min_save_term !== null) {
        return selectedTerm >= p.min_save_term;
      }
      return false; // 필터링 조건에 맞지 않으면 제외
    });
  }

  // 최소 가입 금액 필터링
  const selectedAmount = currentFilters.value.minAmount;
  if (selectedAmount !== null) {
    filteredProducts = filteredProducts.filter(p => {
      return p.minAmount !== null && p.minAmount >= selectedAmount;
    });
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
  currentFilters.value = filters;
  fetchProducts();
};

// 정렬 변경 핸들러
const handleSortChange = sort => {
  console.log('Sort changed:', sort);
  currentSort.value = sort;
  fetchProducts();
};

// 찜하기/찜 해제 핸들러
const handleToggleLike = ({ productId, isLiked }) => {
  if (isLiked) {
    console.log(`찜 해제 요청: productId ${productId}`);
    scrapedProductIds.value.delete(productId);
  } else {
    console.log(`찜하기 요청: productId ${productId}`);
    scrapedProductIds.value.add(productId);
  }
};

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  fetchProducts();
});

// 외부에서 사용할 수 있도록 expose (필요한 경우)
defineExpose({
  fetchProducts,
});
</script>

<style scoped>
/* Tailwind CSS 사용 시 추가 스타일은 최소화 */
</style>
