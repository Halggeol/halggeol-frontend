<template>
  <div class="inline-block">
    <select
      id="sort"
      class="select select-bordered w-full max-w-xs"
      v-model="selectedSort"
      @change="onSortChange"
    >
      <option value="popularDesc">인기순</option>
      <option value="rateDesc">금리 높은 순</option>
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

<style scoped>
/*
  Tailwind CSS를 주로 사용하기 때문에 style 태그는 비어있는 경우가 많지만,
  만약 특정 브라우저에서 appearance-none이 완벽히 작동하지 않거나
  더 미세한 조정이 필요하다면 여기에 커스텀 CSS를 추가할 수 있습니다.
*/
</style>
