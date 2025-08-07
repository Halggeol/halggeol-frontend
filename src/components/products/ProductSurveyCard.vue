<template>
  <!-- 이미 피드백을 남긴 경우 블러 처리 -->
  <div v-if="isCompleted" class="relative">
    <div class="filter blur-sm pointer-events-none select-none">
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
                  class="mr-2 w-4 h-4 text-primary bg-base-100 border-border-primary focus:ring-primary focus:ring-2"
                />
                <span class="text-callout text-fg-primary">{{
                  option.label
                }}</span>
              </label>
            </div>

            <!-- 제출 버튼 -->
            <BaseButton variant="primary" size="sm" class="px-6">
              제출
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>
    <div
      class="absolute inset-0 flex flex-col items-center justify-center bg-base-100/50"
    >
      <h4 class="text-title-sm font-semibold text-fg-primary mb-2">
        이 상품에 대한 피드백을 이미
        <span class="text-primary font-bold">{{
          getStatusLabel(productStatus)
        }}</span
        >로 응답하셨습니다.
      </h4>
    </div>
  </div>

  <!-- 정상 설문 카드 -->
  <BaseCard v-else size="lg" variant="tinted">
    <div class="space-y-6">
      <h3 class="text-title-sm font-semibold text-fg-primary">
        금융상품은 어떠셨나요?
      </h3>

      <div class="space-y-1">
        <div class="relative">
          <div class="flex items-center justify-between">
            <!-- 라디오 버튼 그룹 -->
            <div class="flex gap-4">
              <label
                v-for="option in statusOptions"
                :key="option.value"
                class="relative flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  :value="option.value"
                  v-model="selectedStatus"
                  class="mr-2 w-4 h-4 text-primary bg-base-100 border-border-primary focus:ring-primary focus:ring-2"
                />
                <span class="text-callout text-fg-primary">{{
                  option.label
                }}</span>
                <!-- 각 선택지별 설명 텍스트 -->
                <div
                  v-if="selectedStatus === option.value"
                  class="absolute top-full left-6 mt-1 text-callout text-fg-secondary whitespace-nowrap z-10"
                >
                  {{ getStatusDescription(option.value) }}
                </div>
              </label>
            </div>

            <!-- 제출 버튼 -->
            <BaseButton
              variant="primary"
              size="sm"
              @click="submitSurvey"
              :disabled="!selectedStatus"
              class="px-6"
              label="제출"
            >
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { useNavigationStore } from '@/stores/navigation';
import { updateProductStatus, addScrap } from '@/api/product-detail';

const navigationStore = useNavigationStore();

// 설문 응답 데이터
const selectedStatus = ref(null);

const statusOptions = [
  { value: '가입', label: '가입 할래요' },
  { value: '관심', label: '고민해 볼래요' },
  { value: '회고', label: '가입 안 할래요' },
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
  productStatus: {
    type: [String, Object, null],
    default: null,
  },
});

// 이미 완료된 설문인지 확인
const isCompleted = computed(() => {
  return props.productStatus !== null && props.productStatus !== '';
  // return false; // 개발용
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

// 상태값을 한글 라벨로 변환
const getStatusLabel = status => {
  const statusMap = {
    가입: '가입 할래요',
    관심: '고민해 볼래요',
    회고: '가입 안 할래요',
  };

  // status가 객체인 경우 (예: { status: '가입' }) 처리
  if (typeof status === 'object' && status !== null) {
    return statusMap[status.status] || status.status || '알 수 없음';
  }

  // status가 문자열인 경우
  return statusMap[status] || status || '알 수 없음';
};

// 상태별 설명 텍스트 반환
const getStatusDescription = status => {
  const descriptionMap = {
    가입: '금융 상품 가입 링크로 연결해드려요',
    관심: '고민 중인 상품을 관심상품에 등록해드려요',
    회고: '이후 인사이트에서 확인해보실 수 있어요',
  };

  return descriptionMap[status] || '';
};
</script>
