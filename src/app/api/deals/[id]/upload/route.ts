import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { saveFile } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = parseInt(params.id);
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedDocs = [];

    for (const file of files) {
      // Save file to disk
      const filepath = await saveFile(file, dealId);
      
      // Save to database
      const result = await query(
        `INSERT INTO documents (deal_id, filename, original_filename, file_path, file_size, mime_type)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [dealId, file.name, file.name, filepath, file.size, file.type]
      );

      uploadedDocs.push(result.rows[0]);
    }

    // Update deal status
    await query(
      'UPDATE deals SET status = $1, updated_at = NOW() WHERE id = $2',
      ['uploaded', dealId]
    );

    return NextResponse.json({ 
      message: 'Files uploaded successfully',
      documents: uploadedDocs 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
