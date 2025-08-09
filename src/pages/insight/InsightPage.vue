<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getInsightList } from '@/api/insight.js';
import { getInsightDetail, mapRegretInsightResponse } from '@/api/insight-detail';
import ForexBarChart from '@/components/insight/InsightBarChart.vue';
import InsightLineChart from '@/components/insight/InsightLineChart.vue';
import InsightDetailPage from './InsightDetailPage.vue';

const route = useRoute();
const router = useRouter();

const productsData = ref([]);
const detailData = ref(null);

const selectedCurrency = ref('USD');
const currencyOptions = ref(['USD']);

const currentRound = ref(null);
const currentProductId = ref(null);

// 현재 선택된 상품이 외환 상품인지 확인
const isForexProduct = computed(() => {
  return detailData.value?.forexInfo?.length > 0;
});

// 후회 인사이트 데이터
const regretInsightData = computed(() => {
  if (!detailData.value) return [];
  return mapRegretInsightResponse(detailData.value);
});

// 현재 회차의 상품 목록
const currentProducts = computed(() => {
  return productsData.value.find(p => p.round === currentRound.value)?.products ?? [];
});

// ✅ 데이터 로드
async function loadData(round, productId) {
  try {
    const {
      productsData: pData,
      detailData: dData,
      round: r,
      productId: pid,
    } = await getInsightList(round, productId);

    productsData.value = pData;
    detailData.value = dData;
    currentRound.value = r;
    currentProductId.value = pid;

    // URL 업데이트
    router.replace({ path: '/insight', query: { round: r, productId: pid } });

    // 통화 옵션 세팅 (외환 상품인 경우에만)
    if (dData.forexInfo?.length > 0 && dData.currency) {
      const currencies = dData.currency.split(',');
      selectedCurrency.value = currencies[0];
      currencyOptions.value = currencies;
    }
  } catch (e) {
    console.error('데이터 로드 실패:', e);
  }
}

// ✅ 회차 변경
function changeRound(next = true) {
  const rounds = productsData.value.map(r => r.round);
  const currentIndex = rounds.indexOf(currentRound.value);
  const newIndex = next ? currentIndex + 1 : currentIndex - 1;

  if (newIndex >= 0 && newIndex < rounds.length) {
    // 새 회차의 첫 번째 상품으로 이동
    const firstProduct = productsData.value[newIndex]?.products?.[0];
    if (firstProduct) {
      loadData(productsData.value[newIndex].round, firstProduct.productId);
    }
  }
}

// ✅ 상품 클릭
function handleProductClick(pid) {
  loadData(currentRound.value, pid);
}

// ✅ 현재 선택된 상품의 인덱스 가져오기
const getCurrentProductIndex = (productId) => {
  return currentProducts.value.findIndex(p => p.productId === productId);
};

onMounted(() => {
  const roundParam = Number(route.query.round) || null;
  const productIdParam = route.query.productId || null;
  loadData(roundParam, productIdParam);
});
</script>

<template>
  <div class="insight-container">
    <!-- 회차 네비게이션 -->
    <div class="chart-nav">
      <button @click="changeRound(false)" :disabled="!productsData.length">❮</button>
      <span>{{ currentRound }}회차</span>
      <button @click="changeRound(true)" :disabled="!productsData.length">❯</button>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="main-content">
      <!-- 좌측 상품 목록 -->
      <div class="products-sidebar">
        <h3>상품 목록</h3>
        <div 
          class="product-item"
          :class="{ active: product.productId === currentProductId }"
          v-for="(product, idx) in currentProducts"
          :key="product.productId"
          @click="handleProductClick(product.productId)"
        >
          <span class="product-number">{{ idx + 1 }}</span>
          <span class="product-name">{{ product.name }}</span>
        </div>
      </div>

      <!-- 우측 차트 영역 -->
      <div class="chart-area">
        <!-- 외환 상품인 경우 -->
        <div v-if="isForexProduct" class="forex-section">
          <div class="currency-selector">
            <label>통화 선택:</label>
            <select v-model="selectedCurrency">
              <option v-for="c in currencyOptions" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="chart-wrapper">
            <ForexBarChart
              :forexInfo="detailData.forexInfo"
              :selectedCurrency="selectedCurrency"
            />
          </div>
        </div>

        <!-- 외환이 아닌 상품인 경우 -->
        <div v-else class="non-forex-section">
          <div class="chart-wrapper">
            <InsightLineChart 
              :regretInsightData="regretInsightData"
              v-if="regretInsightData.length > 0"
            />
            <div v-else class="no-data-message">
              <p>표시할 차트 데이터가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 상세 정보 -->
    <InsightDetailPage v-if="currentRound && currentProductId" />
  </div>
</template>

<style scoped>
.insight-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.chart-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.chart-nav button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.chart-nav button:hover:not(:disabled) {
  background: #0056b3;
}

.chart-nav button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.chart-nav span {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.main-content {
  display: flex;
  gap: 20px;
  min-height: 500px;
}

.products-sidebar {
  flex: 0 0 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.products-sidebar h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.product-item:hover {
  background: #f8f9fa;
  border-color: #e9ecef;
}

.product-item.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.product-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: #6c757d;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.product-item.active .product-number {
  background: #2196f3;
}

.product-name {
  font-size: 14px;
  line-height: 1.4;
  color: #333;
}

.chart-area {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.forex-section {
  height: 100%;
}

.currency-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.currency-selector label {
  font-weight: bold;
  color: #333;
}

.currency-selector select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.chart-wrapper {
  height: 450px;
  width: 100%;
}

.non-forex-section {
  height: 100%;
}

.no-data-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
  font-size: 16px;
  border: 2px dashed #dee2e6;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .products-sidebar {
    flex: none;
  }
}
</style>