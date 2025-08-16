<script setup>
import { RouterView } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAuthStore } from './stores/authStore';
import MobilePage from './pages/common/MobilePage.vue';

const authStore = useAuthStore();
authStore.initialize();

// 모바일 사이즈일 시 MobilePage로 전환
const isMobile = ref(false);

const mediaQuery = window.matchMedia('(max-width: 768px)');
const handleResize = () => {
  if (mediaQuery) {
    isMobile.value = mediaQuery.matches;
  }
};

onMounted(() => {
  handleResize();
  if (mediaQuery) {
    mediaQuery.addEventListener('change', handleResize);
  }
});

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleResize);
  }
});
</script>

<template>
  <RouterView v-if="!isMobile" :key="$route.fullPath" />
  <MobilePage v-else />
</template>

<style scoped></style>
