<script setup>
import SideBar from '@/components/layout/SideBar.vue';
import Header from '@/components/layout/Header.vue';
import QuickButton from '@/components/layout/QuickButton.vue';
import Footer from '@/components/layout/Footer.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const navItems = computed(() => route.meta.navItems);
</script>

<template>
  <Header />
  <main class="wrapper mt-14 grid grid-cols-5 tablet:grid-cols-4">
    <SideBar :nav-items="navItems" />
    <div
      class="ml-20 tablet:ml-10 mr-[10.8%] tablet:mr-5 col-span-4 tablet:col-span-3"
    >
      <RouterView />
    </div>
  </main>
  <QuickButton />
  <Footer />
</template>
