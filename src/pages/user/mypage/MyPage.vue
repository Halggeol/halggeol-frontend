<script setup>
import { reactive, ref, onMounted } from 'vue';
import { viewProfile } from '@/api/user';

// 사용자 정보
const user = reactive({
  name: '',
  email: '',
  phone: '',
  birth: '',
  knowledge: '',
  investmentType: '',
});

const result = ref({
  message: '',
  success: false
});

// 버튼 핸들러
const changePassword = () => console.log('비밀번호 변경');
const retakeFinancialTest = () => console.log('금융이해도 재검사');
const retakeInvestmentTest = () => console.log('투자성향 재검사');
const withdrawAccount = () => console.log('탈퇴하기');

onMounted(() => {
 setUserInfo();
})

async function setUserInfo() {
  console.log('===== 사용자 정보 조회 핸들링 =====');

  try {
    console.log('===== viewProfile API 호출 =====');
    const response = await viewProfile();
    const profile = response.data?.profile;

    user.name = profile.name;
    user.email = profile.email;
    user.phone = profile.phone;
    user.birth = profile.birth;
    user.knowledge = profile.knowledge;
    user.investmentType = profile.investmentType;

  } catch (error) {
    result.value = {
      message: '사용자 정보 조회에 실패했습니다.',
      success: false
    };
  }
}

</script>

<template>
  <div class="w-full mx-auto mt-8 p-6">
    <!-- 제목 -->
    <h2 class="title01 font-bold mb-2 text-left">내 정보</h2>
    <hr class="mb-10"/>

    <!-- 정보 리스트 -->
    <div class="space-y-6 text-sm">
      <!-- 이름 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 font-medium text-gray-800">이름</div>
        <div class="w-1/2 text-gray-900">{{ user.name }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 이메일 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 font-medium text-gray-800">이메일</div>
        <div class="w-1/2 text-gray-900">{{ user.email }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 비밀번호 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 font-medium text-gray-800">비밀번호</div>
        <div class="w-1/2 text-gray-900">비밀번호</div>
        <div class="w-1/3 text-right">
          <button
            class="text-gray-400 text-sm hover:text-gray-600 hover:underline"
            @click="changePassword"
          >
            변경하기
          </button>
        </div>
      </div>

      <!-- 전화번호 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 font-medium text-gray-800">전화번호</div>
        <div class="w-1/2 text-gray-900">{{ user.phone }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 생년월일 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 font-medium text-gray-800">생년월일</div>
        <div class="w-1/2 text-gray-900">{{ user.birth }}</div>
        <div class="w-1/3"></div>
      </div>

      <!-- 금융이해도 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 font-medium text-gray-800">금융이해도</div>
        <div class="w-1/2 text-gray-900">{{ user.knowledge }}</div>
        <div class="w-1/3 text-right">
          <button
            class="text-gray-400 text-sm hover:text-gray-600 hover:underline"
            @click="retakeFinancialTest"
          >
            재검사하기
          </button>
        </div>
      </div>

      <!-- 투자성향 -->
      <div class="flex items-center justify-between w-full">
        <div class="w-1/3 font-medium text-gray-800">투자성향</div>
        <div class="w-1/2 text-gray-900">{{ user.investmentType }}</div>
        <div class="w-1/3 text-right">
          <button
            class="text-gray-400 text-sm hover:text-gray-600 hover:underline"
            @click="retakeInvestmentTest"
          >
            재검사하기
          </button>
        </div>
      </div>
    </div>

    <!-- 탈퇴하기 버튼 -->
    <div class="my-28">
      <button class="text-sm text-gray-400 hover:underline" @click="withdrawAccount">
        탈퇴하기
      </button>
    </div>
  </div>
</template>
