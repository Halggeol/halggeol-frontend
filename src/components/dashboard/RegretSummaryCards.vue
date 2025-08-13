<script setup>
import { computed } from 'vue';
import BaseCard from '../common/BaseCard.vue';
import Tooltiip from '../icons/Tooltiip.vue';

const props = defineProps({
  regretScore: {
    type: Number,
    default: 0,
  },
  feedbackRatio: {
    type: Number,
    default: 0,
  },
  portfolio: {
    type: Array,
    default: () => [],
  },
});

const regretScoreDisplay = computed(() => {
  if (props.regretScore == null) {
    return {
      value: '없음',
      colorClass: 'text-fg-primary',
      bgColor: 'bg-[#DDE1E4]',
    };
  }

  const score = props.regretScore;
  let colorClass = 'text-status-blue';
  let bgColor = 'bg-[#EAF2FF]';
  let text = '좋음';
  if (score >= 70) {
    text = '나쁨';
    colorClass = 'text-status-red';
    bgColor = 'bg-[#FCD9D9]';
  } else if (score >= 40) {
    text = '보통';
    colorClass = 'text-primary';
    bgColor = 'bg-[#FFFAE5]';
  }

  return { value: text, colorClass, bgColor };
});

const feedbackRatioDisplay = computed(() => {
  if (props.feedbackRatio == null) {
    return {
      value: '후회 전',
      colorClass: 'text-fg-primary',
      bgColor: 'bg-[#DDE1E4]',
    };
  }

  const ratio = props.feedbackRatio;
  let colorClass = 'text-status-blue';
  let bgColor = 'bg-[#EAF2FF]';
  if (ratio >= 0.6) {
    colorClass = 'text-status-red';
    bgColor = 'bg-[#FCD9D9]';
  } else if (ratio >= 0.3) {
    colorClass = 'text-primary';
    bgColor = 'bg-[#FFFAE5]';
  }

  const value = `${(ratio * 100).toFixed(0)}%`;
  return { value, colorClass, bgColor };
});

const assetAnalysisDisplay = computed(() => {
  const portfolio = props.portfolio;
  if (!portfolio || portfolio.length === 0) {
    return {
      value: '텅',
      colorClass: 'text-fg-primary',
      bgColor: 'bg-[#DDE1E4]',
    };
  }

  // AssetPortfolioCard에서 가져온 로직
  const aggressiveTypes = ['fund', 'aggressive pension', 'stock'];
  const aggressiveRatio = portfolio
    .filter(item => aggressiveTypes.includes(item.type))
    .reduce((sum, item) => sum + item.ratio, 0);

  // 공격형 자산 비율이 50%를 초과하는지에 따라 값과 스타일 결정
  if (aggressiveRatio > 0.5) {
    return {
      value: '공격형',
      colorClass: 'text-status-red',
      bgColor: 'bg-[#FCD9D9]',
    };
  } else {
    return {
      value: '안정형',
      colorClass: 'text-status-blue',
      bgColor: 'bg-[#EAF2FF]',
    };
  }
});
</script>
<template>
  <div class="flex items-center justify-center gap-6 tablet:gap-4 pb-12">
    <BaseCard
      size="lg"
      variant="transparent"
      :class="regretScoreDisplay.bgColor"
    >
      <p class="text-body02 pb-1">
        후회지수
        <span
          class="inline-block relative group ml-1 align-top tooltip"
          data-tip="내 자산 대비 놓친 기회를 반영한 점수"
        >
          <Tooltiip class="w-5 h-5 text-fg-secondary" />
        </span>
      </p>
      <p class="title02" :class="regretScoreDisplay.colorClass">
        {{ regretScoreDisplay.value }}
      </p>
    </BaseCard>
    <BaseCard
      size="lg"
      variant="transparent"
      :class="feedbackRatioDisplay.bgColor"
    >
      <p class="text-body02 pb-1">
        후회상품비율
        <span
          class="inline-block relative group ml-1 align-top tooltip"
          data-tip="추천 상품 중 ‘후회해요’라고 응답한 상품의 비율"
        >
          <Tooltiip class="w-5 h-5 text-fg-secondary" />
        </span>
      </p>
      <p class="title02" :class="feedbackRatioDisplay.colorClass">
        {{ feedbackRatioDisplay.value }}
      </p>
    </BaseCard>
    <BaseCard
      size="lg"
      variant="transparent"
      :class="assetAnalysisDisplay.bgColor"
    >
      <p class="text-body02 pb-1">
        자산유형
        <span
          class="inline-block relative group ml-1 align-top tooltip"
          data-tip="현재 내 자산의 분류"
        >
          <Tooltiip class="w-5 h-5 text-fg-secondary"
        /></span>
      </p>
      <p class="title02" :class="assetAnalysisDisplay.colorClass">
        {{ assetAnalysisDisplay.value }}
      </p>
    </BaseCard>
  </div>
</template>
