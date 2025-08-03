<template>
  <div class="w-64 p-5 border-r border-gray-200 bg-gray-50 flex-shrink-0">
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
            :checked="isAllSelected"
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
import { ref, watch, defineEmits, computed, onMounted } from 'vue';

const productTypes = [
  { label: '예금', value: 'deposit' },
  { label: '적금', value: 'savings' },
  { label: '펀드', value: 'fund' },
  { label: '연금', value: 'pension' },
  { label: '외화', value: 'forex' },
];
const productTypeValues = productTypes.map(t => t.value);
const selectedProductTypes = ref([]);

const isAllSelected = computed(() => {
  return selectedProductTypes.value.length === productTypeValues.length;
});

const emit = defineEmits(['filtersChanged']);

function toggleAllProductTypes(event) {
  if (event.target.checked) {
    selectedProductTypes.value = [...productTypeValues];
  } else {
    selectedProductTypes.value = [];
  }
}

const resetFilters = () => {
  selectedProductTypes.value = [];
};

// 백엔드 API 파라미터에 맞춰서 필터 데이터를 구성하여 emit
const emitFilters = () => {
  const filters = {
    // 백엔드 파라미터명에 맞춤
    productTypes:
      selectedProductTypes.value.length > 0
        ? selectedProductTypes.value
        : ['all'],
  };
  emit('filtersChanged', filters);
};

// 필터 변경 시 즉시 부모 컴포넌트에 알림
watch(
  selectedProductTypes,
  () => {
    emitFilters();
  },
  { deep: true }
);

// 컴포넌트 마운트 시 초기 필터 상태 전달
onMounted(() => {
  emitFilters();
});
</script>

<style scoped>
/* (스타일은 그대로) */
</style>
