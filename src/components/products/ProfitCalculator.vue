<template>
  <BaseCard
    v-if="shouldShowCalculator"
    size="lg"
    variant="outline"
    class="profit-calculator"
  >
    <h3
      class="text-body01 tablet:text-title-sm wide:text-title-sm text-fg-primary mb-6"
    >
      <div
        class="tooltip"
        data-tip="금융정보로 기록된 기본 금리/최고 금리를 기준으로 저축 금액에 따른 단순한 수익 금액을 산출합니다."
      >
        <span class="underline font-semibold">수익 계산기</span>
      </div>
    </h3>

    <div class="bg-secondary-50 rounded-lg p-6">
      <div
        class="flex flex-col tablet:flex-row wide:flex-row items-center justify-center flex-wrap gap-x-2 gap-y-3 text-footnote tablet:text-body01 wide:text-body01 text-fg-secondary"
      >
        <!-- Part 1: Rate -->
        <div class="flex items-center gap-1">
          <div class="relative inline-block">
            <button
              type="button"
              @click="dropdownOpen = !dropdownOpen"
              class="font-semibold text-status-blue cursor-pointer border-b-2 border-status-blue hover:border-status-blue transition-colors duration-200 inline-flex items-center"
            >
              {{
                (rateOptions &&
                  rateOptions[selectedRateIndex] &&
                  rateOptions[selectedRateIndex].label) ||
                '금리'
              }}
              ({{ currentInterestRate }}%)
              <svg
                class="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute z-10 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <ul class="py-1">
                <li
                  v-for="(option, index) in calculatorProps.rateOptions || []"
                  :key="index"
                >
                  <a
                    @click="
                      selectRate(index);
                      dropdownOpen = false;
                    "
                    :class="[
                      'block px-3 py-2 text-left hover:bg-secondary-50 transition-colors rounded-md cursor-pointer text-callout',
                      selectedRateIndex === index
                        ? 'bg-status-blue/10 text-status-blue font-semibold'
                        : 'text-fg-primary',
                    ]"
                  >
                    <span class="font-medium">{{ option.label }}</span>
                    <span class="text-fg-secondary ml-2"
                      >({{ option.value }}%)</span
                    >
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <span>로</span>
        </div>

        <!-- Part 2: Amount -->
        <div class="flex items-center gap-1">
          <div class="inline-flex items-center">
            <input
              v-model="displayAmountInput"
              @input="updateFromInput"
              @blur="formatAmount"
              @focus="selectAllText"
              @keydown.enter="formatAmount"
              class="inline-block text-status-blue font-bold bg-transparent border-b-2 border-status-blue/50 focus:border-status-blue hover:border-status-blue transition-colors duration-200 outline-none px-2 py-1 text-center min-w-[100px] max-w-[140px] rounded-sm text-footnote tablet:text-body01 wide:text-body01"
              type="text"
              placeholder="0"
            />
            <span class="font-semibold text-status-blue ml-1">원</span>
          </div>
          <span>만큼 저축했다면</span>
        </div>

        <!-- Part 3: Result -->
        <div class="flex items-center gap-1">
          <span>예상수익액은</span>
          <span
            class="font-bold text-body01 tablet:text-title-sm wide:text-title-sm text-status-blue inline-block min-w-[100px] tablet:min-w-[120px] wide:min-w-[120px] text-right"
            >{{ formattedProfit }}원</span
          >
          <span>입니다.</span>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  productDetail: {
    type: Object,
    required: true,
  },
  maxAmount: {
    type: Number,
    default: 1000000000,
  },
});

const amount = ref(100000);

const selectedRateIndex = ref(0);
const dropdownOpen = ref(false);

// prefix 추출
const idPrefix = computed(() => {
  if (
    props.productDetail &&
    props.productDetail.id &&
    typeof props.productDetail.id === 'string'
  ) {
    return props.productDetail.id.charAt(0).toUpperCase();
  }
  return '';
});

