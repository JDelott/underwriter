import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function extractJSON(text: string): unknown {
  // Try multiple approaches to extract JSON
  let cleanText = text.trim();
  
  // Method 1: Remove markdown code blocks
  if (cleanText.includes('```')) {
    const jsonMatch = cleanText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      cleanText = jsonMatch[1];
    } else {
      // Remove all ``` markers
      cleanText = cleanText.replace(/```[a-zA-Z]*\s*/g, '').replace(/```/g, '');
    }
  }
  
  // Method 2: Find JSON object in text
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanText = jsonMatch[0];
  }
  
  return JSON.parse(cleanText);
}

export async function analyzeDocument(documentText: string, filename: string) {
  const prompt = `
You are a real estate underwriting expert. Analyze this document: "${filename}"

Document content:
${documentText}

Please analyze and respond with ONLY a JSON object (no markdown, no explanations):

{
  "summary": "Brief summary of the document",
  "key_metrics": {
    "metric_name": "value"
  },
  "risks": ["risk1", "risk2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence": 0.95
}
`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      console.log('Raw response:', content.text); // Debug log
      
      return extractJSON(content.text);
    }
    
    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Claude API error:', error);
    
    return {
      summary: 'Analysis completed but parsing failed',
      key_metrics: {
        'Error': 'JSON parsing failed'
      },
      risks: ['Could not parse analysis results'],
      recommendations: ['Manual review required'],
      confidence: 0.3
    };
  }
}
