<template>
  <div class="flex">
    <ScrapFilter @filtersChanged="handleFilterChange" />

    <div class="flex-1 p-5">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">관심 상품 목록</h2>
        <ProductSort @update:sort="handleSortChange" />
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
import { ref, watch } from 'vue';
import ProductSort from '@/components/products/ProductSort.vue';
import ScrapFilter from '@/components/scrap/ScrapFilter.vue';
import ScrapSection from '@/components/scrap/ScrapSection.vue';
import { useRoute, useRouter } from 'vue-router';
import { delScrap } from '@/api/product-detail';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(false);
const error = ref(null);

// 필터 상태를 URL에서 관리
const currentFilters = ref({
  productTypes: ['all'], // 'all'로 초기화하여 처음에는 전체 목록을 보여줌
});
const currentSort = ref('popularDesc');
const isScrapLoading = ref(false);

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;

  // localStorage에서 토큰을 가져옵니다.
  const token = localStorage.getItem('accessToken');
  if (!token) {
    error.value = '로그인이 필요합니다.';
    loading.value = false;
    // 로그인 페이지로 이동
    router.push('/login');
    return;
  }

  try {
    const params = new URLSearchParams();

    // 필터링 파라미터 (ScrapFilter에서 보낸 값)
    if (
      currentFilters.value.productTypes &&
      !currentFilters.value.productTypes.includes('all')
    ) {
      params.append(
        'productTypes',
        currentFilters.value.productTypes.join(',')
      );
    }

    // 정렬 파라미터
    if (currentSort.value) {
      params.append('sort', currentSort.value);
    }

    const apiUrl = `http://localhost:8080/api/scrap?${params.toString()}`; // 스크랩 API 엔드포인트
    console.log('API 호출:', apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`, // localStorage에서 가져온 토큰 사용
      },
    });
    //const response = await fetch(apiUrl);
    products.value = response.data;
    error.value = null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      if (err.response.status === 401) {
        error.value = '로그인 세션이 만료되었습니다. 다시 로그인해주세요.';
        // 로그인 페이지로 이동
        router.push('/login');
      } else {
        error.value = `서버 오류: ${err.response.status}`;
      }
    } else {
      error.value = '네트워크 연결 상태를 확인해주세요.';
      console.error('API 호출 중 오류 발생:', err);
    }
  } finally {
    loading.value = false;
  }
};

// 필터 변경 핸들러
const handleFilterChange = filters => {
  console.log('Filters changed:', filters);
  // ScrapFilter에서 보낸 filters 객체를 그대로 사용
  router.push({
    query: {
      ...route.query,
      productTypes:
        filters.productTypes && !filters.productTypes.includes('all')
          ? filters.productTypes.join(',')
          : undefined,
    },
  });
};

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
  if (isScrapLoading.value) return;

  // isLiked가 true일 때만 (찜 해제) 로직 실행
  if (isLiked) {
    console.log('찜 해제 요청: productId', productId);
    isScrapLoading.value = true;
    try {
      await delScrap(productId);
      // API 호출 성공 시 목록에서 해당 상품 제거
      products.value = products.value.filter(p => p.productId !== productId);
      console.log('찜 해제 완료');
    } catch (error) {
      console.error('찜 해제 실패:', error);
      alert('찜 해제 중 오류가 발생했습니다.');
    } finally {
      isScrapLoading.value = false;
    }
  }
};

const handleProductClick = product => {
  console.log('Product clicked:', product);
  router.push({
    name: 'products-detail',
    params: { id: product.productId },
  });
};

// URL 쿼리 변경을 감지하여 상태 업데이트 및 API 재호출
watch(
  () => route.query,
  newQuery => {
    currentFilters.value = {
      productTypes: newQuery.productTypes
        ? newQuery.productTypes.split(',')
        : ['all'],
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
