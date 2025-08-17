<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { viewProfile } from '@/api/user';
import RetakeSurveyModal from '@/components/user/mypage/RetakeSurveyModal.vue';
import ResetPasswordModal from '@/components/user/mypage/ResetPasswordModal.vue';
import LeaveServiceModal from '@/components/user/mypage/LeaveServiceModal.vue';
import ChangeInsightCycleModal from '@/components/user/mypage/ChangeInsightCycleModal.vue';
import Tooltiip from '@/assets/icons/common/Tooltiip.vue';

const router = useRouter();

// 비밀번호 재설정 모달 관련 상태
const isResetPasswordModalOpen = ref(false);

// 재설문 여부 모달 관련 상태
const isRetakeSurveyModalOpen = ref(false);
const surveyType = ref('');

// 회원탈퇴 모달 관련 상태
const isLeaveServiceModalOpen = ref(false);

// 인사이트 주기 변경 모달 관련 상태
const isChangeInsightCycleModalOpen = ref(false);

// 사용자 정보
const user = reactive({
  name: '',
  email: '',
  phone: '',
  birth: '',
  knowledge: '',
  knowledgeRenewDate: '',
  investmentType: '',
  investmentTypeRenewDate: '',
  insightCycle: '',
});

const renewDate = computed(() => {
  if (surveyType.value === 'knowledge') return user.knowledgeRenewDate;
  else if (surveyType.value === 'tendency') return user.investmentTypeRenewDate;
  return '';
});

const result = ref({
  message: '',
  success: false,
});

// 버튼 핸들러
const changePassword = () => {
  isResetPasswordModalOpen.value = true;
};

const retakeKnowledgeTest = () => {
  surveyType.value = 'knowledge';
  isRetakeSurveyModalOpen.value = true;
};

const retakeTendencyTest = () => {
  surveyType.value = 'tendency';
  isRetakeSurveyModalOpen.value = true;
};

const leaveService = () => {
  isLeaveServiceModalOpen.value = true;
};

const changeInsightCycle = () => {
  isChangeInsightCycleModalOpen.value = true;
};

onMounted(() => {
  setUserInfo();
});

function convertCycleString(cycle) {
  if (cycle === '0 0 0 1/7 * *') return '1주';
  if (cycle === '0 0 0 1/14 * *') return '2주';
  if (cycle === '0 0 0 1 * *') return '1개월';
  return '';
}

function handleRetakeSurveyConfirm() {
  isRetakeSurveyModalOpen.value = false;
  router.push(`/signup/survey/${surveyType.value}`);
}

async function setUserInfo() {
  console.log('===== 사용자 정보 조회 핸들링 =====');

  try {
    console.log('===== viewProfile API 호출 =====');
    const response = await viewProfile();

    if (!response.data || !response.data.profile) {
      result.value = {
        message: '사용자 정보가 없습니다.',
        success: false,
      };
    }

    const profile = response.data.profile;

    user.name = profile.name;
    user.email = profile.email;
    user.phone = profile.phone;
    user.birth = profile.birth;
    user.knowledge = profile.userKlg;
    user.knowledgeRenewDate = profile.klgRenewDate;
    user.investmentType = profile.risk;
    user.investmentTypeRenewDate = profile.riskRenewDate;
    user.insightCycle = profile.insightCycle;
  } catch (error) {
    console.error('사용자 정보 조회 실패: ', error);
    result.value = {
      message: '사용자 정보 조회에 실패했습니다.',
      success: false,
    };
  }
}

function handleCycleChanged(newCycle) {
  user.insightCycle = newCycle;
}
</script>

