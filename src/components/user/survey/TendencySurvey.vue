<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { initTendencySurvey, updateTendencySurvey } from '@/api/survey';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps({
  email: String,
});

const router = useRouter();
const route = useRoute();

const page = ref(0);
const questionsPerPage = 3;

const answers = ref({});
const experiences = ref([]);
const experiencePeriods = ref({});
const investmentPeriod = ref(null);

// 투자 경험 문항 체크박스 상태 관련 변수
const clickedExperienceIdx = ref(null);
const clickedExperienceValue = ref(null);

const questions = [
  {
    number: 1,
    question: '향후 수입을 어떻게 예상하시나요?',
    options: [
      { text: '현재 수입이 있고 증가할 것 같다', score: 5 },
      { text: '현재 수입이 있지만 감소할 것 같다', score: 3 },
      { text: '현재 수입이 없고 현금이 주 수입원이다', score: 1 },
    ],
  },
  {
    number: 2,
    question: '기존 보유하고 계신 총자산 대비 금융자산의 비중은 어느 정도인가요?',
    options: [
      { text: '5% 이하', score: 1 },
      { text: '10% 이하', score: 2 },
      { text: '20% 이하', score: 3 },
      { text: '30% 이하', score: 4 },
      { text: '30% 초과', score: 5 },
    ],
  },
  {
    number: 3,
    question: '어떤 목적으로 투자하시나요?',
    options: [
      { text: '원금 보존 우선', score: 1 },
      { text: '일부 손실 감수하고 수익 기대', score: 3 },
      { text: '고수익 위해 손실 감수 가능', score: 5 },
    ],
  },
  {
    number: 4,
    question: '감내하실 수 있는 투자수익 및 위험수준은 어느 정도인가요?',
    options: [
      { text: '무조건 원금 보존', score: 1 },
      { text: '10% 변동에도 매도', score: 3 },
      { text: '20% 변동도 감내 가능', score: 4 },
      { text: '30% 이상도 가능', score: 5 },
    ],
  },
  {
    number: 5,
    question: '금융지식 수준(이해도)는 어느 정도라고 생각하시나요?',
    options: [
      { text: '예적금 외 없음', score: 1 },
      { text: '일반 금융상품 설명 후 결정 가능', score: 2 },
      { text: '일반 상품 잘 알고 있음', score: 3 },
      { text: '파생상품 포함 모두 잘 앎', score: 4 },
    ],
  },
  {
    number: 6,
    question: '나이는 어떻게 되시나요?',
    options: [
      { text: '20세 미만', score: 1 },
      { text: '20~35세 미만', score: 3 },
      { text: '35~50세 미만', score: 5 },
      { text: '50~60세 미만', score: 2 },
      { text: '65세 이상', score: 1 },
    ],
  },
  {
    number: 7,
    question: '연소득은 어떻게 되시나요?',
    options: [
      { text: '2천만원 미만', score: 1 },
      { text: '2천~5천만원 미만', score: 2 },
      { text: '5천~7천만원 미만', score: 3 },
      { text: '7천~1억원 미만', score: 4 },
      { text: '1억원 이상', score: 5 },
    ],
  },
];

const experiencesQuestion = {
  number: 8,
  question: '투자한 경험이 있는 항목을 모두 선택해주세요.(중복 가능)',
  options: [
    {
      text: '금융투자상품에 투자해 본 경험이 없음',
      score: 0,
    },
    {
      text: '주식신용거래, 선물/옵션, ELW, 원금비보장형 ELS/DLS/ELF',
      score: 6,
      period: [
        { text: '1년미만', score: 1 },
        { text: '1년이상~3년미만', score: 3 },
        { text: '3년이상', score: 5 },
      ]
    },
    {
      text: '주식, 주식형펀드, 해외펀드, 원금보장형 ELS/DLS/ELF, 투자자문/일임(Wrap), 외화증권',
      score: 3,
      period: [
        { text: '1년미만', score: 1 },
        { text: '1년이상~3년미만', score: 3 },
        { text: '3년이상', score: 5 },
      ]
    },
    {
      text: '채권/혼합형 펀드, 신탁, 채권',
      score: 1,
      period: [
        { text: '1년미만', score: 1 },
        { text: '1년이상~3년미만', score: 3 },
        { text: '3년이상', score: 5 },
      ]
    },
  ],
}

