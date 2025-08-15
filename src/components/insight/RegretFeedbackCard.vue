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

const emit = defineEmits(['survey-submitted']);

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
    emit('survey-submitted', payload.value);
  } catch (err) {
    console.error('전송 실패:', err);
    submitSuccess.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const readOnly = computed(() => props.isSurveyed || submitSuccess.value);
</script>

<template>
  <BaseCard size="lg" variant="tinted" class="mt-40 p-12">
    <h2 class="title01" v-if="!readOnly">
      {{ props.userName }} 님의 의견을 알려주세요
    </h2>
    <h2 class="title01" v-else>{{ props.userName }} 님의 소중한 의견이에요</h2>
    <div class="my-6 space-y-4">
      <p class="text-body01 font-medium text-fg-primary">
        지금 금융상품명을 가입하지 않은 걸
      </p>

      <div class="grid grid-cols-2 gap-4">
        <label>
          <input
            type="radio"
            value="후회해요"
            v-model="situation"
            :disabled="readOnly"
            class="sr-only peer"
          />
          <div
            class="w-full rounded-lg border p-4 text-body02 text-center transition-all"
            :class="{
              'opacity-70': readOnly,
              'cursor-pointer': !readOnly,
              'cursor-default': readOnly,
              'border-primary bg-white shadow font-semibold':
                situation === '후회해요',
              'border-gray-200 bg-white': situation !== '후회해요',
              'hover:bg-primary-50 hover:border-primary-200':
                !readOnly && situation !== '후회해요',
            }"
          >
            후회해요
          </div>
        </label>
        <label>
          <input
            type="radio"
            value="후회 안 해요"
            v-model="situation"
            :disabled="readOnly"
            class="sr-only peer"
          />
          <div
            class="w-full rounded-lg border p-4 text-body02 text-center transition-all"
            :class="{
              'opacity-70': readOnly,
              'cursor-pointer': !readOnly,
              'cursor-default': readOnly,
              'border-primary bg-white shadow font-semibold':
                situation === '후회 안 해요',
              'border-gray-200 bg-white': situation !== '후회 안 해요',
              'hover:bg-primary-50 hover:border-primary-200':
                !readOnly && situation !== '후회 안 해요',
            }"
          >
            후회 안 해요
          </div>
        </label>
      </div>
    </div>

    <div v-if="situation === '후회해요'" class="my-6 space-y-4">
      <p class="text-body01 font-medium text-fg-primary">
        그때 가입하지 않은 이유는
      </p>
      <div class="space-y-2">
        <label v-for="item in regretReasons" :key="item.id">
          <input
            type="radio"
            :value="item.id"
            v-model="selectedReason"
            :disabled="readOnly"
            class="sr-only peer"
          />
          <div
            class="flex items-center mb-3 rounded-lg border p-4 text-body02 transition-all"
            :class="{
              'opacity-70': readOnly,
              'cursor-pointer': !readOnly,
              'cursor-default': readOnly,
              'border-primary bg-white shadow font-semibold':
                selectedReason === item.id,
              'border-gray-200 bg-white': selectedReason !== item.id,
              'hover:bg-primary-50 hover:border-primary-200':
                !readOnly && selectedReason !== item.id,
            }"
          >
            <div
              class="flex h-5 w-5 mr-2 items-center justify-center rounded-full border border-gray-300 peer-checked:border-primary"
            >
              <div
                class="h-2.5 w-2.5 rounded-full bg-primary"
                v-if="selectedReason === item.id"
              ></div>
            </div>
            <span>{{ item.text }}</span>
          </div>
        </label>
      </div>
    </div>

    <BaseButton
      v-if="!readOnly"
      @click="submitFeedback"
      size="sm"
      label="제출하기"
      :disabled="isSubmitting || (situation === '후회해요' && !selectedReason)"
      :loading="isSubmitting"
      class="mt-4"
    >
    </BaseButton>
  </BaseCard>
</template>
