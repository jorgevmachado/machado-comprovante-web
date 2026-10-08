import { redirect } from 'next/navigation';

import { getServerSession } from '@/src/server/auth';
import Home from '../page';

jest.mock('next/navigation', () => ({
  redirect: jest.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

jest.mock('@/src/server/auth', () => ({
  getServerSession: jest.fn(),
}));

describe('home route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects authenticated users to the home page', async () => {
    jest.mocked(getServerSession).mockResolvedValue({
      isAuthenticated: true,
    });

    await expect(Home()).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/home');
  });

  it('redirects unauthenticated users to join', async () => {
    jest.mocked(getServerSession).mockResolvedValue({
      isAuthenticated: false,
    });

    await expect(Home()).rejects.toThrow('NEXT_REDIRECT');

    expect(redirect).toHaveBeenCalledWith('/join');
  });
});
