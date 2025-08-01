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

export const analyzeProductWithGemini = async (productDetail) => {
  try {
    const response = await api.post('/gemini/analyze', productDetail);
    return response.data;
  } catch (error) {
    console.error('Gemini Product Analysis API Error:', error);
    throw error;
  }
};
