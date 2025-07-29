import api from '@/utils/axios';

const PRODUCT_COLUMN_MAPPING = {
  D: {
    name: 'name',
    rate: 'rate',
    primeRate: 'primeRate',
    saveTerm: 'saveTerm',
    scrapCnt: 'scrapCnt',
    joinMember: 'joinMember',
    joinWay: 'joinWay',
    minimumCost: 'minimumCost',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    maxLimit: 'maxLimit',
    bonusCondition: 'bonusCondition',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
  },
  S: {
    name: 'name',
    rate: 'rate',
    primeRate: 'primeRate',
    saveTerm: 'saveTerm',
    scrapCnt: 'scrapCnt',
    joinMember: 'joinMember',
    joinWay: 'joinWay',
    minimumCost: 'minimumCost',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    maxLimit: 'maxLimit',
    rateType: 'rateType',
    saveType: 'saveType',
    bonusCondition: 'bonusCondition',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
  },
  F: {
    name: 'name',
    rate: 'rate',
    primeRate: 'rate',
    saveTerm: 'investmentType',
    scrapCnt: 'scrapCnt',
    joinMember: 'target',
    joinWay: 'investmentType',
    minimumCost: 'minimumCost',
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
    advantage: 'advantage',
    disadvantage: 'disadvantage',
  },
  X: {
    name: 'name',
    rate: 'rate',
    primeRate: 'rate',
    saveTerm: 'autoRenew',
    scrapCnt: 'scrapCnt',
    joinMember: 'target',
    joinWay: 'rateGiveWay',
    minimumCost: 'regFund',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    currency: 'currency',
    description: 'description',
    regLimitDate: 'regLimitDate',
    extraDeposit: 'extraDeposit',
    taxRefund: 'taxRefund',
    protect: 'protect',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
  },
  P: {
    name: 'name',
    rate: 'rate',
    primeRate: 'lastYearProfitRate',
    saveTerm: 'pensionType',
    scrapCnt: 'scrapCnt',
    joinMember: 'pensionKind',
    joinWay: 'pensionType',
    minimumCost: 'minimumGuaranteeRate',
    company: 'company',
    caution: 'caution',
    regLink: 'regLink',
    id: 'id',
    pensionKind: 'pensionKind',
    pensionType: 'pensionType',
    minGuaranteeRate: 'minGuaranteeRate',
    lastYearProfitRate: 'lastYearProfitRate',
    advantage: 'advantage',
    disadvantage: 'disadvantage',
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
