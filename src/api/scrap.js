import api from '@/utils/axios';

// 찜한 상품 ID 목록 조회
export const getScrapedProductIds = async () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) return [];

  try {
    // 이 API는 [{productId: 'A'}, {productId: 'B'}] 형태의 객체 배열을 반환합니다.
    const response = await api.get('/scrap');

    // ✅ map() 함수를 사용해 각 객체에서 productId만 추출하여 새로운 배열을 만듭니다.
    const idList = response.data.map(item => item.productId);

    // 최종적으로 ID 배열 ['A', 'B']를 반환합니다.
    return idList;
  } catch (error) {
    console.error('관심상품 ID 목록 조회 실패:', error);
    return [];
  }
};
