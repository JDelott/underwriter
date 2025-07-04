// src/app/api/deals/[id]/upload-text/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { saveTextDocument } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params for Next.js 15
    const dealId = parseInt(id);
    const { text, documentType } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    console.log(`Creating text document for deal ${dealId}, type: ${documentType}`);

    // Generate a filename based on document type and timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${documentType.replace(/\s+/g, '-')}-${timestamp}.txt`;
    
    // Save the text document to disk
    const filepath = await saveTextDocument(text, dealId, documentType.replace(/\s+/g, '-'));
    
    // Save text document to database
    const result = await query(
      `INSERT INTO documents (deal_id, filename, original_filename, file_path, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [dealId, filename, filename, filepath, text.length, 'text/plain']
    );

    // Update deal status
    await query(
      'UPDATE deals SET status = $1, updated_at = NOW() WHERE id = $2',
      ['uploaded', dealId]
    );

    console.log(`Text document created successfully: ${filename}`);

    return NextResponse.json({ 
      message: 'Text document added successfully',
      document: result.rows[0] 
    });

  } catch (error) {
    console.error('Text upload error:', error);
    return NextResponse.json({ 
      error: 'Text upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
