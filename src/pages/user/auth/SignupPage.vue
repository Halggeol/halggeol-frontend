<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { join } from '@/api/user';
import PrivacyPolicyModal from '@/components/user/PrivacyPolicyModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';

const router = useRouter();

const regex = {
  name: /^[가-힣]{2,}$/,
  password: /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
  phone: /^01[016789]\d{7,8}$/,
  birth: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
};

const errors = ref({});
const token = ref(null);
const showPassword = ref(false);
const showconfirmPassword = ref(false);

const form = ref({
  name: '',
  email: '',
  birth: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false
});

const result = ref({
  message: '',
  success: false
})

const canSubmit = computed(() => {
  let allFilled = false;
  allFilled = Object.entries(form.value).every(([key, val]) => {
    if (key === 'agree') return val === true;
    return val !== '';
  });
  return allFilled && Object.keys(errors.value).length === 0;
});

onMounted(() => {
  setTokenIfExists();
  setEmailFromToken();
  privacyHtml.value = privacyText.replace(/\n/g, '<br>');
});

const privacyHtml = ref('');
const privacyText = `이때 할 걸(이하 "회사")은 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 개인정보 처리방침을 수립·공개합니다.

제1조(개인정보의 수집 항목 및 수집 방법)
회사는 다음의 개인정보를 수집하며, 수집 시점에 이용자로부터 별도의 동의를 받습니다.

1. 회원 가입 및 서비스 이용 시
- 필수 항목: 이름, 이메일, 생년월일, 전화번호

2. 마이데이터 서비스 이용 시
- 선택 항목: 마이데이터 연계를 통한 개인 금융정보
- ※ 마이데이터 정보는 별도의 동의 절차를 거쳐 수집되며, 본 방침과는 별도로 고지 및 관리됩니다.

제2조(개인정보의 수집 및 이용 목적)
회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.

1. 회원 가입 및 관리
- 이용자 식별 및 본인 확인
- 회원제 서비스 제공 및 유지

2. 마이데이터 서비스 제공
- 사용자 맞춤 금융 분석 및 인사이트 제공
- 마이데이터 기반 금융 정보 통합 조회

제3조(개인정보의 보유 및 이용 기간)
회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.

- 보유 기간: 회원 탈퇴 시 즉시 파기

제4조(개인정보의 제3자 제공)
회사는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다.
단, 다음의 경우에는 예외로 합니다.
- 정보주체의 사전 동의를 받은 경우
- 법령에 의하여 제출 의무가 있는 경우

제5조(개인정보의 파기 절차 및 방법)
회사는 수집된 개인정보의 처리 목적이 달성된 후에는 내부 방침 및 관련 법령에 따라 지체 없이 안전하게 파기합니다.

1. 파기 절차: 이용자의 탈퇴 요청 시 내부 검토 후 즉시 파기
2. 파기 방법: 전자적 파일 형태는 복구 불가능한 방식으로 영구 삭제

본 방침은 2025년 8월 4일부터 적용됩니다.`;

function setTokenIfExists() {
  token.value = new URLSearchParams(window.location.search).get('token');
}

function setEmailFromToken() {
  if (token.value === null) {
    console.error('토큰 누락');
    router.push('/signup/request');
    return;
  }

  try {
    const payload = token.value.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // base64 디코딩
    const json = JSON.parse(decoded);
    form.value.email = json.sub;

  } catch (e) {
    console.error('토큰 형식 오류: ', e);
    router.push('/signup/request');
  }
}

function validateField(field) {
  const value = form.value[field];

  switch (field) {
    case 'name':
      if (!value) errors.value.name = '이름을 입력해주세요';
      else if (!regex.name.test(value)) errors.value.name = '이름은 한글 2자 이상이어야 합니다';
      else delete errors.value.name;
      break;

    case 'phone':
      if (!value) errors.value.phone = '전화번호를 입력해주세요';
      else if (!regex.phone.test(value)) errors.value.phone = '올바른 전화번호 형식이 아닙니다';
      else delete errors.value.phone;
      break;

    case 'agree':
      if (!form.value.agree) errors.value.agree = '약관에 동의해주세요';
      else delete errors.value.agree;
      break;
  }
}

function validateBirth() {
  if (!form.value.birth) {
    errors.value.birth = '생년월일을 입력해주세요';
    return;
  }

  if (!regex.birth.test(form.value.birth)) {
    errors.value.birth = '올바른 생년월일 형식이 아닙니다';
    return;
  }

  const birthDate = new Date(`${form.value.birth}T00:00:00`);
  if (isNaN(birthDate)) {
    errors.value.birth = '존재하지 않는 날짜입니다';
    return;
  }

  const today = new Date();
  const minAgeDate = new Date(
    birthDate.getFullYear() + 14,
    birthDate.getMonth(),
    birthDate.getDate()
  );

  if (minAgeDate > today) {
    errors.value.birth = '만 14세 이상만 가입할 수 있습니다';
    return;
  }

  delete errors.value.birth;
}

function validatePasswords() {
  if (!form.value.password)
    errors.value.password = '비밀번호를 입력해주세요';
  else if (!regex.password.test(form.value.password))
    errors.value.password = '비밀번호는 8자 이상이어야 합니다 (영문자, 숫자, 특수문자 사용 가능)';
  else
    delete errors.value.password;

  if (!form.value.confirmPassword)
    errors.value.confirmPassword = '비밀번호를 다시 입력해주세요';
  else if (form.value.password !== form.value.confirmPassword)
    errors.value.confirmPassword = '비밀번호가 일치하지 않습니다';
  else
    delete errors.value.confirmPassword;
}

