import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = parseInt(params.id);
    const result = await query(
      'SELECT * FROM documents WHERE deal_id = $1 ORDER BY created_at DESC',
      [dealId]
    );
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
