<script setup>
import { defineProps, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import UserInModal from '../../icons/UserInModal.vue';
import Heart from '../../icons/Heart.vue';
import Logout from '../../icons/Logout.vue';
import BaseCard from '@/components/common/BaseCard.vue';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close', 'go-to', 'logout']);

const authStore = useAuthStore();

function close() {
  emit('close');
}

function goTo(path) {
  emit('go-to', path);
}

function logout() {
  emit('logout');
}
</script>

<template>
  <BaseCard
    v-if="isOpen"
    class="absolute top-16 right-30 z-50"
    size="sm"
    ratio="lg"
    :shadow="true"
  >
    <button
      class="absolute top-3 right-4 text-gray-400"
      @click="close"
      aria-label="닫기"
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
    <!-- 사용자 이름과 내 정보 (중앙 정렬 영역) -->
    <div class="flex flex-col items-center mt-4">
      <UserInModal class="mb-4" />

      <h3 class="title03 mb-4">{{ authStore.username }}</h3>

      <button
        class="btn text-footnote font-normal py-2 bg-primary border-0 shadow-none hover:shadow-none rounded-full text-white h-6"
        @click="goTo('/mypage')"
      >
        내 정보
      </button>
    </div>

    <!-- 가입상품, 관심상품, 로그아웃 (왼쪽 정렬 영역) -->
    <button
      class="group btn btn-block text-body02 font-normal bg-transparent shadow-none hover:bg-transparent hover:shadow-none border-0 flex items-center justify-start transition-color mt-6"
      @click="goTo('/myproduct')"
    >
      <Heart
        class="mr-2 text-fg-secondary group-hover:text-status-red"
      />가입상품
    </button>
    <button
      class="group btn btn-block text-body02 font-normal bg-transparent shadow-none hover:bg-transparent hover:shadow-none border-0 flex items-center justify-start transition-color"
      @click="goTo('/scrap')"
    >
      <Heart
        class="mr-2 text-fg-secondary group-hover:text-status-red"
      />관심상품
    </button>

    <hr class="my-2 w-full border-gray-200" />
    <button
      class="btn btn-block text-body02 font-normal bg-transparent shadow-none hover:bg-transparent hover:shadow-none border-0 flex items-center justify-start"
      @click="logout"
    >
      <Logout class="mr-2 text-fg-secondary" />로그아웃
    </button>
  </BaseCard>
</template>
