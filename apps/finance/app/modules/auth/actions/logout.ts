'use server';
import { clearAuthCookie } from '../session';

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
}