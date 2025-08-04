import api from '@/utils/axios';

export const requestJoin = async body => {
  try {
    const response = await api.post('/signup/request', body);
    return response;
  } catch (error) {
    console.error('User requestJoin API Error:', error);
    throw error;
  }
};

export const join = async (token, body) => {
  try {
    const response = await api.post('/signup?token=' + token, body);
    return response;
  } catch (error) {
    console.error('User Join API Error:', error);
    throw error;
  }
};

export const login = async body => {
  try {
    const response = await api.post('/login', body);
    return response;
  } catch (error) {
    console.error('User Login API Error:', error);
    throw error;
  }
};
