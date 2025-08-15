import api from '@/utils/axios';

export const getInsightProducts = async () => {
  try {
    // const response = await api.get('/insight/with-products');
    const response = await api.get('/insight'); // 수정한 API로 추후 변경
    return response.data;
  } catch (error) {
    console.error('Error fetching insight products:', error);
    return []; // 에러 시 빈 배열 반환
  }
};
