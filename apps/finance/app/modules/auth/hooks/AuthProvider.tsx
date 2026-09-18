'use client';
import React, { useMemo, useState, useCallback } from 'react';

import { AuthContext, type AuthContextProps } from './AuthContext';
import type { AuthState } from './types';
import { readAuthFromCookies, removeCookie, TOKEN_COOKIE, USER_COOKIE } from './business';

type AuthProviderProps = {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(readAuthFromCookies);

  const clearAuth = useCallback(() => {
    removeCookie(TOKEN_COOKIE);
    removeCookie(USER_COOKIE);
    setState({ token: null, user: null, isAuthenticated: false });
  }, []);

  const contextValue = useMemo(() => ({
    ...state,
    clearAuth,
  }), [state, clearAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;