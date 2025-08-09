import api from '@/utils/axios';

export const requestJoin = async body => {
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

export const login = async body => {
  try {
    const response = await api.post('/login', body);
    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.get('/logout');
    return response;
  } catch (error) {
    console.error('Logout API Error:', error);
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

export const resetPasswordWithoutLogin = async (token, body) => {
  try {
    const response = await api.post(`/password/reset?token=${token}`, body);
    return response;
  } catch (error) {
    console.error('Reset Password Without Login API Error:', error);
    throw error;
  }
};

export const resetPasswordWithLogin = async (body) => {
  try {
    const response = await api.patch('/password/reset', body);
    return response;
  } catch (error) {
    console.error('Reset Password With Login API Error:', error);
    throw error;
  }
};

export const reverifyPassword = async (body) => {
  try {
    const response = await api.post('/password/reverify', body);
    return response;
  } catch (error) {
    console.error('Reverify Password API Error:', error);
    throw error;
  }
};

export const viewProfile = async () => {
  try {
    const response = await api.get('/me');
    return response;
  } catch (error) {
    console.error('View Profile API Error:', error);
    throw error;
  }
};

export const syncMydata = async () => {
  try {
    const response = await api.get('/mydata');
    return response.data.authUrl;
  } catch (error) {
    console.error('Sync Mydata API Error:', error);
    throw error;
  }
};

export const leaveService = async () => {
  try {
    const response = await api.delete('/me');
    return response;
  } catch (error) {
    console.error('Delete Account API Error:', error);
    throw error;
  }
};

export const changeInsightCycle = async (body) => {
  try {
    const response = await api.patch('/me/update/cycle', body);
    return response;
  } catch (error) {
    console.error('Update Insight Cycle API Error:', error);
    throw error;
  }
}
