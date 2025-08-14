<script setup>
import BaseButton from '@/components/common/BaseButton.vue';
import BaseCard from '@/components/common/BaseCard.vue';
</script>

<template>
  <div class="h-14 w-full px-6 sticky top-0 border-b border-gray-100 bg-white">
    <div
      class="h-full flex justify-start items-center gap-2 text-body02 font-semibold"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z"
          fill="#60584C"
        />
        <path
          d="M16.4249 12.0938C17.552 11.8121 17.661 10.2532 16.5841 9.81731L5.82531 5.46255C4.84298 5.06494 3.86513 6.04279 4.26274 7.02512L8.6175 17.7839C9.05336 18.8608 10.6123 18.7518 10.894 17.6247L11.8256 13.8985C11.9331 13.4686 12.2688 13.1329 12.6987 13.0254L16.4249 12.0938Z"
          fill="#FFD338"
        />
        <path
          d="M14.6581 17.1834L12.8931 15.4184C12.5026 15.0279 12.5026 14.3947 12.8931 14.0042C13.2836 13.6137 13.9168 13.6137 14.3073 14.0042L16.0723 15.7692C16.3271 16.024 16.6623 16.1653 16.996 16.173C17.3274 16.1807 17.6286 16.0569 17.8428 15.8427C18.057 15.6285 18.1808 15.3273 18.1732 14.9958C18.1655 14.6622 18.0241 14.327 17.7694 14.0722C17.3788 13.6816 17.3788 13.0485 17.7694 12.658C18.1599 12.2674 18.7931 12.2674 19.1836 12.658C19.7929 13.2673 20.1525 14.0886 20.1724 14.9494C20.1924 15.8125 19.868 16.646 19.2571 17.2569C18.6461 17.8678 17.8126 18.1922 16.9496 18.1723C16.0888 18.1524 15.2674 17.7927 14.6581 17.1834Z"
          fill="#FFD338"
        />
      </svg>

      그때 할 걸
    </div>
  </div>
  <div class="flex flex-col items-center justify-center my-12 px-6">
    <p class="text-callout pb-2">후회 없는 금융상품 추천 서비스</p>
    <h2 class="title02">그때 할 걸</h2>
  </div>
  <div>img</div>
  <div class="px-6">"그때 할 걸" 더이상의 후회?</div>
  <div class="mx-6 pb-28">
    <BaseCard size="lg" ratio="lg" variant="tinted">
      <h3 class="title03">놓친 상품도 다시 보자</h3>
    </BaseCard>
  </div>
  <div class="mx-6">
    <BaseCard size="lg" ratio="lg" variant="tinted">
      <h3 class="title03">오직 PC에서만</h3>
    </BaseCard>
  </div>
  <div class="bg-white w-full fixed bottom-0 p-6">
    <BaseButton size="lg" label="PC 링크 복사하기" />
  </div>
</template>
