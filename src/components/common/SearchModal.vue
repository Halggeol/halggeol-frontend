<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all sm:align-middle"
      role="dialog"
      aria-modal="true"
    >
      <div class="px-6 py-8">
        <div class="sm:flex sm:items-start">
          <div class="mt-2 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <div class="mt-2">
              <div class="relative flex items-center">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  ref="searchInput"
                  type="text"
                  v-model="searchQuery"
                  @keyup.enter="performSearch"
                  class="block w-full pl-10 py-2 border-0 rounded-full leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                  :class="{ 'pr-10': showClearButton }"
                  placeholder="검색어를 입력하세요."
                />
                <div
                  v-if="showClearButton"
                  class="absolute inset-y-0 right-10 pr-3 flex items-center cursor-pointer"
                  @click="clearSearchQuery"
                >
                  <svg
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
                <button
                  type="button"
                  @click="performSearch"
                  :disabled="!isSearchButtonActive"
                  :class="{
                    'bg-blue-500 hover:bg-blue-600': isSearchButtonActive,
                    'bg-gray-200 cursor-not-allowed': !isSearchButtonActive,
                  }"
                  class="ml-2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                >
                  <svg
                    class="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:isOpen', 'search']);

const searchQuery = ref('');
const searchInput = ref(null);

const showClearButton = computed(() => {
  return searchQuery.value.length > 0;
});

const isSearchButtonActive = computed(() => {
  const query = searchQuery.value.trim();
  return query.length > 0; // 한 글자만 입력해도 활성화
});

watch(
  () => props.isOpen,
  newVal => {
    if (newVal) {
      nextTick(() => {
        if (searchInput.value) {
          searchInput.value.focus();
        }
      });
    } else {
      searchQuery.value = '';
    }
  }
);

const performSearch = () => {
  if (isSearchButtonActive.value) {
    emit('search', searchQuery.value);
    closeModal();
  }
};

const clearSearchQuery = () => {
  searchQuery.value = '';
  if (searchInput.value) {
    searchInput.value.focus();
  }
};

const closeModal = () => {
  emit('update:isOpen', false);
};
</script>

<style scoped>
/* Tailwind CSS를 주로 사용하므로, 추가적인 스타일은 최소화 */
</style>
