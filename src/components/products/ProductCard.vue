<template>
  <div
    class="flex justify-between items-center border-b py-4 px-2 hover:bg-gray-50 transition cursor-pointer"
    @click="handleProductClick"
  >
    <!-- 왼쪽 정보 영역 -->
    <div class="flex-1">
      <p class="text-footnote text-fg-secondary">{{ product.company }}</p>
      <h3 class="text-body02 font-bold text-fg-primary mt-1">
        {{ product.name }}
      </h3>

      <!-- 태그들 -->
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          class="text-[13px] px-2 py-[2px] rounded-full"
          :style="getProductTypeStyles(product.type)"
        >
          {{ getProductTypeLabel(product.type) }}
        </span>

        <template v-if="product.tag1">
          <!-- Forex 상품일 경우 tag1을 쉼표 기준으로 분리하여 표시 -->
          <template v-if="normalizeType(product.type) === 'forex'">
            <span
              v-for="currency in product.tag1.split(',')"
              :key="currency"
              class="text-[13px] bg-[#83BCFF] text-white px-2 py-[2px] rounded-full"
            >
              {{ currency.trim() }}
            </span>
          </template>
          <!-- 그 외 상품의 tag1 -->
          <span
            v-else
            class="text-[13px] bg-[#83BCFF] text-white px-2 py-[2px] rounded-full"
          >
            {{ formatTag1(product.tag1, product.type) }}
          </span>
        </template>

        <!-- tag2 -->
        <span
          v-if="product.tag2"
          class="text-[13px] bg-[#62CDE7] text-white px-2 py-[2px] rounded-full"
        >
          {{ formatTag2(product.tag2, product.type) }}
        </span>

        <!-- tag3 -->
        <span
          v-if="product.tag3"
          class="text-[13px] bg-[#6CD18C] text-white px-2 py-[2px] rounded-full"
        >
          {{ formatTag3(product.tag3, product.type) }}
        </span>

        <span
          v-if="product.fSector"
          class="text-[13px] bg-gray-500 text-white px-2 py-[2px] rounded-full"
        >
          {{ getFSectorLabel(product.fSector) }}
        </span>
      </div>

      <!-- 추가 정보 -->
      <div class="mt-2 text-xs text-gray-500 space-y-1">
        <div v-if="product.amount" class="text-sm font-semibold text-blue-600">
          가입금액: {{ formatAmount(product.amount) }}
        </div>

        <!-- <div v-if="product.minAmount">
          최소 가입금액: {{ formatAmount(product.minAmount) }}
        </div>
        <div v-if="getTermRangeText()">
          {{ getTermRangeText() }}
        </div>
        <div v-if="product.viewCnt || product.scrapCnt" class="flex space-x-3">
          <span v-if="product.viewCnt">조회 {{ product.viewCnt }}</span>
          <span v-if="product.scrapCnt">관심 {{ product.scrapCnt }}</span>
        </div> -->
      </div>
    </div>

    <!-- 오른쪽 금리/수익률 정보 -->
    <div class="flex flex-col items-end space-y-2 ml-4">
      <div class="text-right">
        <!-- 상품별 메인 지표 (title) -->
        <p class="text-4xl font-bold text-gray-800">
          {{ formatTitle(product.title, product.type) }}
        </p>

        <!-- 상품별 서브 지표 (subTitle) -->
        <p v-if="product.subTitle" class="text-sm text-gray-600 mt-1">
          {{ formatSubTitle(product.subTitle, product.type) }}
        </p>

        <!-- 기준 정보 -->
        <p class="text-xs text-gray-500 mt-1">
          {{ getBaseText(product.type) }}
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <!-- 찜하기 버튼 -->
        <button
          @click.stop="toggleLike"
          class="text-xl hover:scale-110 transition-transform"
          :title="isLiked ? '찜 해제' : '찜하기'"
          :class="[
            isLiked
              ? 'text-red-500 hover:scale-110'
              : 'text-gray-400 hover:text-gray-600 hover:scale-110',
          ]"
        >
          <Heart />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import Heart from '../icons/Heart.vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  // 부모 컴포넌트에서 찜 상태를 전달받는 prop
  isLiked: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['productClick', 'toggleLike']);

// 타입 정규화 헬퍼 함수
const normalizeType = type => {
  const actualType = Array.isArray(type) ? type[0] : type;
  return String(actualType).toLowerCase().trim();
};

// 상품 유형 라벨 변환
const getProductTypeLabel = type => {
  const normalizedType = normalizeType(type);
  const typeMap = {
    deposit: '예금',
    savings: '적금',
    fund: '펀드',
    pension: '연금',
    forex: '외화',
  };
  return typeMap[normalizedType] || normalizedType;
};

