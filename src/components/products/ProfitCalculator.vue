<template>
  <BaseCard
    v-if="shouldShowCalculator"
    size="lg"
    variant="outline"
    class="profit-calculator"
  >
    <h3 class="title02 text-fg-primary flex items-center justify-start mb-6">
      수익계산기
      <span
        class="inline-block relative group ml-1 tooltip"
        data-tip="금융정보로 기록된 기본 금리/최고 금리를 기준으로 저축 금액에 따른 단순한 수익 금액을 산출합니다."
      >
        <Tooltiip class="text-fg-secondary" />
      </span>
    </h3>

    <div class="rounded-lg p-6">
      <div class="calculator-sentence">
        <!-- Part 1: Rate -->
        <div class="sentence-part">
          <div class="relative inline-block">
            <button
              type="button"
              @click="dropdownOpen = !dropdownOpen"
              class="rate-selector-button"
              :style="themeStyles.textAndBorderColor"
            >
              {{
                (calculatorProps.rateOptions &&
                  calculatorProps.rateOptions[selectedRateIndex] &&
                  calculatorProps.rateOptions[selectedRateIndex].label) ||
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

            <div v-if="dropdownOpen" class="dropdown-menu">
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
                    class="dropdown-item"
                    :style="
                      selectedRateIndex === index ? themeStyles.highlightBg : {}
                    "
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
        <div class="sentence-part">
          <div class="inline-flex items-center">
            <input
              v-model="displayAmountInput"
              @input="updateFromInput"
              @blur="formatAmount"
              @focus="selectAllText"
              @keydown.enter="formatAmount"
              class="amount-input"
              :style="themeStyles.textAndBorderColor"
              type="text"
              placeholder="0"
            />
            <span class="font-semibold ml-1" :style="themeStyles.textColor"
              >원</span
            >
          </div>
          <span>만큼 저축했다면</span>
        </div>

        <!-- Part 3: Result -->
        <div class="sentence-part">
          <span>예상수익액은</span>
          <span class="profit-result" :style="themeStyles.textColor"
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
import Tooltiip from '../icons/Tooltiip.vue';

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

const shouldShowCalculator = computed(() => {
  const prefix = idPrefix.value;
  return !['F', 'X', 'A'].includes(prefix);
});

const themeStyles = computed(() => {
  const prefix = idPrefix.value;
  const colorMap = {
    D: '#FB0000', // fg-deposit
    S: '#F95A00', // fg-savings
    C: '#CC0CCC', // fg-pension
  };
  const color = colorMap[prefix] || '#FFBC00';

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return {
    textColor: { color: color },
    borderColor: { borderColor: color },
    textAndBorderColor: { color: color, borderColor: color },
    highlightBg: { backgroundColor: hexToRgba(color, 0.1), color: color },
  };
});

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
  const { rate, primeRate, saveTerm } = props.productDetail;

  switch (prefix) {
    case 'C': // Pension
      return {
        rateOptions: [{ label: '연 수익률', value: parseFloat(rate) || 0 }],
        period: 12,
        minAmount: 10000,
      };
    default: // D, S (Deposit, Savings)
      return {
        rateOptions: [
          { label: '일반 금리', value: parseFloat(rate) || 0 },
          { label: '최대 금리', value: parseFloat(primeRate) || 0 },
        ],
        period: parseInt(saveTerm) || 12,
        minAmount: 10000,
      };
  }
});

const currentInterestRate = computed(() => {
  const options = calculatorProps.value.rateOptions || [];
  const selectedOption = options[selectedRateIndex.value];
  return selectedOption?.value ?? 0;
});

const displayAmountInput = ref('100,000');

const profit = computed(() => {
  const principal = amount.value;
  const rate = currentInterestRate.value / 100;
  const time = calculatorProps.value.period / 12;
  const grossProfit = principal * rate * time;
  return Math.floor(grossProfit);
});

const formattedProfit = computed(() => {
  return profit.value.toLocaleString();
});

const selectRate = index => {
  selectedRateIndex.value = index;
  dropdownOpen.value = false;
};

const selectAllText = event => {
  event.target.select();
};

const updateFromInput = event => {
  const value = event.target.value.replace(/,/g, '');
  if (value === '' || value === null || value === undefined) {
    amount.value = 0;
    return;
  }
  const numValue = parseInt(value, 10) || 0;
  const clampedValue = Math.max(0, Math.min(props.maxAmount, numValue));
  amount.value = clampedValue;
  displayAmountInput.value = clampedValue.toLocaleString();
};

const formatAmount = () => {
  if (displayAmountInput.value === '') {
    amount.value = 0;
  }
  displayAmountInput.value = amount.value.toLocaleString();
};

const handleClickOutside = event => {
  const dropdownButton = event.target.closest('.relative.inline-block button');
  const dropdownContent = event.target.closest('.absolute.z-10');
  if (dropdownOpen.value && !dropdownButton && !dropdownContent) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  amount.value = 100000;
  displayAmountInput.value = '100,000';
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.calculator-sentence {
  @apply flex items-center justify-center flex-wrap gap-x-2 gap-y-3 text-fg-secondary text-body01;
}

.sentence-part {
  @apply flex items-center gap-1;
}

.rate-selector-button {
  @apply inline-flex items-center cursor-pointer border-b-2 font-semibold transition-colors duration-200;
}

.dropdown-menu {
  @apply absolute z-10 mt-2 w-52 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none;
}

.dropdown-item {
  @apply block cursor-pointer rounded-md px-3 py-2 text-left text-callout transition-colors hover:bg-gray-100 text-fg-primary;
}

.amount-input {
  @apply inline-block min-w-[100px] rounded-sm border-b-2 bg-transparent px-2 py-1 text-center font-bold outline-none transition-colors duration-200 text-body01;
}

.profit-result {
  @apply inline-block text-right font-bold text-body01 min-w-[120px];
}
</style>
