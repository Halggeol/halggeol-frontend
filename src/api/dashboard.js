import api from '@/utils/axios';

export const getDashboardMain = async () => {
  try {
    const response = await api.get('/main');
    return response;
  } catch (error) {
    console.error('Dashboard API Error:', error);
    throw error;
  }
};
