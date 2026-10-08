'use server';
import { clearAuthCookie } from '@/src/server/auth';

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
}