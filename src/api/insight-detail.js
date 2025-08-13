import api from '@/utils/axios';

export const getInsightDetail = async (round, productId) => {
  const response = await api.get(`/insight/${round}/products/${productId}`);
  return response.data;
};

export const submitRegretSurvey = async surveyData => {
  const response = await api.patch(`/insight/feedback`, surveyData);
  return response.data;
};

// 후회 인사이트
// 후회 시뮬레이션 그래프
export const mapRegretInsightResponse = data => {
  return (data.profits || []).map(item => ({
    date: item.date ?? null,
    asset: item.asset ?? null,
    lostAsset: item.lostAsset ?? null,
  }));
};

// 후회 시뮬레이션 카드
export const mapRegretSimulationResponse = data => {
  if (!data) {
    return {
      prefix: null,
      asset: null,
      isCompound: null,
      rate: null,
      saveTerm: null,
      minLimit: null,
      maxLimit: null,
    };
  }
  const prefix = data.id[0];
  const asset = data.forexInfo?.[0]?.asset ?? data.profits?.[0]?.asset;
  const isAggressive = prefix === 'A' || prefix === 'F';
  const saveTerm = isAggressive
    ? getSaveTerm(data.recDate, data.anlzDate)
    : (data.saveTerm ?? 12);
  const minLimit = data.minLimit ?? 10000;
  const maxLimit = data.maxLimit ?? 50000000;

  return {
    prefix,
    asset: asset,
    isCompound: data.isCompound,
    interestRate: data.interestRate,
    saveTerm: saveTerm,
    minLimit: minLimit,
    maxLimit: maxLimit,
  };
};

// 후회 날씨
export const mapRegretWeatherResponse = data => {
  if (!data) {
    return {
      regretScore: null,
      missAmount: null,
    };
  }
  return {
    regretScore: data.regretScore,
    missAmount: data.missAmount,
  };
};

// AI 요약
export const mapAISummaryResponse = data => {
  if (!data) {
    return {
      summary: null,
      good: null,
      bad: null,
    };
  }
  return {
    summary: data.description,
    good: data.advantage,
    bad: data.disadvantage,
  };
};

// 후회 피드백 설문
export const mapRegretFeedbackResponse = data => {
  if (!data) {
    return {
      userName: null,
      productId: null,
      isSurveyed: null,
      isRegretted: null,
      regrettedReason: null,
    };
  }
  return {
    userName: data.name,
    productId: data.id,
    isSurveyed: data.isSurveyed,
    isRegretted: data.isRegretted,
    regrettedReason: data.regrettedReason,
  };
};

// 유사상품
export const mapSimilarProductsResponse = data => {
  return (data.similarProducts || []).map(item => ({
    productId: item.dto?.id ?? null,
    name: item.dto?.name ?? null,
    matchScore: item.score != null ? Math.floor(item.score * 100) : null,
  }));
};

function getSaveTerm(start, end) {
  if (!start || !end) return null;

  const startDate = new Date(start);
  const endDate = new Date(end);

  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();
  // const dateDiff = endDate.getDate() - startDate.getDate();

  return yearDiff * 12 + monthDiff;
}