async function handleJoinSubmit() {
  console.log('===== 회원가입 요청 핸들링 =====');
  Object.keys(form.value).forEach((field) => {
    if (field === 'password' || field === 'confirmPassword')
      validatePasswords(field);
    else
      validateField(field);
  });

  if (canSubmit.value) {
    try {
      console.log("===== join API 호출 =====");
      await join(token.value, form.value);

      result.value = {
        message: '회원가입이 완료되었습니다.',
        success: true
      };
      router.push({ name: 'survey', params: { type: 'knowledge' } });
    } catch (error) {
      if (error.response?.status === 409) {
        result.value = {
          message: '이미 가입된 이메일입니다.',
          success: false
        };
      }
      else {
        result.value = {
          message: '회원가입에 실패했습니다.',
          success: false
        };
      }
    }
  }
}

function inputStyleClass(error) {
  return [
    'w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors',
    error ? 'border-red-500 bg-red-100 placeholder-red-500' : 'border-gray-300 focus:border-blue-500',
  ];
}

function openPolicyModal() {
  const modal = document.getElementById('policy_modal');
  modal?.showModal();
}

</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-50 relative">
    <div class="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
      <h2 class="text-center title02 font-bold mb-6">회원가입</h2>

      <!-- 회원가입 폼 -->
      <form @submit.prevent novalidate>
        <!-- 이름 -->
        <div class="mb-3">
          <input
            type="text"
            v-model="form.name"
            @blur="validateField('name')"
            :class="inputStyleClass(errors.name)"
            placeholder="이름"
            :disabled="result.success"
          />
          <small v-if="errors.name" class="text-red-500 mt-1 block">{{ errors.name }}</small>
        </div>

        <!-- 생년월일 -->
        <div class="mb-3">
          <input
            type="text"
            v-model="form.birth"
            @blur="validateBirth()"
            :class="inputStyleClass(errors.birth)"
            placeholder="생년월일 (YYYY-MM-DD)"
            :disabled="result.success"
          />
          <small v-if="errors.birth" class="text-red-500 mt-1 block">{{ errors.birth }}</small>
        </div>

        <!-- 전화번호 -->
        <div class="mb-3">
          <input
            type="text"
            v-model="form.phone"
            @blur="validateField('phone')"
            :class="inputStyleClass(errors.phone)"
            placeholder="전화번호 ('-' 제외)"
            :disabled="result.success"
          />
          <small v-if="errors.phone" class="text-red-500 mt-1 block">{{ errors.phone }}</small>
        </div>

        <hr class="mt-6 mb-7">

        <!-- 이메일 -->
        <div class="mb-3">
          <input
            type="text"
            v-model="form.email"
            class="w-full mb-1 px-3 py-3 border rounded-md outline-none transition-colors border-gray-300 bg-gray-100 text-gray-300"
            disabled
          />
        </div>

        <!-- 비밀번호 -->
        <div class="mb-3 relative">
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              @blur="validatePasswords()"
              :class="inputStyleClass(errors.password)"
              placeholder="비밀번호 (8자 이상, 영문/숫자/특수문자)"
              :disabled="result.success"
            />

            <button
              type="button"
              tabindex="-1"
              @click="showPassword = !showPassword"
              class="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center"
            >
              <EyeOpen v-if="showPassword" class="w-4 h-4"></EyeOpen>
              <EyeClose v-if="!showPassword" class="w-4 h-4"></EyeClose>
            </button>
          </div>

          <small v-if="errors.password" class="text-red-500 mt-1 block">{{ errors.password }}</small>
        </div>

        <!-- 비밀번호 재입력 -->
        <div class="mb-3 relative">
          <div class="relative">
            <input
              :type="showconfirmPassword ? 'text' : 'password'"
              v-model="form.confirmPassword"
              @blur="validatePasswords()"
              :class="inputStyleClass(errors.confirmPassword)"
              placeholder="비밀번호 재입력"
              :disabled="result.success"
            />

            <button
              type="button"
              tabindex="-1"
              @click="showconfirmPassword = !showconfirmPassword"
              class="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center"
            >
              <EyeOpen v-if="showconfirmPassword" class="w-4 h-4"></EyeOpen>
              <EyeClose v-if="!showconfirmPassword" class="w-4 h-4"></EyeClose>
            </button>

          </div>
          <small v-if="errors.confirmPassword" class="text-red-500 mt-1 block">{{ errors.confirmPassword }}</small>
        </div>

        <!-- 약관 동의 -->
        <div class="flex items-start my-5 gap-2 text-gray-500 mb-4">
          <input
            type="checkbox"
            v-model="form.agree"
            @change="validateField('agree')"
            class="scale-150 accent-gray-300 bg-white border-gray-300 rounded w-3 h-3"
            :disabled="result.success"
            />
          <span class="leading-snug text-xs">
            <span class="underline cursor-pointer hover:text-black" @click="openPolicyModal">
              개인정보 처리방침
            </span>
            에 따라 개인정보를 수집, 사용, 타사에 대한 제공 및 처리하는 데 동의합니다.
            <small v-if="errors.agree" class="text-red-500 mt-1 block">{{ errors.agree }}</small>
          </span>
        </div>

        <!-- 가입하기 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!canSubmit || result.success"
          label="가입하기"
          @click="handleJoinSubmit"
          class="mt-6"
        >
        </BaseButton>

        <!-- 결과 메세지 -->
        <small
          v-if="result.message"
          :class="result.success ? 'text-green-500' : 'text-red-500'"
          class="mt-1 block pt-2"
        >
          {{ result.message }}
        </small>
      </form>
    </div>
  </div>

  <!-- 개인정보 처리방침 모달 -->
  <PrivacyPolicyModal></PrivacyPolicyModal>
</template>
