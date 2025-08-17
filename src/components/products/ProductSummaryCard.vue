<template>
  <BaseCard size="lg" variant="outline" class="w-full tablet:p-6 mb-20">
    <div
      class="tablet:grid tablet:grid-cols-2 tablet:gap-y-6 tablet:gap-x-4 place-items-center flex flex-row justify-around items-start gap-x-8 w-full"
    >
      <!-- 예금/적금 -->
      <template v-if="isDepositOrSavings">
        <!-- 최고금리 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            최고금리
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{ productDetail.primeRate || productDetail.rate }} %
          </p>
        </div>

        <!-- 기본금리 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            기본금리
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{ productDetail.rate }} %
          </p>
        </div>

        <!-- 저축기간 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            저축기간
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            <span v-if="productDetail.minSaveTerm && productDetail.maxSaveTerm">
              <template
                v-if="productDetail.minSaveTerm === productDetail.maxSaveTerm"
              >
                {{ productDetail.minSaveTerm }}개월
              </template>
              <template v-else>
                {{ productDetail.minSaveTerm }}~{{
                  productDetail.maxSaveTerm
                }}개월
              </template>
            </span>
            <span v-else-if="productDetail.saveTerm">
              {{ productDetail.saveTerm }}개월
            </span>
            <span v-else>-</span>
          </p>
        </div>
      </template>

      <!-- 펀드 -->
      <template v-if="isFund">
        <!-- 기준가 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            기준가
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{
              productDetail.fundPrice
                ? formatCurrency(productDetail.fundPrice, false)
                : '-'
            }}
          </p>
        </div>

        <!-- 수익률 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            기준가 변동
            <span
              class="inline-block relative group ml-1 tooltip"
              data-tip="3개월간 변동 수치"
            >
              <Tooltiip class="text-fg-secondary w-4 h-4" />
            </span>
          </h3>
          <p
            class="tablet:text-body01 title02 font-bold text-fg-primary"
            :class="getPriceMovementColor(productDetail.fundPriceMovement)"
          >
            {{
              productDetail.fundPriceMovement || productDetail.rate + '%' || '-'
            }}
          </p>
        </div>

        <!-- TER(총보수율) -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            총보수율(TER)
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{ productDetail.ter ? productDetail.ter + '%' : '-' }}
          </p>
        </div>
      </template>

      <!-- 외화 -->
      <template v-if="isForex">
        <!-- 금리 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            금리
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{ productDetail.rate }} %
          </p>
        </div>

        <!-- 통화 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            통화
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{ productDetail.currency || '-' }}
          </p>
        </div>

        <!-- 최소금액 -->
        <div class="text-center">
          <h3
            class="text-footnote flex items-center justify-center font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            최소금액
            <span
              class="inline-block relative group ml-1 tooltip"
              data-tip="현재 환율 기준으로 원화로 계산됩니다."
            >
              <Tooltiip class="text-fg-secondary w-4 h-4" />
            </span>
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{
              productDetail.minLimit
                ? formatCurrency(productDetail.minLimit)
                : '-'
            }}
          </p>
        </div>
      </template>

      <!-- 연금 -->
      <template v-if="isPension">
        <!-- 금리 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            수익률
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{ productDetail.rate }} %
          </p>
        </div>

        <!-- 최소보장이율 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            최소보장이율
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{
              productDetail.minGuaranteeRate
                ? productDetail.minGuaranteeRate + '%'
                : '-'
            }}
          </p>
        </div>

        <!-- 연금종류 -->
        <div class="text-center">
          <h3
            class="text-footnote font-medium text-fg-secondary tablet:mb-2 mb-3"
          >
            연금종류
          </h3>
          <p class="tablet:text-body01 title02 font-bold text-fg-primary">
            {{ productDetail.pensionKind || '-' }}
          </p>
        </div>
      </template>

      <!-- 공통: 나와의 적합도 -->
      <div class="text-center">
        <h3
          class="text-footnote flex items-center justify-center font-medium text-fg-secondary tablet:mb-2 mb-3"
        >
          나와의 적합도
          <span
            class="inline-block relative group ml-1 tooltip"
            data-tip="서비스에서 고객의 정보를 분석하여 추천하는 금융 상품과의 적합성을 수치로 보여주는 지표입니다."
          >
            <Tooltiip class="text-fg-secondary w-4 h-4" />
          </span>
        </h3>
        <p
          :class="[
            'tablet:text-body01 title02 font-bold text-status-blue',
            { tooltip: !authStore.isLoggedIn },
          ]"
          :data-tip="
            !authStore.isLoggedIn
              ? '로그인 후 적합도를 확인할 수 있습니다.'
              : null
          "
        >
          {{ authStore.isLoggedIn ? productDetail.score + ' %' : '??' }}
        </p>
      </div>
    </div>
  </BaseCard>

  <!-- Slot for additional content -->
  <slot></slot>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import { useAuthStore } from '@/stores/authStore';
import Tooltiip from '@/assets/icons/common/Tooltiip.vue';

const authStore = useAuthStore();

const props = defineProps({
  productDetail: {
    type: Object,
    required: true,
  },
});

// 상품 유형별 구분
const isDepositOrSavings = computed(() => {
  return (
    props.productDetail.productType === 'D' ||
    props.productDetail.productType === 'S'
  );
});

const isFund = computed(() => {
  return props.productDetail.productType === 'F';
});

const isForex = computed(() => {
  return props.productDetail.productType === 'X';
});

const isPension = computed(() => {
  return (
    props.productDetail.productType === 'A' ||
    props.productDetail.productType === 'C'
  );
});

// 통화 포맷팅
const formatCurrency = (amount, addWon = true) => {
  if (!amount) return '';
  const formatted = new Intl.NumberFormat('ko-KR').format(amount);
  return addWon ? formatted + '원' : formatted;
};

// 가격 변동 색상
const getPriceMovementColor = movement => {
  if (!movement) return 'text-fg-primary';
  const movementStr = movement.toString();
  if (movementStr.includes('+') || movementStr.includes('상승')) {
    return 'text-status-red';
  } else if (movementStr.includes('-') || movementStr.includes('하락')) {
    return 'text-status-blue';
  }
  return 'text-fg-primary';
};
</script>
