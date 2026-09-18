import { NextRequest, NextResponse } from 'next/server';
import { Token } from '@machado-repo/shared';

import { AUTH_COOKIE_NAME } from '@/app/modules/auth/constants';

type RoleEnum = 'USER' | 'ADMIN';

type SessionPayload = {
  exp?: number;
  role?: RoleEnum;
};

const isAdminOnlyCatalogPath = (pathname: string): boolean => {
  const normalizedPathname = pathname !== '/' ? pathname.replace(/\/$/, '') : pathname;

  if (normalizedPathname === '/catalog') {
    return true;
  }

  if (!normalizedPathname.startsWith('/catalog/')) {
    return false;
  }

  const segments = normalizedPathname.split('/').filter(Boolean);

  return segments.length === 2;
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const result = Token.tryCreate(token);

  if (!result.isOk) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = result.payload;

  if (payload?.role !== 'ADMIN' && isAdminOnlyCatalogPath(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/home?reason=forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/catalog/:path*'],
};
