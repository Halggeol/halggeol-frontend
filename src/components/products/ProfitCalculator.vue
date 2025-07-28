<template>
  <div class="profit-calculator bg-white rounded-lg border border-gray-200 p-6">
    <h3 class="text-lg font-medium text-gray-900 mb-6">수익 계산기</h3>

    <div class="space-y-6">
      <!-- 금액 입력 영역 -->
      <div class="space-y-4">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="text-gray-700 text-base leading-relaxed">
            <span
              @click="dropdownOpen = !dropdownOpen"
              class="font-medium text-blue-600 cursor-pointer border-b-2 border-blue-300 hover:border-blue-500 transition-colors duration-200"
              >{{ rateOptions[selectedRateIndex]?.label }} ({{
                currentInterestRate
              }}%)
            </span>
            <div
              v-if="dropdownOpen"
              class="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2 mt-1"
            >
              <button
                v-for="(option, index) in rateOptions"
                :key="index"
                @click="selectRate(index)"
                :class="[
                  'w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors rounded-md',
                  selectedRateIndex === index
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-900',
                ]"
              >
                <span class="font-medium">{{ option.label }}</span>
                <span class="text-gray-500 ml-2">({{ option.value }}%)</span>
              </button>
            </div>
            금리로
            <div class="inline-flex items-center mx-1">
              <input
                v-model="displayAmountInput"
                @input="updateFromInput"
                @blur="formatAmount"
                @focus="selectAllText"
                class="inline-block text-blue-600 font-bold bg-transparent border-b-2 border-blue-300 focus:border-blue-500 outline-none px-1 py-0 text-center min-w-[80px] max-w-[120px]"
                type="text"
                placeholder="금액"
              />
              <span class="font-medium text-blue-600 ml-1">원</span>
            </div>
            만큼 저축했다면 예상수익액은
            <span class="font-bold text-lg text-green-600"
              >{{ formattedProfit }}원</span
            >입니다.
          </div>
        </div>

        <!-- 게이지바 슬라이더 -->
        <div class="relative">
          <div class="w-full bg-gray-200 rounded-full h-3 relative">
            <div
              class="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-200"
              :style="{ width: sliderPercentage + '%' }"
            ></div>
            <!-- 슬라이더 핸들 -->
            <div
              class="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
              :style="{ left: 'calc(' + sliderPercentage + '% - 10px)' }"
              @mousedown="startDrag"
            ></div>
          </div>
          <!-- 클릭 가능한 영역 -->
          <div
            class="absolute inset-0 cursor-pointer"
            @click="handleSliderClick"
            ref="sliderTrack"
          ></div>
        </div>

        <!-- 금액 범위 표시 -->
        <div class="flex justify-between text-sm text-gray-500">
          <span>{{ minAmountFormatted }}</span>
          <span>{{ maxAmountFormatted }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  rateOptions: {
    type: Array,
    default: () => [
      { label: '기본금리', value: 2.55 },
      { label: '최대금리', value: 3.15 },
    ],
  },
  defaultRateIndex: {
    type: Number,
    default: 1, // 기본값으로 두 번째 옵션(최대금리) 선택
  },
  minAmount: {
    type: Number,
    default: 10000,
  },
  maxAmount: {
    type: Number,
    default: 10000000,
  },
  period: {
    type: Number,
    default: 12, // 개월
  },
});

const amount = ref(100000);
const isDragging = ref(false);
const sliderTrack = ref(null);
const selectedRateIndex = ref(props.defaultRateIndex);
const dropdownOpen = ref(false);

// 현재 선택된 금리
const currentInterestRate = computed(() => {
  return props.rateOptions[selectedRateIndex.value]?.value || 3.15;
});

// 표시용 금액 (콤마 포함)
const displayAmount = computed(() => {
  return amount.value.toLocaleString();
});

// 입력창용 금액
const displayAmountInput = ref('100,000');

// 슬라이더 퍼센테이지 계산
const sliderPercentage = computed(() => {
  const range = props.maxAmount - props.minAmount;
  const position = amount.value - props.minAmount;
  return Math.max(0, Math.min(100, (position / range) * 100));
});

// 수익 계산
const profit = computed(() => {
  const principal = amount.value;
  const rate = currentInterestRate.value / 100;
  const time = props.period / 12;

  // 단리 계산: 원금 × 이율 × 기간
  const grossProfit = principal * rate * time;
  // 세후 수익 (이자소득세 15.4% 적용)
  const tax = grossProfit * 0.154;
  return Math.floor(grossProfit - tax);
});

// 수익 포맷팅
const formattedProfit = computed(() => {
  return profit.value.toLocaleString();
});

// 최소/최대 금액 포맷팅
const minAmountFormatted = computed(() => {
  return props.minAmount.toLocaleString() + '원';
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
  const numValue = parseInt(value) || 0;
  const clampedValue = Math.max(
    props.minAmount,
    Math.min(props.maxAmount, numValue)
  );
  amount.value = clampedValue;
  displayAmountInput.value = clampedValue.toLocaleString();
};

// 금액 포맷팅
const formatAmount = () => {
  displayAmountInput.value = amount.value.toLocaleString();
};

// 슬라이더 클릭 처리
const handleSliderClick = event => {
  if (isDragging.value) return;

  const rect = sliderTrack.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

  const range = props.maxAmount - props.minAmount;
  const newAmount = props.minAmount + (range * percentage) / 100;
  const roundedAmount = Math.round(newAmount / 1000) * 1000;
  amount.value = roundedAmount;
  displayAmountInput.value = roundedAmount.toLocaleString();
};

// 드래그 시작
const startDrag = event => {
  isDragging.value = true;
  event.preventDefault();

  const handleMouseMove = e => {
    if (!isDragging.value) return;

    const rect = sliderTrack.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

    const range = props.maxAmount - props.minAmount;
    const newAmount = props.minAmount + (range * percentage) / 100;
    const roundedAmount = Math.round(newAmount / 1000) * 1000;
    amount.value = roundedAmount;
    displayAmountInput.value = roundedAmount.toLocaleString();
  };

  const handleMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// 드롭다운 외부 클릭 시 닫기
const handleClickOutside = event => {
  if (!event.target.closest('.profit-calculator')) {
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
