import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/app/modules/auth/constants';
import { Token } from '@machado-repo/shared';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/join', request.url));
  }

  const result = Token.tryCreate(token);

  if(result.isFailure || result.instance.isExpired) {
    const response = NextResponse.redirect(new URL('/join', request.url));
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!join|_next/static|_next/image|favicon.ico).*)',
  ],
};