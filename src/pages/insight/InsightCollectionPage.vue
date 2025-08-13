<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import InsightView from './InsightView.vue';

const route = useRoute();

// 현재 경로에 따라 filterType을 동적으로 결정합니다.
const filterType = computed(() => {
  if (route.path.includes('fund')) return 'fund';
  if (route.path.includes('aggressive')) return 'aggressive';
  return null;
});
</script>

<template>
  <InsightView :filter-type="filterType" />
</template>
