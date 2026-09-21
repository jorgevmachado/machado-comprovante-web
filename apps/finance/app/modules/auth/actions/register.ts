'use server';
import { HttpClient } from '@machado-repo/shared';

import type { TUser } from '@/app/modules/auth/types';

export async function registerAction(data: Record<string, string>): Promise<{ status: string; message: string; }> {
  try {
    const client = await HttpClient.post<TUser>({
      path: '/auth/register',
      config: { body: data }
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
  return {
    status: 'success',
    message: 'auth.register.messages.success',
  }
}