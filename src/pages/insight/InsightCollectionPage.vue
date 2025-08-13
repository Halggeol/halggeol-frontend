<template>
  <div class="insight-container">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <p>데이터를 불러오는 중...</p>
    </div>

    <template v-else>
      <div class="header-navigation">
        <div class="round-navigation" v-if="availableRounds.length > 1">
          <button @click="changeRound(false)" :disabled="availableRounds.indexOf(currentRound) === 0">❮</button>
          <span class="round-text">{{ currentRound || 7 }}회차</span>
          <button @click="changeRound(true)" :disabled="availableRounds.indexOf(currentRound) === availableRounds.length - 1">❯</button>
        </div>

        <div class="issue-date">
          발행일: {{ currentRecDate || '2025. 07. 13' }}
        </div>
      </div>

      <!-- 메인 컨텐츠 -->
      <div class="main-content">
        <!-- 좌측 상품 목록 -->
        <div class="products-sidebar">
          <div v-if="currentProducts.length === 0" class="no-products">
            <p>해당 조건에 맞는 상품이 없습니다.</p>
          </div>
          <div v-else>
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
        </div>

        <!-- 우측 차트 영역 -->
        <div class="chart-area">
          <div v-if="!detailData" class="no-data-message">
            <p>상품을 선택해주세요.</p>
          </div>
          
          <!-- 차트 표시 -->
          <div v-else class="chart-section">
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
      <InsightDetailPage 
        v-if="currentRound && currentProductId && detailData" 
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getInsightList } from '@/api/insight.js';
import { mapRegretInsightResponse } from '@/api/insight-detail';
import InsightLineChart from '@/components/insight/InsightLineChart.vue';
import InsightDetailPage from './InsightDetailPage.vue';

const route = useRoute();
const router = useRouter();

const productsData = ref([]);
const detailData = ref(null);
const loading = ref(false);

const currentRound = ref(null);
const currentProductId = ref(null);

// URL 경로에서 type 구하기 (fund / aggressive_pension)
const type = computed(() => {
  if (route.path.includes('fund')) return 'fund';
  if (route.path.includes('aggressive')) return 'aggressive_pension';
  return null;
});

// 쿼리에서 round, productId 파싱
const queryRound = computed(() => {
  const roundParam = route.query.round;
  const parsed = Number(roundParam);
  return !isNaN(parsed) && parsed > 0 ? parsed : null;
});

const queryProductId = computed(() => {
  const id = route.query.productId;
  return id || null;
});

// 후회 인사이트 데이터
const regretInsightData = computed(() => {
  if (!detailData.value) return [];
  return mapRegretInsightResponse(detailData.value);
});

// 사용 가능한 회차 목록
const availableRounds = computed(() => {
  return productsData.value.map(p => p.round).sort((a, b) => a - b);
});

// 현재 회차의 상품 목록
const currentProducts = computed(() => {
  return productsData.value.find(p => p.round === currentRound.value)?.products ?? [];
});

// 현재 회차 날짜
const currentRecDate = computed(() => {
  const roundData = productsData.value.find(p => p.round === currentRound.value);
  
  if (!roundData?.recDate) {
    return null;
  }

  const datePart = roundData.recDate.split('T')[0];
  const dateObj = new Date(datePart);

  if (isNaN(dateObj.getTime())) {
    return null;
  }

  const formattedDate = dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\.$/, ''); // 마지막 점(.) 제거
  
  return formattedDate;
});

// 데이터 로드 함수
async function loadData(roundValue, productIdValue) {
  if (loading.value) return;
  
  loading.value = true;
  try {
    const {
      productsData: pData,
      detailData: dData,
      round: r,
      productId: pid,
    } = await getInsightList(roundValue, productIdValue, type.value);

    productsData.value = pData;
    detailData.value = dData;
    currentRound.value = r;
    currentProductId.value = pid;

    // URL 쿼리 업데이트
    if (route.query.round !== String(r) || route.query.productId !== pid) {
      router.replace({ 
        path: route.path, 
        query: { round: r, productId: pid } 
      });
    }
  } catch (e) {
    console.error('데이터 로드 실패:', e);
  } finally {
    loading.value = false;
  }
}

