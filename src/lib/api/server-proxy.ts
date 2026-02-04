import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5109';

export async function proxyToBackend(
  req: NextRequest,
  backendPath: string
): Promise<NextResponse> {
  try {
    let tokenResponse;
    try {
      tokenResponse = await auth0.getAccessToken();
    } catch (tokenError) {
      return NextResponse.json({ error: 'Unauthorized', detail: String(tokenError) }, { status: 401 });
    }
    const token = tokenResponse?.token;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build the full URL with query params
    const url = new URL(backendPath, BACKEND_URL);
    req.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Build fetch options
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    // Attach body for non-GET requests
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      try {
        const body = await req.json();
        fetchOptions.body = JSON.stringify(body);
      } catch {
        // No body — that's fine for some requests
      }
    }

    const response = await fetch(url.toString(), fetchOptions);

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Try to parse JSON response (includes application/problem+json from ASP.NET Core)
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('json')) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // Non-JSON response
    const text = await response.text();
    return new NextResponse(text, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[PROXY] Error:', message);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend', detail: message },
      { status: 502 }
    );
  }
}
