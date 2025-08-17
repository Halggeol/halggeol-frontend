<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { reverifyPassword, resetPasswordWithLogin, logout } from '@/api/user';
import { setAccessToken } from '@/utils/authUtil';
import BaseButton from '@/components/common/BaseButton.vue';
import EyeClose from '@/assets/icons/auth/EyeClose.vue';
import EyeOpen from '@/assets/icons/auth/EyeOpen.vue';

const router = useRouter();

const regex = {
  password: /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
};

const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
});

const errors = ref({});
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const result = ref({
  message: '',
  success: false,
});

const canSubmit = computed(() => {
  return (
    oldPassword.value !== '' &&
    newPassword.value !== '' &&
    confirmPassword.value !== ''
  );
});

function validatePasswords() {
  if (!oldPassword.value) errors.value.oldPassword = '비밀번호를 입력해주세요';
  else delete errors.value.oldPassword;

  if (!newPassword.value) errors.value.newPassword = '비밀번호를 입력해주세요';
  else if (!regex.password.test(newPassword.value))
    errors.value.newPassword =
      '비밀번호는 8자 이상이어야 합니다 (영문자, 숫자, 특수문자 사용 가능)';
  else delete errors.value.newPassword;

  if (newPassword.value && !confirmPassword.value)
    errors.value.confirmPassword = '비밀번호를 다시 입력해주세요';
  else if (newPassword.value !== confirmPassword.value)
    errors.value.confirmPassword = '비밀번호가 일치하지 않습니다';
  else delete errors.value.confirmPassword;
}

function handleClose() {
  oldPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  errors.value = {};
  result.value = { message: '', success: false };
  showOldPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
  props.onClose();
}

async function handleResetPassword() {
  console.log('===== 로그인 상태 비밀번호 재설정 핸들링 =====');

  validatePasswords();

  if (canSubmit.value) {
    try {
      console.log('===== reverifyPassword API 호출 =====');
      const response = await reverifyPassword({
        confirmPassword: oldPassword.value,
      });

      setAccessToken(response.data.reverifyToken);

      console.log('===== resetPasswordWithLogin API 호출 =====');
      await resetPasswordWithLogin({
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      });

      result.value = {
        message: '비밀번호 재설정이 완료되었습니다. 다시 로그인 해주세요.',
        success: true,
      };

      await logout();

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      result.value = {
        message: '오류가 발생했습니다.',
        success: false,
      };
    }
  }
}

function inputStyleClass(error) {
  return [
    'w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors',
    error
      ? 'border-red-500 bg-red-100 placeholder-red-500'
      : 'border-gray-300 focus:border-blue-500',
  ];
}
</script>

<template>
  <dialog v-if="isOpen" class="modal" open>
    <div class="modal-box max-w-sm">
      <button class="absolute right-4 top-4" @click="handleClose">✕</button>
      <h3 class="text-body01 font-bold mb-6">비밀번호 재설정</h3>

      <!-- 비밀번호 재설정 폼 -->
      <form @submit.prevent novalidate>
        <!-- 기존 비밀번호 -->
        <div class="mb-3 relative">
          <div class="relative">
            <input
              :type="showOldPassword ? 'text' : 'password'"
              v-model="oldPassword"
              @blur="validatePasswords()"
              :class="inputStyleClass(errors.oldPassword)"
              placeholder="기존 비밀번호"
              :disabled="result.success"
            />

            <button
              type="button"
              tabindex="-1"
              @click="showOldPassword = !showOldPassword"
              class="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center"
            >
              <EyeOpen v-if="showOldPassword" class="w-4 h-4"></EyeOpen>
              <EyeClose v-if="!showOldPassword" class="w-4 h-4"></EyeClose>
            </button>
          </div>

          <small v-if="errors.oldPassword" class="text-status-red mt-1 block">{{
            errors.oldPassword
          }}</small>
        </div>

        <!-- 새 비밀번호 -->
        <div class="mb-3 relative">
          <div class="relative">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              v-model="newPassword"
              @blur="validatePasswords()"
              :class="inputStyleClass(errors.newPassword)"
              placeholder="새 비밀번호 (8자 이상, 영문/숫자/특수문자)"
              :disabled="result.success"
            />

            <button
              type="button"
              tabindex="-1"
              @click="showNewPassword = !showNewPassword"
              class="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center"
            >
              <EyeOpen v-if="showNewPassword" class="w-4 h-4"></EyeOpen>
              <EyeClose v-if="!showNewPassword" class="w-4 h-4"></EyeClose>
            </button>
          </div>

          <small v-if="errors.newPassword" class="text-status-red mt-1 block">{{
            errors.newPassword
          }}</small>
        </div>

        <!-- 비밀번호 재입력 -->
        <div class="mb-3 relative">
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              @blur="validatePasswords()"
              :class="inputStyleClass(errors.confirmPassword)"
              placeholder="비밀번호 재입력"
              :disabled="result.success"
            />

            <button
              type="button"
              tabindex="-1"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center"
            >
              <EyeOpen v-if="showConfirmPassword" class="w-4 h-4"></EyeOpen>
              <EyeClose v-if="!showConfirmPassword" class="w-4 h-4"></EyeClose>
            </button>
          </div>
          <small
            v-if="errors.confirmPassword"
            class="text-status-red mt-1 block"
            >{{ errors.confirmPassword }}</small
          >
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
          :class="result.success ? 'text-status-blue' : 'text-status-red'"
          class="mt-2 block pt-2"
        >
          {{ result.message }}
        </small>
      </form>
    </div>
  </dialog>
</template>
