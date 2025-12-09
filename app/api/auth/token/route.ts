import { NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

/**
 * GET /api/auth/token
 *
 * Returns the Auth0 access token for the current user.
 * Used by the API client to inject the token into requests.
 */
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Use ID token instead of access token since access token is encrypted (JWE)
    // ID token is a readable JWT that the backend can validate
    const accessToken = session.tokenSet?.idToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error fetching access token:', error);
    return NextResponse.json(
      { error: 'Failed to fetch access token' },
      { status: 500 }
    );
  }
}
