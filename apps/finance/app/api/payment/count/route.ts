import { NextRequest ,NextResponse } from 'next/server';
import { getServerSession } from '@/app/modules/auth/session';
import { HttpClient } from '@machado-repo/shared';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession();

  if (!session.isAuthenticated || !session.token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const response = await HttpClient.get<{ count: number }>({
      path: '/finance/payment/summary/count',
      config: {
        token: session.token,
        params
      },
    });
    if(response.isFailure) {
      return NextResponse.json({ message: response.error }, { status: 422 });
    }
    return NextResponse.json(response.instance);
  } catch (error) {
    const message = error instanceof Error && error.message ? error.message : 'Could not load payment count.';
    return NextResponse.json({ message }, { status: 500 });
  }
}