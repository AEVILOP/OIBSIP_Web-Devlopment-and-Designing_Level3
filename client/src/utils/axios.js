import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;
let accessToken = null;
let refreshPromise = null;

export const setApiAccessToken = (token) => {
  accessToken = token;
};

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = axios.post(
      `${baseURL}/auth/refresh-token`,
      undefined,
      { withCredentials: true, timeout: 15000 },
    ).then(({ data }) => {
      setApiAccessToken(data.accessToken);
      window.dispatchEvent(new CustomEvent('auth:refreshed', { detail: data }));
      return data.accessToken;
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const expired = error.response?.status === 401
      && error.response?.data?.code === 'TOKEN_EXPIRED';

    if (expired && !original?._retried) {
      original._retried = true;
      try {
        const token = await refreshSession();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (_refreshError) {
        setApiAccessToken(null);
        window.dispatchEvent(new Event('auth:expired'));
      }
    }

    if (!original?._silent) {
      if (!error.response) toast.error('Connection failed. Check your internet.');
      else if (error.response.status >= 500) toast.error('Something went wrong on our end. Try again.');
    }
    return Promise.reject(error);
  },
);

export const apiError = (error, fallback = 'Unable to complete that request') => (
  error.response?.data?.error
  || error.response?.data?.details?.[0]?.message
  || fallback
);

export default api;
