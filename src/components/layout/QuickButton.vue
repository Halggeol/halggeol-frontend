<script setup>
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- 우측 하단 퀵 버튼 영역 -->
  <div class="fixed flex justify-end w-full bottom-[20%] right-[5%] z-30">
    <div class="flex flex-col flex-wrap gap-2">
      <!-- 관심상품 이통 버튼 -->
      <RouterLink
        to="/scrap"
        class="w-10 h-10 bg-fg-primary rounded-full flex items-center justify-center"
        aria-label="관심상품 목록으로 이동"
      >
        <svg class="size-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.3671 3.84123C16.9415 3.41541 16.4361 3.07761 15.8799 2.84714C15.3237 2.61667 14.7275 2.49805 14.1254 2.49805C13.5234 2.49805 12.9272 2.61667 12.371 2.84714C11.8147 3.07761 11.3094 3.41541 10.8838 3.84123L10.0004 4.72457L9.11709 3.84123C8.25735 2.98149 7.09129 2.49849 5.87542 2.49849C4.65956 2.49849 3.4935 2.98149 2.63376 3.84123C1.77401 4.70098 1.29102 5.86704 1.29102 7.0829C1.29102 8.29876 1.77401 9.46482 2.63376 10.3246L10.0004 17.6912L17.3671 10.3246C17.7929 9.89894 18.1307 9.39358 18.3612 8.83736C18.5917 8.28115 18.7103 7.68497 18.7103 7.0829C18.7103 6.48083 18.5917 5.88465 18.3612 5.32844C18.1307 4.77222 17.7929 4.26686 17.3671 3.84123Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </RouterLink>
      <!-- Scroll to Top 버튼 -->
      <button
        class="w-10 h-10 bg-fg-primary rounded-full flex items-center justify-center"
        @click="scrollToTop()"
        aria-label="맨 위로 이동"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="size-6">
          <path
            fill-rule="evenodd"
            d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
