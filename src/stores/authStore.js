import { defineStore } from 'pinia';
import { getAccessToken, setAccessToken, clearAccessToken } from '@/utils/authUtil';

export const useAuthStore = defineStore('auth',  {
  state: () => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    initialize() {
      const token = getAccessToken();
      if (token) {
        // TODO: 토큰 파싱해서 만료 여부 확인
        this.isLoggedIn = true;
      }
    },
    login(token, userData) {
      this.isLoggedIn = true;
      this.user = userData;
      setAccessToken(token);
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      clearAccessToken();
    }
  }
})
