import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/server-proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/identity/register');
}
