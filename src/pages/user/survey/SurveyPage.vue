<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getEmail } from '@/utils/authUtil';
import KnowledgeSurvey from '@/components/user/survey/KnowledgeSurvey.vue';
import TendencySurvey from '@/components/user/survey/TendencySurvey.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import ProcessDots from '@/components/icons/survey/ProcessDots.vue';
import Check from '@/components/icons/survey/Check.vue';
import OneFilled from '@/components/icons/survey/OneFilled.vue';
import TwoEmpty from '@/components/icons/survey/TwoEmpty.vue';
import TwoFilled from '@/components/icons/survey/TwoFilled.vue';
import ThreeEmpty from '@/components/icons/survey/ThreeEmpty.vue';

const route = useRoute();
const type  = route.params.type; // knowledge, tendency

const email = ref(null);
const started = ref(false);

onMounted(() => {
  email.value = getEmail();
})

function startSurvey() {
  started.value = true;
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center">
    <!-- 과정 진행도 아이콘 -->
    <div class="w-full max-w-[500px] flex items-center justify-start my-14">
      <OneFilled v-if="type === 'knowledge'"/>
      <Check v-else-if="type === 'tendency'"/>

      <ProcessDots/>

      <TwoEmpty v-if="type === 'knowledge'"/>
      <TwoFilled v-else-if="type === 'tendency'"/>

      <ProcessDots/>
      <ThreeEmpty/>
    </div>

    <!-- 설문 온보딩 -->
    <div v-if="!started" class="w-full max-w-[500px] flex flex-col grow">
      <!-- 상단 설명 영역 -->
      <div>
        <h1 v-if="type === 'knowledge'" class="text-title-lg mb-10">
          나의 <span class="font-bold">금융 이해도</span>를 <br /> 확인해보세요
        </h1>
        <h1 v-else-if="type === 'tendency'" class="text-title-lg mb-10">
          나의 <span class="font-bold">투자성향</span>을 <br/> 파악해보세요
        </h1>

        <p class="text-gray-600 mb-6">
          <template v-if="type === 'knowledge'">
            금융에 대한 나의 이해도를 간단한 OX 퀴즈를 통해 확인해보세요<br />
            진단 결과에 따라 더 나은 금융상품을 추천해드릴게요<br />
            금융 이해도 설문 결과는 12개월 간 재사용이 가능합니다
          </template>
          <template v-else-if="type === 'tendency'">
            설문을 통해 투자성향을 파악해보세요<br />
            소중한 정보를 바탕으로 가장 적합한 금융 상품을 추천해드려요<br />
            투자성향 설문 결과는 12개월 간 재사용이 가능합니다
          </template>
        </p>
      </div>

      <!-- 시작하기 버튼 -->
      <BaseButton
        v-if="!started"
        class="mt-auto mb-32"
        size="lg"
        variant="filled"
        :disabled="false"
        label="시작하기"
        @click="startSurvey">
      </BaseButton>
    </div>

    <!-- 설문 컴포넌트 -->
    <div v-if="started">
      <KnowledgeSurvey
        v-if="type === 'knowledge'"
        :email="email"
      />
      <TendencySurvey
        v-else-if="type === 'tendency'"
        :email="email"
      />
    </div>
  </div>
</template>
