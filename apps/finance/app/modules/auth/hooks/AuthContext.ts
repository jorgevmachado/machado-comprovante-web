'use client';

import React from 'react';

import type { AuthState } from './types';

export type AuthContextProps = AuthState & {
  clearAuth: () => void;
};

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);