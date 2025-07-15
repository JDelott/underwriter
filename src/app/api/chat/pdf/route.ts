import { NextRequest, NextResponse } from 'next/server';
import { chatWithClaude } from '@/lib/claude';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { message, propertyId } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get the PDF text content from database
    let context = '';
    if (propertyId) {
      try {
        const result = await query(
          'SELECT extracted_text, name, property_type, address FROM portfolio_properties WHERE id = $1',
          [propertyId]
        );
        
        if (result.rows.length > 0) {
          const property = result.rows[0];
          const fullText = property.extracted_text || '';
          
          // Truncate text to fit within Claude's context window (approximately 150k characters)
          const maxChars = 150000;
          const truncatedText = fullText.length > maxChars 
            ? fullText.substring(0, maxChars) + '\n\n[Document truncated for analysis...]'
            : fullText;
          
          console.log(`Document text length: ${fullText.length} chars, using: ${truncatedText.length} chars`);
          
          // Add property context
          const propertyContext = `
Property: ${property.name}
Type: ${property.property_type}
Address: ${property.address || 'Not specified'}

Document Content:
${truncatedText}
          `;
          context = propertyContext;
        }
      } catch (error) {
        console.error('Failed to get property data:', error);
      }
    }

    if (!context) {
      return NextResponse.json({ 
        response: "I don't have access to the document content for this property yet. The PDF may still be processing or the text extraction may have failed." 
      });
    }

    const dealContext = `You are an expert real estate underwriter assistant. You have access to a specific property document from a portfolio and can answer questions about its financial metrics, risks, and investment potential.

DOCUMENT CONTEXT:
${context}

Answer questions about this specific property based on the document content. Be specific and cite relevant numbers, dates, and details from the document. If you can't find specific information, say so clearly.`;

    console.log(`Sending message to Claude: "${message}" with context length: ${dealContext.length}`);

    const response = await chatWithClaude(message, dealContext);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('PDF chat error:', error);
    return NextResponse.json(
      { error: `Chat failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 
