import { jwtDecode } from 'jwt-decode';

export const isValidToken = () => {
  const token = sessionStorage.getItem('bearerToken');

  if (!token) {
    return false;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      sessionStorage.removeItem('bearerToken'); // Remove expired token
      return false;
    }
    return true;
  } catch (error) {
    //console.error("Error decoding token:", error);
    sessionStorage.removeItem('bearerToken'); // Remove invalid token
    return false;
  }
};

export const redirectToLogin = () => {
  window.location.href = '/';
};
