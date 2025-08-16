<template>
  <!-- Already completed survey -->
  <div v-if="isCompleted" class="relative mt-20">
    <div class="filter blur-sm pointer-events-none select-none">
      <BaseCard size="lg" variant="tinted">
        <h3 class="text-body01 font-semibold text-fg-primary mb-4">
          금융상품은 어떠셨나요?
        </h3>
        <div
          class="flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-4"
        >
          <div class="flex flex-wrap gap-x-6 gap-y-3">
            <div
              v-for="option in statusOptions"
              :key="option.value"
              class="flex items-center"
            >
              <div
                class="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"
              ></div>
              <span class="text-body02 text-gray-400">{{ option.label }}</span>
            </div>
          </div>
          <BaseButton
            variant="primary"
            size="sm"
            class="px-6 w-full tablet:w-auto self-end tablet:self-center"
            disabled
          >
            제출
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    <div
      class="absolute inset-0 flex flex-col items-center justify-center bg-base-100/50 p-4 rounded-lg"
    >
      <h4 class="text-body01 font-semibold text-fg-primary mb-2 text-center">
        이 상품에 대한 피드백을 이미
        <span class="text-primary font-bold">{{
          getStatusLabel(productStatus)
        }}</span
        >로 응답하셨습니다.
      </h4>
    </div>
  </div>

  <!-- Active survey card -->
  <BaseCard v-else size="lg" variant="tinted" class="mt-20">
    <div class="space-y-4">
      <h3 class="text-body01 font-semibold text-fg-primary">
        금융상품은 어떠셨나요?
      </h3>
      <div
        class="flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-4"
      >
        <div class="flex-grow">
          <div class="flex flex-wrap gap-x-6 gap-y-3">
            <label
              v-for="option in statusOptions"
              :key="option.value"
              class="flex items-center cursor-pointer"
            >
              <input
                type="radio"
                :value="option.value"
                v-model="selectedStatus"
                class="sr-only peer"
              />
              <div
                class="flex h-5 w-5 mr-2 items-center justify-center rounded-full border border-gray-300 peer-checked:border-primary"
              >
                <div
                  class="h-2.5 w-2.5 rounded-full bg-primary"
                  v-if="selectedStatus === option.value"
                ></div>
              </div>
              <span class="text-body02 text-fg-primary">{{
                option.label
              }}</span>
            </label>
          </div>
          <div class="pt-2 min-h-[24px]">
            <p
              v-if="selectedStatus"
              class="text-body02 text-fg-secondary transition-opacity duration-300"
            >
              {{ getStatusDescription(selectedStatus) }}
            </p>
          </div>
        </div>

        <BaseButton
          variant="primary"
          size="sm"
          @click="submitSurvey"
          :disabled="!selectedStatus"
          class="px-6 w-full tablet:w-auto self-end tablet:self-center flex-shrink-0"
          label="제출"
        >
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '@/components/common/BaseButton.vue';
// import { useNavigationStore } from '@/stores/navigation';
import { updateProductStatus, addScrap } from '@/api/product-detail';

// const navigationStore = useNavigationStore();

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

const emit = defineEmits(['survey-completed']);

// Function to check if survey is completed from localStorage
const isSurveyCompletedInLocalStorage = productId => {
  const completedSurveys = JSON.parse(
    localStorage.getItem('completedSurveys') || '{}'
  );
  return completedSurveys[productId] === true;
};

// Function to mark survey as completed in localStorage
const markSurveyCompletedInLocalStorage = productId => {
  const completedSurveys = JSON.parse(
    localStorage.getItem('completedSurveys') || '{}'
  );
  completedSurveys[productId] = true;
  localStorage.setItem('completedSurveys', JSON.stringify(completedSurveys));
};

const isCompleted = computed(() => {
  // Check both productStatus and localStorage
  return (
    (props.productStatus !== null && props.productStatus !== '') ||
    isSurveyCompletedInLocalStorage(props.productId)
  );
});

const submitSurvey = async () => {
  if (!selectedStatus.value) return;

  try {
    await updateProductStatus(props.productId, selectedStatus.value);
    console.log('상품 상태 업데이트 완료:', selectedStatus.value);

    if (selectedStatus.value === '관심') {
      await addScrap(props.productId);
      console.log('스크랩 추가 완료');
    } else if (selectedStatus.value === '가입') {
      if (props.productDetail.regLink) {
        window.open(props.productDetail.regLink, '_blank');
      }
    }

    // Mark survey as completed in localStorage
    markSurveyCompletedInLocalStorage(props.productId);

    // Emit event (optional, but good for parent to know)
    emit('survey-completed', selectedStatus.value);
  } catch (error) {
    console.error('설문 처리 실패:', error);
  }
};

const getStatusLabel = status => {
  const statusMap = {
    가입: '가입 할래요',
    관심: '고민해 볼래요',
    회고: '가입 안 할래요',
  };

  if (typeof status === 'object' && status !== null) {
    return statusMap[status.status] || status.status || '알 수 없음';
  }

  return statusMap[status] || status || '알 수 없음';
};

const getStatusDescription = status => {
  const descriptionMap = {
    가입: '금융 상품 가입 링크로 연결해드려요',
    관심: '고민 중인 상품을 관심상품에 등록해드려요',
    회고: '이후 인사이트에서 확인해보실 수 있어요',
  };

  return descriptionMap[status] || '';
};
</script>
