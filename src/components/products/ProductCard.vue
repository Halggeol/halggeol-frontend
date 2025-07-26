<template>
  <div
    class="flex justify-between items-center border-b py-4 px-2 hover:bg-gray-50 transition"
  >
    <!-- 왼쪽 정보 영역 -->
    <div>
      <p class="text-sm text-gray-500">{{ product.company }}</p>
      <h3 class="text-lg font-semibold mt-1">{{ product.name }}</h3>

      <!-- 태그들 -->
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="tag in product.tags"
          :key="tag"
          class="text-[15px] bg-gray-400 text-white px-2 py-[2px] rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 오른쪽 금리 정보 -->
    <div class="flex flex-col items-end space-y-2">
      <div class="text-right">
        <p class="text-5xl font-bold text-gray-800">연 {{ product.rate }}%</p>
        <p class="text-xs text-gray-500">{{ product.term }}개월 기준</p>
      </div>

      <button @click="toggleLike" class="text-xl">
        <span v-if="liked">❤️</span>
        <span v-else>🤍</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const liked = ref(false);
const toggleLike = () => {
  liked.value = !liked.value;
};
</script>
