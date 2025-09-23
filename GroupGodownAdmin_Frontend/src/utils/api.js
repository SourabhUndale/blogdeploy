import axios from 'axios';
import { redirectToLogin } from './auth';

const api = axios.create();

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
