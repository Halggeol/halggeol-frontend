<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import Bad from '@/components/icons/regretScore/BadFace.vue';
// import router from '@/router';

function reload() {
  // router.go();
  location.reload();
}
</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen mx-[20%]">
    <Bad class="mb-8" />
    <h2 class="title01 mb-4">잠시 후 다시 확인해 주세요!</h2>
    <p class="text-body02 text-fg-secondary mb-8 text-center">
      지금 이 서비스와 연결할 수 없습니다<br />문제를 해결하기 위해 열심히
      노력하고 있습니다<br />잠시 후 다시 확인해 주세요
    </p>
    <div class="flex w-full gap-4 justify-center">
      <BaseButton :label="'새로고침'" @click="reload" />
    </div>
  </div>
</template>
