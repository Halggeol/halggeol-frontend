<script setup>
defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['confirm'])

function onConfirm() {
  emit('confirm')
}

</script>

<template>
  <dialog id="extend_login_modal" class="modal" :open="isOpen">
    <div class="modal-box">
      <h3 class="font-bold text-lg">회원가입을 축하합니다.</h3>
      <p class="pt-6">로그인 페이지로 이동합니다.</p>

      <div class="modal-action">
        <button class="btn bg-primary" @click="onConfirm">확인</button>
      </div>
    </div>
  </dialog>
</template>
