<script setup>
import { computed, ref, watch } from 'vue';
import BaseCard from '../common/BaseCard.vue';

const props = defineProps({
  prefix: { type: String, required: true },
  asset: Number,
  isCompound: Boolean,
  interestRate: Number,
  saveTerm: Number,
  minLimit: Number,
  maxLimit: Number,
});

// 투자금 설정
const priceOptions = computed(() => {
  const min = props.minLimit;
  const max = Math.min(props.maxLimit, props.asset);

  const options = [];
  const step = Math.max(10000, Math.floor((max - min) / 4));
  for (let i = 0; i <= 4; i++) {
    const value = min + step * i;
    const roundedValue = Math.round(value / 10000) * 10000;
    options.push(roundedValue);
  }
  return options.map(value => ({
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

  if (['D', 'S', 'C', 'X'].includes(prefix)) {
    const rate = props.interestRate / 100;
    return props.rateType === '복리'
      ? Math.round(principal * Math.pow(1 + rate, 1) - principal)
      : Math.round(principal * rate);
  }

  // 외환의 경우 추후 다시 계산

  if (['A', 'F'].includes(prefix)) {
    const rate = props.interestRate / 100;
    return Math.round(principal * rate);
  }

  return 0;
});

// 놓친 금액 매칭, 백그라운드 이미지 추후 수정
const regretTable = [
  { threshold: 3000000, text: '유럽 여행을 갈 수 있었어요', image: '' },
  { threshold: 2500000, text: '아이맥을 살 수 있었어요', image: '' },
  { threshold: 2000000, text: '맥북에어를 살 수 있었어요', image: '' },
  { threshold: 1500000, text: 'DSLR 카메라를 살 수 있었어요', image: '' },
  { threshold: 1200000, text: '세라젬 안마의자를 살 수 있었어요', image: '' },
  { threshold: 1000000, text: '핸드폰을 바꿀 수 있었어요', image: '' },
  { threshold: 700000, text: '최신 태블릿 PC를 살 수 있었어요', image: '' },
  { threshold: 500000, text: '애플워치를 살 수 있었어요', image: '' },
  { threshold: 300000, text: '제주도를 갈 수 있었어요', image: '' },
  { threshold: 200000, text: '에어프라이어를 살 수 있었어요', image: '' },
  { threshold: 150000, text: '로봇 청소기를 살 수 있었어요', image: '' },
  {
    threshold: 100000,
    text: '고급 레스토랑 식사권을 살 수 있었어요',
    image: '',
  },
  { threshold: 70000, text: '소형 가전제품을 살 수 있었어요', image: '' },
  { threshold: 50000, text: '맛있는 외식을 할 수 있었어요', image: '' },
  {
    threshold: 30000,
    text: '브랜드 베이커리 케이크를 살 수 있었어요',
    image: '',
  },
  {
    threshold: 10000,
    text: '따뜻한 아메리카노 2~3잔을 마실 수 있었어요',
    image: '',
  },
  { threshold: 0, text: '작은 기쁨을 누릴 수 있었어요', image: '' },
];

const regretContent = computed(() => {
  return (
    regretTable.find(item => missAmount.value >= item.threshold) ??
    regretTable.at(-1)
  );
});
</script>

<template>
  <BaseCard
    :shadow="true"
    class="flex-[2]"
    style="
      background-image: url(https://t1.kakaocdn.net/thumb/C317x178.fwebp.q100/?fname=https%3A%2F%2Ft1.kakaocdn.net%2Fkakaocorp%2Fkakaocorp%2Fservice%2Fgnb%2Fgnb_kakaoCulture.png);
      background-size: cover;
      background-position: center;
    "
  >
    <p class="text-body02 text-fg-primary">
      <span>그때 </span>
      <select
        v-model="selectedPrincipal"
        class="inline-block bg-transparent text-fg-primary px-2 py-1 mx-1 appearance-none focus:outline-none focus:ring-0"
      >
        <option v-for="opt in priceOptions" :key="opt.value" :value="opt.value">
          {{ (opt.value / 10000).toLocaleString() }}만원
        </option>
      </select>
      <span> 가입했다면</span>
    </p>
    <p class="title01">{{ regretContent.text }}</p>
  </BaseCard>
</template>
