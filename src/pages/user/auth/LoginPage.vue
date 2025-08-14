<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/user';
import { useAuthStore } from '@/stores/authStore';
import { regex } from '@/utils/validationUtil';
import BaseButton from '@/components/common/BaseButton.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const emailInputRef = ref(null);
const passwordInputRef = ref(null);

const errors = ref({
  email: '',
  password: '',
});

const result = ref({
  message: '',
  success: false,
});

const canSubmit = computed(() => {
  return (
    email.value !== '' &&
    password.value !== '' &&
    errors.value.email === '' &&
    errors.value.password === ''
  );
});

function validateEmail() {
  if (!email.value) errors.value.email = '이메일을 입력해주세요';
  else if (!regex.email.test(email.value))
    errors.value.email = '올바른 이메일 형식이 아닙니다';
  else errors.value.email = '';
}

function validatePassword() {
  if (!password.value) errors.value.password = '비밀번호를 입력해주세요';
  else errors.value.password = '';
}

function clearEmail() {
  email.value = '';
  errors.value.email = '';
  if (!result.value.success && emailInputRef.value) emailInputRef.value.focus();
}

function clearPassword() {
  password.value = '';
  errors.value.password = '';
  if (!result.value.success && passwordInputRef.value)
    passwordInputRef.value.focus();
}

async function handleLoginSubmit() {
  console.log('===== 로그인 핸들링 =====');

  validateEmail();
  validatePassword();

  if (canSubmit.value) {
    try {
      console.log('===== login API 호출 =====');
      const response = await login({
        email: email.value,
        password: password.value,
      });

      result.value = {
        message: '로그인 되었습니다.',
        success: true,
      };

      authStore.login(
        response.data?.authResult?.token,
        response.data?.authResult?.name
      );

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      result.value = {
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        success: false,
      };
    }
  }
}

function inputStyleClass(field) {
  return [
    'w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors',
    errors.value[field]
      ? 'border-red-500 bg-red-100 placeholder-red-500'
      : 'border-gray-300 focus:border-blue-500',
  ];
}
</script>

<template>
  <div
    class="h-screen flex items-center justify-center relative"
    style="
      background-image: url('http://googleusercontent.com/image_generation_content/1');
      background-size: cover;
      background-position: center;
    "
  >
    <div class="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
      <h2 class="text-center title02 font-bold mb-6">로그인</h2>

      <form @submit.prevent novalidate>
        <div class="mb-3 relative">
          <div class="relative">
            <input
              ref="emailInputRef"
              type="email"
              v-model="email"
              @blur="validateEmail"
              :class="[...inputStyleClass('email'), 'pr-10']"
              placeholder="이메일"
              :disabled="result.success"
            />
            <button
              v-if="email && !result.success"
              type="button"
              tabindex="-1"
              @click="clearEmail"
              class="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded"
              aria-label="이메일 지우기"
              title="지우기"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="10.0007"
                  cy="10.0006"
                  rx="9.16669"
                  ry="9.16664"
                  fill="#8C949E"
                />
                <path
                  d="M6.66602 13.333L13.3326 6.66622"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M6.66602 6.66699L13.3326 13.3337"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <small v-if="errors.email" class="text-red-500 mt-1 block">{{
            errors.email
          }}</small>
        </div>

        <div class="mb-3 relative">
          <div class="relative">
            <input
              ref="passwordInputRef"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              @blur="validatePassword"
              :class="[...inputStyleClass('password'), 'pr-20']"
              placeholder="비밀번호"
              :disabled="result.success"
            />

            <button
              v-if="password && !result.success"
              type="button"
              tabindex="-1"
              @click="showPassword = !showPassword"
              class="absolute top-1/2 right-10 -translate-y-1/2 flex items-center justify-center"
              aria-label="비밀번호 표시 전환"
              :title="showPassword ? '숨기기' : '보이기'"
            >
              <EyeOpen v-if="showPassword" class="w-4 h-4"></EyeOpen>
              <EyeClose v-if="!showPassword" class="w-4 h-4"></EyeClose>
            </button>

            <button
              v-if="password && !result.success"
              type="button"
              tabindex="-1"
              @click="clearPassword"
              class="absolute top-1/2 right-3 -translate-y-1/2 p-1 rounded"
              aria-label="비밀번호 지우기"
              title="지우기"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="10.0007"
                  cy="10.0006"
                  rx="9.16669"
                  ry="9.16664"
                  fill="#8C949E"
                />
                <path
                  d="M6.66602 13.333L13.3326 6.66622"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M6.66602 6.66699L13.3326 13.3337"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>

          <small v-if="errors.password" class="text-red-500 mt-1 block">{{
            errors.password
          }}</small>
        </div>

        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!canSubmit || result.success"
          label="로그인"
          @click="handleLoginSubmit"
          class="mt-6"
        >
        </BaseButton>

        <small
          v-if="result.message"
          :class="result.success ? 'text-green-500' : 'text-red-500'"
          class="mt-1 block pt-2"
        >
          {{ result.message }}
        </small>

        <div class="mt-6 text-center text-xs text-gray-500 space-x-3">
          <RouterLink to="/find" class="hover:underline"
            >아이디 / 비밀번호 찾기</RouterLink
          >
          <span>|</span>
          <RouterLink to="/signup/request" class="hover:underline"
            >회원가입</RouterLink
          >
        </div>
      </form>
    </div>
  </div>
</template>
