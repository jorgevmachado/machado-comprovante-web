import { Token, HttpClient, Result } from '@machado-repo/shared';

import type { TUser } from '../types';

import { clearAuthCookie } from '../session';

export const getAuthenticatedUser = async (token?: string): Promise<TUser | undefined> => {
  if (!token) {
    return undefined;
  }

  try {
    const client = await HttpClient.get<TUser>({
      path: '/auth/me',
      config: { token } ,
    });

    if(client.isFailure) {
      if(client.error.statusCode === 401) {
        await clearAuthCookie();
      }
      return Result.fail('auth.me.messages.error');
    }

    return client.instance as TUser;
  } catch (error) {
    const responseError = error as ResponseError | undefined;

    if (responseError?.statusCode === 401) {
      await clearAuthCookie();
    }

    return undefined;
  }
}

export const getAuthenticatedUserBootstrap = async (
  isAuthenticated: boolean ,
  token?: string ,
): Promise<{ initialUser?: TUser; tokenExpiresAt?: number }> => {

  if (!isAuthenticated || !token) {
    return {
      initialUser: undefined ,
      tokenExpiresAt: undefined ,
    };
  }

  const tokenValueObject = Token.tryCreate(token);
  const tokenExpiresAt = tokenValueObject.isOk ? tokenValueObject.instance.expiration : undefined;

  const initialUser = await getAuthenticatedUser(token);

  return {
    initialUser ,
    tokenExpiresAt,
  };
};