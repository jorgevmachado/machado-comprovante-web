export type AuthUser = any;

export type AuthState = {
  user?: AuthUser;
  token?: string;
  isAuthenticated: boolean;
}