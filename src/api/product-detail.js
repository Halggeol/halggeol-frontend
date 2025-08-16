import api from '@/utils/axios';

const PRODUCT_COLUMN_MAPPING = {
  // Deposit (예금) - DepositDetailResponseDTO 기준
  D: {
    name: 'name',
    rate: 'rate',
    primeRate: 'primeRate',
    scrapCnt: 'scrapCnt',
    joinMember: 'joinMember',
    joinWay: 'joinWay',
    minimumCost: 'minLimit',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    maxLimit: 'maxLimit',
    bonusCondition: 'bonusCondition',
    rateType: 'rateType',
    endDate: 'endDate',
    joinDeny: 'joinDeny',
    score: 'score',
    risk: 'risk',
    viewCnt: 'viewCnt',
    regretCnt: 'regretCnt',
    minSaveTerm: 'minSaveTerm',
    maxSaveTerm: 'maxSaveTerm',
    description: 'description',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
    isScraped: 'isScraped',
  },

  // Savings (적금) - SavingsDetailResponseDTO 기준
  S: {
    name: 'name',
    rate: 'rate',
    primeRate: 'primeRate',
    scrapCnt: 'scrapCnt',
    joinMember: 'joinMember',
    joinWay: 'joinWay',
    minimumCost: 'minLimit',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    maxLimit: 'maxLimit',
    rateType: 'rateType',
    saveType: 'saveType',
    bonusCondition: 'bonusCondition',
    endDate: 'endDate',
    joinDeny: 'joinDeny',
    score: 'score',
    risk: 'risk',
    viewCnt: 'viewCnt',
    regretCnt: 'regretCnt',
    minSaveTerm: 'minSaveTerm',
    maxSaveTerm: 'maxSaveTerm',
    description: 'description',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
    isScraped: 'isScraped',
  },

  // Fund (펀드) - FundDetailResponseDTO 기준
  F: {
    name: 'name',
    rate: 'rate',
    scrapCnt: 'scrapCnt',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    fundPrice: 'fundPrice',
    fundPriceMovement: 'fundPriceMovement',
    ter: 'ter',
    category: 'category',
    theme: 'theme',
    investmentWarningGrade: 'investmentWarningGrade',
    upfrontFee: 'upfrontFee',
    managementFee: 'managementFee',
    minLimit: 'minLimit',
    target: 'target',
    investmentType: 'investmentType',
    score: 'score',
    risk: 'risk',
    viewCnt: 'viewCnt',
    regretCnt: 'regretCnt',
    description: 'description',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
    isScraped: 'isScraped',
  },

  // Forex (외화) - ForexDetailResponseDTO 기준
  X: {
    name: 'name',
    rate: 'rate',
    scrapCnt: 'scrapCnt',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    currency: 'currency',
    description: 'description',
    minLimit: 'minLimit',
    maxLimit: 'maxLimit',
    regLimitDate: 'regLimitDate',
    autoRenew: 'autoRenew',
    extraDeposit: 'extraDeposit',
    rateGiveWay: 'rateGiveWay',
    taxRefund: 'taxRefund',
    protect: 'protect',
    score: 'score',
    risk: 'risk',
    viewCnt: 'viewCnt',
    regretCnt: 'regretCnt',
    rateType: 'rateType',
    minSaveTerm: 'minSaveTerm',
    maxSaveTerm: 'maxSaveTerm',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
    isScraped: 'isScraped',
  },

  // Aggressive Pension (공격형 연금) - PensionDetailResponseDTO 기준
  A: {
    name: 'name',
    rate: 'rate',
    scrapCnt: 'scrapCnt',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    pensionPriceMovement: 'pensionPriceMovement',
    pensionKind: 'pensionKind',
    pensionType: 'pensionType',
    minGuaranteeRate: 'minGuaranteeRate',
    endDate: 'endDate',
    score: 'score',
    risk: 'risk',
    viewCnt: 'viewCnt',
    regretCnt: 'regretCnt',
    saveTerm: 'saveTerm',
    rateType: 'rateType',
    minLimit: 'minLimit',
    maxLimit: 'maxLimit',
    description: 'description',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
    isScraped: 'isScraped',
  },

  // Conservative Pension (안정형 연금) - PensionDetailResponseDTO 기준
  C: {
    name: 'name',
    rate: 'rate',
    scrapCnt: 'scrapCnt',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    pensionPriceMovement: 'pensionPriceMovement',
    pensionKind: 'pensionKind',
    pensionType: 'pensionType',
    minGuaranteeRate: 'minGuaranteeRate',
    endDate: 'endDate',
    score: 'score',
    risk: 'risk',
    viewCnt: 'viewCnt',
    regretCnt: 'regretCnt',
    saveTerm: 'saveTerm',
    rateType: 'rateType',
    minLimit: 'minLimit',
    maxLimit: 'maxLimit',
    description: 'description',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
    isScraped: 'isScraped',
  },
};