// 회차 변경
function changeRound(next = true) {
  const rounds = availableRounds.value;
  if (rounds.length === 0) return;
  
  const currentIndex = rounds.indexOf(currentRound.value);
  const newIndex = next ? currentIndex + 1 : currentIndex - 1;

  if (newIndex >= 0 && newIndex < rounds.length) {
    const newRound = rounds[newIndex];
    const newRoundData = productsData.value.find(p => p.round === newRound);
    if (newRoundData && newRoundData.products.length > 0) {
      loadData(newRound, newRoundData.products[0].productId);
    }
  }
}

// 상품 클릭
function handleProductClick(productId) {
  if (productId !== currentProductId.value) {
    loadData(currentRound.value, productId);
  }
}

// 쿼리 변경 감지
watch([queryRound, queryProductId], ([newRound, newProductId]) => {
  if (newRound !== currentRound.value || newProductId !== currentProductId.value) {
    loadData(newRound, newProductId);
  }
}, { immediate: false });

// 경로 변경 감지 (type 변경 시)
watch(() => route.path, () => {
  // 경로가 변경되면 새로운 type으로 다시 로드
  loadData(queryRound.value, queryProductId.value);
}, { immediate: false });

onMounted(() => {
  loadData(queryRound.value, queryProductId.value);
});
</script>

<style scoped>
.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.insight-container {
  padding: 30px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #ffffff;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

/* 헤더 네비게이션 컨테이너 */
.header-navigation {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px; /* 약간 더 여유 */
  gap: 10px;
  padding-top: 10px; /* 위쪽 공간 확보 */
  position: relative;
}

/* 회차 네비게이션 */
.round-navigation {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 발행일 */
.issue-date {
  align-self: flex-start; /* 왼쪽 정렬 */
  font-size: 14px;
  color: #888;
  font-weight: 400;
  white-space: nowrap;
  user-select: none;
  padding-left: 10px; /* 좌측 여백 살짝 */
  width: 100%;
  max-width: 350px; /* 좌측 사이드바 넓이와 맞춤 */
}

.round-navigation button {
  width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: #fff;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #666;
  transition: all 0.2s ease;
}

.round-navigation button:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #ccc;
}

.round-navigation button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.round-text {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  min-width: 80px;
  text-align: center;
}

/* 메인 컨텐츠 */
.main-content {
  display: flex;
  gap: 40px;
  min-height: 500px;
}

/* 좌측 상품 목록 */
.products-sidebar {
  flex: 0 0 350px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px 20px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid transparent;
}

/* .product-item:hover {
  background-color: #e8f4fd;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
} */

.product-item:hover {
  background-color: #fffbf0; /* 더 연한 노란색 */
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 211, 56, 0.2); /* KB-Yellow 그림자 */
}

/* .product-item.active {
  background-color: #e3f2fd;
  border-color: #2196f3;
  border-left: 4px solid #2196f3;
  font-weight: 500;
} */

.product-item.active {
  background-color: #fff8e1; /* 연한 노란색 배경 */
  border-color: #FFD338; /* KB-Yellow */
  border-left: 4px solid #FFD338; /* KB-Yellow */
  font-weight: 500;
}

.product-number {
  flex: 0 0 28px;
  text-align: center;
  background: #666;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
  font-weight: 600;
}

/* .product-item.active .product-number {
  background: #2196f3;
} */

.product-item.active .product-number {
  background: #FFD338; /* KB-Yellow */
  color: #60584C; /* KB-Gray - 더 나은 가독성을 위해 */
}

.product-name {
  flex: 1;
  font-size: 15px;
  color: #333;
  line-height: 1.4;
}

/* 우측 차트 영역 */
.chart-area {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.chart-wrapper {
  height: 400px;
  position: relative;
}

.no-data-message,
.no-products {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
  font-size: 16px;
}

.no-products {
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .products-sidebar {
    flex: none;
  }
  
  .product-item {
    padding: 15px 18px;
  }

  .header-navigation {
    justify-content: center;
    gap: 15px;
  }
  
  .issue-date {
    min-width: auto;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .insight-container {
    padding: 20px;
  }
  
  .round-navigation button {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  
  .round-text {
    font-size: 18px;
  }
  
  .chart-area {
    padding: 20px;
  }
}
</style>