<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { findEmail, requestPasswordReset } from '@/api/user';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();
const activeTab = ref('findId');

// 아이디 찾기 관련 상태
const name = ref('');
const phone = ref('');
const idResult = ref([]);

// 비밀번호 재설정 관련 상태
const email = ref('');

const result = ref({
  message: '',
  success: false
});

const canSubmit = computed(() => {
  if (activeTab.value === 'findId')
    return name.value !== '' && phone.value !== '';
  else if (activeTab.value === 'resetPassword')
    return email.value !== '';
  return false;
})

const displayPhone = computed(() => {
  const digits = phone.value;

  if (digits.includes('-'))
    return digits;

  if (digits.length < 3)
    return digits;
  if (digits.length <= 6)
    return `${digits.slice(0, 3)}-${digits.slice(3)}${digits.length >= 6 ? '-' + digits.slice(6) : ''}`;
  if (digits.length === 11)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  else
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
});

function inputPhone(inputPhone) {
  if (inputPhone.data != null)
    phone.value = phone.value + inputPhone.data;
  else
    phone.value = phone.value.slice(0, -1);
}

function switchTab(tab) {
  activeTab.value = tab;
  // 상태 초기화
  name.value = '';
  phone.value = '';
  email.value = '';
  idResult.value = [];
  result.value = {
    message: '',
    success: false
  }
}

function goToLogin() {
  router.push('/login');
}

async function handleFindId() {
  console.log('===== 아이디 찾기 핸들링 =====');
  if (canSubmit.value) {
    try {
      console.log('===== findId API 호출 =====');
      const response = await findEmail({ name: name.value, phone: phone.value });

      idResult.value = response.data.email;
      if (idResult.value !== undefined) {
        result.value = {
          message: '입력하신 정보와 일치하는 아이디는 ' + idResult.value.length + '개입니다.',
          success: true
        }
      }
      else {
        result.value = {
          message: '일치하는 회원 정보가 없습니다.',
          success: false
        }
      }
    } catch (error) {
      result.value = {
        message: '오류가 발생했습니다.',
        success: false
      }
    }
  }
}

async function handleRequestResetPassword() {
  console.log('===== 이메일 본인인증 핸들링 =====');

  if (canSubmit.value) {
    try {
      console.log("===== requestPasswordReset API 호출 =====");
      const response = await requestPasswordReset({ email: email.value });

      if (response.success) {
        result.value = {
          message: '입력하신 이메일로 비밀번호 재설정 링크가 전송되었습니다.',
          success: true
        };
      }
      else {
        result.value = {
          message: '이메일 전송에 실패했습니다.',
          success: false
        };
      }
    } catch (error) {
      result.value = {
        message: '오류가 발생했습니다.',
        success: false
      };
    }
  }
}
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-50 relative">
    <div class="w-full max-w-sm p-8 bg-white shadow-md rounded-2xl">
      <h2 class="text-center title02 font-bold mb-6">아이디 / 비밀번호 찾기</h2>

      <!-- 탭 전환 버튼 -->
      <div class="flex justify-center mb-6 gap-4">
        <button
          @click="switchTab('findId')"
          :class="['px-4 py-2 rounded-md text-sm font-medium',
                   activeTab === 'findId' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700']"
        >
          아이디 찾기
        </button>

        <button
          @click="switchTab('resetPassword')"
          :class="['px-4 py-2 rounded-md text-sm font-medium',
                   activeTab === 'resetPassword' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700']"
        >
          비밀번호 재설정
        </button>
      </div>

      <!-- 아이디 찾기 -->
      <form v-if="activeTab === 'findId' && result.success === false" @submit.prevent novalidate>
        <input
          type="text"
          v-model="name"
          placeholder="이름"
          class="w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
        />
        <input
          type="text"
          :value="displayPhone"
          @input="inputPhone"
          placeholder="전화번호"
          class="w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
        />

        <!-- 아이디 찾기 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!canSubmit"
          label="아이디 찾기"
          @click="handleFindId"
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
      </form>

      <!-- 아이디 찾기 결과 -->
      <div v-if="activeTab === 'findId' && result.success === true">
        <p class="text-base text-gray-500 mb-4 text-center">{{ result.message }}</p>
        <div class="rounded-lg border border-gray-300 bg-gray-50 p-4 max-h-[130px] overflow-y-auto">
          <ul class="space-y-2">
            <li
              v-for="(email, index) in idResult"
              :key="index"
              class="text-sm text-gray-800"
            >
              {{ email }}
            </li>
          </ul>
        </div>

        <!-- 로그인 페이지 이동 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          label="로그인"
          @click="goToLogin"
          class="mt-6"
        >
          로그인
        </BaseButton>
      </div>

      <!-- 비밀번호 재설정 -->
      <form v-if="activeTab === 'resetPassword'" @submit.prevent novalidate>
        <input
          type="email"
          v-model="email"
          placeholder="가입한 이메일"
          class="w-full px-3 py-3 my-1 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
        />

        <!-- 비밀번호 재설정 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          :disabled="!email"
          label="이메일 인증"
          @click="handleRequestResetPassword"
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
      </form>
    </div>
  </div>
</template>
