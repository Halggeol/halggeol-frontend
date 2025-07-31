<template>
  <div class="w-64 p-5 border-r border-gray-200 bg-gray-50 flex-shrink-0">
    <!-- 상품 유형 필터 -->
    <div class="mb-6 relative">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">상품 유형</h3>
      <button
        @click="resetFilters"
        class="absolute top-0 right-0 text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-0"
      >
        초기화
      </button>
      <ul>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="typeAll"
            value="all"
            :checked="
              selectedProductTypes.length === productTypeValues.length &&
              productTypeValues.length > 0
            "
            @change="toggleAllProductTypes"
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
            :checked="
              selectedBanks.length === bankValues.length &&
              bankValues.length > 0
            "
            @change="toggleAllBanks"
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
      <h3 class="text-lg font-semibold mb-3 text-gray-800">가입 기간</h3>
      <ul>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="periodFree"
            value=""
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="periodFree"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >자유</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period6M"
            value="6M"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period6M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >6개월</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period12M"
            value="12M"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period12M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >12개월</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period24M"
            value="24M"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period24M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >24개월</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="radio"
            id="period36M"
            value="36M"
            v-model="selectedSubscriptionPeriod"
            class="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label
            for="period36M"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >36개월</label
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
            class="w-full p-2 pr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
import { ref, watch } from 'vue';

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
const selectedProductTypes = ref([]); // 기본 해제 상태

const banks = [
  { label: '1금융권', value: 'first_tier' },
  { label: '2금융권', value: 'second_tier' },
];
const bankValues = banks.map(b => b.value);
const selectedBanks = ref([]); // 기본 해제 상태

const selectedSubscriptionPeriod = ref(null);

const inputAmount = ref(null);
const selectedAmount = ref(0);

const emit = defineEmits(['update:filters']);

function toggleAllProductTypes(event) {
  if (event.target.checked) {
    selectedProductTypes.value = [...productTypeValues];
  } else {
    selectedProductTypes.value = [];
  }
}

function toggleAllBanks(event) {
  if (event.target.checked) {
    selectedBanks.value = [...bankValues];
  } else {
    selectedBanks.value = [];
  }
}

const handleAmountInput = () => {
  if (inputAmount.value !== null && !isNaN(inputAmount.value)) {
    if (inputAmount.value >= MIN_AMOUNT) {
      selectedAmount.value = inputAmount.value;
      errorMessage.value = ''; // 에러 메시지 제거
    } else {
      errorMessage.value = '10만원 이상 입력해 주세요.';
      selectedAmount.value = 0;
    }
  } else {
    selectedAmount.value = 0;
    errorMessage.value = '유효한 숫자를 입력해 주세요.';
  }
};

const clearInputAmount = () => {
  inputAmount.value = null;
  selectedAmount.value = 0;
};

// 모든 필터를 초기화하는 함수
const resetFilters = () => {
  selectedProductTypes.value = [];
  selectedBanks.value = [];
  selectedSubscriptionPeriod.value = ''; // '자유'로 초기화
  inputAmount.value = null;
  selectedAmount.value = 0;
  errorMessage.value = '';
  // 필터 초기화 후, 바로 상위 컴포넌트로 변경된 필터 상태를 emit (watch에 의해 자동 호출될 것임)
};

watch(
  [
    selectedProductTypes,
    selectedBanks,
    selectedSubscriptionPeriod,
    selectedAmount,
  ],
  ([newTypes, newBanks, newPeriod, newSelectedAmount]) => {
    emit('update:filters', {
      productTypes: newTypes,
      banks: newBanks,
      subscriptionPeriod: newPeriod || null,
      subscriptionAmount: newSelectedAmount,
      minAmount: newSelectedAmount,
      maxAmount: newSelectedAmount > 0 ? newSelectedAmount : 100000000,
    });
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
  font-size: 0.8rem; /* 80% 크기 */
  color: #a0aec0; /* gray-400 */
}
</style>
