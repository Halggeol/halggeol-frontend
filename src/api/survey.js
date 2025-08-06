import api from '@/utils/axios';

/**
 * @returns {Promise}
 */
export const initKnowledgeSurvey = async (body) => {
  try {
    const response = await api.patch('/survey/knowledge/init', body);
    return response;
  } catch (error) {
    console.error('Init Knowledge Survey API Error:', error);
    throw error;
  }
};

export const updateKnowledgeSurvey = async (body) => {
  try {
    const response = await api.patch('/survey/knowledge', body);
    return response;
  } catch (error) {
    console.error('Knowledge Survey API Error:', error);
    throw error;
  }
};
