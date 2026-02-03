import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GraphHelper } from '@/lib/graph';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  // Pass the user's access token
  const graph = new GraphHelper(session.accessToken);

  try {
    await graph.addRow(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add row' }, { status: 500 });
  }
}
