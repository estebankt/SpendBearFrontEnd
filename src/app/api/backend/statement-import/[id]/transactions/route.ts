import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/server-proxy';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(req, `/api/statement-import/${id}/transactions`);
}
