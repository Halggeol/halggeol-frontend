import axios from 'axios';

// 1. axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080', // 기본 백엔드 서버 주소
});

// 2. 요청 인터셉터 추가 (모든 요청에 토큰을 자동으로 포함)
api.interceptors.request.use(
  config => {
    // sessionStorage에서 토큰을 가져옵니다.
    const token = sessionStorage.getItem('accessToken');

    // 토큰이 존재하면 헤더에 추가합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 3. 생성한 인스턴스를 export 합니다.
export default api;
