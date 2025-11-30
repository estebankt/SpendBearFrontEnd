import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const session = await auth0.getSession(req);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get access token
    const res = new Response();
    const { token } = await auth0.getAccessToken(req, res);

    // Extract user info from Auth0 session
    const { email, name } = session.user;
    const [firstName, ...lastNameParts] = (name || email || '').split(' ');
    const lastName = lastNameParts.join(' ') || firstName;

    // Register user in backend
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/identity/register`,
      {
        email,
        firstName,
        lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('User registration error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data || error.message },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}
