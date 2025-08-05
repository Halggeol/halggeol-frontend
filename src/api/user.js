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

export const requestJoin = async (body) => {
  try {
    const response = await api.post('/signup/request', body);
    return response;
  } catch (error) {
    console.error('Request Join API Error:', error);
    throw error;
  }
};

export const join = async (token, body) => {
  try {
    const response = await api.post(`/signup?token=${token}`, body);
    return response;
  } catch (error) {
    console.error('Join API Error:', error);
    throw error;
  }
};

export const login = async (body) => {
  try {
    const response = await api.post('/login', body);
    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

export const extendLogin = async () => {
  try {
    const response = await api.get('/login/extend');
    return response;
  } catch (error) {
    console.error('Extend Login API Error:', error);
    throw error;
  }
};

export const findEmail = async (body) => {
  try {
    const response = await api.post('/email/find', body);
    return response;
  } catch (error) {
    console.error('Find Email API Error:', error);
    throw error;
  }
};

export const requestPasswordReset = async (body) => {
  try {
    const response = await api.post('/password/reset/request', body);
    return response;
  } catch (error) {
    console.error('Request Password Reset API Error:', error);
    throw error;
  }
};

export const resetPassword = async (token, body) => {
  try {
    const response = await api.post(`/password/reset?token=${token}`, body);
    return response;
  } catch (error) {
    console.error('Reset Password API Error:', error);
    throw error;
  }
};
