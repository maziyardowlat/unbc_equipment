import { NextResponse } from 'next/server';
import { GraphHelper } from '@/lib/graph';

export async function GET() {
  // In a real app, retrieve the session for the access token
  // const session = await getServerSession(authOptions);
  
  // For now, we rely on the Mock Env var logic in GraphHelper
  const graph = new GraphHelper(); 

  try {
    const nextId = await graph.getLatestEquipId();
    return NextResponse.json({ nextId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ID' }, { status: 500 });
  }
}
