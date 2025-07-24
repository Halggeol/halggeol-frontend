<template>
  <div class="w-64 p-5 border-r border-gray-200 bg-gray-50 flex-shrink-0">
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">상품 유형</h3>
      <ul>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="typeDeposit"
            value="deposit"
            v-model="selectedProductTypes"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="typeDeposit"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >예금</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="typeSavings"
            value="savings"
            v-model="selectedProductTypes"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="typeSavings"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >적금</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="typeFund"
            value="fund"
            v-model="selectedProductTypes"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="typeFund"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >펀드</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="typePension"
            value="pension"
            v-model="selectedProductTypes"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="typePension"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >연금</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="typeForex"
            value="forex"
            v-model="selectedProductTypes"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="typeForex"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >외화</label
          >
        </li>
      </ul>
    </div>

    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">은행</h3>
      <ul>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="bankFirstTier"
            value="first_tier"
            v-model="selectedBanks"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="bankFirstTier"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >1금융권</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="bankSecondTier"
            value="second_tier"
            v-model="selectedBanks"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="bankSecondTier"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >2금융권</label
          >
        </li>
        <li class="mb-2 flex items-center">
          <input
            type="checkbox"
            id="bankAssetManagement"
            value="asset_management"
            v-model="selectedBanks"
            class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label
            for="bankAssetManagement"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
            >자산운용</label
          >
        </li>
      </ul>
    </div>

    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">가입 기간</h3>
      <ul>
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

    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3 text-gray-800">가입 금액</h3>
      <div class="flex items-center space-x-2">
        <div class="relative flex-grow">
          <input
            type="number"
            v-model.number="inputAmount"
            placeholder="금액을 입력해 주세요"
            class="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        >
          확인
        </button>
      </div>
      <p class="mt-2 text-xs text-gray-500">10만원 이상부터 가능해요</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// 상품 유형 필터
const selectedProductTypes = ref([]);

// 은행 필터
const selectedBanks = ref([]);

// 가입 기간 필터: 라디오 버튼은 하나의 값만 가질 수 있으므로, 배열이 아닌 단일 값으로 초기화합니다.
const selectedSubscriptionPeriod = ref(null);

// 가입 금액 필터 (새로운 UI에 맞게 변경)
const inputAmount = ref(null); // 사용자가 입력 필드에 직접 입력하는 값
const selectedAmount = ref(0); // 사용자가 '확인'을 눌렀을 때 최종적으로 필터링에 사용될 금액

// Watchers to emit filter changes
const emit = defineEmits(['update:filters']);

// 금액을 필터에 적용하는 함수
const handleAmountInput = () => {
  // inputAmount가 유효한 숫자인지 확인
  if (
    inputAmount.value !== null &&
    !isNaN(inputAmount.value) &&
    inputAmount.value >= 0
  ) {
    selectedAmount.value = inputAmount.value;
  } else {
    selectedAmount.value = 0; // 유효하지 않으면 0 또는 원하는 기본값으로 설정
  }
};

// 입력 필드 지우기
const clearInputAmount = () => {
  inputAmount.value = null;
  selectedAmount.value = 0; // 입력 필드가 지워지면 선택된 금액도 초기화
};

watch(
  [
    selectedProductTypes,
    selectedBanks,
    selectedSubscriptionPeriod,
    selectedAmount, // 이제 selectedSubscriptionAmount 대신 selectedAmount를 watch합니다.
  ],
  ([newTypes, newBanks, newPeriod, newSelectedAmount]) => {
    emit('update:filters', {
      productTypes: newTypes,
      banks: newBanks,
      subscriptionPeriod: newPeriod,
      // 가입 금액은 이제 inputAmount 대신 selectedAmount를 사용합니다.
      // 실제 필터링 로직에서 이 값을 어떻게 사용할지에 따라 minAmount, maxAmount로 매핑합니다.
      subscriptionAmount: newSelectedAmount, // 이 값 자체를 전달하거나,
      minAmount: newSelectedAmount, // 또는 최소 금액으로 활용
      maxAmount: newSelectedAmount > 0 ? newSelectedAmount : 100000000, // 입력값이 있으면 해당 값으로 최대도 설정하거나, 무한대로 설정 (조정 필요)
    });
  },
  { deep: true, immediate: true } // immediate: true를 추가하여 컴포넌트 마운트 시 초기값으로 한 번 emit
);

// Helper function to format currency (for display purposes)
const formatCurrency = value => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0, // 소수점 제거
  }).format(value);
};
</script>

<style scoped>
/*
  Tailwind CSS를 사용하면 대부분의 스타일을 인라인 클래스로 처리합니다.
  따라서 <style scoped> 블록은 거의 비어있게 되거나,
  Tailwind에서 제공하지 않는 커스텀 CSS 또는 오버라이드를 위해 사용됩니다.
*/
</style>
