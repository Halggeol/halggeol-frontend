<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const navItems = [
  { to: '/', label: '홈', exact: true },
  { to: '/insight', label: '회고 인사이트' },
  { to: '/products', label: '금융상품 둘러보기' },
]
const isActive = (to, exact = false) => (exact ? route.path === to : route.path.startsWith(to))
</script>

<template>
  <!-- 헤더 영역 -->
  <header class="bg-white fixed inset-x-0 top-0 z-50">
    <nav aria-label="Global" class="mx-[10.8%] flex items-center justify-between py-4">
      <!-- 헤더 - 로고 영역 -->
      <h1 class="flex mobile:hidden">
        <RouterLink to="/" class="-m-4 p-4"> 그때 할 걸 </RouterLink>
      </h1>
      <!-- 헤더 - gnb 영역 -->
      <div class="flex gap-x-12 mobile:hidden">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="[
            '-m-4 p-4 body02 text-fg-primary',
            isActive(item.to, item.exact) ? 'font-bold' : '',
          ]"
        >
          {{ item.label }}
        </RouterLink>
        <button class="-m-4 p-4" aria-label="Search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5 text-fg-primary"
          >
            <path
              fill-rule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
      <!-- 헤더 - 유저 영역 -->
      <div class="flex gap-x-6 justify-end mobile:hidden">
        <RouterLink to="/" class="-m-4 p-4 body02 text-fg-primary">로그인</RouterLink>
        <RouterLink to="/" class="-m-4 p-4 body02 text-fg-primary">회원가입</RouterLink>
      </div>
    </nav>
  </header>
</template>
