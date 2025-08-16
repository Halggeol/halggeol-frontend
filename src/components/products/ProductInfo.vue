<template>
  <BaseCard size="lg" variant="outline" class="my-20">
    <h3 class="title02 font-semibold text-fg-primary mb-8">상품 정보</h3>

    <div class="space-y-4">
      <!-- 공통 정보 -->
      <div class="info-row">
        <span class="info-label">운용 회사</span>
        <span class="info-value">{{ productDetail.company }}</span>
      </div>

      <!-- 예금/적금 전용 정보 -->
      <template v-if="isDepositOrSavings">
        <div class="info-row" v-if="productDetail.minimumCost">
          <span class="info-label">최소 가입 금액</span>
          <span class="info-value">{{
            formatCurrency(productDetail.minimumCost)
          }}</span>
        </div>
        <div class="info-row" v-if="productDetail.maxLimit">
          <span class="info-label">최대 가입 금액</span>
          <span class="info-value">{{
            formatCurrency(productDetail.maxLimit)
          }}</span>
        </div>
        <div
          class="info-row"
          v-if="productDetail.minSaveTerm || productDetail.maxSaveTerm"
        >
          <span class="info-label">저축 기간</span>
          <span class="info-value">
            {{ productDetail.minSaveTerm }}개월 ~
            {{ productDetail.maxSaveTerm }}개월
          </span>
        </div>
        <div class="info-row" v-if="productDetail.rateType">
          <span class="info-label">금리 유형</span>
          <span class="info-value">{{ productDetail.rateType }}</span>
        </div>
        <div class="info-row" v-if="productDetail.bonusCondition">
          <span class="info-label">우대 조건</span>
          <span class="info-value leading-relaxed">{{
            productDetail.bonusCondition
          }}</span>
        </div>
        <div
          class="info-row"
          v-if="productDetail.saveType && productDetail.productType === 'S'"
        >
          <span class="info-label">적금 유형</span>
          <span class="info-value">{{ productDetail.saveType }}</span>
        </div>
      </template>

      <!-- 펀드 전용 정보 -->
      <template v-if="isFund">
        <div class="info-row" v-if="productDetail.minLimit">
          <span class="info-label">최소 투자 금액</span>
          <span class="info-value">{{
            formatCurrency(productDetail.minLimit)
          }}</span>
        </div>
        <div class="info-row" v-if="productDetail.fundPrice">
          <span class="info-label">기준가</span>
          <span class="info-value">{{
            productDetail.fundPrice.toFixed(1)
          }}</span>
        </div>
        <div class="info-row" v-if="productDetail.fundPriceMovement">
          <span class="info-label">기준가 변동</span>
          <span
            class="info-value"
            :class="getPriceMovementColor(productDetail.fundPriceMovement)"
          >
            {{ productDetail.fundPriceMovement }}
          </span>
        </div>
        <div class="info-row" v-if="productDetail.ter">
          <span class="info-label">총 보수율(TER)</span>
          <span class="info-value">{{ productDetail.ter }}%</span>
        </div>
        <div class="info-row" v-if="productDetail.category">
          <span class="info-label">카테고리</span>
          <span class="info-value">{{ productDetail.category }}</span>
        </div>
        <div class="info-row" v-if="productDetail.theme">
          <span class="info-label">테마</span>
          <span class="info-value">{{ productDetail.theme }}</span>
        </div>
        <div class="info-row" v-if="productDetail.upfrontFee">
          <span class="info-label">선취 수수료</span>
          <span class="info-value">{{ productDetail.upfrontFee }}%</span>
        </div>
        <div class="info-row" v-if="productDetail.managementFee">
          <span class="info-label">운용 수수료</span>
          <span class="info-value">{{ productDetail.managementFee }}%</span>
        </div>
        <div class="info-row" v-if="productDetail.investmentWarningGrade">
          <span class="info-label">투자 위험 등급</span>
          <span class="info-value">{{
            productDetail.investmentWarningGrade
          }}</span>
        </div>
      </template>

      <!-- 외화 전용 정보 -->
      <template v-if="isForex">
        <div class="info-row" v-if="productDetail.currency">
          <span class="info-label">통화</span>
          <span class="info-value">{{ productDetail.currency }}</span>
        </div>
        <div class="info-row" v-if="productDetail.minLimit">
          <span class="info-label">
            <div
              class="tooltip underline"
              data-tip="현재 환율 기준으로 원화로 계산됩니다."
            >
              최소 가입 금액
            </div>
          </span>
          <span class="info-value">{{
            formatCurrency(productDetail.minLimit)
          }}</span>
        </div>
        <div class="info-row" v-if="productDetail.maxLimit">
          <span class="info-label">
            <div
              class="tooltip underline"
              data-tip="현재 환율 기준으로 원화로 계산됩니다."
            >
              최대 가입 금액
            </div>
          </span>
          <span class="info-value">{{
            formatCurrency(productDetail.maxLimit)
          }}</span>
        </div>
        <div
          class="info-row"
          v-if="productDetail.minSaveTerm || productDetail.maxSaveTerm"
        >
          <span class="info-label">저축 기간</span>
          <span class="info-value">
            {{ productDetail.minSaveTerm }}개월 ~
            {{ productDetail.maxSaveTerm }}개월
          </span>
        </div>
        <div class="info-row" v-if="productDetail.autoRenew">
          <span class="info-label">자동 연장</span>
          <span class="info-value">{{
            productDetail.autoRenew === 'Y' ? '가능' : '불가능'
          }}</span>
        </div>
        <div class="info-row" v-if="productDetail.extraDeposit">
          <span class="info-label">추가 입금</span>
          <span class="info-value">{{ productDetail.extraDeposit }}</span>
        </div>
        <div class="info-row" v-if="productDetail.rateGiveWay">
          <span class="info-label">금리 지급 방식</span>
          <span class="info-value">{{ productDetail.rateGiveWay }}</span>
        </div>
        <div class="info-row" v-if="productDetail.taxRefund !== undefined">
          <span class="info-label">세금 환급</span>
          <span class="info-value">{{
            productDetail.taxRefund ? '가능' : '불가능'
          }}</span>
        </div>
        <div class="info-row" v-if="productDetail.protect">
          <span class="info-label">예금자 보호</span>
          <span class="info-value">{{ productDetail.protect }}</span>
        </div>
      </template>

      <!-- 연금 전용 정보 -->
      <template v-if="isPension">
        <div class="info-row" v-if="productDetail.pensionKind">
          <span class="info-label">연금 종류</span>
          <span class="info-value">{{ productDetail.pensionKind }}</span>
        </div>
        <div class="info-row" v-if="productDetail.minGuaranteeRate">
          <span class="info-label">최소 보장 이율</span>
          <span class="info-value">{{ productDetail.minGuaranteeRate }}%</span>
        </div>
        <div
          class="info-row"
          v-if="productDetail.minSaveTerm || productDetail.maxSaveTerm"
        >
          <span class="info-label">저축 기간</span>
          <span class="info-value">
            {{ productDetail.minSaveTerm }}개월 ~
            {{ productDetail.maxSaveTerm }}개월
          </span>
        </div>
        <div class="info-row" v-if="productDetail.minLimit">
          <span class="info-label">최소 가입 금액</span>
          <span class="info-value">{{
            formatCurrency(productDetail.minLimit)
          }}</span>
        </div>
        <div class="info-row" v-if="productDetail.maxLimit">
          <span class="info-label">최대 가입 금액</span>
          <span class="info-value">{{
            formatCurrency(productDetail.maxLimit)
          }}</span>
        </div>
      </template>

      <!-- 공통 가입 정보 -->
      <div class="info-row" v-if="productDetail.joinMember">
        <span class="info-label">가입 대상</span>
        <span class="info-value">{{ productDetail.joinMember }}</span>
      </div>
      <div class="info-row" v-if="productDetail.joinWay">
        <span class="info-label">가입 방법</span>
        <span class="info-value">{{ productDetail.joinWay }}</span>
      </div>
      <div class="info-row" v-if="productDetail.endDate">
        <span class="info-label">판매 종료일</span>
        <span class="info-value">{{ productDetail.endDate }}</span>
      </div>
      <div class="info-row" v-if="productDetail.caution">
        <span class="info-label">기타 사항</span>
        <span class="info-value leading-relaxed">{{
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
<style scoped>
.info-row {
  @apply flex items-start;
}

.info-label {
  @apply text-fg-secondary font-medium flex-shrink-0 w-32 text-body02;
}

.info-value {
  @apply text-fg-primary text-body02;
}
</style>
