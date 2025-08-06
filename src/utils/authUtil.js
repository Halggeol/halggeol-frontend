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

export const getTokenIfExists = () => {
  const token = new URLSearchParams(window.location.search).get('token');

  if (token === null) {
    console.error('토큰 누락');
    return null;
  }

  return token;
}

export const getEmailFromToken = (token) => {
  if (token === null)
    return null;

  try {
    return parseToken(token).sub;
  } catch (e) {
    console.error('토큰 형식 오류: ', e);
    return null;
  }
}

export const parseToken = (token) => {
  const payload = token.split('.')[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // base64 디코딩
  return JSON.parse(decoded);
}

export const isValidToken = (parsedToken) => {
  const now = Math.floor(Date.now() / 1000);
  return (parsedToken.exp && parsedToken.exp > now);
}

export const getTokenRemainingSeconds = () => {
  const token = getAccessToken();
  if (!token) return 0;

  const parsedToken = parseToken(token);
  if (!parsedToken.exp) return 0;

  const now = Math.floor(Date.now() / 1000);
  return parsedToken.exp - now;
}
