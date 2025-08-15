<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  prefix: { type: String, required: true },
  asset: Number,
  isCompound: Boolean,
  interestRate: Number,
  saveTerm: Number,
  minLimit: Number,
  maxLimit: Number,
  forexInfo: Array,
  selectedCurrency: String,
});

// 투자금 설정
const priceOptions = computed(() => {
  const min = props.minLimit;
  // asset 값과 maxLimit 중 더 작은 값을 최대값으로 설정
  const max = Math.min(props.maxLimit, props.asset);

  const niceSteps = [1, 2, 2.5, 5, 10];
  const range = max - min;
  if (range <= 0) {
    const value = min === 0 ? 10000 : min;
    return [{ value, label: `${(min / 10000).toLocaleString()}만원` }];
  }

  const step = Math.pow(10, Math.floor(Math.log10(range / 4)));
  const niceStep = niceSteps.find(s => s * step >= range / 4) * step;

  const options = new Set();
  let current = Math.floor(min / niceStep) * niceStep;

  while (current <= max) {
    if (current >= min) {
      options.add(current);
    }
    current += niceStep;
  }
  const roundedMax = Math.round(max / 10000) * 10000;
  options.add(roundedMax); // 최대값 항상 포함

  let finalOptions = Array.from(options).sort((a, b) => a - b);

  if (finalOptions.includes(0)) {
    finalOptions = finalOptions.map(opt => (opt === 0 ? 10000 : opt));
    finalOptions = [...new Set(finalOptions)].sort((a, b) => a - b);
  }

  return finalOptions.map(value => ({
    value,
    label: `${(value / 10000).toLocaleString()}만원`,
  }));
});

const selectedPrincipal = ref(0);

watch(
  priceOptions,
  newOptions => {
    if (newOptions.length > 1) {
      selectedPrincipal.value = newOptions[1].value;
    } else if (newOptions.length === 1) {
      selectedPrincipal.value = newOptions[0].value;
    } else {
      selectedPrincipal.value = props.minLimit;
    }
  },
  { immediate: true }
);

// 놓친 금액 계산
const missAmount = computed(() => {
  const principal = selectedPrincipal.value;
  const prefix = props.prefix;
  const rate = props.interestRate / 100;

  if (['D', 'S', 'C'].includes(prefix)) {
    return props.isCompound === true
      ? Math.round(principal * Math.pow(1 + rate, 1) - principal) // 복리
      : Math.round(principal * rate); // 단리
  }

  if (prefix === 'X') {
    const interestAmount = props.isCompound
      ? Math.round(principal * Math.pow(1 + rate, 1) - principal)
      : Math.round(principal * rate);

    const targetForex = props.forexInfo?.find(
      info => info.currency === props.selectedCurrency
    );

    if (!targetForex) return interestAmount;

    const exchangeGainRate = targetForex.diffPercent / 100;
    const totalPrincipalAndInterest = principal + interestAmount;
    const exchangeGainAmount = Math.round(
      totalPrincipalAndInterest * exchangeGainRate
    );

    return interestAmount + exchangeGainAmount;
  }

  if (['A', 'F'].includes(prefix)) {
    return Math.round(principal * rate);
  }

  return 0;
});

