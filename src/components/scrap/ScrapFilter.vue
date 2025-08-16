<template>
  <div
    class="w-64 px-10 py-5 border-r border-gray-200 bg-gray-50 flex-shrink-0 sticky top-0 h-screen"
  >
    <div class="p-5 border-r border-gray-200 h-full overflow-y-auto">
      <!-- 상품 유형 필터 -->
      <div class="relative">
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
        <ul>
          <li class="mb-2 flex items-center">
            <input
              type="checkbox"
              id="typeAll"
              v-model="isAllSelected"
              class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label
              for="typeAll"
              class="ml-2 text-sm text-gray-700 cursor-pointer"
            >
              전체
            </label>
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
            >
              {{ type.label }}
            </label>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, defineEmits, computed, defineProps } from 'vue';

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      types: [],
    }),
  },
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const productTypes = [
  { label: '예금', value: 'deposit' },
  { label: '적금', value: 'savings' },
  { label: '펀드', value: 'fund' },
  { label: '연금', value: 'pension' },
  { label: '외화', value: 'forex' },
];
const productTypeValues = productTypes.map(t => t.value);

const selectedProductTypes = ref([]);
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

const resetFilters = () => {
  selectedProductTypes.value = [];
};

const emitFilters = () => {
  const filters = {
    types: selectedProductTypes.value,
  };
  emit('filtersChanged', filters);
};

watch(selectedProductTypes, emitFilters, { deep: true });

watch(
  () => props.initialFilters,
  newFilters => {
    selectedProductTypes.value = Array.isArray(newFilters.types)
      ? newFilters.types
      : [];
  },
  { deep: true, immediate: true }
);
</script>
