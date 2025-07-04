import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dealId = parseInt(id);
    
    console.log(`Fetching documents for deal ${dealId}`);
    
    const result = await query(
      'SELECT * FROM documents WHERE deal_id = $1 ORDER BY created_at DESC',
      [dealId]
    );
    
    // PostgreSQL JSONB returns objects directly, no parsing needed
    const documents = result.rows.map(doc => ({
      ...doc,
      analysis_result: doc.analysis_result || null
    }));
    
    console.log(`Found ${documents.length} documents for deal ${dealId}`);
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Failed to fetch documents:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
