<script setup>
import Header from '@/components/layout/Header.vue';
import QuickButton from '@/components/layout/QuickButton.vue';
import Footer from '@/components/layout/Footer.vue';
import { RouterView } from 'vue-router';
import ProductsDetailPage from '@/pages/products/ProductsDetailPage.vue';
</script>

<template>
  <Header />
  <main class="wrapper mt-14">
    <RouterView />
  </main>
  <QuickButton />
  <Footer />
</template>
