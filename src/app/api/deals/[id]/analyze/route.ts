import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { analyzeDocument } from '@/lib/claude';
import { readFile } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dealId = parseInt(params.id);
    
    // Get all documents for this deal
    const docs = await query(
      'SELECT * FROM documents WHERE deal_id = $1 AND status = $2',
      [dealId, 'uploaded']
    );

    if (docs.rows.length === 0) {
      return NextResponse.json({ error: 'No documents to analyze' }, { status: 400 });
    }

    // Update deal status
    await query(
      'UPDATE deals SET status = $1 WHERE id = $2',
      ['analyzing', dealId]
    );

    const analysisResults = [];

    for (const doc of docs.rows) {
      try {
        // Mark document as analyzing
        await query(
          'UPDATE documents SET status = $1 WHERE id = $2',
          ['analyzing', doc.id]
        );

        // Read file content
        const fileContent = await readFile(doc.file_path);

        // Analyze with Claude
        const analysis = await analyzeDocument(fileContent, doc.original_filename);
        
        // Save analysis result
        await query(
          'UPDATE documents SET status = $1, analysis_result = $2 WHERE id = $3',
          ['analyzed', JSON.stringify(analysis), doc.id]
        );

        analysisResults.push({
          document: doc,
          analysis
        });

      } catch (error) {
        console.error(`Analysis failed for document ${doc.id}:`, error);
        await query(
          'UPDATE documents SET status = $1 WHERE id = $2',
          ['error', doc.id]
        );
      }
    }

    // Update deal status to completed
    await query(
      'UPDATE deals SET status = $1, updated_at = NOW() WHERE id = $2',
      ['completed', dealId]
    );

    return NextResponse.json({ 
      message: 'Analysis completed',
      results: analysisResults 
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
