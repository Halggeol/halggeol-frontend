// import axios from 'axios';
// import router from '../router';
// import store from '../store';

// const apiClient = axios.create({
//   baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080/api',
//   timeout: 10000, // 요청 타임아웃 (10초)
//   headers: {
//     'Content-Type': 'application/json',
//     // 'Authorization': 'Bearer YOUR_TOKEN' // 필요시 기본적으로 토큰을 포함시킬 수도 있지만, 인터셉터에서 동적으로 추가하는 것이 일반적
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('userToken'); // 로컬 스토리지에서 토큰 가져오기
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`; // 모든 요청 헤더에 토큰 추가
//     }

//     // Vuex 스토어를 사용하여 전역 로딩 상태 활성화 (선택 사항)
//     // `store`가 정의되어 있고 'setLoading' 액션이 있다면
//     if (store && store._actions && store._actions.setLoading) {
//       store.dispatch('setLoading', true);
//     }

//     return config; // 수정된 config 객체 반환
//   },
//   (error) => {
//     // 요청 에러 처리
//     if (store && store._actions && store._actions.setLoading) {
//       store.dispatch('setLoading', false); // 에러 발생 시 로딩 상태 비활성화
//     }
//     return Promise.reject(error); // 에러를 호출자에게 전달
//   }
// );

// // 3. 응답(Response) 인터셉터 설정
// apiClient.interceptors.response.use(
//   (response) => {
//     // 응답을 받은 후 수행할 작업
//     // 예: 로딩 스피너 비활성화, 응답 데이터 가공
//     if (store && store._actions && store._actions.setLoading) {
//       store.dispatch('setLoading', false); // 응답 성공 시 로딩 상태 비활성화
//     }
//     return response; // 응답 데이터 반환
//   },
//   (error) => {
//     // 응답 에러 처리
//     if (store && store._actions && store._actions.setLoading) {
//       store.dispatch('setLoading', false); // 응답 에러 시 로딩 상태 비활성화
//     }

//     // 예: 401 Unauthorized 에러 발생 시 로그인 페이지로 리다이렉트
//     if (error.response && error.response.status === 401) {
//       console.error('Unauthorized access. Redirecting to login.');
//       localStorage.removeItem('userToken'); // 유효하지 않은 토큰 제거
//       // 'auth' 모듈이 있고 'logout' 액션이 있다면
//       if (store && store.hasModule && store.hasModule('auth') && store._actions['auth/logout']) {
//         store.dispatch('auth/logout');
//       }
//       if (router) {
//         router
