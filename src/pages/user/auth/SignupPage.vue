<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { join } from '@/api/user';
import { setTokenIfExists, setEmailFromToken } from '@/utils/authUtil';
import PrivacyPolicyModal from '@/components/user/auth/PrivacyPolicyModal.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';

const router = useRouter();
const privacyModalRef = ref();

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
  if ((token.value = setTokenIfExists()) === null ||
      (form.value.email = setEmailFromToken(token.value)) === null)
    router.push('/signup/request');
});

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
  privacyModalRef.value?.showModal();
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
  <PrivacyPolicyModal ref="privacyModalRef"></PrivacyPolicyModal>
</template>
