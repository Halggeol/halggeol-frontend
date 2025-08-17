<script setup>
// import BaseButton from '@/components/common/BaseButton.vue';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['confirm', 'cancel']);

function onConfirm() {
  emit('confirm');
}

function onCancel() {
  emit('cancel');
}
</script>

<template>
  <dialog id="extend_login_modal" class="modal" :open="isOpen">
    <div class="modal-box">
      <h3 class="title03">로그인 세션이 곧 만료됩니다.</h3>
      <p class="text-body02 pt-2 pb-4">로그인 시간을 연장하시겠습니까?</p>

      <div class="modal-action">
        <!-- <BaseButton
          size="sm"
          variant="outline"
          label="취소"
          @click="onCancel"
        />
        <BaseButton size="sm" label="연장하기" @click="onConfirm" class=":" /> -->
        <button class="btn bg-primary" @click="onConfirm">연장하기</button>
        <button class="btn" @click="onCancel">취소</button>
      </div>
    </div>
  </dialog>
</template>
<style scoped></style>
