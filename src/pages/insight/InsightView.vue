<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInsightStore } from '@/stores/insightStore';
import {
  getInsightDetail,
  mapRegretInsightResponse,
} from '@/api/insight-detail';

import InsightLineChart from '@/components/insight/InsightLineChart.vue';
import ForexBarChart from '@/components/insight/InsightBarChart.vue';
import InsightDetailPage from '@/pages/insight/InsightDetailPage.vue';
import LoadingPage from '@/pages/LoadingPage.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import PagenationsButton from '@/components/icons/insight/PagenationsButton.vue';

const props = defineProps({
  filterType: {
    type: String,
    default: null, // 'fund', 'aggressive', 또는 null
  },
});

const route = useRoute();
const router = useRouter();
const insightStore = useInsightStore();

const detailData = ref(null);
const isLoading = ref(false);
const error = ref(null);
const selectedCurrency = ref('USD');
const filteredProductsData = computed(() => {
  const originalData = insightStore.products;
  if (!props.filterType) {
    return originalData; // 기본
  }

  const filterPrefix = props.filterType === 'fund' ? 'F' : 'A';

  const mappedData = originalData.map(roundData => ({
    ...roundData,
    products: roundData.products.filter(p =>
      p.productId.startsWith(filterPrefix)
    ),
  }));

  return mappedData.filter(roundData => roundData.products.length > 0);
});

const availableRounds = computed(() => {
  return filteredProductsData.value.map(p => p.round).sort((a, b) => a - b);
});
const currentRound = computed(() =>
  route.query.round ? Number(route.query.round) : null
);
const currentProducts = computed(() => {
  return (
    filteredProductsData.value.find(p => p.round === currentRound.value)
      ?.products ?? []
  );
});
const currentRecDate = computed(() => {
  return (
    filteredProductsData.value.find(p => p.round === currentRound.value)
      ?.recDate ?? null
  );
  // - split 해서 년/월/일 붙이기
});
const currentProductId = computed(() => route.query.productId || null);

// 현재 선택된 상품이 외환 상품인지 확인
const isForexProduct = computed(() => detailData.value?.forexInfo?.length > 0);

// 통화 선택 옵션
const currencyOptions = computed(() => {
  if (isForexProduct.value && detailData.value?.currency) {
    return detailData.value.currency.split(',');
  }
  return ['USD'];
});

// 후회 인사이트 데이터
const regretInsightData = computed(() => {
  if (!detailData.value) return [];
  return mapRegretInsightResponse(detailData.value);
});

