import type { AuthState, AuthUser } from './types';

export const TOKEN_COOKIE = 'auth_token';
export const USER_COOKIE = 'auth_user';
export const COOKIE_OPTIONS = 'path=/; SameSite=Lax; max-age=1296000';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string, options: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; ${options}`;
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}

export function readAuthFromCookies(): AuthState {
  const token = getCookie(TOKEN_COOKIE);
  if (!token) return { token: null, user: null, isAuthenticated: false };
  const userRaw = getCookie(USER_COOKIE);
  if (!userRaw) return { token: null, user: null, isAuthenticated: false };
  try {
    return { token, user: JSON.parse(userRaw) as AuthUser, isAuthenticated: true };
  } catch {
    return { token: null, user: null, isAuthenticated: false };
  }
}