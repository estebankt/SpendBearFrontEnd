import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/server-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/notifications');
}
