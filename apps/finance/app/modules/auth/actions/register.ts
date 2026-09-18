'use server';
import { Token, HttpClient } from '@machado-repo/shared';

import { setAuthCookie } from '@/app/modules/auth/session';

export async function registerAction(data: Record<string, string>): Promise<{ status: string; message: string; }> {
  try {
    const client = await HttpClient.post<TUser>({
      path: '/auth/register',
      config: { body: data } ,
      baseUrl: process.env.API_BASE_URL,
    });

    if(client.isFailure) {
      return {
        status: 'error',
        message: 'auth.register.messages.error',
      };
    }
  } catch (error) {
    console.error('registerAction error:', error);
    return {
      status: 'error',
      message: 'auth.register.messages.error',
    };
  }
  redirect('/join');
  return {
    status: 'success',
    message: 'auth.register.messages.success',
  };
}