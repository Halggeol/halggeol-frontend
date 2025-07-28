<script setup>
import { ref, onMounted, computed } from 'vue';
import { getProductDetail, addScrap, delScrap } from '@/api/products';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ProfitCalculator from '@/components/products/ProfitCalculator.vue';

const productDetail = ref(null);
const isLoading = ref(true);
const error = ref(null);
const renewDate = '25.06.20';

const idPrefix = computed(() => {
  if (
    productDetail.value &&
    productDetail.value.id &&
    typeof productDetail.value.id === 'string'
  ) {
    return productDetail.value.id.charAt(0).toUpperCase();
  }
  return '';
});

const productTypeName = computed(() => {
  const typeMapping = {
    'D': '예금',
    'S': '적금',
    'A': '공격형 연금',
    'C': '안정형 연금',
    'F': '펀드',
    'X': '외화'
  };
  return typeMapping[idPrefix.value] || '금융상품';
});

const navigateToLink = () => {
  //   window.location.href = productDetail.value.regLink;
  window.open(productDetail.value.regLink, '_blank');
};

onMounted(async () => {
  try {
    const productId = 'F0001';
    const userId = 1;

    const response = await getProductDetail(productId);
    productDetail.value = response.data;
  } catch (err) {
    error.value = '상품 상세 정보를 불러오는데 실패했습니다: ' + err.message;
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="product-detail-page">
    <div v-if="isLoading" class="loading-message">
      <p>상품 상세 정보를 불러오는 중...</p>
    </div>
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="productDetail">
      <!-- <div v-if="idPrefix === 'D'"> -->
      <!-- 헤더 섹션 -->
      <div
        class="bg-gradient-to-r from-secondary-200 to-secondary-300 py-12 lg:py-16 px-[10.8%]"
      >
        <div class="flex justify-between items-start">
          <!-- 왼쪽 컨텐츠 -->
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-6">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-caption font-medium"
                >{{ productTypeName }}</span
              >
              <span
                v-if="productDetail.joinMember"
                class="inline-flex items-center px-3 py-1 rounded-full bg-fg-secondary-100 text-fg-primary text-caption"
                >{{ productDetail.joinMember }}</span
              >
              <span
                v-if="productDetail.joinWay"
                class="inline-flex items-center px-3 py-1 rounded-full bg-fg-secondary-100 text-fg-primary text-caption"
                >{{ productDetail.joinWay }}</span
              >
            </div>

            <h1 class="text-title-lg lg:text-title-xl font-bold text-fg-primary mb-6">
              {{ productDetail.name }}
            </h1>

            <div class="flex items-center gap-2 mb-8">
              <span class="text-status-red">❤️</span>
              <span class="text-footnote text-fg-secondary">
                <strong class="text-fg-primary">{{ productDetail.scrapCnt }}</strong
                >명이 관심갖고있음
              </span>
            </div>

            <div class="text-body02 text-fg-secondary leading-relaxed max-w-2xl">
              제공되는 정보는 금융감독원 <strong class="text-fg-primary">{{ renewDate }}</strong
              >일에 공시된 내용을 기반으로 작성되었으며, 금융상품 광고가
              아닙니다. 실제 상품 가입 시점에 변동될 수 있으므로 상품 가입 시
              꼭 다시 확인하시기 바랍니다.
            </div>
          </div>

          <!-- 오른쪽 버튼들 -->
          <div class="flex flex-col gap-3 ml-6 lg:ml-8 mt-auto">
            <BaseButton
              @click="addScrap(productDetail.id)"
              label="🤍 관심상품"
              size="sm"
              variant="outline"
              class="!w-auto !px-6 md:!px-8 lg:!px-10 !whitespace-nowrap !text-footnote md:!text-callout"
            />
            <BaseButton
              @click="navigateToLink"
              label="가입하기"
              size="sm"
              variant="filled"
              class="!w-auto !px-6 md:!px-8 lg:!px-10 !whitespace-nowrap !text-footnote md:!text-callout"
            />
          </div>
        </div>
      </div>

      <!-- 메인 컨텐츠 섹션 -->
      <div class="space-y-8 py-8">
        <!-- 상품 주요 정보 카드 -->
        <BaseCard
          size="lg"
          class="gap-8 flex justify-around items-start w-full p-8"
        >
          <!-- 최고금리 -->
          <div class="text-center">
            <h3 class="text-callout font-medium text-fg-secondary mb-3">최고금리</h3>
            <p class="text-title-sm font-bold text-fg-primary">
              {{ productDetail.primeRate }} %
            </p>
          </div>

          <!-- 기본금리 -->
          <div class="text-center">
            <h3 class="text-callout font-medium text-fg-secondary mb-3">기본금리</h3>
            <p class="text-title-sm font-bold text-fg-primary">{{ productDetail.rate }} %</p>
          </div>

          <!-- 기간 -->
          <div class="text-center">
            <h3 class="text-callout font-medium text-fg-secondary mb-3">기간</h3>
            <p class="text-title-sm font-bold text-fg-primary">
              {{ productDetail.saveTerm }} 개월
            </p>
          </div>

          <!-- 나와의 적합도 -->
          <div class="text-center">
            <h3 class="text-callout font-medium text-fg-secondary mb-3">나와의 적합도</h3>
            <!-- TODO: 이후 연결 -->
            <p class="text-title-sm font-bold text-status-blue">50 %</p>
          </div>
        </BaseCard>

        <!-- AI 한 줄 요약 -->
        <div class="bg-white rounded-xl shadow-card border border-1/2 border-secondary-200 p-8">
          <h3 class="text-title-sm font-semibold text-fg-primary mb-6">AI 한 줄 요약</h3>
          <div class="space-y-4">
            <p class="text-body02 text-fg-secondary leading-relaxed">
              <span class="text-callout font-medium text-status-blue">장점</span> : {{ productDetail.advantage }}
            </p>
            <p class="text-body02 text-fg-secondary leading-relaxed">
              <span class="text-callout font-medium text-status-red">단점</span> : {{ productDetail.disadvantage }}
            </p>
          </div>
        </div>

        <!-- 상품 정보 -->
        <div class="bg-white rounded-xl shadow-card border border-1/2 border-secondary-200 p-8">
          <h3 class="text-title-sm font-semibold text-fg-primary mb-8">상품 정보</h3>

          <div class="space-y-6">
            <div class="flex items-start">
              <span class="w-28 text-callout text-fg-secondary flex-shrink-0">최소 금액</span>
              <span class="text-body02 text-fg-primary font-medium"
                >{{ productDetail.minimumCost }} 원 이상</span
              >
            </div>

            <div class="flex items-start">
              <span class="w-28 text-callout text-fg-secondary flex-shrink-0">운용 회사</span>
              <span class="text-body02 text-fg-primary font-medium">{{ productDetail.company }}</span>
            </div>

            <div class="flex items-start" v-if="productDetail.joinMember">
              <span class="w-28 text-callout text-fg-secondary flex-shrink-0">가입 대상</span>
              <span class="text-body02 text-fg-primary font-medium">{{ productDetail.joinMember }}</span>
            </div>

            <div class="flex items-start" v-if="productDetail.joinWay">
              <span class="w-28 text-callout text-fg-secondary flex-shrink-0">가입 방법</span>
              <span class="text-body02 text-fg-primary font-medium">{{ productDetail.joinWay }}</span>
            </div>

            <div class="flex items-start" v-if="productDetail.caution">
              <span class="w-28 text-callout text-fg-secondary flex-shrink-0">기타 사항</span>
              <span class="text-body02 text-fg-primary leading-relaxed">{{ productDetail.caution }}</span>
            </div>
          </div>
        </div>

        <!-- 수익 계산기 -->
        <ProfitCalculator
          :rateOptions="[
            { label: '일반 금리', value: productDetail.rate },
            { label: '최대 금리', value: productDetail.primeRate },
          ]"
          :defaultRateIndex="0"
        />
      </div>
    </div>
    <div v-else class="no-data-message">
      <p>상품 정보가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped></style>
