import api from '@/utils/axios';

/**
 * @returns {Promise}
 */
export const getUserProducts = async () => {
  try {
    const response = await api.get('/me/products');
    return response;
  } catch (error) {
    console.error('User Products API Error:', error);
    throw error;
  }
};
