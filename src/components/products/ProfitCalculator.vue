<template>
  <div
    class="profit-calculator bg-white rounded-xl shadow-card border border-1/2 border-secondary-200 p-8"
  >
    <h3 class="text-title-sm font-semibold text-fg-primary mb-8">
      수익 계산기
    </h3>

    <div class="space-y-6">
      <!-- 금액 입력 영역 -->
      <div class="space-y-4">
        <div class="bg-secondary-50 rounded-lg p-6">
          <div class="text-fg-secondary text-body02 leading-relaxed">
            <span
              @click="dropdownOpen = !dropdownOpen"
              class="font-semibold text-status-blue cursor-pointer border-b-2 border-status-blue hover:border-status-blue transition-colors duration-200"
              >{{
                (rateOptions &&
                  rateOptions[selectedRateIndex] &&
                  rateOptions[selectedRateIndex].label) ||
                '금리'
              }}
              ({{ currentInterestRate }}%)
            </span>
            <div
              v-if="dropdownOpen"
              class="absolute bg-white border border-secondary-200 rounded-lg shadow-card z-10 p-2 mt-1"
            >
              <button
                v-for="(option, index) in calculatorProps.rateOptions || []"
                :key="index"
                @click="selectRate(index)"
                :class="[
                  'w-full px-3 py-2 text-left hover:bg-secondary-50 transition-colors rounded-md',
                  selectedRateIndex === index
                    ? 'bg-status-blue/10 text-status-blue font-semibold'
                    : 'text-fg-primary',
                ]"
              >
                <span class="font-medium">{{ option.label }}</span>
                <span class="text-fg-secondary ml-2"
                  >({{ option.value }}%)</span
                >
              </button>
            </div>
            로
            <div class="inline-flex items-center mx-1">
              <input
                v-model="displayAmountInput"
                @input="updateFromInput"
                @blur="formatAmount"
                @focus="selectAllText"
                @keydown.enter="formatAmount"
                class="inline-block text-status-blue font-bold bg-transparent border-b-2 border-status-blue/50 focus:border-status-blue hover:border-status-blue transition-colors duration-200 outline-none px-2 py-1 text-center min-w-[100px] max-w-[140px] rounded-sm"
                type="text"
                placeholder="0"
              />
              <span class="font-semibold text-status-blue ml-1">원</span>
            </div>
            만큼 저축했다면 예상수익액은
            <span class="font-bold text-title-sm text-status-blue"
              >{{ formattedProfit }}원</span
            >입니다.
          </div>
        </div>

        <!-- 게이지바 슬라이더 -->
        <div class="relative">
          <div class="w-full bg-secondary-200 rounded-full h-4 relative">
            <div
              class="bg-gradient-to-r from-status-blue to-status-blue/80 h-4 rounded-full transition-all duration-300 ease-out"
              :style="{ width: sliderPercentage + '%' }"
            ></div>
            <!-- 슬라이더 핸들 -->
            <div
              class="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-3 border-status-blue rounded-full cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ease-out z-10"
              :style="{
                right: 'calc(' + (100 - sliderPercentage) + '% - 12px)',
              }"
              @mousedown="startDrag"
              @click.stop
            ></div>
          </div>
          <!-- 클릭 가능한 영역 -->
          <div
            class="absolute inset-0 cursor-pointer"
            @click="handleSliderClick"
            @mousedown="handleTrackMouseDown"
            ref="sliderTrack"
          ></div>
        </div>

        <!-- 금액 범위 표시 -->
        <div class="flex justify-between text-footnote text-fg-secondary">
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
  productDetail: {
    type: Object,
    required: true,
  },
  maxAmount: {
    type: Number,
    default: 100000000,
  },
});

const amount = ref(100000);
const isDragging = ref(false);
const sliderTrack = ref(null);
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

// 슬라이더 퍼센테이지 계산
const sliderPercentage = computed(() => {
  const range = props.maxAmount - 0;
  const position = amount.value - 0;
  return Math.max(0, Math.min(100, (position / range) * 100));
});

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

// 최소/최대 금액 포맷팅
const minAmountFormatted = computed(() => {
  return '0원';
});

const maxAmountFormatted = computed(() => {
  return props.maxAmount.toLocaleString() + '원';
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

// 공통 드래그 로직
const updateSliderFromMouse = clientX => {
  if (!sliderTrack.value) return;

  const rect = sliderTrack.value.getBoundingClientRect();
  const x = clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

  const range = props.maxAmount - 0;
  const newAmount = 0 + (range * percentage) / 100;
  const roundedAmount = Math.round(newAmount / 10000) * 10000;
  amount.value = roundedAmount;
  displayAmountInput.value = roundedAmount.toLocaleString();
};

// 슬라이더 클릭 처리
const handleSliderClick = event => {
  if (isDragging.value) return;
  updateSliderFromMouse(event.clientX);
};

// 트랙 마우스 다운 처리
const handleTrackMouseDown = event => {
  if (event.target === event.currentTarget) {
    // 트랙 자체를 클릭한 경우
    updateSliderFromMouse(event.clientX);
    startDrag(event);
  }
};

// 드래그 시작
const startDrag = event => {
  isDragging.value = true;
  event.preventDefault();
  event.stopPropagation();

  const handleMouseMove = e => {
    if (!isDragging.value) return;
    updateSliderFromMouse(e.clientX);
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
