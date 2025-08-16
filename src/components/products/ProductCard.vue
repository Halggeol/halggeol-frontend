<template>
  <div
    class="flex justify-between items-center border-b p-5 hover:bg-gray-50 transition cursor-pointer h-[140px]"
    @click="handleProductClick"
  >
    <!-- 왼쪽 정보 영역 -->
    <div class="flex-1 max-w-[60%]">
      <p class="text-footnote text-fg-secondary">{{ product.company }}</p>
      <h3 class="text-body02 font-bold text-fg-primary mt-2">
        {{ product.name }}
      </h3>

      <!-- 태그들 -->
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          class="text-footnote px-2 py-[2px] rounded-full"
          :style="getProductTypeStyles(product.type)"
        >
          {{ getProductTypeLabel(product.type) }}
        </span>

        <template v-if="product.tag1">
          <template v-if="normalizeType(product.type) === 'forex'">
            <span
              v-for="currency in product.tag1.split(',')"
              :key="currency"
              class="text-footnote bg-[#83BCFF] text-white px-2 py-[2px] rounded-full"
            >
              {{ currency.trim() }}
            </span>
          </template>
          <span
            v-else
            class="text-footnote bg-[#83BCFF] text-white px-2 py-[2px] rounded-full"
          >
            {{ formatTag1(product.tag1, product.type) }}
          </span>
        </template>

        <span
          v-if="product.tag2 && normalizeType(product.type) !== 'forex'"
          class="text-footnote bg-[#62CDE7] text-white px-2 py-[2px] rounded-full"
        >
          {{ formatTag2(product.tag2, product.type) }}
        </span>

        <span
          v-if="product.tag3 && normalizeType(product.type) !== 'forex'"
          class="text-footnote bg-[#6CD18C] text-white px-2 py-[2px] rounded-full"
        >
          {{ formatTag3(product.tag3, product.type) }}
        </span>

        <span
          v-if="product.fSector"
          class="text-footnote bg-gray-500 text-white px-2 py-[2px] rounded-full"
        >
          {{ getFSectorLabel(product.fSector) }}
        </span>
      </div>

      <!-- 추가 정보 -->
      <div class="mt-3 text-xs text-gray-500 space-y-1">
        <div
          v-if="product.amount"
          class="text-footnote font-semibold text-status-blue"
        >
          가입금액: {{ formatAmount(product.amount) }}
        </div>
      </div>
    </div>

    <!-- 오른쪽 금리/수익률 정보 -->
    <div
      class="flex flex-col items-end justify-center space-y-3 ml-4 min-w-[35%]"
    >
      <div class="text-right">
        <p class="text-title01 font-bold text-fg-primary">
          {{ formatTitle(product.title, product.type) }}
        </p>
        <p v-if="product.subTitle" class="text-callout text-fg-secondary mt-2">
          {{ formatSubTitle(product.subTitle, product.type) }}
        </p>
        <p class="text-callout text-fg-secondary mt-2">
          {{ getBaseText(product.type) }}
        </p>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click.stop="toggleLike"
          class="text-xl hover:scale-110 transition-transform"
          :title="isLiked ? '찜 해제' : '찜하기'"
          :class="[isLiked ? 'text-status-red' : 'text-fg-gray']"
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
  product: { type: Object, required: true },
  isLiked: { type: Boolean, default: false },
});
const emit = defineEmits(['productClick', 'toggleLike']);

const normalizeType = type => {
  const actualType = Array.isArray(type) ? type[0] : type;
  return String(actualType).toLowerCase().trim();
};

const getProductTypeLabel = type => {
  const map = {
    deposit: '예금',
    savings: '적금',
    fund: '펀드',
    pension: '연금',
    forex: '외화',
  };
  return map[normalizeType(type)] || type;
};

const getProductTypeStyles = type => {
  const map = {
    deposit: { backgroundColor: '#FFEFEE', color: '#FB0000' },
    savings: { backgroundColor: '#FFF4DF', color: '#F95A00' },
    fund: { backgroundColor: '#ECF0FF', color: '#1544BC' },
    pension: { backgroundColor: '#F9EFFA', color: '#CC0CCC' },
    forex: { backgroundColor: '#F9EFE3', color: '#995C14' },
  };
  return (
    map[normalizeType(type)] || { backgroundColor: '#6B7280', color: '#FFF' }
  );
};

const getFSectorLabel = sector => {
  const map = { 1: '1금융권', 2: '2금융권' };
  return map[sector] || `${sector}금융권`;
};

const formatTag1 = (tag1, type) => {
  switch (normalizeType(type)) {
    case 'deposit':
    case 'savings':
      return `최소 ${tag1}개월`;
    case 'pension':
      return tag1 === 'TRUE' ? '안정형' : '공격형';
    default:
      return tag1;
  }
};

const formatTag2 = (tag2, type) => {
  switch (normalizeType(type)) {
    case 'deposit':
    case 'savings':
      return `최대 ${tag2}개월`;
    default:
      return tag2;
  }
};

const formatTag3 = (tag3, type) => {
  switch (normalizeType(type)) {
    case 'pension':
      return `위험도 ${tag3}`;
    case 'fund':
      return `투자경고 ${tag3}등급`;
    default:
      return tag3;
  }
};

const formatTitle = (title, type) => {
  if (!title) return '-';
  switch (normalizeType(type)) {
    case 'deposit':
    case 'savings':
    case 'fund':
    case 'pension':
    case 'forex':
      return `연 ${parseFloat(title).toFixed(2)}%`;
    default:
      return title;
  }
};

const formatSubTitle = (subTitle, type) => {
  if (!subTitle) return '';
  switch (normalizeType(type)) {
    case 'deposit':
    case 'savings':
      return `기본금리 ${parseFloat(subTitle).toFixed(2)}%`;
    case 'pension':
      return `최소보장 ${parseFloat(subTitle).toFixed(2)}%`;
    default:
      return subTitle;
  }
};

const getBaseText = type => {
  switch (normalizeType(type)) {
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

const formatAmount = amount => {
  const num = parseInt(amount || 0);
  if (num >= 100000000) return `${(num / 100000000).toFixed(0)}억원`;
  if (num >= 10000) return `${(num / 10000).toFixed(0)}만원`;
  return `${num.toLocaleString()}원`;
};

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
