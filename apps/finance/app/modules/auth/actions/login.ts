'use server';
import { redirect } from 'next/navigation';
import { Token, HttpClient } from '@machado-repo/shared';

import { setAuthCookie } from '@/app/modules/auth/session';

export async function loginAction(data: Record<string, string>): Promise<{ status: string; message: string; }> {
  console.log('#############################################################1')
  console.log('#############################################################2')
  console.log('#############################################################3')
  try {
    const { email, password } = data;

    const client = await HttpClient.post<{ access_token: string }>({
      path: '/auth/login',
      config: { body: { credential: email, password } }
    });
    if(client.isFailure) {
      return {
        status: 'error',
        message: 'auth.login.messages.error',
      };
    }
    const instance = client.instance
    const token = instance.access_token;
    await setAuthCookie(token);
  } catch (error) {
    console.error('loginAction error:', error);
    return {
      status: 'error',
      message: 'auth.login.messages.error',
    };
  }
  redirect('/home');
  return {
    status: 'success',
    message: 'auth.login.messages.success',
  };
}