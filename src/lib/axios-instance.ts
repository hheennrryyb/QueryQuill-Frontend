import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    const user = jwtDecode(accessToken);
    const isExpired = Date.now() >= (user as any)?.exp * 1000 || true;

    if (!isExpired) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      const refreshToken = localStorage.getItem('refreshToken');

      try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL+'/api/token/refresh/', {
          refresh: refreshToken
        });

        localStorage.setItem('accessToken', response.data.access);
        config.headers.Authorization = `Bearer ${response.data.access}`;
      } catch (error) {
        // Refresh token has expired or is invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login page or show login modal
        window.location.href = '/login';
      }
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// axiosInstance.interceptors.response.use(
//     (response) => {
//       console.log('Response:', response);  // Debugging line
//       return response;
//     },
//     (error) => {
//       console.error('Response Error:', error.response);  // Debugging line
//       return Promise.reject(error);
//   }
// );

export const setAuthToken = (token: any) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export default axiosInstance;