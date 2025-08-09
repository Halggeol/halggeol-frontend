<script setup>
import BaseCard from '../common/BaseCard.vue';
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

// 추천 상품 카드 콘텐츠 커스텀
const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  hasPadding: {
    type: Boolean,
    default: true,
  },
  isSimilar: {
    type: String,
    default: '적합도',
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

// 스크롤러 네비게이션
const showPrevButton = ref(false);
const showNextButton = ref(true);
const SCROLL_AMOUNT = 384;

function scrollHorizontally(amount) {
  if (!scrollerWrapper.value) return;
  scrollerWrapper.value.scrollBy({ left: amount, behavior: 'smooth' });
}

function updateButtonVisibility() {
  if (!scrollerWrapper.value) return;
  const el = scrollerWrapper.value;
  // 스크롤 맨 왼쪽일 때 숨김
  showPrevButton.value = el.scrollLeft > 0;
  // 스크롤이 맨 오른쪽일 때 숨김
  showNextButton.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
}

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

    scrollerWrapper.value.addEventListener('scroll', updateButtonVisibility);
    window.addEventListener('resize', updateButtonVisibility);
    nextTick(updateButtonVisibility);
  }
});

onBeforeUnmount(() => {
  if (scrollerWrapper.value) {
    scrollerWrapper.value.removeEventListener('mousedown', handleMouseDown);
    scrollerWrapper.value.removeEventListener('mouseleave', handleMouseLeave);
    scrollerWrapper.value.removeEventListener('mouseup', handleMouseUp);
    scrollerWrapper.value.removeEventListener('mousemove', handleMouseMove);

    scrollerWrapper.value.removeEventListener('scroll', updateButtonVisibility);
    window.removeEventListener('resize', updateButtonVisibility);
  }
});
// 마우스 좌우 끌기 설정 끝
</script>

<template>
  <div class="scroller">
    <button
      v-show="showPrevButton"
      @click="scrollHorizontally(-SCROLL_AMOUNT)"
      class="scroll-btn left-4"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M38 24H10M10 24L24 38M10 24L24 10"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
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
            <span class="text-body02">{{ props.isSimilar }}</span>
            <p class="title-lg">{{ item.matchScore }}%</p>
          </div>
        </div>
      </BaseCard>
    </div>
    <button
      v-show="showNextButton"
      @click="scrollHorizontally(SCROLL_AMOUNT)"
      class="scroll-btn right-6 text-fg-primary"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 24H38M38 24L24 10M38 24L24 38"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
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

.scroll-btn {
  position: absolute;
  top: 40%;
  transform: translateY(-40%);
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 9999px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.scroll-btn:hover {
  background-color: white;
}
</style>
