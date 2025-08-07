<script setup>
import { ref } from 'vue';
import { syncMydata } from '@/api/user';
import BaseButton from '@/components/common/BaseButton.vue';
import ProcessDots from '@/components/icons/survey/ProcessDots.vue';
import Check from '@/components/icons/survey/Check.vue';
import ThreeFilled from '@/components/icons/survey/ThreeFilled.vue';
import SyncSuccessModal from '@/components/user/auth/SyncSuccessModal.vue';
import router from '@/router';

const isLoading = ref(false);
const isMydataSynced = ref(false);

async function handleSyncMydata() {
  console.log('===== 마이데이터 연결 핸들링 =====');

  try {
    isLoading.value = true;
    await syncMydata();
    isMydataSynced.value = true;

  } catch (error) {
    alert('오류가 발생했습니다.');
    isLoading.value = false;
  }
}

function routeToLoginPage() {
  router.push('/login')
}

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
          그때 할 걸에서 <span class="font-bold">마이데이터</span>를 <br />를 연동하세요
        </h1>

        <p class="text-gray-600 mb-6">
          연동한 마이데이터로 나의 자산을<br />
          쉽고 빠르게 분석할 수 있어요
        </p>
      </div>

      <!-- 연동하기 버튼 -->
      <BaseButton
        class="mt-auto mb-32"
        size="lg"
        variant="filled"
        :disabled="isLoading"
        :label="isLoading ? '잠시만 기다려주세요' : '연동하기'"
        @click="handleSyncMydata">
      </BaseButton>
    </div>
  </div>

  <SyncSuccessModal
    :isOpen="isMydataSynced"
    @confirm="routeToLoginPage"
  />
</template>
