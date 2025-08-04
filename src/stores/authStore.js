import { defineStore } from 'pinia';
import * as authUtil from '@/utils/authUtil';

export const useAuthStore = defineStore('auth',  {
  state: () => ({
    isLoggedIn: false,
    username: null,
  }),
  actions: {
    initialize() {
      const token = authUtil.getAccessToken();
      if (token) {
        try {
          const parsedToken = authUtil.parseToken(token);

          if (authUtil.isValidToken(parsedToken)) {
            this.isLoggedIn = true;
            this.username = authUtil.getUsername();
          }
          else {
            console.error('만료된 토큰');
            authUtil.clearAccessToken();
            this.isLoggedIn = false;
            this.username = null;
          }

        } catch (e) {
          console.error('토큰 형식 오류: ', e);
          authUtil.clearAccessToken();
          this.isLoggedIn = false;
          this.username = null;
        }
      }
    },
    login(token, userData) {
      this.isLoggedIn = true;
      this.username = userData;
      authUtil.setAccessToken(token);
      authUtil.setUsername(this.username);
    },
    logout() {
      this.isLoggedIn = false;
      this.username = null;
      authUtil.clearAccessToken();
      authUtil.clearUsername();
    }
  }
})
