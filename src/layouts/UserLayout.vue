<script setup>
import UserHeader from '@/components/layout/UserHeader.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <UserHeader />
  <main class="wrapper mt-14">
    <RouterView />
  </main>
</template>
