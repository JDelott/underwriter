import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocument } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { text, documentType = 'text document' } = await request.json();
    
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const analysis = await analyzeDocument(text, documentType);
    
    return NextResponse.json({ 
      success: true,
      analysis 
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
