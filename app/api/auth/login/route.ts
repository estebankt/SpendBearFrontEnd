import { NextRequest } from 'next/server';
import { auth0 } from '@/lib/auth0';

export async function GET(request: NextRequest) {
  // Access the internal authClient which has the handleLogin method
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authClient = (auth0 as any).authClient;
  if (!authClient || typeof authClient.handleLogin !== 'function') {
    return new Response('Auth client not properly initialized', { status: 500 });
  }
  return authClient.handleLogin(request);
}
