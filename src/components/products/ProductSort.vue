<template>
  <div class="inline-block">
    <select
      id="sort"
      class="select select-bordered w-full max-w-xs"
      v-model="selectedSort"
      @change="onSortChange"
    >
      <option value="popularDesc">인기순</option>
      <option value="rateDesc">수익률 순</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from 'vue';

const emit = defineEmits(['update:sort']);
const props = defineProps({
  modelValue: {
    type: String,
    default: 'popularDesc', // 기본값
  },
});

const selectedSort = ref(props.modelValue);

watch(
  () => props.modelValue,
  newVal => {
    selectedSort.value = newVal;
  }
);

function onSortChange() {
  emit('update:sort', selectedSort.value);
}
</script>

<style scoped></style>
