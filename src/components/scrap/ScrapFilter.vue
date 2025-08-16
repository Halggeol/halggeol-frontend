<template>
  <div
    class="w-64 px-10 py-5 border-r border-gray-200 bg-gray-50 flex-shrink-0 sticky top-0 h-screen"
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
