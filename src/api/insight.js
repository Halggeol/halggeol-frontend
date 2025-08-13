import api from '@/utils/axios';
import { getInsightDetail } from '@/api/insight-detail';
import { mapRegretInsightResponse } from '@/api/insight-detail';

// ✅ 백엔드 API 호출 - round, type 파라미터로 상품 목록 가져오기
export const getInsightProducts = async (round = null, type = null) => {
  try {
    // type이 없으면 with-products 엔드포인트 사용 (모든 상품)
    if (!type) {
      const response = await api.get('/insight/with-products');
      
      // API 응답 구조 확인 후 안전하게 반환
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn('예상과 다른 API 응답 구조:', response.data);
        return [];
      }
    }
    
    // type이 있으면 기존 insight 엔드포인트 사용
    const params = new URLSearchParams();
    if (round !== null) params.append('round', round);
    if (type) params.append('type', type);
    
    const url = `/insight?${params.toString()}`;
    const response = await api.get(url);
    
    // API 응답 구조 확인 후 안전하게 반환
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn('예상과 다른 API 응답 구조:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching insight products:', error);
    return []; // 에러 시 빈 배열 반환
  }
};

// ✅ 회차별로 그룹화하여 반환하는 함수
const groupByRound = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return [];
  }
  
  const grouped = products.reduce((acc, product) => {
    const round = product.round;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(product);
    return acc;
  }, {});
  
  // 회차별 객체 배열로 변환
  return Object.keys(grouped)
    .sort((a, b) => Number(a) - Number(b))
    .map(round => ({
      round: Number(round),
      products: grouped[round]
    }));
};

// ✅ 통합된 데이터 로더 - 상품 목록 + 상세 데이터
export const getInsightList = async (round, productId, type = null) => {
  try {
    // 1. 상품 목록 조회 - type이 있으면 해당 타입의 모든 회차 데이터를 가져옴
    const productsData = await getInsightProducts(null, type);
    
    // 안전성 검사 강화
    if (!productsData) {
      throw new Error('Failed to fetch products data');
    }
    
    if (!Array.isArray(productsData)) {
      throw new Error('Products data is not an array');
    }
    
    if (productsData.length === 0) {
      throw new Error('No products found');
    }
    
    // API 응답이 평면 배열인지 회차별로 그룹화된 배열인지 확인
    const firstItem = productsData[0];
    let processedData = productsData;
    
    // 만약 첫 번째 아이템이 { round: number, products: [] } 형태가 아니라면
    // 평면 배열이므로 회차별로 그룹화해야 함
    if (firstItem && !firstItem.products && firstItem.productId) {
      processedData = groupByRound(productsData);
    }
    
    // 2. round 결정 로직
    let targetRound = round;
    let targetRoundData = null;
    
    if (targetRound) {
      // 요청된 round가 실제 데이터에 있는지 확인
      targetRoundData = processedData.find(p => p && p.round === targetRound);
    }
    
    if (!targetRoundData) {
      // 요청된 round가 없거나 처음 로드인 경우 마지막 회차 사용 (최신순)
      targetRoundData = processedData[processedData.length - 1];
      targetRound = targetRoundData?.round;
    }
    
    if (!targetRoundData) {
      throw new Error(`No round data found for round ${targetRound}`);
    }
    
    if (!targetRoundData.products) {
      throw new Error(`No products property found for round ${targetRound}`);
    }
    
    if (!Array.isArray(targetRoundData.products)) {
      throw new Error(`Products is not an array for round ${targetRound}`);
    }
    
    if (targetRoundData.products.length === 0) {
      throw new Error(`No products found for round ${targetRound}`);
    }
    
    // 3. productId 결정 로직
    let finalProductId = productId;
    
    // 요청된 productId가 해당 회차에 있는지 확인
    const productExists = targetRoundData.products.find(p => p && p.productId === finalProductId);
    
    if (!finalProductId || !productExists) {
      // productId가 없거나 해당 회차에 없으면 첫 번째 상품 선택
      finalProductId = targetRoundData.products[0]?.productId;
    }
    
    if (!finalProductId) {
      throw new Error('No valid product found');
    }
    
    // 4. 상세 데이터 불러오기 - 확실히 존재하는 round와 productId로 요청
    const detailData = await getInsightDetail(targetRound, finalProductId);
    
    return {
      productsData: processedData,
      detailData,
      round: targetRound,
      productId: finalProductId,
    };
  } catch (error) {
    console.error('Error fetching insight list:', error);
    // 에러 발생 시 기본 구조 반환
    return {
      productsData: [],
      detailData: null,
      round: null,
      productId: null,
      error: error.message
    };
  }
};