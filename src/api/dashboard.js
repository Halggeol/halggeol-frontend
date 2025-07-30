import api from '@/utils/axios';

/**
 * 대시보드 메인 데이터 조회
 * axios interceptor에서 자동으로 Bearer 토큰이 추가됩니다.
 *
 * @returns {Promise} API 응답 데이터
 */
export const getDashboardMain = async () => {
  try {
    const response = await api.get('/main');
    return response;
  } catch (error) {
    console.error('Dashboard API Error:', error);
    throw error;
  }
};
