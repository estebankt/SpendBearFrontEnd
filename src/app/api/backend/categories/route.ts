import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/server-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/spending/categories');
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/spending/categories');
}
