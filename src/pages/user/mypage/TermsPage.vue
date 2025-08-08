<script setup>
import { termsText, privacyText } from '@/constants/terms';

function formatSectionTitles(text) {
  return text.replace(
    /제\d+조\s*\([^)]+\)/g,
    (match) => `<span class="font-bold">${match}</span>`
  );
}

</script>

<template>
  <div class="w-full mx-auto mt-8 p-6">
    <!-- 제목 -->
    <h2 class="title01 font-bold mb-6 text-left">이용약관</h2>

    <!-- 가로 방향 분할 -->
    <div class="flex flex-col">
      <!-- 이용약관 -->
      <div class="flex-1">
        <div class="mb-10 border rounded p-4 h-[250px] overflow-y-auto text-sm leading-relaxed whitespace-pre-line">
          <div v-html="formatSectionTitles(termsText)"></div>
        </div>
      </div>

    <h2 class="title01 font-bold mb-6 text-left">개인정보 처리방침</h2>

    <!-- 개인정보 처리방침 -->
      <div class="flex-1">
        <div class="border rounded p-4 h-[250px] overflow-y-auto text-sm leading-relaxed whitespace-pre-line">
          <div v-html="formatSectionTitles(privacyText)"></div>
        </div>
      </div>
    </div>
  </div>
</template>
