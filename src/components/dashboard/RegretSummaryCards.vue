<script setup>
import { computed } from 'vue';
import BaseCard from '../common/BaseCard.vue';
import Tooltiip from '@/assets/icons/common/Tooltiip.vue';

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
      value: '인사이트 발행 전이에요',
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
      value: '아직 후회하지 않았어요',
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
      value: '자산을 연동하세요',
      colorClass: 'text-fg-primary',
      bgColor: 'bg-[#DDE1E4]',
    };
  }

  // AssetPortfolioCard에서 가져온 로직
  const aggressiveTypes = ['fund', 'aggressive'];
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
  } else if (aggressiveRatio == 0.5) {
    return {
      value: '혼합형',
      colorClass: 'text-primary',
      bgColor: 'bg-[#FFFAE5]',
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
      <p class="text-body03 pb-1">
        그때 할걸 후회지수
        <span
          class="inline-block relative group ml-1 align-top tooltip"
          data-tip="상품을 놓쳤을 때 느낄 수 있는 아쉬움의 크기를 예측한 점수예요. 과거 회고 인사이트의 예상 후회지수를 평균 내어 계산했어요. • 좋음: 40점 미만 • 보통: 40점 이상 70점 미만 • 나쁨: 70점 미만"
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
      <p class="text-body03 pb-1">
        후회상품비율
        <span
          class="inline-block relative group ml-1 align-top tooltip"
          data-tip="후회상품은 회고 인사이트에 발행된 상품에 대해 '후회해요' 응답한 상품이에요. 이 비율은 전체 회고 중 후회상품이 얼마나 되는지 보여줘요."
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
      <p class="text-body03 pb-1">
        자산유형
        <span
          class="inline-block relative group ml-1 align-top tooltip"
          data-tip="자산 포트폴리오에서 과반수를 차지하는 자산 유형을 보여줘요. • 공격형: 펀드, 주식 등 공격형 자산이 절반 이상인 상태 • 안정형: 예적금 등 안정형 자산이 절반 이상인 상태"
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
