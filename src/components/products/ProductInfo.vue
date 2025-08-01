<template>
  <BaseCard size="lg" variant="outline">
    <h3 class="text-title-sm font-semibold text-fg-primary mb-8">상품 정보</h3>

    <div class="space-y-4">
      <!-- 공통 정보 -->
      <div class="flex items-start">
        <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
          >운용 회사</span
        >
        <span class="text-body02 text-fg-primary font-medium">{{
          productDetail.company
        }}</span>
      </div>

      <!-- 예금/적금 전용 정보 -->
      <template v-if="isDepositOrSavings">
        <div class="flex items-start" v-if="productDetail.minimumCost">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >최소 가입 금액</span
          >
          <span class="text-body02 text-fg-primary font-medium"
            >{{ formatCurrency(productDetail.minimumCost) }}
          </span>
        </div>
        <div class="flex items-start" v-if="productDetail.maxLimit">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >최대 가입 금액</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            formatCurrency(productDetail.maxLimit)
          }}</span>
        </div>
        <div
          class="flex items-start"
          v-if="productDetail.minSaveTerm || productDetail.maxSaveTerm"
        >
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >저축 기간</span
          >
          <span class="text-body02 text-fg-primary font-medium">
            {{ productDetail.minSaveTerm }}개월 ~
            {{ productDetail.maxSaveTerm }}개월
          </span>
        </div>
        <div class="flex items-start" v-if="productDetail.rateType">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >금리 유형</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.rateType
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.bonusCondition">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >우대 조건</span
          >
          <span class="text-body02 text-fg-primary leading-relaxed">{{
            productDetail.bonusCondition
          }}</span>
        </div>
        <div
          class="flex items-start"
          v-if="productDetail.saveType && productDetail.productType === 'S'"
        >
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >적금 유형</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.saveType
          }}</span>
        </div>
      </template>

      <!-- 펀드 전용 정보 -->
      <template v-if="isFund">
        <div class="flex items-start" v-if="productDetail.minLimit">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >최소 투자 금액</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            formatCurrency(productDetail.minLimit)
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.fundPrice">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >기준가</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            // 소수점 첫째자리 까지만
            (productDetail.fundPrice * 10).toFixed(1)
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.fundPriceMovement">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >기준가 변동</span
          >
          <span
            class="text-body02 font-medium"
            :class="getPriceMovementColor(productDetail.fundPriceMovement)"
          >
            {{ productDetail.fundPriceMovement }}
          </span>
        </div>
        <div class="flex items-start" v-if="productDetail.ter">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >총 보수율(TER)</span
          >
          <span class="text-body02 text-fg-primary font-medium"
            >{{ productDetail.ter }}%</span
          >
        </div>
        <div class="flex items-start" v-if="productDetail.category">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >카테고리</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.category
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.theme">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >테마</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.theme
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.upfrontFee">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >선취 수수료</span
          >
          <span class="text-body02 text-fg-primary font-medium"
            >{{ productDetail.upfrontFee }}%</span
          >
        </div>
        <div class="flex items-start" v-if="productDetail.managementFee">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >운용 수수료</span
          >
          <span class="text-body02 text-fg-primary font-medium"
            >{{ productDetail.managementFee }}%</span
          >
        </div>
        <div
          class="flex items-start"
          v-if="productDetail.investmentWarningGrade"
        >
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >투자 위험 등급</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.investmentWarningGrade
          }}</span>
        </div>
      </template>

      <!-- 외화 전용 정보 -->
      <template v-if="isForex">
        <div class="flex items-start" v-if="productDetail.currency">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >통화</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.currency
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.minLimit">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            ><div
              class="tooltip underline"
              data-tip="현재 환율 기준으로 원화로 계산됩니다."
            >
              최소 가입 금액
            </div></span
          >

          <span class="text-body02 text-fg-primary font-medium">{{
            formatCurrency(productDetail.minLimit)
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.maxLimit">
          <span
            class="w-32 text-callout text-fg-secondary flex-shrink-0 underline"
            ><div
              class="tooltip underline"
              data-tip="현재 환율 기준으로 원화로 계산됩니다."
            >
              최대 가입 금액
            </div></span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            formatCurrency(productDetail.maxLimit)
          }}</span>
        </div>
        <div
          class="flex items-start"
          v-if="productDetail.minSaveTerm || productDetail.maxSaveTerm"
        >
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >저축 기간</span
          >
          <span class="text-body02 text-fg-primary font-medium">
            {{ productDetail.minSaveTerm }}개월 ~
            {{ productDetail.maxSaveTerm }}개월
          </span>
        </div>
        <div class="flex items-start" v-if="productDetail.autoRenew">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >자동 연장</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.autoRenew === 'Y' ? '가능' : '불가능'
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.extraDeposit">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >추가 입금</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.extraDeposit
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.rateGiveWay">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >금리 지급 방식</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.rateGiveWay
          }}</span>
        </div>
        <div
          class="flex items-start"
          v-if="productDetail.taxRefund !== undefined"
        >
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >세금 환급</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.taxRefund ? '가능' : '불가능'
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.protect">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >예금자 보호</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.protect
          }}</span>
        </div>
      </template>

      <!-- 연금 전용 정보 -->
      <template v-if="isPension">
        <div class="flex items-start" v-if="productDetail.pensionKind">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >연금 종류</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            productDetail.pensionKind
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.minGuaranteeRate">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >최소 보장 이율</span
          >
          <span class="text-body02 text-fg-primary font-medium"
            >{{ productDetail.minGuaranteeRate }}%</span
          >
        </div>
        <div
          class="flex items-start"
          v-if="productDetail.minSaveTerm || productDetail.maxSaveTerm"
        >
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >저축 기간</span
          >
          <span class="text-body02 text-fg-primary font-medium">
            {{ productDetail.minSaveTerm }}개월 ~
            {{ productDetail.maxSaveTerm }}개월
          </span>
        </div>
        <div class="flex items-start" v-if="productDetail.minLimit">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >최소 가입 금액</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            formatCurrency(productDetail.minLimit)
          }}</span>
        </div>
        <div class="flex items-start" v-if="productDetail.maxLimit">
          <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
            >최대 가입 금액</span
          >
          <span class="text-body02 text-fg-primary font-medium">{{
            formatCurrency(productDetail.maxLimit)
          }}</span>
        </div>
      </template>

      <!-- 공통 가입 정보 -->
      <div class="flex items-start" v-if="productDetail.joinMember">
        <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
          >가입 대상</span
        >
        <span class="text-body02 text-fg-primary font-medium">{{
          productDetail.joinMember
        }}</span>
      </div>

      <div class="flex items-start" v-if="productDetail.joinWay">
        <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
          >가입 방법</span
        >
        <span class="text-body02 text-fg-primary font-medium">{{
          productDetail.joinWay
        }}</span>
      </div>

      <div class="flex items-start" v-if="productDetail.endDate">
        <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
          >판매 종료일</span
        >
        <span class="text-body02 text-fg-primary font-medium">{{
          productDetail.endDate
        }}</span>
      </div>

      <div class="flex items-start" v-if="productDetail.caution">
        <span class="w-32 text-callout text-fg-secondary flex-shrink-0"
          >기타 사항</span
        >
        <span class="text-body02 text-fg-primary leading-relaxed">{{
          productDetail.caution
        }}</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';

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
const formatCurrency = amount => {
  if (!amount) return '';
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
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
