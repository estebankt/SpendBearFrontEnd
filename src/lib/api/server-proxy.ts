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
      console.log('[PROXY] getAccessToken() returned:', JSON.stringify(tokenResponse).slice(0, 300));
    } catch (tokenError) {
      console.error('[PROXY] getAccessToken() THREW an error:', tokenError);
      return NextResponse.json({ error: 'Unauthorized', detail: String(tokenError) }, { status: 401 });
    }
    const token = tokenResponse?.token;

    if (!token) {
      console.error('[PROXY] No token in response. Full tokenResponse:', tokenResponse);
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
        // No body — that's fine for some POST requests
      }
    }

    console.log(`[PROXY] ${req.method} ${url.toString()} (token: ${token ? 'present' : 'MISSING'})`);

    const response = await fetch(url.toString(), fetchOptions);

    console.log(`[PROXY] Response: ${response.status} ${response.statusText} from ${url.toString()}`);

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Try to parse JSON response
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log(`[PROXY] JSON data from ${backendPath}:`, JSON.stringify(data).slice(0, 500));
      return NextResponse.json(data, { status: response.status });
    }

    // Non-JSON response
    const text = await response.text();
    console.log(`[PROXY] Non-JSON response from ${backendPath}:`, text.slice(0, 200));
    return new NextResponse(text, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error('Proxy error:', message, stack);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend', detail: message },
      { status: 502 }
    );
  }
}
