<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { resetPassword } from '@/api/user';
import { getTokenIfExists } from '@/utils/authUtil';
import BaseButton from '@/components/common/BaseButton.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';

const router = useRouter();

const regex = {
  password: /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
};

const errors = ref({});
const token = ref(null);
const showPassword = ref(false);
const showconfirmPassword = ref(false);

const password = ref('');
const confirmPassword = ref('');

const result = ref({
  message: '',
  success: false
});

const canSubmit = computed(() => {
  return password.value !== '' && confirmPassword.value !== '';
});

onMounted(() => {
  if ((token.value = getTokenIfExists()) === null)
    router.push('/find');
});

function validatePasswords() {
  if (!password.value)
    errors.value.password = '비밀번호를 입력해주세요';
  else if (!regex.password.test(password.value))
    errors.value.password = '비밀번호는 8자 이상이어야 합니다 (영문자, 숫자, 특수문자 사용 가능)';
  else
    delete errors.value.password;

  if (!confirmPassword.value)
    errors.value.confirmPassword = '비밀번호를 다시 입력해주세요';
  else if (password.value !== confirmPassword.value)
    errors.value.confirmPassword = '비밀번호가 일치하지 않습니다';
  else
    delete errors.value.confirmPassword;
}

async function handleResetPassword() {
  console.log('===== 비밀번호 재설정 핸들링 =====');

  validatePasswords();

  if (canSubmit.value) {
    try {
      console.log("===== resetPassword API 호출 =====");
      await resetPassword(token.value, { newPassword: password.value, confirmPassword: confirmPassword.value })

      result.value = {
        message: '비밀번호 재설정이 완료되었습니다. 로그인 페이지로 이동합니다.',
        success: true
      };

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      result.value = {
        message: '오류가 발생했습니다.',
        success: false
      };
    }
  }
}

function inputStyleClass(error) {
  return [
    'w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors',
    error ? 'border-red-500 bg-red-100 placeholder-red-500' : 'border-gray-300 focus:border-blue-500',
  ];
}

</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-50 relative">
    <div class="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
      <h2 class="text-center title02 font-bold mb-6">비밀번호 재설정</h2>

      <!-- 비밀번호 재설정 폼 -->
      <form @submit.prevent novalidate>
        <!-- 비밀번호 -->
        <div class="mb-3 relative">
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
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
              v-model="confirmPassword"
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

        <!-- 변경하기 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!canSubmit || result.success"
          label="비밀번호 변경"
          @click="handleResetPassword"
          class="mt-6"
        >
        </BaseButton>

        <!-- 결과 메시지 -->
        <small
          v-if="result.message"
          :class="result.success ? 'text-green-500' : 'text-red-500'"
          class="mt-2 block pt-2"
        >
          {{ result.message }}
        </small>
      </form>
    </div>
  </div>
</template>
