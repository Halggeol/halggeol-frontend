import api from '@/utils/axios';

/**
 * Get user's products list
 * @returns {Promise}
 */
export const getUserProductsList = async () => {
  try {
    const response = await api.get('/me/products');
    return response;
  } catch (error) {
    console.error('Get User Products List API Error:', error);
    throw error;
  }
};