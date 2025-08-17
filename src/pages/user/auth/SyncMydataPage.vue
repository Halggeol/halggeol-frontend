<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { syncMydata } from '@/api/user';
import BaseButton from '@/components/common/BaseButton.vue';
import ProcessDots from '@/assets/icons/auth/survey/ProcessDots.vue';
import Check from '@/assets/icons/auth/survey/Check.vue';
import ThreeFilled from '@/assets/icons/auth/survey/ThreeFilled.vue';

const router = useRouter();

const isLoading = ref(false);

async function handleSyncMydata() {
  console.log('===== 마이데이터 연결 핸들링 =====');

  try {
    isLoading.value = true;
    // const authUrl = await syncMydata();
    // window.location.href = authUrl;

    // TODO: 네이버 인증서 이동 or 로딩 화면 구현
    setTimeout(() => {
      router.push('/signup/success');
    }, 3000);
  } catch (error) {
    alert('오류가 발생했습니다.');
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="h-[calc(100vh-56px)] bg-white flex flex-col items-center justify-center"
  >
    <!-- 과정 진행도 아이콘 -->
    <div class="w-full max-w-[500px] flex items-center justify-start my-14">
      <Check />
      <ProcessDots />
      <Check />
      <ProcessDots />
      <ThreeFilled />
    </div>

    <div class="w-full max-w-[500px] flex flex-col grow">
      <!-- 상단 설명 영역 -->
      <div>
        <h1 class="text-title-lg mb-10 text-fg-primary">
          그때 할 걸에서 <span class="font-bold">마이데이터</span>를
          <br />연동하세요
        </h1>

        <p class="text-fg-secondary mb-6">
          연동한 마이데이터로 나의 자산을<br />
          쉽고 빠르게 분석할 수 있어요
        </p>
      </div>

      <!-- 로딩 중 화면 -->
      <div
        v-if="isLoading"
        class="flex flex-col items-center justify-center grow"
      >
        <!-- 스피너 -->
        <div
          class="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-6"
        ></div>
        <p class="text-fg-secondary">마이데이터를 연동 중입니다...</p>
      </div>

      <!-- 연동하기 버튼 -->
      <BaseButton
        class="mt-auto mb-32"
        size="lg"
        variant="filled"
        :disabled="isLoading"
        :label="isLoading ? '잠시만 기다려주세요' : '연동하기'"
        @click="handleSyncMydata"
      >
      </BaseButton>
    </div>
  </div>
</template>
