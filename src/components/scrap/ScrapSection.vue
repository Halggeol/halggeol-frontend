<template>
  <div class="p-4">
    <div
      v-for="type in types"
      :key="type"
      v-show="isTypeVisible(type)"
      class="bg-white rounded-xl shadow-md overflow-hidden mb-8"
    >
      <div class="px-6 py-4 bg-primary border-b border-secondary">
        <h2 class="text-title03 text-white">
          {{ getProductTypeLabel(type) }}
        </h2>
      </div>

      <div class="divide-y divide-gray-200">
        <ProductCard
          v-for="product in getProductsByType(type)"
          :key="product.productId"
          :product="product"
          :isLiked="true"
          @toggle-like="handleToggleLike"
          @product-click="handleProductClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import ProductCard from '../products/ProductCard.vue';

// 상위 컴포넌트로부터 props를 받습니다.
const props = defineProps({
  scrapedProducts: {
    type: Array,
    required: true,
  },
  selectedFilters: { type: Object, default: () => ({ types: [] }) },
});

const emit = defineEmits(['toggle-like', 'product-click']);

// 상품 유형 순서 정의
const types = ['deposit', 'savings', 'fund', 'pension', 'forex'];

// 상품 유형에 따라 라벨을 반환하는 함수
const getProductTypeLabel = type => {
  const typeMap = {
    deposit: '예금',
    savings: '적금',
    fund: '펀드',
    pension: '연금',
    forex: '외화',
  };
  return typeMap[type] || type;
};

// computed 속성을 사용하여 상품 유형별로 그룹화된 상품 목록을 생성
const groupedProducts = computed(() => {
  const groups = {};
  types.forEach(type => {
    groups[type] = props.scrapedProducts.filter(p => p.type === type);
  });
  return groups;
});

// 특정 유형의 상품 목록을 반환
const getProductsByType = type => {
  return groupedProducts.value[type] || [];
};

// 필터링된 유형만 표시할지 결정하는 함수
const isTypeVisible = type => {
  // 해당 유형에 상품이 없으면 섹션을 표시하지 않음
  const productsOfType = getProductsByType(type);
  if (productsOfType.length === 0) {
    return false;
  }

  // selectedFilters.types가 유효한 배열인지 먼저 확인
  if (!props.selectedFilters || !Array.isArray(props.selectedFilters.types)) {
    return true; // props가 없거나 형식이 잘못된 경우 일단 모두 표시
  }

  // '전체'가 선택된 경우 모든 유형 표시
  if (props.selectedFilters.types.length === 0) {
    return true;
  }

  // 특정 유형이 선택된 경우, 해당 유형만 표시
  return props.selectedFilters.types.includes(type);
};

const handleToggleLike = payload => {
  emit('toggle-like', payload);
};

const handleProductClick = product => {
  emit('product-click', product);
};
</script>
