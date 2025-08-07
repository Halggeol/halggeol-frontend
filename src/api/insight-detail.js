import api from '@/utils/axios';

const baseUrl = `/insight/details`;

export const getInsightDetail = async (round, productId) => {
  const response = await api.get(baseUrl, { params: { round, productId } });
  return response.data;
};

export const submitRegretSurvey = async surveyData => {
  const response = await api.patch(baseUrl, surveyData);
  return response.data;
};

// 후회 인사이트
// 후회 시뮬레이션 그래프

// 후회 시뮬레이션 카드
export const mapRegretSimulationResponse = data => {
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
    rate: data.interestRate,
    saveTerm: saveTerm,
    minLimit: minLimit,
    maxLimit: maxLimit,
  };
};

// 후회 날씨
export const mapRegretWeatherResponse = data => {
  return {
    regretScore: data.regretScore,
    missAmount: data.missAmount,
  };
};

// AI 요약
export const mapAISummaryResponse = data => {
  return {
    summary: data.description,
    good: data.advantage,
    bad: data.disadvantage,
  };
};

// 후회 피드백 설문
export const mapRegretFeedbackResponse = data => {
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
  const startDate = new Date(start);
  const endDate = new Date(end);

  const yearDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthDiff = endDate.getMonth() - startDate.getMonth();

  return yearDiff * 12 + monthDiff;
}
