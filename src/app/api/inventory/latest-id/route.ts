import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GraphHelper } from '@/lib/graph';

export async function GET() {
  const session = await getServerSession(authOptions);

  // If no session, GraphHelper falls back to MOCK if configured, or fails.
  // We prefer failing early if not mock.
  if (process.env.USE_MOCK_DATA !== 'true' && (!session || !session.accessToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const graph = new GraphHelper(session?.accessToken); 

  try {
    const nextId = await graph.getLatestEquipId();
    return NextResponse.json({ nextId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch ID' }, { status: 500 });
  }
}
