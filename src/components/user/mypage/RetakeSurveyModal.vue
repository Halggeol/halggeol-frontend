<script setup>

const props = defineProps({
  type: String,
  renewDate: String,
  isOpen: Boolean,
  onClose: Function
});

const emit = defineEmits(['confirm']);

function confirmRetake() {
  emit('confirm');
}

</script>

<template>
  <dialog v-if="isOpen" class="modal" open>
    <div class="modal-box">
      <button class="absolute right-4 top-4" @click="onClose">✕</button>
      <h3 class="text-body01 font-bold">{{ type === 'knowledge' ? '금융이해도' : '투자성향' }} 재검사</h3>
      <p class="pt-8">마지막 검사일은 {{ renewDate }}입니다.</p>
      <p class="pt-2 pb-4">설문을 다시 시작하시겠습니까?</p>
      <div class="modal-action">
        <button class="btn bg-primary text-white" @click="confirmRetake">예</button>
        <button class="btn" @click="onClose">아니오</button>
      </div>
    </div>
  </dialog>
</template>
