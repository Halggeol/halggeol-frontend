<template>
  <div
    class="w-64 p-5 border-r border-gray-200 bg-gray-50 flex-shrink-0 sticky top-0 h-screen"
  >
    <!-- 상품 유형 필터 -->
    <div class="mb-6 relative">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">상품 유형</h3>
      <button
        @click="resetFilters"
        class="absolute top-0 right-0 text-sm text-gray-500 hover:text-gray-700 underline focus:outline-none focus:ring-0"
      >
        초기화
      </button>
      <ul>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="typeAll"
            value="all"
            v-model="isAllSelected"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label for="typeAll" class="ml-2 text-sm text-gray-700 cursor-pointer"
            >전체</label
          >
        </li>
        <li
          v-for="type in productTypes"
          :key="type.value"
          class="mb-2 flex items-center"
        >
          <input
            type="checkbox"
            :id="'type' + type.value"
            :value="type.value"
            v-model="selectedProductTypes"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            :for="'type' + type.value"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >{{ type.label }}</label
          >
        </li>
      </ul>
    </div>

    <!-- 은행 필터 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">은행/판매사</h3>
      <ul>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="bankAll"
            value="all"
            v-model="isAllBanksSelected"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label for="bankAll" class="ml-2 text-sm text-gray-700 cursor-pointer"
            >전체</label
          >
        </li>
        <li
          v-for="bank in banks"
          :key="bank.value"
          class="mb-2 flex items-center"
        >
          <input
            type="checkbox"
            :id="'bank' + bank.value"
            :value="bank.value"
            v-model="selectedBanks"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            :for="'bank' + bank.value"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >{{ bank.label }}</label
          >
        </li>
      </ul>
    </div>

    <!-- 가입 기간 필터 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">최소 가입 기간</h3>
      <ul>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="periodFree"
            :value="null"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="periodFree"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >전체</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period6M"
            :value="6"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period6M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >6개월 이상</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period12M"
            :value="12"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period12M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >12개월 이상</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period24M"
            :value="24"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period24M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >24개월 이상</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period36M"
            :value="36"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period36M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >36개월 이상</label
          >
        </li>
      </ul>
    </div>

    <!-- 가입 금액 필터 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">최소 가입 금액</h3>
      <div class="flex items-center space-x-2">
        <div class="relative flex-grow">
          <input
            type="number"
            v-model.number="inputAmount"
            placeholder="금액을 입력해 주세요"
            class="w-full p-2 pr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-callout"
            @keyup.enter="handleAmountInput"
          />
          <button
            v-if="inputAmount !== null && inputAmount !== ''"
            @click="clearInputAmount"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <button
          @click="handleAmountInput"
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent whitespace-nowrap min-w-[60px]"
        >
          확인
        </button>
      </div>
      <p class="mt-2 text-xs text-gray-500">10만원 이상부터 가능해요</p>
      <p v-if="errorMessage" class="mt-1 text-xs text-red-500">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, computed, defineProps } from 'vue';

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      types: [],
      fSectors: [],
      saveTerm: null,
      minAmount: null,
    }),
  },
});

const MIN_AMOUNT = 100000;
const errorMessage = ref('');

const productTypes = [
  { label: '예금', value: 'deposit' },
  { label: '적금', value: 'savings' },
  { label: '펀드', value: 'fund' },
  { label: '연금', value: 'pension' },
  { label: '외화', value: 'forex' },
];
const productTypeValues = productTypes.map(t => t.value);

const selectedProductTypes = ref([]);
const banks = [
  { label: '1금융권', value: 1 },
  { label: '2금융권', value: 2 },
];
const bankValues = banks.map(b => b.value);
const selectedBanks = ref([]);

const selectedSubscriptionPeriod = ref(null);
const inputAmount = ref(null);
const selectedAmount = ref(null);

const emit = defineEmits(['filtersChanged']);

const isAllSelected = computed({
  get() {
    return selectedProductTypes.value.length === productTypeValues.length;
  },
  set(newValue) {
    if (newValue) {
      selectedProductTypes.value = [...productTypeValues];
    } else {
      selectedProductTypes.value = [];
    }
  },
});

const isAllBanksSelected = computed({
  get() {
    return (
      selectedBanks.value.length === bankValues.length && bankValues.length > 0
    );
  },
  set(newValue) {
    if (newValue) {
      selectedBanks.value = [...bankValues];
    } else {
      selectedBanks.value = [];
    }
  },
});

const handleAmountInput = () => {
  if (
    inputAmount.value === null ||
    isNaN(inputAmount.value) ||
    inputAmount.value === ''
  ) {
    selectedAmount.value = null;
    errorMessage.value = '유효한 숫자를 입력해 주세요.';
  } else if (inputAmount.value >= MIN_AMOUNT) {
    selectedAmount.value = inputAmount.value;
    errorMessage.value = '';
  } else {
    errorMessage.value = '10만원 이상 입력해 주세요.';
    selectedAmount.value = null;
  }
};

const clearInputAmount = () => {
  inputAmount.value = null;
  selectedAmount.value = null;
  errorMessage.value = '';
};

const resetFilters = () => {
  selectedProductTypes.value = [];
  selectedBanks.value = [];
  selectedSubscriptionPeriod.value = null;
  inputAmount.value = null;
  selectedAmount.value = null;
  errorMessage.value = '';
};

const emitFilters = () => {
  const filters = {
    types:
      selectedProductTypes.value.length > 0 ? selectedProductTypes.value : [],
    fSectors: selectedBanks.value.length > 0 ? selectedBanks.value : [],
    saveTerm: selectedSubscriptionPeriod.value,
    minAmount: selectedAmount.value ? selectedAmount.value : null,
  };
  emit('filtersChanged', filters);
};

// 로컬 상태 변화를 감지하여 emit 이벤트를 발생시킵니다.
watch(
  [
    selectedProductTypes,
    selectedBanks,
    selectedSubscriptionPeriod,
    selectedAmount,
  ],
  () => {
    emitFilters();
  },
  { deep: true }
);

// 부모 Prop의 변화를 감지하여 로컬 상태를 업데이트합니다.
watch(
  () => props.initialFilters,
  newFilters => {
    selectedProductTypes.value = Array.isArray(newFilters.types)
      ? newFilters.types
      : [];
    selectedBanks.value = Array.isArray(newFilters.fSectors)
      ? newFilters.fSectors
      : [];
    selectedSubscriptionPeriod.value = newFilters.saveTerm;
    inputAmount.value = newFilters.minAmount;
    selectedAmount.value = newFilters.minAmount;
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
/* Tailwind CSS 위주라 별도 스타일 거의 필요 없음 */
/* 크롬, 사파리, 엣지 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 파이어폭스 */
input[type='number'] {
  -moz-appearance: textfield;
}

/* placeholder 폰트 크기 및 색상 조정 */
input::placeholder {
  font-size: 1rem; /* 80% 크기 */
  color: #a0aec0; /* gray-400 */
}
</style>
