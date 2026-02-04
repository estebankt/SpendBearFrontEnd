import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/server-proxy';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(req, `/api/budgets/${id}`);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(req, `/api/budgets/${id}`);
}