const investmentPeriodQuestion = {
  number: 9,
  question: '현재 투자 자산에 대한 투자 예정 기간은 어떻게 되시나요?',
  options: [
    { text: '1년 미만' },
    { text: '1~2년 미만' },
    { text: '2~3년 미만' },
    { text: '3~5년 미만' },
    { text: '5년 이상' },
  ],
}

const currentQuestions = computed(() => questions.slice(page.value * questionsPerPage, (page.value + 1) * questionsPerPage));

const allExperiencePeriodsSelected = computed(() => {
  return experiences.value.every(option => {
    const experienceOption = experiencesQuestion.options[option - 1];
    if (!experienceOption.period)
      return true;

    return experiencePeriods.value[option - 1] !== undefined;
  });
});

const canNext = computed(() => {
  return currentQuestions.value.every(q => answers.value[q.number] !== undefined);
});

const nextLabel = computed(() => {
  return canNext.value ? '다음' : '모든 문항에 응답해주세요';
});

const canSubmit = computed(() => {
  return (
    canNext.value &&
    experiences.value.length > 0 &&
    investmentPeriod.value !== null &&
    allExperiencePeriodsSelected.value
  );
});

const submitLabel = computed(() => {
  return canSubmit.value ? '완료' : '모든 문항에 응답해주세요';
});


const handleAnswer = (questionNumber, optionIndex, score) => {
  answers.value[questionNumber] = { option: optionIndex + 1, optionScore: score };
};

const handleNext = () => {
  page.value++;
};

const handleSubmit = async () => {
  console.log("===== 투자 성향 설문 완료 핸들링 =====");

  const answerList = Object.entries(answers.value).map(([number, value]) => ({
    number: parseInt(number),
    option: value.option,
    optionScore: value.optionScore,
  }));

    const experienceList = experiences.value.map(option => {
    const experienceOption = experiencesQuestion.options[option - 1];
    const periodIdx = experiencePeriods.value[option - 1];
    const period = periodIdx + 1;

    if (periodIdx === undefined)
      return {
        option,
        optionScore: experienceOption.score,
      };

    return {
      option,
      optionScore: experienceOption.score,
      period,
      periodScore: experienceOption.period[periodIdx].score,
    };
  });

  const body = {
    answers: answerList,
    experiences: experienceList,
    investmentPeriod: investmentPeriod.value
  };

  let response;

  try {
    if (props.email) {
      body.email = props.email;
      console.log("===== initTendencySurvey API 호출 =====");
      response = await initTendencySurvey(body);
    }
    else {
      console.log("===== updateTendencySurvey API 호출 =====");
      response = await updateTendencySurvey(body);
    }

    console.log(response.data.message);
    routeToNextStep();

  } catch (error) {
    alert('서버 오류가 발생했습니다.');
  }
};

function changeClickedExperience(idx, value) {
  clickedExperienceIdx.value = idx;
  clickedExperienceValue.value = value;
}

function checkedCheckbox(idx) {
  if (!experiences.value || experiences.value.length === 0)
    return false;
  return experiences.value.includes(idx);
}

function routeToNextStep() {
  if (route.path.startsWith('/signup'))
    router.push('/signup/mydata');
  else if (route.path.startsWith('/mypage'))
    router.push('/mypage');
  else
    router.push('/');
};

watch([clickedExperienceIdx, clickedExperienceValue], () => {
  if (clickedExperienceIdx.value === 1 && clickedExperienceValue.value) {
    experiences.value = [1];
    delete experiencePeriods.value[1];
    delete experiencePeriods.value[2];
    delete experiencePeriods.value[3];
  }
  else if (clickedExperienceIdx.value !== 1 && clickedExperienceValue.value) {
    if (experiences.value.includes(1))
      experiences.value = [clickedExperienceIdx.value];
  }
  else if (clickedExperienceIdx.value === 1 && !clickedExperienceValue.value) {
    experiences.value = [];
    delete experiencePeriods.value[0];
  }
  else if (clickedExperienceIdx.value !== 1 && !clickedExperienceValue.value) {
    experiences.value = experiences.value.filter(item => item !== clickedExperienceIdx.value);
    delete experiencePeriods.value[clickedExperienceIdx.value - 1];
  }

})

