export const setAccessToken = (token) => {
  sessionStorage.setItem('accessToken', token);
};

export const getAccessToken = () => {
  return sessionStorage.getItem('accessToken');
};

export const clearAccessToken = () => {
  sessionStorage.removeItem('accessToken');
};

export const parseToken = (token) => {
  const payload = token.value.split('.')[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // base64 디코딩
  return JSON.parse(decoded);
}

export const isValidToken = (parsedToken) => {
  const now = Math.floor(Date.now() / 1000);
  return (parsedToken.exp && parsedToken.exp > now);
}
