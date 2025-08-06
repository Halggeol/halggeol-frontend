<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
authStore.initialize();

</script>

<template>
  <RouterView :key="$route.fullPath" />
</template>

<style scoped></style>
