<script setup>
import SideBar from '@/components/layout/SideBar.vue'
import Header from '@/components/layout/Header.vue'
import QuickButton from '@/components/layout/QuickButton.vue'
import Footer from '@/components/layout/Footer.vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const navItems = route.meta.navItems
</script>

<template>
  <Header />
  <main class="wrapper mt-14 grid grid-cols-5">
    <SideBar :nav-items="navItems" />
    <div class="ml-20 mr-[13%] col-span-4">
      <RouterView />
    </div>
  </main>
  <QuickButton />
  <Footer />
</template>