<template>
  <div class="pt-12">
    <!-- 제목 -->
    <h2 class="title02 mb-4 text-left">내 정보</h2>
    <hr class="mb-10" />

    <!-- 정보 리스트 -->
    <div class="space-y-8 text-body02 mr-4">
      <!-- 이름 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary">이름</div>
        <div class="w-1/2 text-fg-primary">{{ user.name }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 이메일 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary">이메일</div>
        <div class="w-1/2 text-fg-primary">{{ user.email }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 비밀번호 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary">비밀번호</div>
        <div class="w-1/2 text-fg-primary">********</div>
        <div class="w-1/3 text-right">
          <button
            class="text-fg-gray text-body02 hover:text-fg-secondary hover:underline"
            @click="changePassword"
          >
            변경하기
          </button>
        </div>
      </div>

      <!-- 전화번호 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary">전화번호</div>
        <div class="w-1/2 text-fg-primary">{{ user.phone }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 생년월일 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary">생년월일</div>
        <div class="w-1/2 text-fg-primary">{{ user.birth }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 금융이해도 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary flex items-center">
          금융이해도
          <span
            class="inline-block relative group ml-1 tooltip"
            data-tip="금융이해도는 일상적 금융 거래를 이해하고, 금융 지식을 활용해 금융 선택에 따른 책임을 이해하는 능력이에요. 알맞은 추천을 위해 12개월마다 재검사해야 해요."
          >
            <Tooltiip class="text-fg-secondar w-5 h-5" />
          </span>
        </div>
        <div class="w-1/2 text-fg-primary">{{ user.knowledge }}</div>
        <div class="w-1/3 text-right">
          <button
            class="text-fg-gray text-body02 hover:text-fg-secondary hover:underline"
            @click="retakeKnowledgeTest"
          >
            재검사하기
          </button>
        </div>
      </div>

      <!-- 투자성향 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary flex items-center">
          투자성향
          <span
            class="inline-block relative group ml-1 tooltip"
            data-tip="투자성향은 투자 방법을 파악하기 위해 투자자의 투자 경험과 지식, 위험에 대한 태도를 기초로 파악하는 거예요. 성향에 따라 가입할 수 있는 상품의 범위가 달라져요. 알맞은 추천을 위해 12개월마다 재검사해야 해요."
          >
            <Tooltiip class="text-fg-secondar w-5 h-5" />
          </span>
        </div>
        <div class="w-1/2 text-fg-primary">{{ user.investmentType }}</div>
        <div class="w-1/3 text-right">
          <button
            class="text-fg-gray text-body02 hover:text-fg-secondary hover:underline"
            @click="retakeTendencyTest"
          >
            재검사하기
          </button>
        </div>
      </div>

      <!-- 인사이트 주기 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 text-body02 text-fg-secondary flex items-center">
          인사이트 제공 주기
          <span
            class="inline-block relative group ml-1 tooltip"
            data-tip="회고 인사이트를 받을 기간을 설정해요. 1주/2주/1개월 중 선택할 수 있어요."
          >
            <Tooltiip class="text-fg-secondar w-5 h-5" />
          </span>
        </div>
        <div class="w-1/2 text-fg-primary">
          {{ convertCycleString(user.insightCycle) }}
        </div>

        <div class="w-1/3 text-right">
          <button
            class="text-fg-gray text-body02 hover:text-fg-secondary hover:underline"
            @click="changeInsightCycle"
          >
            변경하기
          </button>
        </div>
      </div>
    </div>

    <!-- 탈퇴하기 버튼 -->
    <div class="my-28">
      <button
        class="text-body02 text-fg-gray hover:underline"
        @click="leaveService"
      >
        탈퇴하기
      </button>
    </div>
  </div>

  <ResetPasswordModal
    :isOpen="isResetPasswordModalOpen"
    :onClose="() => (isResetPasswordModalOpen = false)"
  />

  <RetakeSurveyModal
    :type="surveyType"
    :renewDate="renewDate"
    :isOpen="isRetakeSurveyModalOpen"
    :onClose="() => (isRetakeSurveyModalOpen = false)"
    @confirm="handleRetakeSurveyConfirm"
  />

  <LeaveServiceModal
    :isOpen="isLeaveServiceModalOpen"
    :onClose="() => (isLeaveServiceModalOpen = false)"
  />

  <ChangeInsightCycleModal
    :currentCycle="user.insightCycle"
    :isOpen="isChangeInsightCycleModalOpen"
    :onClose="() => (isChangeInsightCycleModalOpen = false)"
    @updated="handleCycleChanged"
  />
</template>
