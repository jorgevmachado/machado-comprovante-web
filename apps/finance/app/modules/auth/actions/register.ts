'use server';
import { HttpClient } from '@machado-repo/shared';

import { TUser } from '@/app/modules/auth/types';
import { redirect } from 'next/navigation';

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
  redirect('/join');
}