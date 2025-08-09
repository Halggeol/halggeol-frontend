<!-- 사용 방법
props: 
- size: 카드 크기 [md(default)|lg]
- ratio: 카드 비율 [lg|sm|default(default)]
- variant: 카드 스타일 [outline|filled(default)|tinted]
- shadow: box-shadow 여부

e.g.
<BaseCard size="lg" ratio="lg" variant="outline" :shadow="true">
  카드 콘텐츠
</BaseCard>
-->

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
  ratio: {
    type: String,
    default: 'default',
  },
  variant: {
    type: String,
    default: 'filled',
  },
  shadow: {
    type: Boolean,
    default: false,
  },
});

import { computed } from 'vue';

// 카드 크기
const sizeClass = computed(() => {
  switch (props.size) {
    case 'lg':
      return 'w-full p-8';
    case 'sm':
      return 'w-64 p-6';
    default:
      return 'w-1/4 p-6';
  }
});

// 카드 비율
const ratioClass = computed(() => {
  switch (props.ratio) {
    case 'lg':
      return 'aspect-[1/1.2]';
    case 'sm':
      return 'aspect-[1/0.6]';
    default:
      return '';
  }
});

// 카드 스타일
const variantClass = computed(() => {
  switch (props.variant) {
    case 'outline':
      return props.shadow
        ? 'shadow-card border border-[#EDEDED]'
        : 'border border-gray-400';
    case 'tinted':
      return ['bg-secondary', props.shadow && 'shadow-card']
        .filter(Boolean)
        .join(' ');
    default:
      return ['bg-white', props.shadow && 'shadow-card']
        .filter(Boolean)
        .join(' ');
  }
});
</script>

<template>
  <!-- 카드 영역 -->
  <div :class="['rounded-lg', sizeClass, ratioClass, variantClass]">
    <slot />
  </div>
</template>