// 데이터값 매핑 및 추가 필드 생성
const normalizeProductData = rawData => {
  if (!rawData || !rawData.id) return rawData;

  const prefix = rawData.id.charAt(0).toUpperCase();
  const mapping = PRODUCT_COLUMN_MAPPING[prefix];

  if (!mapping) return rawData;

  const normalized = {};

  // 기본 매핑
  for (const [normalizedKey, sourceKey] of Object.entries(mapping)) {
    normalized[normalizedKey] = rawData[sourceKey];
  }

  normalized.productType = prefix; // 상품 타입

  switch (prefix) {
    case 'D': // 예금
    case 'S': // 적금
      normalized.primeRate = rawData.primeRate || rawData.rate; // primeRate가 없으면 rate 사용
      normalized.saveTerm = rawData.minSaveTerm || 0; // 기본 저축 기간
      normalized.minimumCost = rawData.minLimit || 0; // 최소 가입 금액
      break;

    case 'F': // 펀드
      normalized.primeRate = rawData.rate; // 펀드는 rate를 primeRate로 사용
      normalized.saveTerm = rawData.investmentType || ''; // 투자 유형을 기간 대신 사용
      normalized.joinMember = rawData.target || ''; // 투자 대상을 가입 대상으로 사용
      normalized.joinWay = rawData.investmentType || ''; // 투자 유형을 가입 방법으로 사용
      normalized.minimumCost = rawData.minLimit || 0;
      break;

    case 'X': // 외화
      normalized.primeRate = rawData.rate; // 외화는 rate를 primeRate로 사용
      normalized.saveTerm = rawData.autoRenew || ''; // 자동 연장을 기간 대신 사용
      normalized.joinMember = ''; // 통화를 가입 대상으로 사용
      normalized.joinWay = rawData.rateGiveWay || ''; // 금리 지급 방식을 가입 방법으로 사용
      normalized.minimumCost = rawData.minLimit || 0;
      break;

    case 'A': // 공격형 연금
    case 'C': // 안정형 연금
      normalized.primeRate = rawData.rate; // 연금은 rate를 primeRate로 사용
      normalized.saveTerm = rawData.pensionType || ''; // 연금 유형을 기간 대신 사용
      normalized.joinMember = ''; // 연금 종류를 가입 대상으로 사용
      normalized.joinWay = ''; // 연금 유형을 가입 방법으로 사용
      normalized.minimumCost = rawData.minGuaranteeRate || 0; // 최소 보장 이율을 최소 비용으로 사용
      break;
  }

  // 날짜 필드 포맷팅 (timestamp를 YYYY.MM.DD 형식으로 변환)
  const formatDate = timestamp => {
    if (!timestamp) return '';
    try {
      const date = new Date(parseInt(timestamp));
      const year = date.getFullYear().toString().slice(-2); // 뒤 2자리만
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch (error) {
      return '';
    }
  };

  // 날짜 필드들 포맷팅
  if (normalized.endDate) {
    normalized.endDate = formatDate(normalized.endDate);
  }
  if (normalized.regLimitDate) {
    normalized.regLimitDate = formatDate(normalized.regLimitDate);
  }

  return normalized;
};

export const getProductDetail = async productId => {
  const response = await api.get(`/products/detail/${productId}`);
  return {
    ...response,
    data: normalizeProductData(response.data),
  };
};

export const addScrap = productId => {
  return api.post('/scrap', {
    productId: productId,
  });
};

export const delScrap = productId => {
  return api.delete('/scrap', {
    data: {
      productId: productId,
    },
  });
};

export const checkRecommendProductStatus = async productId => {
  try {
    const response = await api.get(`/products/detail/${productId}/status`);
    return response.data;
  } catch (error) {
    console.error('추천 상품 상태 확인 실패:', error);
    throw error;
  }
};

export const updateProductStatus = async (productId, status) => {
  try {
    const response = await api.patch('/products/detail', {
      id: productId,
      status: status,
    });
    return response.data;
  } catch (error) {
    console.error('상품 상태 업데이트 실패:', error);
    throw error;
  }
};

export const analyzeProductWithGemini = async productDetail => {
  try {
    const response = await api.post('/gemini/analyze', productDetail, {
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error('Gemini Product Analysis API Error:', error);
    throw error;
  }
};
