<template>
  <div
    :class="[
      'bg-gray-secondary-200',
      isScrolled
        ? 'py-4 sticky top-0 z-50 shadow-lg'
        : 'py-8 tablet:py-12 wide:py-16',
    ]"
    :style="{
      height: isScrolled ? '80px' : 'auto',
      minHeight: isScrolled ? '80px' : isScrollEffectEnabled ? '360px' : 'auto',
    }"
  >
    <!-- Default Header -->
    <div
      v-if="!isScrolled"
      class="px-4 tablet:px-[10.8%] wide:px-[10.8%] flex flex-col tablet:flex-row wide:flex-row justify-between items-start gap-6"
    >
      <!-- Left Content -->
      <div class="flex-1 min-w-0">
        <div
          class="flex flex-wrap items-center gap-2 mb-4 tablet:gap-3 wide:gap-3 tablet:mb-6 wide:mb-6"
        >
          <span
            class="inline-flex items-center px-3 py-1 rounded-full bg-gray-primary text-white text-caption font-medium"
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
          class="text-title-md tablet:text-title-lg wide:text-title-xl text-fg-primary font-bold mb-4 tablet:mb-6 wide:mb-6"
        >
          {{ productDetail.name }}
        </h1>
        <div class="flex items-center gap-2 mb-6 tablet:mb-8 wide:mb-8">
          <span class="text-status-red"
            ><Heart :class="['w-4 h-4 text-red-500']" /></span
          ><span class="text-footnote text-fg-secondary">
            <strong class="text-fg-primary">{{ productDetail.scrapCnt }}</strong
            >명이 관심갖고있음
          </span>
        </div>
        <div
          class="text-caption tablet:text-footnote wide:text-footnote text-fg-secondary leading-relaxed max-w-2xl overflow-hidden"
        >
          제공되는 정보는 금융감독원
          <strong class="text-fg-primary">{{ renewDate }}</strong
          >일에 공시된 내용을 기반으로 작성되었으며, 금융상품 광고가 아닙니다.
          실제 상품 가입 시점에 변동될 수 있으므로 상품 가입 시 꼭 다시
          확인하시기 바랍니다.
        </div>
      </div>
      <!-- Right Buttons -->
      <div
        class="flex-shrink-0 w-full tablet:w-auto wide:w-auto flex gap-3 mt-6 tablet:mt-auto wide:mt-auto tablet:flex-col wide:flex-col"
      >
        <div
          v-if="authStore.isLoggedIn"
          class="flex-1 tablet:flex-initial wide:flex-initial"
        >
          <BaseButton
            label="관심상품"
            size="sm"
            variant="basic"
            :disabled="isScrapLoading || !authStore.isLoggedIn"
            :hasIconFst="true"
            class="!w-full tablet:!w-auto wide:!w-auto !whitespace-nowrap hover:bg-gray-50 !px-4 !text-caption tablet:!px-8 wide:!px-10 tablet:!text-footnote wide:!text-callout"
            @click="handleAddScrap"
          >
            <template #icon_fst>
              <Heart
                :isFilled="isScraped"
                :class="[
                  'w-4 h-4',
                  isScraped ? 'text-red-500' : 'text-gray-400',
                ]"
              />
            </template>
          </BaseButton>
        </div>
        <BaseButton
          label="가입하기"
          size="sm"
          variant="filled"
          class="flex-1 tablet:!flex-initial wide:!flex-initial !w-full tablet:!w-auto wide:!w-auto !whitespace-nowrap !px-4 !text-caption tablet:!px-8 wide:!px-10 tablet:!text-footnote wide:!text-callout"
          @click="handleNavigate"
        />
      </div>
    </div>

    <!-- Scrolled Header -->
    <div
      v-else
      class="h-full px-4 tablet:px-[10.8%] wide:px-[10.8%] flex justify-between items-center gap-6"
    >
      <!-- Left Content (Scrolled) -->
      <div class="flex-1 min-w-0">
        <h1 class="text-title-sm font-bold text-fg-primary truncate pr-4">
          {{ productDetail.name }}
        </h1>
      </div>
      <!-- Right Buttons (Scrolled) -->
      <div class="flex-shrink-0 flex gap-3 items-center">
        <div v-if="authStore.isLoggedIn">
          <BaseButton
            label=""
            size="xs"
            variant="basic"
            :disabled="isScrapLoading || !authStore.isLoggedIn"
            :hasIconFst="true"
            class="!w-auto !whitespace-nowrap hover:bg-gray-50 !px-6 !text-caption"
            @click="handleAddScrap"
          >
            <template #icon_fst>
              <Heart
                :isFilled="isScraped"
                :class="[
                  'w-4 h-4',
                  isScraped ? 'text-red-500' : 'text-gray-400',
                ]"
              />
            </template>
          </BaseButton>
        </div>
        <BaseButton
          label="가입하기"
          size="xs"
          variant="filled"
          class="!w-auto !whitespace-nowrap !px-4 !text-caption"
          @click="handleNavigate"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import Heart from '@/components/icons/Heart.vue';
import { addScrap, delScrap } from '@/api/product-detail';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

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
  isScrollEffectEnabled: {
    type: Boolean,
    default: true,
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
