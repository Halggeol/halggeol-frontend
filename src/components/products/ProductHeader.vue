<template>
  <div
    :class="[
      'bg-gradient-to-r from-secondary-200 to-secondary-300 px-[10.8%] transition-all duration-300',
      isScrolled ? 'py-4 sticky top-0 z-50 shadow-lg' : 'py-12 lg:py-16'
    ]"
  >
    <div :class="['flex justify-between', isScrolled ? 'items-center' : 'items-start']">
      <!-- 왼쪽 컨텐츠 -->
      <div class="flex-1">
        <!-- 일반 상태 -->
        <div v-if="!isScrolled">
          <div class="flex items-center gap-3 mb-6">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full bg-primary text-white text-caption font-medium"
              >{{ productTypeName }}</span
            >
            <span
              v-if="productDetail.joinMember"
              class="inline-flex items-center px-3 py-1 rounded-full bg-fg-secondary-100 text-fg-primary text-caption"
              >{{ productDetail.joinMember }}</span
            >
            <span
              v-if="productDetail.joinWay"
              class="inline-flex items-center px-3 py-1 rounded-full bg-fg-secondary-100 text-fg-primary text-caption"
              >{{ productDetail.joinWay }}</span
            >
          </div>

          <h1
            class="text-title-lg lg:text-title-xl font-bold text-fg-primary mb-6"
          >
            {{ productDetail.name }}
          </h1>

          <div class="flex items-center gap-2 mb-8">
            <span class="text-status-red">❤️</span>
            <span class="text-footnote text-fg-secondary">
              <strong class="text-fg-primary">{{ productDetail.scrapCnt }}</strong
              >명이 관심갖고있음
            </span>
          </div>

          <div class="text-body02 text-fg-secondary leading-relaxed max-w-2xl">
            제공되는 정보는 금융감독원
            <strong class="text-fg-primary">{{ renewDate }}</strong
            >일에 공시된 내용을 기반으로 작성되었으며, 금융상품 광고가 아닙니다.
            실제 상품 가입 시점에 변동될 수 있으므로 상품 가입 시 꼭 다시
            확인하시기 바랍니다.
          </div>
        </div>
        
        <!-- 스크롤된 상태 (축소된 레이아웃) -->
        <div v-else class="flex items-center">
          <h1 class="text-title-sm font-bold text-fg-primary">
            {{ productDetail.name }}
          </h1>
        </div>
      </div>

      <!-- 오른쪽 버튼들 -->
      <div :class="['ml-6 lg:ml-8', isScrolled ? 'flex gap-3 items-center' : 'flex flex-col gap-3 mt-auto']">
        <BaseButton
          :label="isScraped ? '❤️ 관심상품' : '🤍 관심상품'"
          :size="isScrolled ? 'xs' : 'sm'"
          variant="outline"
          :disabled="isScrapLoading"
          :class="[
            '!w-auto !whitespace-nowrap hover:bg-gray-50 transition-colors',
            isScrolled ? '!px-4 !text-caption' : '!px-6 md:!px-8 lg:!px-10 !text-footnote md:!text-callout'
          ]"
          @click="handleAddScrap"
        />
        <BaseButton
          label="가입하기"
          :size="isScrolled ? 'xs' : 'sm'"
          variant="filled"
          :class="[
            '!w-auto !whitespace-nowrap',
            isScrolled ? '!px-4 !text-caption' : '!px-6 md:!px-8 lg:!px-10 !text-footnote md:!text-callout'
          ]"
          @click="handleNavigate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { addScrap, delScrap } from '@/api/product-detail';

const props = defineProps({
  productDetail: {
    type: Object,
    required: true,
  },
  renewDate: {
    type: String,
    default: '25.06.20',
  },
  isScrolled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['navigate']);

const isScrapLoading = ref(false);
const isScraped = ref(props.productDetail.isScraped || false);

const idPrefix = computed(() => {
  if (
    props.productDetail &&
    props.productDetail.id &&
    typeof props.productDetail.id === 'string'
  ) {
    return props.productDetail.id.charAt(0).toUpperCase();
  }
  return '';
});

const productTypeName = computed(() => {
  const typeMapping = {
    D: '예금',
    S: '적금',
    A: '공격형 연금',
    C: '안정형 연금',
    F: '펀드',
    X: '외화',
  };
  return typeMapping[idPrefix.value] || '금융상품';
});

const handleAddScrap = async () => {
  if (isScrapLoading.value) return;

  console.log('버튼 클릭 - 현재 isScraped:', isScraped.value);
  isScrapLoading.value = true;

  try {
    if (isScraped.value) {
      // 이미 관심상품이면 삭제
      console.log('delScrap 호출');
      await delScrap(props.productDetail.id);
      isScraped.value = false;
      console.log('삭제 완료, isScraped:', isScraped.value);
    } else {
      // 관심상품이 아니면 추가
      console.log('addScrap 호출');
      await addScrap(props.productDetail.id);
      isScraped.value = true;
      console.log('추가 완료, isScraped:', isScraped.value);
    }
  } catch (error) {
    console.error('관심상품 처리 실패:', error);
  } finally {
    isScrapLoading.value = false;
  }
};

const handleNavigate = () => {
  emit('navigate');
};

// productDetail이 변경될 때 isScraped 상태 업데이트
watch(
  () => props.productDetail?.isScraped,
  (newValue, oldValue) => {
    console.log('watch 실행 - props.isScraped 변경:', oldValue, '->', newValue);
    isScraped.value = newValue || false;
  },
  { immediate: true }
);
</script>
