import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, checkServerStatus } from '../lib/actions';
import { useProfile } from './profile-context';
import axiosInstance, { setAuthToken } from '../lib/axios-instance';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  isServerRunning: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isServerRunning, setIsServerRunning] = useState<boolean>(false);
  const { setProfile } = useProfile();

  const checkAuthStatus = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const user = jwtDecode(accessToken) as { exp: number };
        const isExpired = Date.now() >= user.exp * 1000;

        if (!isExpired) {
          setIsAuthenticated(true);
          await fetchUserProfile();
        } else {
          await refreshToken();
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const checkServerAndAuthStatus = async () => {
      try {
        const status = await checkServerStatus();
        setIsServerRunning(status === "running");
      } catch (error) {
        console.error('Error checking server status:', error);
        setIsServerRunning(false);
      }

      if (isServerRunning) {
        await checkAuthStatus();
      }
    };

    checkServerAndAuthStatus();
  }, [isServerRunning]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/profile/');
      setProfile({
        username: response.data.username,
        email: response.data.email,
        id: response.data.id,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await axiosInstance.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      setAuthToken(response.data.access);
      localStorage.setItem('accessToken', response.data.access);
      setIsAuthenticated(true);
      await fetchUserProfile();
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser(username, password);
      if (response.status === 200) {
        const { access, refresh } = response.data;
        setAuthToken(access);
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setIsAuthenticated(true);
        setProfile({
          username: response.data.username,
          email: response.data.email,
          id: response.data.id,
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuthToken(null);
    setIsAuthenticated(false);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, isServerRunning, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};