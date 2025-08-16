<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import Bad from '@/components/icons/regretScore/BadFace.vue';
import router from '@/router';

function goToHome() {
  router.push('/');
}
function goToBack() {
  router.back();
}
</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen mx-[20%]">
    <Bad class="mb-8" />
    <h2 class="title01 mb-4">다시 한 번 확인해 주세요!</h2>
    <p class="text-body02 text-fg-secondary mb-8 text-center">
      지금 입력하신 주소의 페이지는<br />사라졌거나 다른 페이지로
      변경됐습니다<br />주소를 다시 확인해 주세요
    </p>
    <div class="flex w-full gap-4 justify-center">
      <BaseButton variant="outline" :label="'이전 페이지'" @click="goToBack" />
      <BaseButton :label="'그때 할 걸 홈'" @click="goToHome" />
    </div>
  </div>
</template>
