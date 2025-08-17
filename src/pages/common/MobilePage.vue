<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import Logo from '@/components/icons/Logo.vue';
</script>

<template>
  <div class="h-14 w-full px-6 sticky top-0 border-b border-gray-100 bg-white">
    <div
      class="h-full flex justify-start items-center gap-2 text-body02 font-semibold"
    >
      <Logo />
      그때 할걸
    </div>
  </div>
  <section class="py-16 text-center px-6">
    <Logo class="w-20 h-20 mx-auto mb-6" />
    <h1 class="title01 mb-4">
      그때 놓친 기회,<br />더 넓은 화면에서 확인하세요
    </h1>
    <p class="text-body01 text-fg-secondary">
      그때 할걸은 PC 환경에 최적화됐어요.
    </p>
    <div class="flex flex-col items-center text-center px-6 py-20">
      <div class="bg-slate-50 rounded-xl p-6 w-full max-w-md">
        <h2 class="title03 mb-6">혹시, 이런 순간이 있었나요?</h2>
        <div class="space-y-2 text-body02 text-fg-secondary">
          <p>📈 전에 봤던 상품 수익률이 '훌쩍' 올랐을 때</p>
          <p>📉 가지고 있는 상품 수익률만 '뚝' 떨어졌을 때</p>
          <p>💸 환율 변동에 '아차' 싶었을 때</p>
        </div>
      </div>
    </div>
  </section>
  <section>
    <h2 class="title02 text-center mb-4">
      과거의 후회와 미래의 기회를<br />데이터로 연결합니다
    </h2>
    <p class="text-body02 text-fg-secondary text-center mb-10">
      추천과 회고의 선순환 구조를 경험해 보세요
    </p>

    <div class="space-y-6 max-w-md mx-auto">
      <BaseCard size="lg" :shadow="true">
        <h3 class="title03 mb-2">📈 데이터로 되짚는 나의 선택</h3>
        <p class="text-body02 text-fg-secondary">
          추천 받았던 상품들의 현재 수익률을 추적하고, <br />'만약' 내 자산이
          어떻게 변했을지 시뮬레이션해요.
        </p>
      </BaseCard>

      <div class="flex justify-center">
        <svg
          class="w-6 h-6 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16 17l-4 4m0 0l-4-4m4 4V3"
          />
        </svg>
      </div>

      <BaseCard size="lg" :shadow="true">
        <h3 class="title03 mb-2">💡 데이터가 찾아주는 나의 상품</h3>
        <p class="text-body02 text-fg-secondary">
          나의 후회 패턴과 성향을 분석하고, <br />지금 나에게 꼭 맞는 새로운
          기회를 추천해요.
        </p>
      </BaseCard>
    </div>
  </section>
  <div class="mt-16 bg-slate-50">
    <section class="px-6 py-16">
      <h2 class="title02 text-center mb-8">
        그때 할걸에서는<br />이런 기능들을 모두 쓸 수 있어요
      </h2>

      <!-- 회고인사이트 관련 -->
      <div class="space-y-4 max-w-md mx-auto">
        <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5">
          <div
            class="w-12 h-12 bg-red-100 rounded-lg flex-shrink-0 flex justify-center items-center text-title-lg"
          >
            📈
          </div>
          <div>
            <h3 class="font-bold text-fg-primary">데이터 시뮬레이션</h3>
            <p class="text-body02 text-fg-secondary mt-1">
              놓친 상품의 수익률을 추적하고, ‘만약’의 자산 변화를 확인해요.
            </p>
          </div>
        </div>
        <!-- 추천 관련 -->
        <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5">
          <div
            class="w-12 h-12 bg-yellow-100 rounded-lg flex-shrink-0 flex justify-center items-center text-title-lg"
          >
            💡
          </div>
          <div>
            <h3 class="font-bold text-fg-primary">개인 맞춤 추천</h3>
            <p class="text-body02 text-fg-secondary mt-1">
              나의 후회 패턴을 학습해, 더 나은 선택을 할 수 있도록 도와드려요.
            </p>
          </div>
        </div>
        <!-- 탐색 범위 관련 -->
        <div class="bg-white p-6 rounded-xl shadow-sm flex items-center gap-5">
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0 flex justify-center items-center text-title-lg"
          >
            🔍
          </div>
          <div>
            <h3 class="font-bold text-fg-primary">폭넓은 탐색</h3>
            <p class="text-body02 text-fg-secondary mt-1">
              예적금부터 펀드까지 다양한 카테고리에서 새로운 기회를 탐색해요
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="px-6 pt-8 pb-32 text-center">
      <h2 class="title02 mb-4">이 모든 분석, PC에서 한눈에.</h2>
      <p class="text-body01 text-fg-secondary">
        복잡한 금융 데이터를 가장 명확하게 보여드리기 위해<br />PC 환경에
        최적화했어요.
      </p>
    </section>
  </div>
</template>
