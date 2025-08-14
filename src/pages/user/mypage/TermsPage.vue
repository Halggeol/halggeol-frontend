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
  <div class="h-[calc(100vh-56px-114px)] pt-12 flex flex-col">
    <!-- 제목 -->
    <h2 class="title02 font-bold mb-6 text-left">이용약관</h2>

      <!-- 이용약관 -->
      <div class="text-callout mb-10 border rounded p-4 h-[250px] overflow-y-auto leading-relaxed whitespace-pre-line">
        <div v-html="formatSectionTitles(termsText)"></div>
      </div>

    <!-- 제목 -->
    <h2 class="title02 font-bold mb-6 text-left">개인정보 처리방침</h2>

      <!-- 개인정보 처리방침 -->
      <div class="text-callout border rounded p-4 h-[250px] overflow-y-auto leading-relaxed whitespace-pre-line">
        <div v-html="formatSectionTitles(privacyText)"></div>
      </div>
    </div>
</template>
