import api from '@/utils/axios';
import { getInsightDetail } from '@/api/insight-detail';

// ✅ 회차별 상품 목록 가져오기
export const getInsightProducts = async () => {
  try {
    const response = await api.get('/insight/with-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching insight products:', error);
    throw error;
  }
};

// ✅ round, productId 계산 + 상세 데이터 합쳐서 반환
export const getInsightList = async (round, productId) => {
  try {
    const productsData = await getInsightProducts();
    
    if (!Array.isArray(productsData) || productsData.length === 0) {
      throw new Error('No products found');
    }

    // round/productId 기본값 설정
    const targetRound = round || productsData[0].round;
    const targetRoundData = productsData.find(p => p.round === targetRound) || productsData[0];
    
    // 특정 productId가 주어졌으면 해당 상품 사용, 아니면 첫 번째 상품 사용
    let finalProductId;
    if (productId) {
      // productId가 현재 회차에 존재하는지 확인
      const productExists = targetRoundData.products?.find(p => p.productId === productId);
      finalProductId = productExists ? productId : targetRoundData.products?.[0]?.productId;
    } else {
      // productId가 없으면 첫 번째 상품 선택
      finalProductId = targetRoundData.products?.[0]?.productId;
    }
    
    const finalRound = targetRoundData.round;
    
    if (!finalProductId) {
      throw new Error('No valid product found');
    }

    // 상세 데이터 불러오기
    const detailData = await getInsightDetail(finalRound, finalProductId);

    return {
      productsData,
      detailData,
      round: finalRound,
      productId: finalProductId,
    };
  } catch (error) {
    console.error('Error fetching insight list:', error);
    throw error;
  }
};