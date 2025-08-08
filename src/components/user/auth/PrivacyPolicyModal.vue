<script setup>
import { ref } from 'vue';
import { privacyText } from '@/constants/terms';

const dialog = ref();

function showModal() {
  dialog.value?.showModal();
}

defineExpose({
  showModal
});
</script>

<template>
  <dialog id="policy_modal" class="modal" ref="dialog">
    <div class="modal-box max-w-2xl max-h-[80vh] overflow-y-auto">
      <h3 class="font-bold text-xl mb-4">개인정보 처리방침</h3>
      <div v-text="privacyText" class="text-sm leading-relaxed whitespace-pre-line"></div>
      <div class="modal-action mt-4">
        <form method="dialog">
          <button class="btn btn-sm bg-primary">닫기</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
