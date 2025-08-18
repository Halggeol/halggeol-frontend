<template>
  <div>
    <!-- 모바일/태블릿용 모달 -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity hidden tablet:block"
      @click="$emit('close')"
    ></div>

    <aside
      :class="[
        'bg-white w-72 h-screen sticky top-0 flex-shrink-0',
        'tablet:fixed tablet:top-14 tablet:left-0 tablet:h-full tablet:z-50 tablet:transition-transform tablet:duration-300 tablet:ease-in-out',
        isOpen ? 'tablet:translate-x-0' : 'tablet:-translate-x-full',
      ]"
    >
      <div class="p-5 border-r border-gray-200 h-full overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-body02 font-bold text-fg-primary">필터</h2>
          <!-- 모바일/태블릿용 닫기 버튼 -->
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
          <!-- 데스크톱용 초기화 버튼 -->
          <button
            @click="resetFilters"
            class="tablet:hidden text-callout text-fg-gray hover:text-fg-secondary hover:underline focus:outline-none"
          >
            초기화
          </button>
        </div>

        <!-- 상품 유형 필터 -->
        <div class="mb-6 relative">
          <h3 class="title03 mb-3 text-fg-primary">상품 유형</h3>
          <ul class="space-y-3">
            <li class="mb-2 flex items-center">
              <input
                type="checkbox"
                id="typeAll"
                :checked="
                  selectedProductTypes.length === productTypeValues.length
                "
                @change="toggleAllProductTypes"
                class="form-checkbox h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
              />
              <label
                for="typeAll"
                class="ml-2 text-callout text-fg-primary cursor-pointer"
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
                class="form-checkbox h-4 w-4 text-primary-500 rounded border-gray-300 focus:ring-primary-500"
              />
              <label
                :for="'type' + type.value"
                class="ml-2 text-callout text-fg-primary cursor-pointer"
                >{{ type.label }}</label
              >
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({ types: [] }),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['filtersChanged', 'close']);

// 상품 유형 옵션
const productTypes = [
  { value: 'deposit', label: '예금' },
  { value: 'savings', label: '적금' },
  { value: 'pension', label: '연금' },
  { value: 'fund', label: '펀드' },
  { value: 'forex', label: '외화' },
];
const productTypeValues = productTypes.map(type => type.value);

// 선택된 필터 값
const selectedProductTypes = ref([]);

// 전체 상품 유형 토글
const toggleAllProductTypes = event => {
  if (event.target.checked) {
    selectedProductTypes.value = [...productTypeValues];
  } else {
    selectedProductTypes.value = [];
  }
};

// 필터 초기화
const resetFilters = () => {
  selectedProductTypes.value = [];
};

// 필터 변경 시 부모 컴포넌트에 전달
const emitFilters = () => {
  const filters = {
    types: selectedProductTypes.value,
  };
  emit('filtersChanged', filters);
};

// 필터 값 변경 감지
watch(
  selectedProductTypes,
  () => {
    emitFilters();
  },
  { deep: true }
);

// 부모 Prop의 변화를 감지하여 로컬 상태를 업데이트
watch(
  () => props.initialFilters,
  newFilters => {
    selectedProductTypes.value = newFilters.types || [];
  },
  { deep: true, immediate: true }
);
</script>