// 계산기 표시 여부 (F, X, A는 숨김)
const shouldShowCalculator = computed(() => {
  const prefix = idPrefix.value;
  return !['F', 'X', 'A'].includes(prefix);
});

// prefix별 계산기 설정
const calculatorProps = computed(() => {
  if (!props.productDetail)
    return {
      rateOptions: [
        { label: '기본금리', value: 2.55 },
        { label: '최대금리', value: 3.15 },
      ],
      period: 12,
      minAmount: 10000,
    };

  const prefix = idPrefix.value;

  switch (prefix) {
    case 'F': // 펀드
      return {
        rateOptions: [
          {
            label: '연 수익률',
            value: parseFloat(props.productDetail.rate) || 0,
          },
          {
            label: '기본 수익률',
            value: parseFloat(props.productDetail.rate) || 0,
          },
        ],
        period: 12,
        minAmount: 10000,
      };
    case 'X': // 외화
      return {
        rateOptions: [
          {
            label: '3개월 전 대비',
            value: parseFloat(props.productDetail.rate) || 0,
          },
          {
            label: '1년 전 대비',
            value: parseFloat(props.productDetail.rate) || 0,
          },
        ],
        period: 12,
        minAmount: 10000,
      };
    case 'A' || 'C': // 연금
      return {
        rateOptions: [
          {
            label: '연 수익률',
            value: parseFloat(props.productDetail.rate) || 0,
          },
          {
            label: '연 수익률',
            value: parseFloat(props.productDetail.rate) || 0,
          },
        ],
        period: 12,
        minAmount: 10000,
      };
    default: // D, S (예금, 적금)
      return {
        rateOptions: [
          {
            label: '일반 금리',
            value: parseFloat(props.productDetail.rate) || 0,
          },
          {
            label: '최대 금리',
            value: parseFloat(props.productDetail.primeRate) || 0,
          },
        ],
        period: parseInt(props.productDetail.saveTerm) || 12,
        minAmount: 10000,
      };
  }
});

// 현재 선택된 금리
const currentInterestRate = computed(() => {
  const options = calculatorProps.value.rateOptions || [];
  const selectedOption = options[selectedRateIndex.value];
  return selectedOption && selectedOption.value ? selectedOption.value : 3.15;
});

// 입력창용 금액
const displayAmountInput = ref('100,000');

// 수익 계산
const profit = computed(() => {
  const principal = amount.value;
  const rate = currentInterestRate.value / 100;
  const time = calculatorProps.value.period / 12;

  // 단리 계산: 원금 × 이율 × 기간
  const grossProfit = principal * rate * time;
  return Math.floor(grossProfit);
});

// 수익 포맷팅
const formattedProfit = computed(() => {
  return profit.value.toLocaleString();
});

// 금리 선택
const selectRate = index => {
  selectedRateIndex.value = index;
  dropdownOpen.value = false;
};

const selectAllText = event => {
  event.target.select();
};

// 입력값 업데이트
const updateFromInput = event => {
  const value = event.target.value.replace(/,/g, '');

  // 빈 문자열이면 0으로 설정
  if (value === '' || value === null || value === undefined) {
    amount.value = 0;
    return;
  }

  const numValue = parseInt(value) || 0;
  const clampedValue = Math.max(0, Math.min(props.maxAmount, numValue));
  amount.value = clampedValue;
  displayAmountInput.value = clampedValue.toLocaleString();
};

// 금액 포맷팅
const formatAmount = () => {
  // 입력값이 비어있으면 0으로 설정
  if (displayAmountInput.value === '') {
    amount.value = 0;
  }
  displayAmountInput.value = amount.value.toLocaleString();
};

// Close dropdown when clicking outside
const handleClickOutside = event => {
  // Check if the click is outside the dropdown button and the dropdown content
  const dropdownButton = event.target.closest('.relative.inline-block button');
  const dropdownContent = event.target.closest('.absolute.z-10');

  if (dropdownOpen.value && !dropdownButton && !dropdownContent) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  // 초기값 설정
  amount.value = 100000;
  displayAmountInput.value = '100,000';
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
