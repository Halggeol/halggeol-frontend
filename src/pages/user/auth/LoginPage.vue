<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/user';
import { useAuthStore } from '@/stores/authStore';
import BaseButton from '@/components/common/BaseButton.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';

const router = useRouter();
const authStore = useAuthStore();

const regex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const errors = ref({
  email: '',
  password: ''
});

const result = ref({
  message: '',
  success: false
});

const canSubmit = computed(() => {
  return email.value !== '' && password.value !== '' &&
         errors.value.email === '' && errors.value.password === '';
});

function validateEmail() {
  if (!email.value)
    errors.value.email = '이메일을 입력해주세요';
  else if (!regex.email.test(email.value))
    errors.value.email = '올바른 이메일 형식이 아닙니다';
  else
    errors.value.email = '';
}

function validatePassword() {
  if (!password.value)
    errors.value.password = '비밀번호를 입력해주세요';
  else
    errors.value.password = '';
}

async function handleLoginSubmit() {
  console.log('===== 로그인 핸들링 =====');

  validateEmail();
  validatePassword();

  if (canSubmit.value) {
    try {
      console.log('===== login API 호출 =====');
      const response = await login({ email: email.value, password: password.value });

      result.value = {
        message: '로그인 되었습니다.',
        success: true
      };

      authStore.login(response.data?.authResult?.token, response.data?.authResult?.name);

      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      result.value = {
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        success: false
      };
    }
  }
}

function inputStyleClass(field) {
  return [
    'w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors',
    errors.value[field] ? 'border-red-500 bg-red-100 placeholder-red-500' : 'border-gray-300 focus:border-blue-500',
  ];
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-50 relative">
    <div class="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
      <h2 class="text-center title02 font-bold mb-6">로그인</h2>

      <!-- 로그인 폼 -->
      <form @submit.prevent novalidate>
        <!-- 이메일 -->
        <div class="mb-3">
          <input
            type="email"
            v-model="email"
            @blur="validateEmail"
            :class="inputStyleClass('email')"
            placeholder="이메일"
            :disabled="result.success"
          />
          <small v-if="errors.email" class="text-red-500 mt-1 block">{{ errors.email }}</small>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-3 relative">
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              @blur="validatePassword"
              :class="inputStyleClass('password')"
              placeholder="비밀번호"
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

        <!-- 로그인 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!canSubmit || result.success"
          label="로그인"
          @click="handleLoginSubmit"
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

        <!-- 하단 링크 -->
        <div class="mt-6 text-center text-xs text-gray-500 space-x-3">
          <a href="/find/id" class="hover:underline">아이디 찾기</a>
          <span>|</span>
          <a href="/find/password" class="hover:underline">비밀번호 찾기</a>
          <span>|</span>
          <a href="/signup/request" class="hover:underline">회원가입</a>
        </div>
      </form>
    </div>
  </div>
</template>
