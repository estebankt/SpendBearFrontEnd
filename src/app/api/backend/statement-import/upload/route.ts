import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth0';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5109';

export async function POST(req: NextRequest) {
  console.log('[UPLOAD] Starting upload request');

  try {
    console.log('[UPLOAD] Getting access token...');
    let tokenResponse;
    try {
      tokenResponse = await auth0.getAccessToken();
      console.log('[UPLOAD] Token response received:', !!tokenResponse?.token);
    } catch (tokenError) {
      console.error('[UPLOAD] Token error:', tokenError);
      return NextResponse.json({ error: 'Unauthorized', detail: String(tokenError) }, { status: 401 });
    }
    const token = tokenResponse?.token;

    if (!token) {
      console.error('[UPLOAD] No token available');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the form data from the request
    console.log('[UPLOAD] Reading form data...');
    const incomingFormData = await req.formData();
    const file = incomingFormData.get('file');
    console.log('[UPLOAD] File received:', file ? `${(file as File).name} (${(file as File).size} bytes)` : 'null');

    if (!file || !(file instanceof Blob)) {
      console.error('[UPLOAD] No file or invalid file type');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Create new FormData for the backend request
    console.log('[UPLOAD] Creating backend FormData...');
    const backendFormData = new FormData();
    backendFormData.append('file', file);

    // Forward the form data to the backend
    const backendUrl = `${BACKEND_URL}/api/statement-import/upload`;
    console.log('[UPLOAD] Sending to backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: backendFormData,
    });

    console.log('[UPLOAD] Backend response status:', response.status);
    console.log('[UPLOAD] Backend response headers:', Object.fromEntries(response.headers.entries()));

    // Handle 204 No Content
    if (response.status === 204) {
      console.log('[UPLOAD] Returning 204 No Content');
      return new NextResponse(null, { status: 204 });
    }

    // Try to parse JSON response
    const contentType = response.headers.get('content-type');
    console.log('[UPLOAD] Content-Type:', contentType);

    if (contentType?.includes('json')) {
      const data = await response.json();
      console.log('[UPLOAD] JSON response status:', response.status);
      console.log('[UPLOAD] JSON response data:', JSON.stringify(data));
      return NextResponse.json(data, { status: response.status });
    }

    // Non-JSON response
    const text = await response.text();
    console.log('[UPLOAD] Text response:', text.slice(0, 500));
    return new NextResponse(text, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error('[UPLOAD] Error:', message);
    if (stack) console.error('[UPLOAD] Stack:', stack);
    return NextResponse.json(
      { error: 'Failed to proxy upload request to backend', detail: message },
      { status: 502 }
    );
  }
}
