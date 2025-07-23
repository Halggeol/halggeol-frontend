<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <!-- 헤더 영역 -->
  <header class="bg-white fixed inset-x-0 top-0 z-50">
    <nav
      aria-label="Global"
      class="mx-[10.8%] flex items-center justify-between py-4 mobile:hidden"
    >
      <!-- 헤더 - 로고 영역 -->
      <h1 class="flex">
        <RouterLink to="/" class="-m-4 p-4"> 그때 할 걸 </RouterLink>
      </h1>
      <!-- 헤더 - 유저 영역 -->
      <div class="flex gap-x-6 justify-end">
        <RouterLink to="/" class="-m-4 p-4 text-fg-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
