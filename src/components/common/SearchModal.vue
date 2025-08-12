<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-4 bg-fg-primary bg-opacity-50 mobile:hidden"
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
          class="absolute right-12 p-1"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="10.0007"
              cy="10.0006"
              rx="9.16669"
              ry="9.16664"
              fill="#8C949E"
            />
            <path
              d="M6.66602 13.333L13.3326 6.66622"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M6.66602 6.66699L13.3326 13.3337"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <button
          @click="performSearch"
          :disabled="!searchQuery?.trim()"
          class="absolute right-2 p-2 text-fg-primary disabled:cursor-not-allowed"
          title="검색"
        >
          <Search class="text-fg-primary" />
        </button>
      </div>

      <div class="mt-6 flex">
        <div v-if="isLoggedIn" class="w-1/2 pr-3 relative pb-8">
          <h3 class="text-lg font-bold mb-3">최근 검색어</h3>
          <ul v-if="recentSearches.length > 0">
            <li
              v-for="(item, index) in recentSearches"
              :key="`recent-${index}`"
              @click="searchFromList(item.keyword)"
              class="group flex justify-between items-center py-2 cursor-pointer hover:bg-gray-100 rounded px-2"
            >
              <span>{{ item.keyword || '' }}</span>
              <button
                @click.stop="removeRecentSearch(item.keyword)"
                class="p-1 text-gray-400 hover:text-gray-700 opacity-60 hover:opacity-100 transition-opacity"
                title="삭제"
              >
                <svg
                  class="h-4 w-4"
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
            </li>
          </ul>
          <p v-else class="text-gray-500 text-sm p-2">
            최근 검색 기록이 없습니다.
          </p>
          <div
            class="absolute bottom-0 right-6"
            v-if="recentSearches.length > 0"
          >
            <button
              @click="removeAllRecentSearches"
              class="text-sm text-fg-secondary hover:font-semibold"
            >
              전체 삭제
            </button>
          </div>
        </div>

        <div
          :class="[
            isLoggedIn ? 'w-1/2 pl-3 border-l border-gray-200' : 'w-full',
          ]"
        >
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
import {
  getRecentSearches,
  getPopularSearches,
  deleteRecentSearch,
  deleteAllRecentSearches,
} from '@/api/search';
import Search from '../icons/Search.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type: Boolean,
    default: false, // 로그인 상태를 prop으로 받습니다.
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
  newIsOpen => {
    if (newIsOpen) {
      nextTick(() => searchInput.value?.focus());
      // 로그인 상태일 때만 최근 검색어를 불러옵니다.
      if (props.isLoggedIn) {
        fetchRecentSearches();
      }
      // 인기 검색어는 항상 불러옵니다.
      fetchPopularSearches();
    } else {
      searchQuery.value = '';
      // 모달이 닫힐 때 목록을 비워 다음 열릴 때 이전 데이터가 보이지 않게 합니다.
      if (props.isLoggedIn) {
        recentSearches.value = [];
      }
      popularSearches.value = [];
    }
  }
);

const performSearch = () => {
  if (!searchQuery.value?.trim()) {
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

const removeRecentSearch = async keyword => {
  try {
    const success = await deleteRecentSearch(keyword);
    if (success) {
      await fetchRecentSearches();
    }
  } catch (error) {
    console.error('최근 검색어 삭제 처리 실패: ', error);
  }
};

const removeAllRecentSearches = async () => {
  try {
    const success = await deleteAllRecentSearches();
    if (success) {
      await fetchRecentSearches();
    }
  } catch (error) {
    console.error('최근 검색어 전체 삭제 처리 실패: ', error);
  }
};
</script>
