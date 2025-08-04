export const setAccessToken = (token) => {
  sessionStorage.setItem('accessToken', token);
};

export const getAccessToken = () => {
  return sessionStorage.getItem('accessToken');
};

export const clearAccessToken = () => {
  sessionStorage.removeItem('accessToken');
};

export const setUsername = (username) => {
  sessionStorage.setItem('username', username);
};

export const getUsername = () => {
  return sessionStorage.getItem('username');
};

export const clearUsername = () => {
  sessionStorage.removeItem('username');
};

export const parseToken = (token) => {
  const payload = token.split('.')[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // base64 디코딩
  return JSON.parse(decoded);
}

export const isValidToken = (parsedToken) => {
  const now = Math.floor(Date.now() / 1000);
  return (parsedToken.exp && parsedToken.exp > now);
}
