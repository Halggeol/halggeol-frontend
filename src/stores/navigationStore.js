import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    fromRecommend: false,
    lastVisitedProductId: null,
  }),

  actions: {
    setFromRecommend(value) {
      this.fromRecommend = value
    },

    setLastVisitedProductId(productId) {
      this.lastVisitedProductId = productId
    },

    resetNavigation() {
      this.fromRecommend = false
      this.lastVisitedProductId = null
    },

    // 추천에서 상품 상세로 이동
    navigateFromRecommend(productId) {
      this.fromRecommend = true
      this.lastVisitedProductId = productId
    },

    // 다른 곳에서 상품 상세로 이동
    navigateFromOther(productId) {
      this.fromRecommend = false
      this.lastVisitedProductId = productId
    },
  },

  getters: {
    shouldShowSurvey: (state) => state.fromRecommend,
    isFromRecommend: (state) => state.fromRecommend,
  },
})