</script>

<template>
  <div class="h-full w-[500px] flex flex-col">
    <!-- 일반 문항 -->
    <div v-for="q in currentQuestions" :key="q.number" class="mb-6">
      <p class="text-body02 mb-4">
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
      <div class="space-y-2 text-callout">
        <div v-for="(opt, idx) in q.options" :key="idx">
          <button
            class="w-full text-left px-4 py-2 border rounded"
            :class="answers[q.number]?.option === idx + 1 ? 'bg-gray-secondary-350 text-white' : 'bg-white text-fg-primary'"
            @click="handleAnswer(q.number, idx, opt.score)"
          >
            {{ opt.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- 투자 경험 문항 (8번) -->
    <div v-if="(page + 1) * questionsPerPage >= questions.length" class="mb-6">
      <p class="text-body02 mb-2">
        {{ experiencesQuestion.number }}. {{ experiencesQuestion.question }}
        <span
          style="font-size: 10px; vertical-align: top;"
          :class="experiences.length === 0 ? 'text-status-red' : 'text-white'"
        >
          ●
        </span>
      </p>
      <div class="space-y-4 text-callout">
        <div
          v-for="(opt, idx) in experiencesQuestion.options"
          :key="idx"
          class="space-y-1"
        >
          <!-- 체크박스: 해당 투자 경험이 있는지 -->
          <label class="flex items-center space-x-2">
            <input
              type="checkbox"
              class="mr-2 w-4 h-4 text-gray-secondary bg-base-100 border-border-gray-secondary focus:ring-gray-secondary"
              :value="idx + 1"
              v-model="experiences"
              @change="(e) => { changeClickedExperience(idx + 1, e.target.checked) }"
            />
            <span>
              {{ opt.text }}
              <span class="title01" :class="checkedCheckbox(idx + 1) && idx && experiencePeriods[idx] === undefined ? 'text-status-red' : 'text-white'">•</span>
            </span>
          </label>

          <!-- 라디오 버튼: 기간 선택 -->
          <div
            v-if="opt.period"
            class="ml-6 space-x-4 text-callout"
          >
            <label
              v-for="(period, pIdx) in opt.period"
              :key="pIdx"
              class="inline-flex items-center space-x-1"
            >
              <input
                type="radio"
                class="mr-2 w-4 h-4 text-gray-secondary bg-base-100 border-border-gray-secondary focus:ring-gray-secondary"
                :value="pIdx"
                v-model="experiencePeriods[idx]"
                :disabled="!checkedCheckbox(idx + 1)"
              />
              <span class="text-sm text-fg-primary">{{ period.text }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 투자 예정 기간 문항 (9번) -->
    <div v-if="(page + 1) * questionsPerPage >= questions.length" class="mb-6">
      <p class="text-body02 mb-2">
        {{ investmentPeriodQuestion.number }}. {{ investmentPeriodQuestion.question }}
        <span
          style="font-size: 10px; vertical-align: top;"
          :class="investmentPeriod === null ? 'text-status-red' : 'text-white'"
        >
          ●
        </span>
      </p>
      <div class="space-y-2">
        <div v-for="(opt, idx) in investmentPeriodQuestion.options" :key="idx">
          <button
            class="w-full text-left px-4 py-2 border rounded"
            :class="investmentPeriod === idx + 1 ? 'bg-gray-secondary-350 text-white' : 'bg-white text-fg-primary'"
            @click="investmentPeriod = idx + 1"
          >
            {{ opt.text }}
          </button>
        </div>
      </div>
    </div>

    <div class="text-footnote text-fg-secondary text-center mb-6">
      {{ page + 1 }} / {{ Math.ceil(questions.length / questionsPerPage) }}
    </div>

    <BaseButton
      v-if="(page + 1) * questionsPerPage >= questions.length"
      class="mt-auto mb-20 shrink-0"
      :disabled="!canSubmit"
      :label="submitLabel"
      size="lg"
      variant="filled"
      @click="handleSubmit"
    />

    <BaseButton
      v-else
      class="mt-auto mb-20 shrink-0"
      :disabled="!canNext"
      :label="nextLabel"
      size="lg"
      variant="filled"
      @click="handleNext"
    />
  </div>
</template>
