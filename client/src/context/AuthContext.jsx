import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import axios from 'axios';
import api, { setApiAccessToken } from '../utils/axios';

const AuthContext = createContext(null);
const apiRoot = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((data) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setApiAccessToken(data.accessToken);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setApiAccessToken(null);
  }, []);

  useEffect(() => {
    let active = true;
    axios.post(`${apiRoot}/auth/refresh-token`, undefined, {
      withCredentials: true,
      timeout: 15000,
    }).then(({ data }) => {
      if (active) applySession(data);
    }).catch(() => {
      if (active) clearSession();
    }).finally(() => {
      if (active) setIsLoading(false);
    });

    const refreshed = (event) => applySession(event.detail);
    const expired = () => clearSession();
    window.addEventListener('auth:refreshed', refreshed);
    window.addEventListener('auth:expired', expired);
    return () => {
      active = false;
      window.removeEventListener('auth:refreshed', refreshed);
      window.removeEventListener('auth:expired', expired);
    };
  }, [applySession, clearSession]);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    applySession(data);
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearSession();
    }
  };

  const value = useMemo(() => ({
    user,
    accessToken,
    isLoading,
    isAuthenticated: Boolean(user && accessToken),
    login,
    logout,
  }), [user, accessToken, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
