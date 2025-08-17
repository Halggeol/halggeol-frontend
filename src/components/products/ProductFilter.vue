<template>
  <!-- 태블릿용 모달 -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity hidden tablet:block"
    @click="$emit('close')"
  ></div>

  <aside
    :class="[
      'bg-white w-64 h-screen sticky top-14 flex-shrink-0',
      'tablet:fixed tablet:top-14 tablet:left-0 tablet:h-full tablet:z-50 tablet:transition-transform tablet:duration-300 tablet:ease-in-out',
      isOpen ? 'tablet:translate-x-0' : 'tablet:-translate-x-full',
    ]"
  >
    <div
      class="px-5 pt-5 pb-20 border-r border-gray-200 h-full overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-body02 font-bold text-fg-primary">필터</h2>
        <button
          @click="$emit('close')"
          class="hidden tablet:block text-gray-500 hover:text-gray-800"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          @click="resetFilters"
          class="tablet:hidden text-callout text-fg-gray hover:text-fg-secondary hover:underline focus:outline-none"
        >
          초기화
        </button>
      </div>

      <!-- 상품 유형 필터 -->
      <div class="mb-6 border-b border-gray-200 pb-6">
        <h3 class="title03 mb-4 text-fg-primary">상품 유형</h3>
        <ul class="space-y-3">
          <li>
            <label
              for="type-all"
              class="flex items-center cursor-pointer text-callout text-fg-primary"
            >
              <input
                id="type-all"
                type="checkbox"
                v-model="isAllSelected"
                class="form-checkbox h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2">전체</span>
            </label>
          </li>
          <li v-for="type in productTypes" :key="type.value">
            <label
              :for="`type-${type.value}`"
              class="flex items-center cursor-pointer text-callout text-fg-primary"
            >
              <input
                :id="`type-${type.value}`"
                type="checkbox"
                :value="type.value"
                v-model="selectedProductTypes"
                class="form-checkbox h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2">{{ type.label }}</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- 은행 필터 -->
      <div class="mb-6 border-b border-gray-200 pb-6">
        <h3 class="title03 mb-4 text-fg-primary flex items-center">
          은행/판매사
          <span
            class="inline-block relative group ml-1 align-top tooltip"
            data-tip="1금융권은 은행법의 적용을 받는 금융기관입니다."
          >
            <Tooltiip class="text-fg-secondary" />
          </span>
        </h3>
        <ul class="space-y-3">
          <li>
            <label
              for="bank-all"
              class="flex items-center cursor-pointer text-callout text-fg-primary"
            >
              <input
                id="bank-all"
                type="checkbox"
                v-model="isAllBanksSelected"
                class="form-checkbox h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2">전체</span>
            </label>
          </li>
          <li v-for="bank in banks" :key="bank.value">
            <label
              :for="`bank-${bank.value}`"
              class="flex items-center cursor-pointer text-callout text-fg-primary"
            >
              <input
                :id="`bank-${bank.value}`"
                type="checkbox"
                :value="bank.value"
                v-model="selectedBanks"
                class="form-checkbox h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2">{{ bank.label }}</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- 가입 기간 필터 -->
      <div class="mb-6 border-b border-gray-200 pb-6">
        <h3 class="title03 mb-4 text-fg-primary">최소 가입 기간</h3>
        <ul class="space-y-3">
          <li v-for="period in subscriptionPeriods" :key="period.label">
            <label
              :for="`period-${period.value}`"
              class="flex items-center cursor-pointer text-callout text-fg-primary"
            >
              <input
                type="radio"
                :id="`period-${period.value}`"
                :value="period.value"
                v-model="selectedSubscriptionPeriod"
                class="form-radio h-4 w-4 text-primary-500 border-gray-300 focus:ring-primary-500"
              />
              <span class="ml-2">{{ period.label }}</span>
            </label>
          </li>
        </ul>
      </div>

      <!-- 가입 금액 필터 -->
      <div class="mb-6">
        <h3 class="title03 mb-4 text-fg-primary">최소 가입 금액</h3>
        <div class="flex items-center space-x-2">
          <div class="relative flex-grow">
            <input
              type="text"
              v-model="inputAmount"
              placeholder="금액 입력"
              class="w-full p-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:border-primary text-callout"
              @input="formatAmountOnInput"
              @keyup.enter="handleAmountInput"
            />
            <button
              v-if="inputAmount"
              @click="clearInputAmount"
              class="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <button
            @click="handleAmountInput"
            class="bg-gray-200 text-fg-primary px-4 py-2 rounded-md font-semibold text-body02 hover:bg-gray-300 whitespace-nowrap"
          >
            확인
          </button>
        </div>
        <p class="mt-2 text-caption text-gray-500">10만원 이상부터 가능해요</p>
        <p v-if="errorMessage" class="mt-1 text-caption text-red-500">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, defineEmits, computed, defineProps } from 'vue';
import Tooltiip from '../icons/common/Tooltiip.vue';

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
  isOpen: {
    type: Boolean,
    default: false,
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
  { label: '저축은행', value: 2 },
];
const bankValues = banks.map(b => b.value);
const selectedBanks = ref([]);

const subscriptionPeriods = [
  { label: '전체', value: null },
  { label: '6개월 이상', value: 6 },
  { label: '12개월 이상', value: 12 },
  { label: '24개월 이상', value: 24 },
  { label: '36개월 이상', value: 36 },
];
const selectedSubscriptionPeriod = ref(null);
const inputAmount = ref(null);
const selectedAmount = ref(null);

const emit = defineEmits(['filtersChanged', 'close']);

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
