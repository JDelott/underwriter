import { NextRequest, NextResponse } from 'next/server';
import { chatWithClaude } from '@/lib/claude';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message, dealId, conversationHistory } = await request.json();
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Get deal context if dealId is provided
    let dealContext = '';
    if (dealId) {
      try {
        const dealResult = await query(
          'SELECT * FROM deals WHERE id = $1',
          [dealId]
        );
        
        if (dealResult.rows.length > 0) {
          const deal = dealResult.rows[0];
          dealContext = `Deal: ${deal.name} (${deal.property_type || 'Unknown Type'})`;
          
          // Get deal documents with analysis
          const docsResult = await query(
            'SELECT original_filename, analysis_result FROM documents WHERE deal_id = $1 AND analysis_result IS NOT NULL',
            [dealId]
          );
          
          if (docsResult.rows.length > 0) {
            dealContext += `\nDocuments analyzed: ${docsResult.rows.length}`;
            
            // Add key insights from analysis
            const insights = docsResult.rows.map(doc => {
              if (doc.analysis_result?.summary) {
                return `${doc.original_filename}: ${doc.analysis_result.summary}`;
              }
              return null;
            }).filter(Boolean);
            
            if (insights.length > 0) {
              dealContext += `\nKey Insights: ${insights.join('; ')}`;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching deal context:', error);
        // Continue without context if there's an error
      }
    }

    const response = await chatWithClaude(message, dealContext, conversationHistory);
    
    return NextResponse.json({ 
      success: true,
      response 
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Chat failed' 
    }, { status: 500 });
  }
} 
