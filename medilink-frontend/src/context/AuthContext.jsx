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
    refreshToken: null,
    role: null,
    userId: null,
  });

  const isAuthenticated = Boolean(session.token) && !isExpired(session.token);

  function clearSession() {
    clearAccessToken();
    setSessionState({
      token: null,
      refreshToken: null,
      role: null,
      userId: null,
    });
  }

  function setSession(nextSession) {
    const token = nextSession?.accessToken ?? null;
    const refreshToken = nextSession?.refreshToken ?? session.refreshToken ?? null;
    const parsedToken = parseToken(token);
    const role = nextSession?.role ?? parsedToken?.role ?? null;
    const userId = nextSession?.userId ?? parsedToken?.userId ?? null;

    setAccessToken(token);
    setSessionState({
      token,
      refreshToken,
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
      await authService.logout(session.refreshToken);
    } finally {
      clearSession();
    }
  }

  async function refreshSession() {
    if (!session.refreshToken) {
      return null;
    }

    const response = await authService.refresh(session.refreshToken);
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
        refreshToken: session.refreshToken,
        role: session.role,
        userId: session.userId,
        isAuthenticated,
        login,
        logout,
        refreshSession,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
