<script setup>
import { ref, computed, watch } from 'vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { changeInsightCycle } from '@/api/user';

const props = defineProps({
  currentCycle: String,
  isOpen: Boolean,
  onClose: Function
});

const emit = defineEmits(['updated']); // 주기 변경 시 부모에 알림

const selected = ref(props.currentCycle);
const loading = ref(false);

const result = ref({ message: '', success: false });

const options = [
  { value: 'WEEKLY_1', label: '1주' },
  { value: 'WEEKLY_2', label: '2주' },
  { value: 'MONTHLY_1', label: '1개월' }
];

const canSubmit = computed(() => selected.value !== props.currentCycle && !loading.value);

function handleClose() {
  selected.value = props.currentCycle;
  result.value = { message: '', success: false };
  loading.value = false;
  props.onClose();
}

async function handleChangeCycle() {
  if (!canSubmit.value) return;

  loading.value = true;

  try {
    await changeInsightCycle({ cycle: selected.value });
    result.value = { message: '인사이트 주기가 변경되었습니다.', success: true };
    emit('updated', selected.value);

    setTimeout(() => {
      handleClose();
    }, 1000);

  } catch (error) {
    result.value = { message: '변경에 실패했습니다. 다시 시도해주세요.', success: false };
  }

  loading.value = false;
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      selected.value = props.currentCycle || '';
      result.value = { message: '', success: false };
      loading.value = false;
    }
  }
);

</script>

<template>
  <dialog v-if="isOpen" class="modal" open>
    <div class="modal-box max-w-sm">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="handleClose">✕</button>
      <h3 class="text-lg font-bold mb-4">인사이트 주기 변경</h3>

      <form @submit.prevent>
        <!-- 옵션 목록 -->
        <div class="space-y-2 mb-4">
          <label v-for="option in options" :key="option.value" class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              :value="option.value"
              v-model="selected"
              :disabled="loading"
              class="accent-gray-500"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>

        <!-- 버튼 -->
        <BaseButton
          size="lg"
          variant="filled"
          label="변경하기"
          :disabled="!canSubmit"
          @click="handleChangeCycle"
        />

        <!-- 결과 메시지 -->
        <small
          v-if="result.message"
          :class="result.success ? 'text-green-500' : 'text-red-500'"
          class="block mt-2"
        >
          {{ result.message }}
        </small>
      </form>
    </div>
  </dialog>
</template>
