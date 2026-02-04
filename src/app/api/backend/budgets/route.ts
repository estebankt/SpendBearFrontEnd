import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/server-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/budgets');
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/budgets');
}
