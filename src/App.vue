<script setup>
import { RouterView } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import QuickButton from '@/components/layout/QuickButton.vue'
</script>

<template>
  <Header />
  <div class="wrapper mt-14">
    <RouterView />
  </div>
  <QuickButton />
  <Footer />
</template>

<style scoped></style>
