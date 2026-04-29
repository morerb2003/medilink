/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import {
  clearAccessToken,
  setAccessToken,
  setUnauthorizedHandler,
} from '../services/api';
import { isExpired, parseToken } from '../utils/jwtHelper';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState({
    token: null,
    role: null,
    userId: null,
  });

  const isAuthenticated = Boolean(session.token) && !isExpired(session.token);

  function clearSession() {
    clearAccessToken();
    setSessionState({
      token: null,
      role: null,
      userId: null,
    });
  }

  function setSession(nextSession) {
    const token = nextSession?.accessToken ?? null;
    const parsedToken = parseToken(token);
    const role = nextSession?.role ?? parsedToken?.role ?? null;
    const userId = nextSession?.userId ?? parsedToken?.sub ?? null;

    setAccessToken(token);
    setSessionState({
      token,
      role,
      userId,
    });
  }

  async function login(credentials) {
    const response = await authService.login(credentials);
    setSession(response);
    return response;
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  }

  async function refreshToken() {
    if (!session.token) {
      return null;
    }

    const response = await authService.refresh(session.token);
    setSession(response);
    return response;
  }

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  useEffect(() => {
    setAccessToken(isAuthenticated ? session.token : null);
  }, [isAuthenticated, session.token]);

  return (
    <AuthContext.Provider
      value={{
        token: session.token,
        role: session.role,
        userId: session.userId,
        isAuthenticated,
        login,
        logout,
        refreshToken,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
