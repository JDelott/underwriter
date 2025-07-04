import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { analyzeDocument } from '@/lib/claude';
import { readFile } from '@/lib/storage';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dealId = parseInt(id);
    
    console.log(`Starting analysis for deal ${dealId}`);
    
    // Get all documents for this deal that haven't been analyzed yet
    const docs = await query(
      'SELECT * FROM documents WHERE deal_id = $1 AND status IN ($2, $3) ORDER BY created_at DESC',
      [dealId, 'uploaded', 'error']
    );

    if (docs.rows.length === 0) {
      return NextResponse.json({ error: 'No documents available for analysis' }, { status: 400 });
    }

    console.log(`Found ${docs.rows.length} documents to analyze`);

    // Update deal status to analyzing
    await query(
      'UPDATE deals SET status = $1, updated_at = NOW() WHERE id = $2',
      ['analyzing', dealId]
    );

    const analysisResults = [];
    let successCount = 0;
    let errorCount = 0;

    for (const doc of docs.rows) {
      try {
        console.log(`Processing document: ${doc.original_filename}`);
        
        // Mark document as analyzing
        await query(
          'UPDATE documents SET status = $1 WHERE id = $2',
          ['analyzing', doc.id]
        );

        // Read file content
        let fileContent = '';
        try {
          if (doc.mime_type === 'text/plain' || doc.file_path.includes('text-documents')) {
            fileContent = await readFile(doc.file_path);
          } else {
            fileContent = `Document: ${doc.original_filename}\nType: ${doc.mime_type}\nSize: ${doc.file_size} bytes\n\nNote: This file type requires manual review as automatic text extraction is not yet implemented.`;
          }
        } catch (readError) {
          console.error(`Failed to read file ${doc.file_path}:`, readError);
          fileContent = `Document: ${doc.original_filename}\nError: Could not read file content. Manual review required.`;
        }

        // Determine document type from filename or path
        const documentType = inferDocumentType(doc.original_filename);
        
        console.log(`Analyzing with Claude: ${doc.original_filename} (${documentType})`);

        // Analyze with Claude
        const analysis = await analyzeDocument(fileContent, doc.original_filename, documentType);
        
        console.log(`Analysis completed for: ${doc.original_filename}`);
        
        // Save analysis result as JSONB (no JSON.stringify needed for JSONB)
        await query(
          'UPDATE documents SET status = $1, analysis_result = $2 WHERE id = $3',
          ['analyzed', analysis, doc.id]
        );

        analysisResults.push({
          document: doc,
          analysis,
          status: 'success'
        });
        
        successCount++;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Analysis failed for document ${doc.id} (${doc.original_filename}):`, errorMessage);
        
        // Mark document as error
        await query(
          'UPDATE documents SET status = $1 WHERE id = $2',
          ['error', doc.id]
        );
        
        analysisResults.push({
          document: doc,
          analysis: null,
          status: 'error',
          error: errorMessage
        });
        
        errorCount++;
      }
    }

    // Update deal status based on results
    const finalStatus = 'completed';
    await query(
      'UPDATE deals SET status = $1, updated_at = NOW() WHERE id = $2',
      [finalStatus, dealId]
    );

    console.log(`Analysis completed for deal ${dealId}: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({ 
      message: 'Analysis completed',
      results: analysisResults,
      summary: {
        total: docs.rows.length,
        successful: successCount,
        errors: errorCount
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Analysis error:', errorMessage);
    
    // Update deal status to error state
    try {
      const { id } = await params;
      await query(
        'UPDATE deals SET status = $1, updated_at = NOW() WHERE id = $2',
        ['uploaded', parseInt(id)]
      );
    } catch (updateError) {
      console.error('Failed to update deal status:', updateError);
    }
    
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: errorMessage
    }, { status: 500 });
  }
}

// Helper function to infer document type from filename
function inferDocumentType(filename: string): string {
  const lower = filename.toLowerCase();
  
  if (lower.includes('rent') && lower.includes('roll')) {
    return 'rent roll';
  } else if (lower.includes('operating') || lower.includes('income')) {
    return 'operating statement';
  } else if (lower.includes('lease')) {
    return 'lease agreement';
  } else if (lower.includes('p&l') || lower.includes('profit')) {
    return 'profit and loss';
  } else if (lower.includes('balance')) {
    return 'balance sheet';
  } else if (lower.includes('appraisal')) {
    return 'appraisal';
  } else if (lower.includes('inspection')) {
    return 'inspection report';
  } else if (lower.includes('financial')) {
    return 'financial statement';
  } else {
    return 'other';
  }
}