async function loadDetail(round, productId) {
  if (!round || !productId) {
    detailData.value = null;
    return;
  }
  isLoading.value = true;
  error.value = null;
  try {
    const dData = await getInsightDetail(round, productId);
    detailData.value = dData;
    // 통화 자동 선택
    if (dData?.forexInfo?.length > 0 && dData.currency) {
      selectedCurrency.value = dData.currency.split(',')[0];
    }
  } catch (e) {
    console.error('상세 정보 로드 실패:', e);
    error.value = '상세 정보를 불러오는 데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
}

// 회차 변경
function changeRound(next = true) {
  const rounds = availableRounds.value; // 이미 필터링된 회차 목록
  const currentIndex = rounds.indexOf(currentRound.value);
  const newIndex = next ? currentIndex + 1 : currentIndex - 1;

  if (newIndex >= 0 && newIndex < rounds.length) {
    const newRound = rounds[newIndex];
    // 새 회차의 첫 번째 상품
    const firstProductInNewRound = filteredProductsData.value.find(
      p => p.round === newRound
    )?.products?.[0];

    if (firstProductInNewRound) {
      router.push({
        query: { round: newRound, productId: firstProductInNewRound.productId },
      });
    }
  }
}

function handleProductClick(pid) {
  if (pid !== currentProductId.value) {
    router.push({ query: { round: currentRound.value, productId: pid } });
  }
}

onMounted(async () => {
  isLoading.value = true;
  await insightStore.initializeProducts();
  isLoading.value = false;

  if (!route.query.round || !route.query.productId) {
    if (filteredProductsData.value.length > 0) {
      const latestRound = filteredProductsData.value[0];
      const firstProduct = latestRound.products?.[0];
      if (latestRound && firstProduct) {
        router.replace({
          query: {
            round: latestRound.round,
            productId: firstProduct.productId,
          },
        });
      }
    }
  }
});

watch(
  () => route.query,
  newQuery => {
    loadDetail(Number(newQuery.round), newQuery.productId);
  },
  { immediate: true, deep: true }
);
</script>

<template>
  <div>
    <LoadingPage v-if="isLoading && !detailData" />
    <div v-else>
      <div class="chart-nav round-navigation">
        <!-- <button
          @click="changeRound(false)"
          :disabled="availableRounds.indexOf(currentRound) === 0"
        >
          ❮
        </button> -->
        <PagenationsButton
          @click="changeRound(false)"
          :disabled="availableRounds.indexOf(currentRound) === 0"
          class="hover:shadow-card rounded-full"
        />
        <span>{{ currentRound }}회차</span>
        <PagenationsButton
          @click="changeRound(true)"
          :disabled="
            availableRounds.indexOf(currentRound) === availableRounds.length - 1
          "
          class="hover:shadow-card rounded-full scale-x-[-1]"
        />
      </div>

      <div class="issue-date">발행일 {{ currentRecDate }}</div>

      <div class="flex min-h-full gap-10 tablet:flex-col tablet:gap-7">
        <div>
          <div v-if="currentProducts.length === 0" class="no-products">
            <p>텅 화면으로 변경</p>
          </div>
          <div v-else>
            <div
              class="product-item"
              :class="{ active: product.productId === currentProductId }"
              v-for="(product, idx) in currentProducts"
              :key="product.productId"
              @click="handleProductClick(product.productId)"
            >
              <span class="text-body02 font-semibold text-fg-primary">{{
                idx + 1
              }}</span>
              <span class="product-name">{{ product.name }}</span>
            </div>
          </div>
        </div>

        <BaseCard size="lg" variant="outline">
          <LoadingPage v-if="!detailData" />
          <div v-else>
            <div v-if="isForexProduct" class="currency-selector">
              <select v-model="selectedCurrency">
                <option v-for="c in currencyOptions" :key="c" :value="c">
                  {{ c }}
                </option>
              </select>
            </div>
            <div v-if="isForexProduct" class="chart-wrapper">
              <ForexBarChart
                :forexInfo="detailData.forexInfo"
                :selectedCurrency="selectedCurrency"
              />
            </div>
            <div v-else class="chart-wrapper">
              <InsightLineChart
                :regretInsightData="regretInsightData"
                v-if="regretInsightData.length > 0"
              />
              <div v-else class="no-data-message">
                <p>표시할 차트 데이터가 없습니다.</p>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
      <InsightDetailPage :detail-data="detailData" />
    </div>
  </div>
</template>

<style scoped>
.chart-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 8px;
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

.currency-selector {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.currency-selector select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: white
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")
    no-repeat right 12px center;
  background-size: 16px;
  border: 2px solid #e0e6ed;
  border-radius: 10px;
  padding: 12px 40px 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.currency-selector select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23667eea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

.currency-selector select:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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

.product-item:hover {
  background-color: #fffbf0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 211, 56, 0.2);
}

.product-item.active {
  background-color: #fff8e1;
  border-color: #ffd338;
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

.product-item.active .product-number {
  background: #ffd338;
  color: #60584c;
}

.product-name {
  flex: 1;
  font-size: 15px;
  color: #333;
  line-height: 1.4;
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

@media (max-width: 1024px) {
  .products-sidebar {
    flex: none;
  }
  .product-item {
    padding: 15px 18px;
  }
}

@media (max-width: 768px) {
  .currency-selector {
    justify-content: center;
    margin-bottom: 20px;
  }
  .round-navigation button {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  .round-text {
    font-size: 18px;
  }
}
</style>
