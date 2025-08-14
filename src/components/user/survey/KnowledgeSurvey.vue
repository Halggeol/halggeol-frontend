<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { initKnowledgeSurvey, updateKnowledgeSurvey } from '@/api/survey';
import BaseButton from '@/components/common/BaseButton.vue';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  email: String,
})

const questions = [
  { number: 1, question: '일반적으로 대부업체의 대출 이자가 일반 은행의 대출 이자보다 낮다.', score: 1, correct: false },
  { number: 2, question: '대출금의 연체는 신용평가에 가장 치명적이다.', score: 2, correct: true },
  { number: 3, question: '전세보증보험은 전세 계약 종료 시 임차인이 임대인에게 반환해야 하는 전세보증금의 반환을 책임지는 보험상품이다.', score: 1, correct: true },
  { number: 4, question: '연금저축보험에 가입한 경우 연말정산시 납입보험료 연 400만원을 공제받을 수 있다.', score: 2, correct: true },
  { number: 5, question: 'CMA는 장기금융상품에 해당한다.', score: 1, correct: false },
  { number: 6, question: '상조회사는 금융회사가 아니지만 예금자보호법 등의 적용을 받는다.', score: 3, correct: false },
  { number: 7, question: '포트폴리오의 리스크는 자산 간 상관관계가 높을수록 더 감소한다.', score: 3, correct: false },
  { number: 8, question: '불경기가 되면 금리가 인상된다.', score: 3, correct: false },
  { number: 9, question: '주식이나 채권이 투자자들 사이에서 거래되는 시장을 유통시장이라고 한다.', score: 3, correct: true },
  { number: 10, question: '저축은 처분 가능 소득에서 소비 지출을 제외하고 남은 금액이다.', score: 2, correct: true },
];

const page = ref(0);
const answers = ref({});
const questionsPerPage = 5;

const start = computed(() => page.value * questionsPerPage);
const currentQuestions = computed(() => questions.slice(start.value, start.value + questionsPerPage));

const canNext = computed(() => {
  return currentQuestions.value.every(q => answers.value[q.number] !== undefined);
});

const nextLabel = computed(() => {
  return canNext.value ? '다음' : '모든 문항에 응답해주세요';
});

const submitLabel = computed(() => {
  return canNext.value ? '완료' : '모든 문항에 응답해주세요';
});

const handleAnswer = (questionNumber, userAnswer) => {
  answers.value = { ...answers.value, [questionNumber]: userAnswer };
};

const handleNext = () => {
  page.value++;
};

const handleSubmit = async () => {
  console.log("===== 금융 이해도 설문 완료 핸들링 =====");

  const body = {
    answers: questions.map((q) => ({
      number: q.number,
      score: q.score,
      correct: answers.value[q.number] === q.correct,
    })),
  };

  let response;

  try {
    if (props.email) {
      body.email = props.email;
      console.log("===== initKnowledgeSurvey API 호출 =====");
      response = await initKnowledgeSurvey(body);
    }
    else {
      console.log("===== updateKnowledgeSurvey API 호출 =====");
      response = await updateKnowledgeSurvey(body);
    }

    console.log(response.data.message);
    routeToNextStep();

  } catch (error) {
    alert("서버 오류가 발생했습니다.");
  }

  function routeToNextStep() {
    if (route.path.startsWith('/signup'))
      router.push('/signup/survey/tendency');
    else if (route.path.startsWith('/mypage'))
      router.push('/mypage');
    else
      router.push('/');
  }
};
</script>

<template>
  <div class="h-full flex flex-col">
    <div v-for="q in currentQuestions" :key="q.number" class="text-left grow">
      <p class="mb-4 text-body02 text-fg-primary flex items-center justify-between">
        <span>
          {{ q.number }}. {{ q.question }}
          <span
            style="font-size: 10px; vertical-align: top;"
            :class="answers[q.number] === undefined ? 'text-status-red' : 'text-white'"
          >
            ●
          </span>
        </span>
      </p>
      <div class="space-x-4">
        <button
          class="ml-4 px-4 py-2 rounded border"
          :class="answers[q.number] === true ? 'bg-gray-secondary-350 text-white' : 'bg-white text-fg-primary'"
          @click="handleAnswer(q.number, true)"
        >O</button>
        <button
          class="px-4 py-2 rounded border"
          :class="answers[q.number] === false ? 'bg-gray-secondary-350 text-white' : 'bg-white text-fg-primary'"
          @click="handleAnswer(q.number, false)"
        >X</button>
      </div>
    </div>

    <div class="text-footnote text-fg-secondary text-center mb-6">
      {{ page + 1 }} / {{ Math.ceil(questions.length / questionsPerPage) }}
    </div>

    <BaseButton
      v-if="start + questionsPerPage >= questions.length"
      class="mt-auto mb-20 shrink-0"
      size="lg"
      variant="filled"
      :disabled="!canNext"
      :label="submitLabel"
      @click="handleSubmit">
    </BaseButton>

    <BaseButton
      v-else
      class="mt-auto mb-20 shrink-0"
      size="lg"
      variant="filled"
      :disabled="!canNext"
      :label="nextLabel"
      @click="handleNext">
    </BaseButton>
  </div>
</template>

<style scoped>
button {
  transition: all 0.2s ease;
}
</style>
