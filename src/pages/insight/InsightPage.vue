<script setup>
import InsightDetailPage from './InsightDetailPage.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const round = computed(() => {
  const roundParam = route.query.round;
  const parsedRound = Number(roundParam);
  return !isNaN(parsedRound) && parsedRound > 0 ? parsedRound : null;
});

const productId = computed(() => {
  const id = route.query.productId;
  return id && /^[A-Z]\d{4}$/.test(id) ? id : null;
});

const hasValidDetail = computed(() => {
  return round.value && productId.value;
});
</script>

<template>
  <!-- 회차 이동 영역 -->
  <!-- 발행일 -->
  <template v-if="round">
    <template v-if="hasValidDetail">
      <!-- 탭 전환 인사이트 -->
      <InsightDetailPage />
    </template>
  </template>
</template>
