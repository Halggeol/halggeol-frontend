<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-fg-primary bg-opacity-50 mobile:hidden"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-3xl w-full max-w-xl p-8">
      <div class="relative flex items-center">
        <input
          ref="searchInput"
          type="text"
          v-model="searchQuery"
          @keyup.enter="performSearch"
          class="w-full pl-6 pr-20 py-4 border-0 focus:ring-0 rounded-full bg-gray-100 placeholder-gray-500 text-body02"
          placeholder="검색어를 입력하세요."
        />

        <!-- 입력 삭제 버튼 -->
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-12 p-1 text-gray-400"
        >
          <svg
            class="h-5 w-5"
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

        <!-- 검색 버튼 -->
        <button
          @click="performSearch"
          :disabled="!searchQuery.trim()"
          class="absolute right-2 p-2 text-fg-primary disabled:cursor-not-allowed"
          title="검색"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:isOpen', 'search']);

const searchQuery = ref('');
const searchInput = ref(null);

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      nextTick(() => searchInput.value?.focus());
    } else {
      searchQuery.value = '';
    }
  }
);

const performSearch = () => {
  const query = searchQuery.value.trim();
  if (query) {
    emit('search', query);
    closeModal();
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  searchInput.value?.focus();
};

const closeModal = () => {
  emit('update:isOpen', false);
};
</script>
