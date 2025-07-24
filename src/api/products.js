import api from '@/utils/axios';

export const getProductDetail = productId => {
  return api.get(`/products/detail/${productId}`);
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
