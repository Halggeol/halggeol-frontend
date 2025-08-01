<template>
  <BaseCard size="lg" variant="tinted">
    <div class="space-y-6">
      <h3 class="text-title-sm font-semibold text-fg-primary">
        금융상품은 어떠셨나요?
      </h3>

      <div class="flex items-center justify-between">
        <!-- 라디오 버튼 그룹 -->
        <div class="flex gap-4">
          <label
            v-for="option in statusOptions"
            :key="option.value"
            class="flex items-center cursor-pointer"
          >
            <input
              type="radio"
              :value="option.value"
              v-model="selectedStatus"
              class="mr-2 w-4 h-4 text-primary bg-base-100 border-border-primary focus:ring-primary focus:ring-2"
            />
            <span class="text-callout text-fg-primary">{{ option.label }}</span>
          </label>
        </div>

        <!-- 제출 버튼 -->
        <BaseButton
          variant="primary"
          size="sm"
          @click="submitSurvey"
          :disabled="!selectedStatus"
          class="px-6"
        >
          제출
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { useNavigationStore } from '@/stores/navigation';
import { updateProductStatus, addScrap } from '@/api/product-detail';

const navigationStore = useNavigationStore();

// 설문 응답 데이터
const selectedStatus = ref(null);

const statusOptions = [
  { value: '가입', label: '가입할래요' },
  { value: '관심', label: '고민해볼래요' },
  { value: '회고', label: '가입안할래요' },
];

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
  productDetail: {
    type: Object,
    required: true,
  },
});

// 설문 제출
const submitSurvey = async () => {
  if (!selectedStatus.value) return;

  try {
    await updateProductStatus(props.productId, selectedStatus.value);
    console.log('상품 상태 업데이트 완료:', selectedStatus.value);

    // 추가 액션 처리
    if (selectedStatus.value === '관심') {
      // 고민해볼래요 선택 시 스크랩 추가
      await addScrap(props.productId);
      console.log('스크랩 추가 완료');
    } else if (selectedStatus.value === '가입') {
      // 가입할래요 선택 시 새 창에서 가입 링크 열기
      if (props.productDetail.regLink) {
        window.open(props.productDetail.regLink, '_blank');
      }
    }

    closeSurvey();
  } catch (error) {
    console.error('설문 처리 실패:', error);
  }
};

// 설문 닫기
const closeSurvey = () => {
  navigationStore.resetNavigation();
};
</script>
