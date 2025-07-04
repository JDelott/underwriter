import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeDocument(documentText: string, filename: string, documentType?: string) {
  const prompt = `
You are a senior real estate underwriting expert with 15+ years of experience. Analyze this document: "${filename}" (Type: ${documentType || 'Unknown'})

Document content:
${documentText}

Provide a comprehensive analysis in the following JSON format. Be specific and actionable in your analysis:

{
  "summary": "Detailed 2-3 sentence summary of the document and its key insights",
  "key_metrics": {
    "metric_name": "specific_value_with_units"
  },
  "risks": ["Specific risk factors that could impact the investment"],
  "recommendations": ["Actionable recommendations for the underwriter"],
  "confidence": 0.95,
  "property_insights": {
    "strengths": ["Key strengths of this property/deal"],
    "concerns": ["Areas that need attention or further investigation"]
  },
  "financial_highlights": {
    "revenue_items": ["Key revenue drivers identified"],
    "expense_items": ["Major expense categories noted"],
    "profitability_notes": ["Observations about profitability"]
  }
}

Focus on:
- Financial performance and ratios
- Market positioning and competitive advantages
- Risk factors and red flags
- Operational efficiency opportunities
- Investment potential and return prospects

Return ONLY the JSON object without any markdown formatting.
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      // Clean up the response text - remove any markdown formatting
      let cleanText = content.text.trim();
      
      // Remove ```json and ``` if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '');
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '');
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.replace(/\s*```$/, '');
      }
      
      console.log('Claude Analysis Response:', cleanText);
      
      return JSON.parse(cleanText);
    }
    
    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Claude API error:', error);
    
    // Return a structured fallback response
    return {
      summary: 'Document analysis completed with technical limitations. Manual review recommended.',
      key_metrics: {
        'Analysis Status': 'Partial - Technical Issue',
        'Document Type': documentType || 'Unknown',
        'Content Length': `${documentText.length} characters`
      },
      risks: [
        'Could not complete full AI analysis due to technical issues',
        'Manual review of document is strongly recommended'
      ],
      recommendations: [
        'Conduct manual review of this document',
        'Verify all financial figures independently',
        'Consider re-running analysis after technical issues are resolved'
      ],
      confidence: 0.2,
      property_insights: {
        strengths: ['Document successfully uploaded and stored'],
        concerns: ['AI analysis incomplete due to technical limitations']
      },
      financial_highlights: {
        revenue_items: ['Analysis incomplete'],
        expense_items: ['Analysis incomplete'],
        profitability_notes: ['Manual review required']
      }
    };
  }
}

// New function for batch analysis
export async function analyzeBatchDocuments(documents: Array<{id: number, content: string, filename: string, type?: string}>) {
  const results = [];
  
  for (const doc of documents) {
    try {
      console.log(`Analyzing document: ${doc.filename}`);
      const analysis = await analyzeDocument(doc.content, doc.filename, doc.type);
      results.push({
        documentId: doc.id,
        analysis,
        status: 'success'
      });
      
      // Add a small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to analyze document ${doc.filename}:`, error);
      results.push({
        documentId: doc.id,
        analysis: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}
