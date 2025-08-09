<script setup>
import BaseCard from '@/components/common/BaseCard.vue';
import BaseButton from '../common/BaseButton.vue';
import { submitRegretSurvey } from '@/api/insight-detail';
import { ref, computed } from 'vue';

const props = defineProps({
  userName: String,
  productId: String,
  isSurveyed: Boolean,
  isRegretted: Boolean,
  regrettedReason: Number,
});

const situation = ref(
  props.isSurveyed ? (props.isRegretted ? '후회해요' : '후회 안 해요') : null
);
const selectedReason = ref(
  props.isSurveyed && props.isRegretted ? props.regrettedReason : null
);

const regretReasons = [
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
  productId: props.productId,
  isRegretted: situation.value === '후회해요',
  regrettedReason: situation.value === '후회해요' ? selectedReason.value : null,
}));

const isSubmitting = ref(false);
const submitSuccess = ref(false);

const submitFeedback = async () => {
  isSubmitting.value = true;
  try {
    await submitRegretSurvey(payload.value);
    submitSuccess.value = true;
  } catch (err) {
    console.error('전송 실패:', err);
    submitSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const readOnly = computed(() => props.isSurveyed || submitSuccess.value);
const regrettedReasonText = computed(() => {
  const reasonId = submitSuccess.value
    ? selectedReason.value
    : props.regrettedReason;
  if (!reasonId) return '';
  return regretReasons.find(r => r.id === reasonId)?.text || '';
});
</script>

<template>
  <BaseCard size="lg" variant="tinted" class="mt-40 p-12">
    <h2 class="title01" v-if="!readOnly">
      {{ props.userName }} 님의 의견을 알려주세요
    </h2>
    <h2 class="title01" v-else>{{ props.userName }} 님의 소중한 의견이에요</h2>
    <div class="flex items-center gap-8 my-6 text-body02 text-fg-primary">
      <span>지금 금융상품명을 가입하지 않은 걸</span>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="후회해요"
          v-model="situation"
          class="w-4 h-4"
          :disabled="readOnly"
        />
        <span class="text-body02">후회해요</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          value="후회 안 해요"
          v-model="situation"
          class="w-4 h-4"
          :disabled="readOnly"
        />
        <span class="text-body02">후회 안 해요</span>
      </label>
    </div>

    <div v-if="situation === '후회해요'" class="py-6 text-body02">
      <div class="flex gap-4">
        <span class="whitespace-nowrap">그때는</span>
        <div v-if="!readOnly" class="flex flex-col min-w-max">
          <label
            v-for="item in regretReasons"
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
            </span>
          </label>
        </div>
        <span v-else>
          {{ regrettedReasonText }}
        </span>
        <span>가입하지 않았어요</span>
      </div>
    </div>

    <BaseButton
      @click="submitFeedback"
      size="sm"
      label="제출하기"
      :disabled="isSubmitting || (situation === '후회해요' && !selectedReason)"
      :loading="isSubmitting"
      v-if="!readOnly"
    >
    </BaseButton>
  </BaseCard>
</template>
