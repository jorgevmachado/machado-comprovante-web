/** @jest-environment node */

import { NextRequest } from 'next/server';

import { Token } from '@machado-repo/shared';

import { proxy } from '../proxy';

describe('auth proxy expiration handling', () => {
  it('returns 401 and clears the cookie for expired API sessions', async () => {
    const token = Token.generate({ seconds: -1, signature: 'test' });
    const request = new NextRequest('http://localhost/api/payment');
    request.cookies.set('auth-token', token);

    const response = await proxy(request);

    expect(response.status).toBe(401);
    expect(response.headers.get('set-cookie')).toContain('auth-token');
    expect(response.headers.get('set-cookie')).toContain('Expires=Thu, 01 Jan 1970');
  });

  it('redirects expired page sessions to join and clears the cookie', async () => {
    const token = Token.generate({ seconds: -1, signature: 'test' });
    const request = new NextRequest('http://localhost/payment');
    request.cookies.set('auth-token', token);

    const response = await proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/join');
    expect(response.headers.get('set-cookie')).toContain('auth-token');
  });

  it('does not expire a valid API session', async () => {
    const token = Token.generate({ seconds: 60, signature: 'test' });
    const request = new NextRequest('http://localhost/api/payment');
    request.cookies.set('auth-token', token);

    const response = await proxy(request);

    expect(response.status).toBe(200);
  });
});
