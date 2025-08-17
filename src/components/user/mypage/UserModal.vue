<script setup>
import { defineProps, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import Heart from '../../icons/common/Heart.vue';
import Logout from '../../icons/auth/Logout.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import User from '@/components/icons/auth/User.vue';

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
      class="absolute top-4 right-4 text-gray-400"
      @click="close"
      aria-label="닫기"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.25 3.75L3.75 16.25"
          stroke="#8C949E"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
        />
        <path
          d="M3.75 3.75L16.25 16.25"
          stroke="#8C949E"
          stroke-width="1.5"
          stroke-miterlimit="10"
          stroke-linecap="round"
        />
      </svg>
    </button>
    <!-- 사용자 이름과 내 정보 (중앙 정렬 영역) -->
    <div class="flex flex-col items-center mt-4">
      <User
        class="w-10 h-10 rounded-full bg-gray-secondary-200 text-gray-primary mb-3"
      />
      <h3 class="title03 mb-4">{{ authStore.username }}</h3>

      <button
        class="btn text-footnote font-normal py-2 bg-gray-primary border-0 shadow-none hover:shadow-none rounded-full text-white h-6"
        @click="goTo('/mypage')"
      >
        내 정보
      </button>
    </div>

    <!-- 가입상품, 관심상품, 로그아웃 (왼쪽 정렬 영역) -->
    <button
      class="group btn btn-block text-body02 font-normal bg-transparent shadow-none hover:bg-transparent hover:shadow-none border-0 flex items-center justify-start transition-color mt-6 hover:font-semibold"
      @click="goTo('/myproduct')"
    >
      <Heart
        class="mr-2 text-fg-secondary group-hover:text-status-red"
      />가입상품
    </button>
    <button
      class="group btn btn-block text-body02 font-normal bg-transparent shadow-none hover:bg-transparent hover:shadow-none border-0 flex items-center justify-start transition-color hover:font-semibold"
      @click="goTo('/scrap')"
    >
      <Heart
        class="mr-2 text-fg-secondary group-hover:text-status-red"
      />관심상품
    </button>

    <hr class="my-2 w-full border-gray-200" />
    <button
      class="btn btn-block text-body02 font-normal bg-transparent shadow-none hover:bg-transparent hover:shadow-none border-0 flex items-center justify-start hover:font-semibold hover:text-fg-secondary"
      @click="logout"
    >
      <Logout class="mr-2 text-fg-secondary" />로그아웃
    </button>
  </BaseCard>
</template>