// 상품 유형별 색상 클래스 반환 함수
const getProductTypeStyles = type => {
  const normalizedType = normalizeType(type);
  const styleMap = {
    deposit: { backgroundColor: '#FFEFEE', color: '#FB0000' },
    savings: { backgroundColor: '#FFF4DF', color: '#F95A00' },
    fund: { backgroundColor: '#ECF0FF', color: '#1544BC' },
    pension: { backgroundColor: '#F9EFFA', color: '#CC0CCC' },
    forex: { backgroundColor: '#F9EFE3', color: '#995C14' },
  };
  // 해당하는 타입이 없으면 기본 회색 스타일을 반환
  return (
    styleMap[normalizedType] || {
      backgroundColor: '#6B7280',
      color: '#FFFFFF',
    }
  );
};

// 금융권 라벨 변환
const getFSectorLabel = sector => {
  const sectorMap = {
    1: '1금융권',
    2: '2금융권',
  };
  return sectorMap[sector] || `${sector}금융권`;
};

// tag1 포맷팅 (상품별로 다름)
const formatTag1 = (tag1, type) => {
  const normalizedType = normalizeType(type);
  switch (normalizedType) {
    case 'deposit':
      return `최소 ${tag1}개월`;
    case 'savings':
      return `최소 ${tag1}개월`;
    case 'forex':
      return tag1;
    case 'pension':
      return tag1 === 1 ? '확정급여형' : '확정기여형';
    case 'fund':
      return tag1; // 펀드 카테고리 그대로
    default:
      return tag1;
  }
};

// tag2 포맷팅 (상품별로 다름)
const formatTag2 = (tag2, type) => {
  const normalizedType = normalizeType(type);
  switch (normalizedType) {
    case 'deposit':
      return `최대 ${tag2}개월`;
    case 'savings':
      return `최대 ${tag2}개월`;
    case 'forex':
      return tag2;
    case 'pension':
      return tag2; // 연금 종류 그대로
    case 'fund':
      return tag2; // 펀드 테마 그대로
    default:
      return tag2;
  }
};

// tag3 포맷팅
const formatTag3 = (tag3, type) => {
  const normalizedType = normalizeType(type);
  switch (normalizedType) {
    case 'pension':
      return `위험도 ${tag3}`;
    case 'fund':
      return `투자경고 ${tag3}등급`;
    default:
      return tag3;
  }
};

// title 포맷팅 (상품별 메인 지표)
const formatTitle = (title, type) => {
  if (!title) return '-';

  const normalizedType = normalizeType(type);
  switch (normalizedType) {
    case 'deposit':
    case 'savings':
      return `연 ${parseFloat(title).toFixed(2)}%`;
    case 'pension':
      // pension_type이 1이면 수익률, 아니면 가격변동률
      return title.toString().includes('%')
        ? title
        : `${parseFloat(title).toFixed(2)}%`;
    case 'fund':
      return `${parseFloat(title).toFixed(2)}%`;
    case 'forex':
      return `${parseFloat(title).toFixed(2)}%`;
    default:
      return title;
  }
};

// subTitle 포맷팅 (상품별 서브 지표)
const formatSubTitle = (subTitle, type) => {
  if (!subTitle) return '';

  const normalizedType = normalizeType(type);
  switch (normalizedType) {
    case 'deposit':
      return `기본금리 ${parseFloat(subTitle).toFixed(2)}%`;
    case 'savings':
      return `기본금리 ${parseFloat(subTitle).toFixed(2)}%`;
    case 'pension':
      return `최소보장 ${parseFloat(subTitle).toFixed(2)}%`;
    case 'forex':
      return subTitle; // 환율우대방법 그대로
    default:
      return null;
  }
};

// 기준 텍스트
const getBaseText = type => {
  const normalizedType = normalizeType(type);
  switch (normalizedType) {
    case 'deposit':
    case 'savings':
      return '우대금리 포함';
    case 'pension':
      return '연금 기준';
    case 'fund':
      return '최근 수익률 기준';
    case 'forex':
      return '환율 기준';
    default:
      return '';
  }
};

// // 가입기간 범위 텍스트
// const getTermRangeText = () => {
//   const { saveTerm, min_save_term, max_save_term } = props.product;

//   if (saveTerm) {
//     return `가입기간: ${saveTerm}개월`;
//   } else if (min_save_term && max_save_term) {
//     return `가입기간: ${min_save_term}~${max_save_term}개월`;
//   } else if (min_save_term) {
//     return `최소가입기간: ${min_save_term}개월`;
//   }
//   return '';
// };

// 금액 포맷팅 (천 단위 구분)
const formatAmount = amount => {
  const num = parseInt(amount || 0);
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(0)}억원`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(0)}만원`;
  } else {
    return `${num.toLocaleString()}원`;
  }
};

// 이벤트 핸들러들
const toggleLike = () => {
  emit('toggleLike', {
    productId: props.product.productId,
    isLiked: props.isLiked,
  });
};

const handleProductClick = () => {
  emit('productClick', props.product);
};
</script>

<style scoped>
/* 추가적인 스타일이 필요한 경우 */
</style>
