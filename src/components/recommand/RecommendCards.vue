<script setup>
import BaseCard from '../common/BaseCard.vue';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';

// 추천 상품 카드 콘텐츠 커스텀
const props = defineProps({
  userName: {
    type: String,
    default: '사용자',
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  hasPadding: {
    type: Boolean,
    default: true,
  },
});

// 카테고리 매핑
const categoryMap = {
  D: '예금',
  S: '적금',
  A: '연금',
  C: '연금',
  F: '펀드',
  X: '외환',
};

// 상세페이지 이동
import { useRouter } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';

const router = useRouter();
const navigationStore = useNavigationStore();

function goToDetail(id, event) {
  // 추천에서 온 상태로 설정
  if (isScrolling.value) {
    event.stopPropagation();
    return;
  }
  navigationStore.navigateFromRecommend(id);
  router.push(`/products/detail/${id}`);
}

// 패딩값 여부
const wrapperClass = computed(() => {
  return props.hasPadding ? 'scroller-wrapper pl-[10.8%]' : 'scroller-wrapper';
});

// 마우스 좌우 끌기 설정 시작
const scrollerWrapper = ref(null);
const isDragging = ref(false);
const isScrolling = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);
const dragThreshold = 5;

function handleMouseDown(e) {
  isDragging.value = true;
  isScrolling.value = false;
  startX.value = e.pageX - scrollerWrapper.value.offsetLeft;
  scrollLeft.value = scrollerWrapper.value.scrollLeft;
  scrollerWrapper.value.style.cursor = 'grabbing';
}

function handleMouseLeave() {
  isDragging.value = false;
  scrollerWrapper.value.style.cursor = 'grab';
}

function handleMouseUp() {
  isDragging.value = false;
  scrollerWrapper.value.style.cursor = 'grab';
}

function handleMouseMove(e) {
  if (!isDragging.value) return;
  e.preventDefault();
  const x = e.pageX - scrollerWrapper.value.offsetLeft;
  const walk = (x - startX.value) * 1.5;

  if (Math.abs(walk) > dragThreshold) {
    isScrolling.value = true;
  }

  scrollerWrapper.value.scrollLeft = scrollLeft.value - walk;
}

onMounted(() => {
  if (scrollerWrapper.value) {
    scrollerWrapper.value.addEventListener('mousedown', handleMouseDown);
    scrollerWrapper.value.addEventListener('mouseleave', handleMouseLeave);
    scrollerWrapper.value.addEventListener('mouseup', handleMouseUp);
    scrollerWrapper.value.addEventListener('mousemove', handleMouseMove);
  }
});

onBeforeUnmount(() => {
  if (scrollerWrapper.value) {
    scrollerWrapper.value.removeEventListener('mousedown', handleMouseDown);
    scrollerWrapper.value.removeEventListener('mouseleave', handleMouseLeave);
    scrollerWrapper.value.removeEventListener('mouseup', handleMouseUp);
    scrollerWrapper.value.removeEventListener('mousemove', handleMouseMove);
  }
});
// 마우스 좌우 끌기 설정 끝
</script>

<template>
  <div class="scroller">
    <div :class="wrapperClass" ref="scrollerWrapper">
      <BaseCard
        v-for="item in props.items"
        :key="item.productId"
        @click="goToDetail(item.productId)"
        variant="tinted"
        size="lg"
        ratio="lg"
        class="scroller-item cursor-pointer"
      >
        <div class="relative">
          <span class="text-body02 mb-1">{{
            categoryMap[item.productId[0]]
          }}</span>
          <p class="title02 mb-2">{{ item.name }}</p>
          <div class="mt-20 absolute top-28 right-0 text-right">
            <span class="text-body02">적합도</span>
            <p class="title-lg">{{ item.matchScore }}%</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  overflow: hidden;
  position: relative;
  padding-bottom: 10rem;
}
.scroller-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  cursor: grab;
}
.scroller-wrapper:active {
  cursor: grabbing;
}
.scroller-wrapper::-webkit-scrollbar {
  display: none;
}
.scroller-item {
  min-width: 360px;
  margin-right: 1.5rem;
}
</style>
