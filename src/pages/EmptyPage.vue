<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import Bad from '@/components/icons/regretScore/BadFace.vue';

import router from '@/router';

function goToHome() {
  router.push('/');
}
function goToProducts() {
  router.push('/products');
}
</script>
<template>
  <div class="flex flex-col items-center justify-center min-h-screen mx-[20%]">
    <Bad class="mb-8" />
    <h2 class="title01 mb-4">발행된 인사이트가 없습니다!</h2>
    <p class="text-body02 text-fg-secondary mb-8 text-center">
      아직 회고 인사이트가 발행되지 않았습니다<br />금융상품을 더
      둘러보시겠어요?<br />
    </p>
    <div class="flex w-full gap-4 justify-center">
      <BaseButton
        variant="outline"
        :label="'그때 할 걸 홈'"
        @click="goToHome"
      />
      <BaseButton :label="'금융상품 둘러보기'" @click="goToProducts" />
    </div>
  </div>
</template>
