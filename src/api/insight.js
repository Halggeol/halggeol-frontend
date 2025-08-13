import api from '@/utils/axios';

export const getInsightProducts = async () => {
  try {
    const response = await api.get('/insight/with-products');
    return response.data;
  } catch (error) {
    console.error('Error fetching insight products:', error);
    throw error;
  }
};
