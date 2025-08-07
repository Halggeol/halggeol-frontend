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
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:filters']);

// 상품 유형 옵션
const productTypes = [
  { value: 'deposit', label: '정기예금' },
  { value: 'savings', label: '정기적금' },
  { value: 'pension', label: '연금' },
  { value: 'fund', label: '펀드' },
  { value: 'forex', label: '외화' },
];

const productTypeValues = productTypes.map(type => type.value);

// 선택된 필터 값들
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
    productTypes: selectedProductTypes.value,
  };
  emit('update:filters', filters);
};

// 필터 값 변경 감지
watch(
  [selectedProductTypes],
  () => {
    emitFilters();
  },
  { deep: true }
);

// 초기 필터 전달
emitFilters();
</script>

<style scoped>
/* Tailwind CSS 사용 */
</style>