// 놓친 금액 매칭
const regretTable = [
  {
    threshold: 3000000,
    text: ['유럽 여행을✈️ ', '갈 수 있었어요'],
    video: {
      webm: '/video/europe.webm',
      poster: '/video/poster/europe.jpg',
    },
  },
  {
    threshold: 2500000,
    text: ['월급을💵 한번 더 ', '받을 수 있었어요'],
    video: {
      webm: '/video/salary.webm',
      poster: '/video/poster/salary.jpg',
    },
  },
  {
    threshold: 2000000,
    text: ['노트북을💻 ', '바꿀 수 있었어요'],
    video: {
      webm: '/video/laptop.webm',
      poster: '/video/poster/laptop.jpg',
    },
  },
  {
    threshold: 1500000,
    text: ['DSLR 카메라를📷 ', '살 수 있었어요'],
    video: {
      webm: '/video/dslr.webm',
      poster: '/video/poster/dslr.jpg',
    },
  },
  {
    threshold: 1200000,
    text: ['가전제품을🧺 ', '살 수 있었어요'],

    video: {
      webm: '/video/washing.webm',
      poster: '/video/poster/washing.jpg',
    },
  },
  {
    threshold: 1000000,
    text: ['핸드폰을📱 ', '바꿀 수 있었어요'],

    video: {
      webm: '/video/phone.webm',
      poster: '/video/poster/phone.jpg',
    },
  },
  {
    threshold: 700000,
    text: ['게임기기를🎮 ', '살 수 있었어요'],

    video: {
      webm: '/video/game.webm',
      poster: '/video/poster/game.jpg',
    },
  },
  {
    threshold: 500000,
    text: ['제주도를🏝️ ', '갈 수 있었어요'],

    video: {
      webm: '/video/jeju.webm',
      poster: '/video/poster/jeju.jpg',
    },
  },
  {
    threshold: 300000,
    text: ['로봇 청소기를🤖 ', '살 수 있었어요'],

    video: {
      webm: '/video/robot.webm',
      poster: '/video/poster/robot.jpg',
    },
  },
  {
    threshold: 200000,
    text: ['브랜드 신발을👟 ', '살 수 있었어요'],

    video: {
      webm: '/video/shoes.webm',
      poster: '/video/poster/shoes.jpg',
    },
  },
  {
    threshold: 150000,
    text: ['레스토랑에서 외식을🍾 ', '할 수 있었어요'],

    video: {
      webm: '/video/out.webm',
      poster: '/video/poster/out.jpg',
    },
  },
  {
    threshold: 100000,
    text: ['기차 여행을🚞 ', '갈 수 있었어요'],

    video: {
      webm: '/video/train.webm',
      poster: '/video/poster/train.jpg',
    },
  },
  {
    threshold: 50000,
    text: ['카페에서 디저트를🍰 ', '먹을 수 있었어요'],

    video: {
      webm: '/video/desert.webm',
      poster: '/video/poster/desert.jpg',
    },
  },
  {
    threshold: 20000,
    text: ['친구와 커피를☕️ ', '마실 수 있었어요'],

    video: {
      webm: '/video/coffee.webm',
      poster: '/video/poster/coffee.jpg',
    },
  },
  {
    threshold: 0,
    text: ['작은 기쁨을🎁 ', '누릴 수 있었어요'],

    video: {
      webm: '/video/small.webm',
      poster: '/video/poster/small.jpg',
    },
  },
];

const regretContent = computed(() => {
  return (
    regretTable.find(item => missAmount.value >= item.threshold) ??
    regretTable.at(-1)
  );
});
</script>

<template>
  <div class="flex justify-between items-stretch">
    <div class="w-2/3 flex flex-col justify-center text-fg-primary mr-4">
      <div class="text-body01 text-fg-primary">
        <span>그때</span>
        <div class="relative mx-4 inline-block">
          <select
            v-model="selectedPrincipal"
            class="inline-block cursor-pointer appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 font-bold text-fg-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option
              v-for="opt in priceOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ (opt.value / 10000).toLocaleString() }}만원
            </option>
          </select>
        </div>
        <span>가입했다면 지금</span>
      </div>
      <p class="text-title-xl font-bold mt-4">
        <span>{{ regretContent.text[0] }} </span>
        <br class="hidden tablet:block" />
        <span>{{ regretContent.text[1] }}</span>
      </p>
    </div>
    <div class="w-1/3 overflow-hidden rounded-lg shadow-card">
      <video
        :key="regretContent.video.webm"
        autoplay
        muted
        loop
        playsinline
        :poster="regretContent.video.poster"
        class="w-full h-full object-cover"
      >
        <source :src="regretContent.video.webm" type="video/webm" />
      </video>
    </div>
  </div>
</template>
