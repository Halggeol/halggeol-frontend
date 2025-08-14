<script setup>
import { ref, computed } from 'vue';
import { requestJoin } from '@/api/user';
import { regex } from '@/utils/validationUtil';
import BaseButton from '@/components/common/BaseButton.vue';

const error = ref('');
const email = ref('');

const result = ref({
  message: '',
  success: false
})

const canSubmit = computed(() => {
  return email.value !== '' && error.value.length === 0;
});

function validateEmail() {
  if (!email.value)
    error.value = '이메일을 입력해주세요';
  else if (!regex.email.test(email.value))
    error.value = '올바른 이메일 형식이 아닙니다';
  else
    error.value = '';
}

async function handleEmailSubmit() {
  console.log('===== 이메일 본인인증 핸들링 =====');

  validateEmail();
  if (canSubmit.value) {
    try {
      console.log("===== requestJoin API 호출 =====");
      await requestJoin({ email: email.value });

      result.value = {
        message: '입력하신 이메일로 회원가입 링크가 전송되었습니다.',
        success: true
      };
    } catch (error) {
      if (error.response?.status === 409) {
        result.value = {
          message: '이미 가입된 이메일입니다.',
          success: false
        };
      }
      else {
        result.value = {
          message: '유효하지 않은 이메일입니다.',
          success: false
        };
      }
    }
  }
}

function inputStyleClass() {
  return [
    'w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors',
    error.value ? 'border-status-red bg-red-100 placeholder-status-red' : 'border-gray-300 focus:border-status-blue',
  ];
}

</script>

<template>
  <div class="h-[calc(100vh-56px)] flex items-center justify-center bg-gray-50 relative">
    <div class="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
      <h2 class="text-center title02 mb-6">회원가입</h2>

      <!-- 이메일 인증 폼 -->
      <form @submit.prevent novalidate>
        <div class="mb-3">
          <input
            type="email"
            v-model="email"
            @blur="validateEmail()"
            :class="inputStyleClass()"
            placeholder="이메일"
            :disabled="result.success"
          />
          <small v-if="error" class="text-status-red mt-1 block">{{ error }}</small>
        </div>

        <!-- 본인인증하기 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!canSubmit || result.success"
          label="본인인증하기"
          @click="handleEmailSubmit"
          class="mt-6"
        >
        </BaseButton>

        <!-- 결과 메세지 -->
        <small
          v-if="result.message"
          :class="result.success ? 'text-status-blue' : 'text-status-red'"
          class="mt-1 block pt-2"
        >
          {{ result.message }}
        </small>
      </form>
    </div>
  </div>
</template>
