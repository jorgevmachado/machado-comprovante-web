'use server';
import { Token, HttpClient } from '@machado-repo/shared';

import type { TUser } from '../types';

export const getAuthenticatedUser = async (token?: string): Promise<TUser | undefined> => {
  if (!token) {
    return undefined;
  }

  const client = await HttpClient.get<TUser>({
    path: '/auth/me',
    config: { token } ,
  });

  if(client.isFailure || !client.instance) {
    return;
  }

  return client.instance as TUser;
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

  if(!tokenValueObject.isOk) {
    return {
      initialUser: undefined,
      tokenExpiresAt: undefined,
    }
  }

  const tokenExpiresAt = tokenValueObject.instance.expiration;

  const initialUser = await getAuthenticatedUser(token);

  return {
    initialUser ,
    tokenExpiresAt,
  };
};