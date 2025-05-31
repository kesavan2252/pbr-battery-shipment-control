import axios from 'axios';
import Cookies from 'js-cookie'; // Optional: for storing token in cookies

const api = axios.create({
  baseURL:  'http://localhost:5000/api', // Ensure this points to your backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Get token from cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/invalidity
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized and not login/register route, assume token issue
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth')) {
      console.log('Unauthorized request, logging out...');
      Cookies.remove('token');
      localStorage.removeItem('user'); // Or clear from Redux store
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default api;