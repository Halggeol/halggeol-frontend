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
        try {
          const parsedToken = authUtil.parseToken(token);

          if (authUtil.isValidToken(parsedToken))
            this.isLoggedIn = true;
          else {
            console.error('만료된 토큰');
            authUtil.clearAccessToken();
            this.isLoggedIn = false;
          }

        } catch (e) {
          console.error('토큰 형식 오류: ', e);
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
