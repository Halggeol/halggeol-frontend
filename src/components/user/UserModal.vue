<script setup>
import { defineProps, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import UserInModal from '../icons/UserInModal.vue';
import Heart from '../icons/Heart.vue';
import Logout from '../icons/Logout.vue';

const props = defineProps({
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
  <div
    v-if="isOpen"
    class="absolute top-14 right-30 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg z-50 p-4"
  >
    <button
      class="absolute top-2 right-4 text-gray-400 hover:text-gray-600"
      @click="close"
      aria-label="닫기"
    >
      ✕
    </button>

    <!-- 사용자 이름과 내 정보 (중앙 정렬 영역) -->
    <div class="flex flex-col items-center mt-4">
      <UserInModal class="mb-4"/>

      <h3 class="font-bold title03 mb-1">{{ authStore.username }}</h3>

      <button class="btn btn-sm btn-block btn-outline bg-primary border-0 rounded-2xl text-white h-5 w-16" @click="goTo('/mypage')">내 정보</button>
    </div>

    <!-- 가입상품, 관심상품, 로그아웃 (왼쪽 정렬 영역) -->
    <button class="btn btn-sm btn-block btn-outline border-0 flex items-center justify-start mt-3" @click="goTo('/myproduct')">
      <Heart/>가입상품
    </button>
    <button class="btn btn-sm btn-block btn-outline border-0 flex items-center justify-start" @click="goTo('/scrap')">
      <Heart/>관심상품
    </button>

    <hr class="my-2 w-full border-gray-200"/>
    <button class="btn btn-sm btn-block btn-outline border-0 flex items-center justify-start" @click="logout">
      <Logout/>로그아웃
    </button>
  </div>
</template>
