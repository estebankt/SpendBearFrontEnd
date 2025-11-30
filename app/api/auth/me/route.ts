import { NextResponse, NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const session = await auth0.getSession(req);

    if (!session?.user) {
      return NextResponse.redirect(new URL('/api/auth/login', req.url));
    }

    const res = new Response(); // Create a dummy Response object for the signature
    const { token } = await auth0.getAccessToken(req, res);
    return NextResponse.json({ user: session.user, token }) as Response;
  } catch (error) {
    console.error('API /api/auth/me error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = (error as { status?: number })?.status || 500;
    return new NextResponse(message, { status });
  }
}
