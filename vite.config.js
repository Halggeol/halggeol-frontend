import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages 배포를 위한 base path 설정
  base: mode === 'production' ? '/halggeol-frontend/' : '/',

  plugins: [
    vue(),
    // 개발 환경에서만 vueDevTools 사용
    ...(mode === 'development' ? [vueDevTools()] : []),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Node.js 호환성을 위한 설정
    rollupOptions: {
      external: [],
    },
  },
  
  // 개발 서버 설정
  server: {
    host: true,
    port: 3000,
  },
}));
