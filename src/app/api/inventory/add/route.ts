import { NextResponse } from 'next/server';
import { GraphHelper } from '@/lib/graph';

export async function POST(req: Request) {
  const body = await req.json();
  const graph = new GraphHelper();

  try {
    await graph.addRow(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add row' }, { status: 500 });
  }
}
