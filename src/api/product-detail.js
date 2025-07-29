import api from '@/utils/axios';

const PRODUCT_COLUMN_MAPPING = {
  D: {
    name: 'name',
    rate: 'rate',
    primeRate: 'prime_rate',
    saveTerm: 'save_term',
    scrapCnt: 'scrap_cnt',
    joinMember: 'join_member',
    joinWay: 'join_way',
    minimumCost: 'minimum_cost',
    company: 'company',
    caution: 'caution',
    regLink: 'reg_link',
    id: 'id',
    maxLimit: 'max_limit',
    bonusCondition: 'bonus_condition',
  },
  S: {
    name: 'name',
    rate: 'rate',
    primeRate: 'prime_rate',
    saveTerm: 'save_term',
    scrapCnt: 'scrap_cnt',
    joinMember: 'join_member',
    joinWay: 'join_way',
    minimumCost: 'minimum_cost',
    company: 'company',
    caution: 'caution',
    regLink: 'reg_link',
    id: 'id',
    maxLimit: 'max_limit',
    rateType: 'rate_type',
    saveType: 'save_type',
    bonusCondition: 'bonus_condition',
  },
  F: {
    name: 'name',
    rate: 'rate',
    primeRate: 'rate',
    saveTerm: 'investment_type',
    scrapCnt: 'scrap_cnt',
    joinMember: 'target',
    joinWay: 'investment_type',
    minimumCost: 'minimum_cost',
    company: 'company',
    caution: 'caution',
    regLink: 'reg_link',
    id: 'id',
    fundPrice: 'fund_price',
    fundPriceMovement: 'fund_price_movement',
    TER: 'TER',
    category: 'category',
    theme: 'theme',
    investmentWarningGrade: 'investment_warning_grade',
    upfrontFee: 'upfront_fee',
    managementFee: 'management_fee',
  },
  X: {
    name: 'name',
    rate: 'rate',
    primeRate: 'rate',
    saveTerm: 'auto_renew',
    scrapCnt: 'scrap_cnt',
    joinMember: 'target',
    joinWay: 'rate_give_way',
    minimumCost: 'reg_fund',
    company: 'company',
    caution: 'caution',
    regLink: 'reg_link',
    id: 'id',
    currency: 'currency',
    description: 'description',
    regLimitDate: 'reg_limit_date',
    extraDeposit: 'extra_deposit',
    taxRefund: 'tax_refund',
    protect: 'protect',
  },
  P: {
    name: 'name',
    rate: 'rate',
    primeRate: 'last_year_profit_rate',
    saveTerm: 'pension_type',
    scrapCnt: 'scrap_cnt',
    joinMember: 'pension_kind',
    joinWay: 'pension_type',
    minimumCost: 'minimum_guarantee_rate',
    company: 'company',
    caution: 'caution',
    regLink: 'reg_link',
    id: 'id',
    pensionKind: 'pension_kind',
    pensionType: 'pension_type',
    minGuaranteeRate: 'min_guarantee_rate',
    lastYearProfitRate: 'last_year_profit_rate',
  },
};

const normalizeProductData = rawData => {
  if (!rawData || !rawData.id) return rawData;

  const prefix = rawData.id.charAt(0).toUpperCase();
  const mapping = PRODUCT_COLUMN_MAPPING[prefix];

  if (!mapping) return rawData;

  const normalized = {};
  for (const [normalizedKey, sourceKey] of Object.entries(mapping)) {
    normalized[normalizedKey] = rawData[sourceKey];
  }

  return normalized;
};

export const getProductDetail = async productId => {
  const response = await api.get(`/products/detail/${productId}?userId=1`);
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
    productId: productId,
  });
};
