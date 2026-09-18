import { redirect } from 'next/navigation';

import { getServerSession } from '@/app/modules/auth/session';

export default async function Home() {
  const session = await getServerSession();

  if(session.isAuthenticated) {
    redirect('/dashboard');
  }
  redirect('/join');

}
