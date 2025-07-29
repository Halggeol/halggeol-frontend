<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '../common/BaseButton.vue';
import axios from 'axios';
import { ref, computed } from 'vue';

const props = defineProps({
  userName: String,
  productId: String,
});

const situation = ref(null);
const selectedReason = ref(null);

const regertReasons = [
  {
    id: 1,
    text: '관심이 없어서',
  },
  {
    id: 2,
    text: '상품 설명이 부족하거나 복잡해서',
  },
  {
    id: 3,
    text: '상품을 신뢰할 수 없어서',
  },
  {
    id: 4,
    text: '가입 절차가 번거로워서',
  },
];

const payload = computed(() => ({
  isSurveyed: true,
  isRegretted: situation.value === '후회해요',
  regrettedReason: situation.value === '후회해요' ? selectedReason.value : null,
}));

const submitFeedback = async () => {
  try {
    await axios.post(
      `/api/insight/details?productId=${props.productId}`,
      payload.value
    );
    console.log(payload.value);
  } catch (err) {
    console.error('전송 실패:', err);
  }
};
</script>

<template>
  <BaseCard size="lg" variant="tinted" class="mt-40 p-12">
    <h2 class="title01">{{ props.userName }} 님의 의견을 알려주세요</h2>
    <!-- 후회 여부 선택 -> ui 디테일 수정 -->
    <div class="flex items-center gap-8 my-6 text-body02 text-fg-primary">
      <span>지금 금융상품명을 가입하지 않은 걸</span>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="후회해요"
          v-model="situation"
          class="w-4 h-4"
        />
        <span class="text-body02">후회해요</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="후회 안 해요"
          v-model="situation"
          class="w-4 h-4"
        />
        <span class="text-body02">후회 안 해요</span>
      </label>
    </div>

    <!-- 후회 사유 선택 -> ui 디테일 수정 -->
    <div v-if="situation === '후회해요'" class="py-6 text-body02">
      <div class="flex items-start gap-2">
        <span class="pt-1 whitespace-nowrap">그때는</span>
        <div class="flex flex-col min-w-max">
          <label
            v-for="(item, index) in regertReasons"
            :key="item.id"
            class="flex items-center gap-2"
          >
            <input
              type="radio"
              :value="item.id"
              v-model="selectedReason"
              class="w-4 h-4"
            />
            <span>
              {{ item.text }}
              <span v-if="index === 0">가입하지 않았어요</span>
            </span>
          </label>
        </div>
      </div>
    </div>

    <!-- 제출 버튼 -->
    <BaseButton
      @click="submitFeedback"
      size="sm"
      label="제출"
      :disabled="situation === '후회해요' && !selectedReason"
    >
    </BaseButton>
  </BaseCard>
</template>
