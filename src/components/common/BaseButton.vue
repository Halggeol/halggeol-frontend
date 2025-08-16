<!-- 사용 방법
props:
- size: 버튼 크기 [sm|md(default)|lg]
- variant: 버튼 스타일 [outline|filled(default)|ghost]
- disabled: 버튼 비활성화 여부
- hasIconFst/hasIconLst: 왼쪽/오른쪽 아이콘 사용 여부, 슬롯에 #icon_fst/icon_lst 명시
- label: 버튼 표시 텍스트 작성

emits:
- 클릭 이벤트 관련. 부모 컴포넌트 script에 function 정의

e.g.
<BaseButton size="sm" variant="ghost" :disabled="true" :hasIconFst="true" label="가입하기" @click="onClickHandler">
  <template #icon_fst>
    <i></i>
  </template>
</BaseButton>
-->

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'md',
  },
  variant: {
    type: String,
    default: 'filled',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hasIconFst: {
    type: Boolean,
    default: false,
  },
  hasIconLst: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '시작하기',
  },
});

import { computed } from 'vue';
// 기본 레이아웃
const baseClass = computed(() => {
  return [
    'text-sm font-medium rounded-lg flex items-center justify-center',
    (props.hasIconFst || props.hasIconLst) && 'gap-2',
  ]
    .filter(Boolean)
    .join(' ');
});
// 버튼 사이즈
const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-6 py-4';
    case 'lg':
      return 'w-full py-3';
    default:
      return 'w-1/4 py-4';
  }
});

// 버튼 스타일+비활성화 여부
const variantClass = computed(() => {
  if (props.disabled) {
    switch (props.variant) {
      case 'outline':
        return 'border border-gray-300 bg-transparent text-gray-300 cursor-not-allowed';
      case 'ghost':
        return 'bg-transparent text-gray-300 cursor-not-allowed';
      default:
        return 'bg-gray-100 text-gray-300 cursor-not-allowed';
    }
  }
  switch (props.variant) {
    case 'outline':
      return 'border border-gray-400 bg-transparent text-fg-primary';
    case 'ghost':
      return 'bg-transparent text-primary';
    case 'basic':
      return 'bg-gray-100 border-gray-400';
    default:
      return 'bg-primary text-white text-fg-primary';
  }
});

// 클릭 이벤트
const emit = defineEmits(['click']);
</script>

<template>
  <!-- 버튼 영역 -->
  <button
    :class="[baseClass, sizeClass, variantClass]"
    :disabled="disabled"
    @click="emit('click')"
  >
    <slot name="icon_fst" v-if="hasIconFst" />
    {{ label }}
    <slot name="icon_lst" v-if="hasIconLst" />
  </button>
</template>
