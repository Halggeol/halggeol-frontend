<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { clearEmail } from '@/utils/authUtil';
import BaseButton from '@/components/common/BaseButton.vue';
import ProcessDots from '@/components/icons/survey/ProcessDots.vue';
import Check from '@/components/icons/survey/Check.vue';
import ThreeFilled from '@/components/icons/survey/ThreeFilled.vue';

const router = useRouter();

async function routeToLoginPage() {
  router.push('/login');
}

onMounted(() => {
  clearEmail();
});

</script>

<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center">
    <!-- 과정 진행도 아이콘 -->
    <div class="w-full max-w-[500px] flex items-center justify-start my-14">
      <Check/>
      <ProcessDots/>
      <Check/>
      <ProcessDots/>
      <ThreeFilled/>
    </div>

    <div class="w-full max-w-[500px] flex flex-col grow">
      <!-- 상단 설명 영역 -->
      <div>
        <h1 class="text-title-lg mb-10">
          <span class="font-bold">회원가입</span>을 축하합니다
        </h1>

        <p class="text-gray-600 mb-6">
          회원가입과 마이데이터 연동이 완료되었어요<br />
          연동된 자산 정보를 기반으로 적합한 금융상품을 추천해드릴게요
        </p>
      </div>

      <!-- 로그인하기 버튼 -->
      <BaseButton
        class="mt-auto mb-32"
        size="lg"
        variant="filled"
        label="로그인하기"
        @click="routeToLoginPage">
      </BaseButton>
    </div>
  </div>
</template>
