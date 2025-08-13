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
      if (!data || data.length === 0) {
        throw new Error('표시할 상품 목록이 없습니다.');
      }
      products.value = data;
      isInitialized.value = true;
    } catch (error) {
      console.error('상품 목록 초기화 실패:', error);
      isInitialized.value = false;
      throw error;
    }
  }

  return { products, isInitialized, initializeProducts };
});
