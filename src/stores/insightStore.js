import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getInsightProducts } from '@/api/insight.js';

export const useInsightStore = defineStore('insight', () => {
  // state
  const products = ref([]);
  const isInitialized = ref(false); // 상품 목록 초기화 여부 플래그

  // actions
  async function initializeProducts() {
    if (isInitialized.value) {
      return;
    }

    try {
      const data = await getInsightProducts();
      products.value = data || [];
      isInitialized.value = true;
    } catch (error) {
      console.error('상품 목록 초기화 실패:', error);
      isInitialized.value = false;
      throw error;
    }
  }

  function reset() {
    products.value = [];
    isInitialized.value = false;
  }

  return { products, isInitialized, initializeProducts, reset };
});
