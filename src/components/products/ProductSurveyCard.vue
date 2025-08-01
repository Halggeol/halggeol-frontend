<template>
  <BaseCard size="lg" variant="tinted" ㅇ>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-title-sm font-semibold text-fg-primary">
          📝 이 상품은 어떠셨나요?
        </h3>
        <button
          @click="closeSurvey"
          class="text-fg-secondary hover:text-fg-primary text-lg"
        >
          ✕
        </button>
      </div>

      <p class="text-body02 text-fg-secondary">
        추천드린 상품에 대한 피드백을 남겨주세요. 더 나은 추천을 위해
        활용됩니다.
      </p>

      <!-- 만족도 평가 -->
      <div class="space-y-3">
        <label class="text-callout font-medium text-fg-primary">
          이 상품 추천에 대해 얼마나 만족하시나요?
        </label>
        <div class="flex gap-2">
          <button
            v-for="score in [1, 2, 3, 4, 5]"
            :key="score"
            @click="satisfaction = score"
            :class="[
              'w-10 h-10 rounded-full border-2 transition-all',
              satisfaction >= score
                ? 'bg-primary border-primary text-white'
                : 'border-border-primary hover:border-primary',
            ]"
          >
            {{ score }}
          </button>
        </div>
      </div>

      <!-- 관심도 평가 -->
      <div class="space-y-3">
        <label class="text-callout font-medium text-fg-primary">
          실제로 가입을 고려하고 계신가요?
        </label>
        <div class="flex gap-3">
          <button
            v-for="option in interestOptions"
            :key="option.value"
            @click="interest = option.value"
            :class="[
              'px-4 py-2 rounded-lg border-2 transition-all text-callout',
              interest === option.value
                ? 'bg-primary border-primary text-white'
                : 'border-border-primary hover:border-primary',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <!-- 추가 의견 -->
      <div class="space-y-3">
        <label class="text-callout font-medium text-fg-primary">
          추가 의견이 있으시다면 자유롭게 남겨주세요 (선택)
        </label>
        <textarea
          v-model="feedback"
          placeholder="더 나은 추천을 위한 의견을 남겨주세요..."
          class="w-full p-3 border border-border-primary rounded-lg resize-none focus:outline-none focus:border-primary"
          rows="3"
        ></textarea>
      </div>

      <!-- 제출 버튼 -->
      <div class="flex gap-3">
        <BaseButton
          variant="primary"
          size="sm"
          @click="submitSurvey"
          :disabled="!satisfaction || !interest"
          class="flex-1"
        >
          피드백 남기기
        </BaseButton>
        <BaseButton variant="ghost" size="sm" @click="skipSurvey" class="px-6">
          건너뛰기
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

const navigationStore = useNavigationStore();

// 설문 응답 데이터
const satisfaction = ref(null);
const interest = ref(null);
const feedback = ref('');

const interestOptions = [
  { value: 'high', label: '매우 관심있음' },
  { value: 'medium', label: '조금 관심있음' },
  { value: 'low', label: '관심없음' },
];

const emit = defineEmits(['survey-completed', 'survey-closed']);

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
});

// 설문 제출
const submitSurvey = async () => {
  const surveyData = {
    productId: props.productId,
    satisfaction: satisfaction.value,
    interest: interest.value,
    feedback: feedback.value,
    timestamp: new Date().toISOString(),
  };

  try {
    // TODO: API 호출
    console.log('설문 제출:', surveyData);

    // 성공 시
    emit('survey-completed', surveyData);
    closeSurvey();
  } catch (error) {
    console.error('설문 제출 실패:', error);
    // 에러 처리
  }
};

// 설문 건너뛰기
const skipSurvey = () => {
  emit('survey-closed', { skipped: true });
  closeSurvey();
};

// 설문 닫기
const closeSurvey = () => {
  // 추천에서 온 상태 초기화
  navigationStore.resetNavigation();
  emit('survey-closed');
};
</script>
