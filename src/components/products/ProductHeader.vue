<template>
  <div
    :style="productTypeHeaderStyle"
    :class="[
      'transition-colors duration-300',
      isScrolled ? 'py-4 sticky top-0 z-50 shadow-card' : 'tablet:py-8 py-16',
    ]"
  >
    <!-- Default Header -->
    <div
      v-if="!isScrolled"
      class="tablet:px-5 px-[10.8%] flex tablet:flex-col flex-row justify-between items-start gap-6"
    >
      <!-- Left Content -->
      <div class="min-w-0">
        <div
          class="flex flex-wrap items-center tablet:gap-2 tablet:mb-4 gap-3 mb-6"
        >
          <span
            :style="productTypeBadgeStyle"
            class="inline-flex items-center px-3 py-1 rounded-full text-caption font-medium"
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
          class="text-title-md tablet:text-title-lg wide:text-title-xl text-fg-primary font-bold tablet:mb-4 mb-6"
        >
          {{ productDetail.name }}
        </h1>
        <div class="flex items-center gap-2 tablet:mb-6 mb-8">
          <span class="text-status-red"
            ><Heart :class="['w-4 h-4 text-red-500']" /></span
          ><span class="text-body02 text-fg-secondary">
            <strong class="text-fg-primary">{{ productDetail.scrapCnt }}</strong
            >명이 관심갖고있음
          </span>
        </div>
        <div
          class="text-footnote text-fg-secondary leading-relaxed max-w-2xl overflow-hidden"
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
        class="tablet:flex-shrink-0 w-1/3 flex gap-3 tablet:mt-6 mt-auto flex-col tablet:flex-row"
      >
        <div
          v-if="authStore.isLoggedIn"
          class="flex-1 tablet:flex-initial wide:flex-initial"
        >
          <BaseButton
            label="관심상품"
            size="sm"
            variant="outline"
            :disabled="isScrapLoading || !authStore.isLoggedIn"
            :hasIconFst="true"
            class="!w-full tablet:!w-auto wide:!w-auto !whitespace-nowrap !bg-white/60 hover:!bg-gray-50 !px-4 tablet:!px-8 wide:!px-10"
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
          variant="tinted"
          :style="productTypeBadgeStyle"
          class="flex-1 tablet:!flex-initial wide:!flex-initial !w-full tablet:!w-auto wide:!w-auto !whitespace-nowrap !px-4 tablet:!px-8 wide:!px-10"
          @click="handleNavigate"
        />
      </div>
    </div>

    <!-- Scrolled Header -->
    <div
      v-else
      class="h-full tablet:px-5 px-[10.8%] flex justify-between items-center gap-6"
    >
      <!-- Left Content (Scrolled) -->
      <div class="min-w-0">
        <h1 class="text-title-sm font-bold text-fg-primary truncate pr-4">
          {{ productDetail.name }}
        </h1>
      </div>
      <!-- Right Buttons (Scrolled) -->
      <div class="flex-shrink-0 flex gap-3 items-center">
        <div v-if="authStore.isLoggedIn">
          <BaseButton
            label="관심상품"
            size="lg"
            variant="outline"
            :disabled="isScrapLoading || !authStore.isLoggedIn"
            :hasIconFst="true"
            class="!whitespace-nowrap !bg-white/60 hover:!bg-gray-50 !px-6"
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
          size="lg"
          variant="tinted"
          :style="productTypeBadgeStyle"
          class="!whitespace-nowrap !px-4"
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

const emit = defineEmits(['navigate', 'update:scrapStatus']);

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

const productTypeHeaderStyle = computed(() => {
  const prefix = idPrefix.value;
  const colorMap = {
    D: '#FFEFEE', // deposit
    S: '#FFF4DF', // savings
    A: '#F9EFFA', // pension
    C: '#F9EFFA', // pension
    F: '#ECF0FF', // fund
    X: '#F9EFE3', // forex
  };
  const bgColor = colorMap[prefix];
  if (bgColor) {
    return { backgroundColor: bgColor };
  }
  return { backgroundColor: '#e2e8f0' }; // fallback to slate-200
});

const productTypeBadgeStyle = computed(() => {
  const prefix = idPrefix.value;
  const colorMap = {
    D: '#FB0000', // fg-deposit
    S: '#F95A00', // fg-savings
    A: '#CC0CCC', // fg-pension
    C: '#CC0CCC', // fg-pension
    F: '#1544BC', // fg-fund
    X: '#995C14', // fg-forex
  };
  const bgColor = colorMap[prefix];
  if (bgColor) {
    return { backgroundColor: bgColor, color: 'white' };
  }
  return { backgroundColor: '#60584C', color: 'white' }; // Fallback to gray-primary
});

const handleAddScrap = async () => {
  if (isScrapLoading.value) return;

  console.log('버튼 클릭 - 현재 isScraped:', isScraped.value);
  isScrapLoading.value = true;
  const originalScrapStatus = isScraped.value;
  isScraped.value = !originalScrapStatus;
  try {
    if (isScraped.value) {
      // 관심상품이먄 추가
      console.log('addScrap 호출');
      await addScrap(props.productDetail.id);
      console.log('추가 완료, isScraped:', isScraped.value);
    } else {
      // 관심상품 아니면 삭제
      console.log('delScrap 호출');
      await delScrap(props.productDetail.id);
      console.log('삭제 완료, isScraped:', isScraped.value);
    }
    emit('update:scrapStatus', isScraped.value);
  } catch (error) {
    console.error('관심상품 처리 실패:', error);
    isScraped.value = originalScrapStatus;
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
