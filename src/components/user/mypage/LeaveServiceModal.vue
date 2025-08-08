<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { reverifyPassword, leaveService } from '@/api/user';
import { setAccessToken } from '@/utils/authUtil';
import BaseButton from '@/components/common/BaseButton.vue';
import EyeClose from '@/components/icons/EyeClose.vue';
import EyeOpen from '@/components/icons/EyeOpen.vue';

const router = useRouter();
const authStore = useAuthStore();

const regex = {
  password: /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/,
};

const props = defineProps({
  isOpen: Boolean,
  onClose: Function
});

const errors = ref({});
const showConfirmPassword = ref(false);

const confirmPassword = ref('');

const result = ref({
  message: '',
  success: false
});

const canSubmit = computed(() => {
  return confirmPassword.value !== '';
});

function validatePasswords() {
  if (!confirmPassword.value)
    errors.value.confirmPassword = '비밀번호를 입력해주세요';
  else
    delete errors.value.confirmPassword;
}

function handleClose() {
  confirmPassword.value = '';
  errors.value = {};
  result.value = { message: '', success: false };
  showConfirmPassword.value = false;
  props.onClose();
}

async function handleLeaveService() {
  console.log('===== 로그인 상태 비밀번호 재설정 핸들링 =====');

  validatePasswords();

  if (canSubmit.value) {
    try {
      console.log("===== reverifyPassword API 호출 =====");
      const response = await reverifyPassword({ confirmPassword: confirmPassword.value });

      setAccessToken(response.data.reverifyToken);

      console.log("===== leaveService API 호출 =====");
      await leaveService();

      authStore.logout();

      result.value = {
        message: '회원탈퇴가 완료되었습니다. 홈 화면으로 이동합니다.',
        success: true
      };

      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (error) {
      result.value = {
        message: '비밀번호가 올바르지 않습니다.',
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
  <dialog v-if="isOpen" class="modal" open>
    <div class="modal-box max-w-sm">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
      <h3 class="text-lg font-bold mb-6">비밀번호 재확인</h3>

      <!-- 비밀번호 재확인 폼 -->
      <form @submit.prevent novalidate>
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
          <small v-if="errors.confirmPassword" class="text-red-500 mt-1 block">{{ errors.confirmPassword }}</small>
        </div>

        <!-- 탈퇴하기 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!canSubmit || result.success"
          label="탈퇴하기"
          @click="handleLeaveService"
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
  </dialog>
</template>
