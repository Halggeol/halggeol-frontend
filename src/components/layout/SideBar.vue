<!-- 인사이트, 마이페이지 내 사용 -->
<!-- 사용 방법
1. 사용하고자 하는 페이지 script에 navItems 정의
 e.g.
 const navItems = [
  { to: '/', label: '홈' },
  { to: '/insight', label: '회고 인사이트' },
  { to: '/products', label: '금융상품 둘러보기' },
]
2. 사용하고자 하는 페이지 template에 <SideBar :nav-items="navItems" /> 작성
-->

<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
defineProps({
  navItems: {
    type: Array,
    required: true,
    default: () => [],
  },
})
</script>

<template>
  <!-- 사이드바 영역 -->
  <div class="w-1/5 pt-[150px]">
    <ul
      class="menu menu-vertical w-full px-8 mobile:hidden text-body02 text-fg-primary"
      style="
        --menu-active-bg: rgb(162 168 175 / var(--tw-bg-opacity, 1));
        --menu-active-fg: inherit;
      "
    >
      <li v-for="item in navItems" :key="item.to">
        <RouterLink
          :to="item.to"
          :class="['px-6 py-4 mb-6 rounded-lg', route.path === item.to ? 'menu-active' : '']"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 메뉴 활성화 스타일 초기화 */
.menu-active,
:active {
  box-shadow: none !important;
}
</style>
