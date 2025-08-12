<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg w-full max-w-xl p-6 shadow-xl">
      <div class="relative flex items-center">
        <input
          ref="searchInput"
          type="text"
          v-model="searchQuery"
          @keyup.enter="performSearch"
          class="w-full pl-6 pr-20 py-4 border-0 focus:ring-0 rounded-full bg-gray-100 placeholder-gray-500 text-body02"
          placeholder="검색어를 입력하세요."
        />

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

        <button
          @click="performSearch"
          :disabled="!searchQuery?.trim()"
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

      <div class="mt-6 flex">
        <div class="w-1/2 pr-3">
          <h3 class="text-lg font-bold mb-3">최근 검색어</h3>
          <ul v-if="recentSearches.length > 0">
            <li
              v-for="(item, index) in recentSearches"
              :key="`recent-${index}`"
              @click="searchFromList(item.keyword)"
              class="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-100 rounded px-2"
            >
              <span>{{ item.keyword || '' }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500 text-sm p-2">
            최근 검색 기록이 없습니다.
          </p>
        </div>

        <div class="w-1/2 pl-3">
          <h3 class="text-lg font-bold mb-3">인기 검색어</h3>
          <ul v-if="popularSearches.length > 0">
            <li
              v-for="(item, index) in popularSearches"
              :key="`popular-${index}`"
              @click="searchFromList(item.keyword)"
              class="flex items-center py-2 cursor-pointer hover:bg-gray-100 rounded px-2"
            >
              <span class="font-bold mr-2 text-blue-600">{{ index + 1 }}</span>
              <span>{{ item.keyword || '' }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500 text-sm p-2">
            인기 검색어가 없습니다.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { getRecentSearches, getPopularSearches } from '@/api/search';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:isOpen', 'search']);

const searchQuery = ref('');
const searchInput = ref(null);

// 최근 검색어와 인기 검색어를 저장할 반응형 변수를 추가
const recentSearches = ref([]);
const popularSearches = ref([]);

// API 호출 함수
const fetchRecentSearches = async () => {
  try {
    // 백엔드에서 생성한 '최근 검색어' API 엔드포인트로 요청
    recentSearches.value = await getRecentSearches();
  } catch (error) {
    console.error('최근 검색어 조회 실패:', error);
  }
};

const fetchPopularSearches = async () => {
  try {
    // 백엔드에서 생성한 '인기 검색어' API 엔드포인트로 요청합니다.
    popularSearches.value = await getPopularSearches();
  } catch (error) {
    console.error('인기 검색어 조회 실패:', error);
  }
};

watch(
  () => props.isOpen,
  isOpen => {
    if (isOpen) {
      nextTick(() => searchInput.value?.focus());
      fetchRecentSearches();
      fetchPopularSearches();
    } else {
      searchQuery.value = '';
    }
  }
);

const performSearch = () => {
  if (!searchQuery.value) {
    return; // 유효하지 않으면 아무것도 하지 않고 함수를 즉시 종료합니다.
  }
  const query = searchQuery.value.trim();
  if (query) {
    emit('search', query);
    closeModal();
  }
};

// 목록에 있는 키워드를 클릭했을 때 검색을 실행하는 함수를 추가
const searchFromList = keyword => {
  searchQuery.value = keyword;
  performSearch();
};
const clearSearch = () => {
  searchQuery.value = '';
  searchInput.value?.focus();
};

const closeModal = () => {
  emit('update:isOpen', false);
};
</script>
