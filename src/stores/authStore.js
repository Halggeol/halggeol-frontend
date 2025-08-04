import { defineStore } from 'pinia';
import * as authUtil from '@/utils/authUtil';

export const useAuthStore = defineStore('auth',  {
  state: () => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    initialize() {
      const token = authUtil.getAccessToken();
      if (token) {
        const parsedToken = authUtil.parseToken(token);
        if (authUtil.isValidToken(parsedToken))
          this.isLoggedIn = true;
        else {
          console.error('만료된 토큰입니다.');
          authUtil.clearAccessToken();
          this.isLoggedIn = false;
        }
      }
    },
    login(token, userData) {
      this.isLoggedIn = true;
      this.user = userData;
      authUtil.setAccessToken(token);
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      authUtil.clearAccessToken();
    }
  }
})
