import { NextRequest, NextResponse } from 'next/server';
import { chatWithClaude } from '@/lib/claude';
import { query } from '@/lib/db';

// Define types for the analysis result
interface AnalysisResult {
  summary?: string;
  confidence?: number;
  key_metrics?: Record<string, string | number>;
  financial_highlights?: {
    revenue_items?: string[];
    expense_items?: string[];
    profitability_notes?: string[];
  };
  property_insights?: {
    strengths?: string[];
    concerns?: string[];
  };
  risks?: string[];
  recommendations?: string[];
}

interface DocumentWithAnalysis {
  original_filename: string;
  analysis_result?: AnalysisResult;
}

export async function POST(request: NextRequest) {
  try {
    const { message, dealId, conversationHistory, isDealsPage, isAnalysisPage } = await request.json();
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Get deal context based on the page type
    let dealContext = '';
    
    if (isAnalysisPage && dealId) {
      // Analysis page - provide comprehensive analysis context for current deal PLUS all deals for comparison
      try {
        const dealResult = await query(
          'SELECT * FROM deals WHERE id = $1',
          [dealId]
        );
        
        if (dealResult.rows.length > 0) {
          const deal = dealResult.rows[0];
          dealContext = `DETAILED ANALYSIS VIEW - ${deal.name}\n`;
          dealContext += `Property Type: ${deal.property_type || 'Unknown'}\n`;
          dealContext += `Address: ${deal.address || 'Not specified'}\n`;
          dealContext += `Status: ${deal.status}\n\n`;
          
          // Get detailed analysis data for current deal
          const docsResult = await query(
            'SELECT original_filename, analysis_result FROM documents WHERE deal_id = $1 AND analysis_result IS NOT NULL',
            [dealId]
          );
          
          if (docsResult.rows.length > 0) {
            dealContext += `COMPREHENSIVE ANALYSIS DATA FOR CURRENT DEAL:\n\n`;
            
            docsResult.rows.forEach((doc: DocumentWithAnalysis, index: number) => {
              if (doc.analysis_result) {
                const analysis = doc.analysis_result;
                dealContext += `DOCUMENT ${index + 1}: ${doc.original_filename}\n`;
                dealContext += `${'='.repeat(50)}\n`;
                
                if (analysis.summary) {
                  dealContext += `Summary: ${analysis.summary}\n\n`;
                }
                
                if (analysis.confidence) {
                  dealContext += `Confidence Score: ${analysis.confidence}%\n\n`;
                }
                
                // Detailed key metrics
                if (analysis.key_metrics) {
                  dealContext += `KEY METRICS:\n`;
                  Object.entries(analysis.key_metrics).forEach(([key, value]) => {
                    dealContext += `  • ${key}: ${value}\n`;
                  });
                  dealContext += `\n`;
                }
                
                // Detailed financial highlights
                if (analysis.financial_highlights) {
                  const fh = analysis.financial_highlights;
                  dealContext += `FINANCIAL HIGHLIGHTS:\n`;
                  if (fh.revenue_items && fh.revenue_items.length > 0) {
                    dealContext += `  Revenue Items:\n`;
                    fh.revenue_items.forEach(item => dealContext += `    - ${item}\n`);
                  }
                  if (fh.expense_items && fh.expense_items.length > 0) {
                    dealContext += `  Expense Items:\n`;
                    fh.expense_items.forEach(item => dealContext += `    - ${item}\n`);
                  }
                  if (fh.profitability_notes && fh.profitability_notes.length > 0) {
                    dealContext += `  Profitability Notes:\n`;
                    fh.profitability_notes.forEach(note => dealContext += `    - ${note}\n`);
                  }
                  dealContext += `\n`;
                }
                
                // Detailed property insights
                if (analysis.property_insights) {
                  const pi = analysis.property_insights;
                  dealContext += `PROPERTY INSIGHTS:\n`;
                  if (pi.strengths && pi.strengths.length > 0) {
                    dealContext += `  Strengths:\n`;
                    pi.strengths.forEach(strength => dealContext += `    - ${strength}\n`);
                  }
                  if (pi.concerns && pi.concerns.length > 0) {
                    dealContext += `  Concerns:\n`;
                    pi.concerns.forEach(concern => dealContext += `    - ${concern}\n`);
                  }
                  dealContext += `\n`;
                }
                
                // All risks
                if (analysis.risks && analysis.risks.length > 0) {
                  dealContext += `IDENTIFIED RISKS:\n`;
                  analysis.risks.forEach(risk => dealContext += `  • ${risk}\n`);
                  dealContext += `\n`;
                }
                
                // All recommendations
                if (analysis.recommendations && analysis.recommendations.length > 0) {
                  dealContext += `RECOMMENDATIONS:\n`;
                  analysis.recommendations.forEach(rec => dealContext += `  • ${rec}\n`);
                  dealContext += `\n`;
                }
                
                dealContext += `\n`;
              }
            });
          }
        }

        // NOW ADD ALL OTHER DEALS FOR COMPARISON
        dealContext += `\n${'='.repeat(80)}\n`;
        dealContext += `ALL OTHER DEALS FOR COMPARISON:\n`;
        dealContext += `${'='.repeat(80)}\n\n`;

        const allDealsResult = await query(
          'SELECT * FROM deals WHERE id != $1 ORDER BY created_at DESC',
          [dealId]
        );
        
        if (allDealsResult.rows.length > 0) {
          const otherDealsWithAnalysis = await Promise.all(
            allDealsResult.rows.map(async (deal) => {
              const docsResult = await query(
                'SELECT original_filename, analysis_result FROM documents WHERE deal_id = $1 AND analysis_result IS NOT NULL',
                [deal.id]
              );
              
              return {
                ...deal,
                documents: docsResult.rows as DocumentWithAnalysis[]
              };
            })
          );
          
          // Filter to only deals with analysis data
          const analyzedOtherDeals = otherDealsWithAnalysis.filter(deal => deal.documents.length > 0);
          
          if (analyzedOtherDeals.length > 0) {
            dealContext += `COMPARISON DEALS (${analyzedOtherDeals.length} deals with analysis):\n\n`;
            
            analyzedOtherDeals.forEach((deal, index) => {
              dealContext += `COMPARISON DEAL ${index + 1}: ${deal.name}\n`;
              dealContext += `- Property Type: ${deal.property_type || 'Unknown'}\n`;
              dealContext += `- Status: ${deal.status}\n`;
              dealContext += `- Documents: ${deal.documents.length}\n`;
              
              // Add detailed analysis metrics
              deal.documents.forEach((doc: DocumentWithAnalysis) => {
                if (doc.analysis_result) {
                  const analysis = doc.analysis_result;
                  dealContext += `\n${doc.original_filename} Analysis:\n`;
                  dealContext += `  Summary: ${analysis.summary || 'N/A'}\n`;
                  dealContext += `  Confidence: ${analysis.confidence || 'N/A'}%\n`;
                  
                  // Key metrics
                  if (analysis.key_metrics) {
                    dealContext += `  Key Metrics:\n`;
                    Object.entries(analysis.key_metrics).forEach(([key, value]) => {
                      dealContext += `    - ${key}: ${value}\n`;
                    });
                  }
                  
                  // Financial highlights
                  if (analysis.financial_highlights) {
                    const fh = analysis.financial_highlights;
                    if (fh.revenue_items && fh.revenue_items.length > 0) {
                      dealContext += `  Revenue Items: ${fh.revenue_items.join(', ')}\n`;
                    }
                    if (fh.expense_items && fh.expense_items.length > 0) {
                      dealContext += `  Expense Items: ${fh.expense_items.join(', ')}\n`;
                    }
                    if (fh.profitability_notes && fh.profitability_notes.length > 0) {
                      dealContext += `  Profitability: ${fh.profitability_notes.join(', ')}\n`;
                    }
                  }
                  
                  // Property insights
                  if (analysis.property_insights) {
                    const pi = analysis.property_insights;
                    if (pi.strengths && pi.strengths.length > 0) {
                      dealContext += `  Strengths: ${pi.strengths.join(', ')}\n`;
                    }
                    if (pi.concerns && pi.concerns.length > 0) {
                      dealContext += `  Concerns: ${pi.concerns.join(', ')}\n`;
                    }
                  }
                  
                  // Top risks
                  if (analysis.risks && analysis.risks.length > 0) {
                    dealContext += `  Top Risks: ${analysis.risks.slice(0, 3).join(', ')}\n`;
                  }
                  
                  // Key recommendations
                  if (analysis.recommendations && analysis.recommendations.length > 0) {
                    dealContext += `  Key Recommendations: ${analysis.recommendations.slice(0, 3).join(', ')}\n`;
                  }
                }
              });
              
              dealContext += `\n---\n\n`;
            });
          } else {
            dealContext += `No other deals with analysis data available for comparison.\n\n`;
          }
        }
        
        dealContext += `\nYou have access to ALL detailed analysis data for the current deal AND all other deals for comparison. You can compare metrics, performance, risks, and opportunities across all deals.`;
        
      } catch (error) {
        console.error('Error fetching analysis context:', error);
        // Continue without context if there's an error
      }
    } else if (isDealsPage) {
      // Deals overview page - provide comparison context for all deals
      try {
        const dealsResult = await query(
          'SELECT * FROM deals ORDER BY created_at DESC'
        );
        
        if (dealsResult.rows.length > 0) {
          const dealsWithAnalysis = await Promise.all(
            dealsResult.rows.map(async (deal) => {
              const docsResult = await query(
                'SELECT original_filename, analysis_result FROM documents WHERE deal_id = $1 AND analysis_result IS NOT NULL',
                [deal.id]
              );
              
              return {
                ...deal,
                documents: docsResult.rows as DocumentWithAnalysis[]
              };
            })
          );
          
          // Filter to only deals with analysis data
          const analyzedDeals = dealsWithAnalysis.filter(deal => deal.documents.length > 0);
          
          if (analyzedDeals.length > 0) {
            dealContext = `ALL DEALS OVERVIEW (${analyzedDeals.length} deals with analysis):\n\n`;
            
            analyzedDeals.forEach((deal, index) => {
              dealContext += `DEAL ${index + 1}: ${deal.name}\n`;
              dealContext += `- Property Type: ${deal.property_type || 'Unknown'}\n`;
              dealContext += `- Status: ${deal.status}\n`;
              dealContext += `- Documents: ${deal.documents.length}\n`;
              
              // Add detailed analysis metrics
              deal.documents.forEach((doc: DocumentWithAnalysis) => {
                if (doc.analysis_result) {
                  const analysis = doc.analysis_result;
                  dealContext += `\n${doc.original_filename} Analysis:\n`;
                  dealContext += `  Summary: ${analysis.summary || 'N/A'}\n`;
                  dealContext += `  Confidence: ${analysis.confidence || 'N/A'}%\n`;
                  
                  // Key metrics
                  if (analysis.key_metrics) {
                    dealContext += `  Key Metrics:\n`;
                    Object.entries(analysis.key_metrics).forEach(([key, value]) => {
                      dealContext += `    - ${key}: ${value}\n`;
                    });
                  }
                  
                  // Financial highlights
                  if (analysis.financial_highlights) {
                    const fh = analysis.financial_highlights;
                    if (fh.revenue_items && fh.revenue_items.length > 0) {
                      dealContext += `  Revenue Items: ${fh.revenue_items.join(', ')}\n`;
                    }
                    if (fh.expense_items && fh.expense_items.length > 0) {
                      dealContext += `  Expense Items: ${fh.expense_items.join(', ')}\n`;
                    }
                    if (fh.profitability_notes && fh.profitability_notes.length > 0) {
                      dealContext += `  Profitability: ${fh.profitability_notes.join(', ')}\n`;
                    }
                  }
                  
                  // Property insights
                  if (analysis.property_insights) {
                    const pi = analysis.property_insights;
                    if (pi.strengths && pi.strengths.length > 0) {
                      dealContext += `  Strengths: ${pi.strengths.join(', ')}\n`;
                    }
                    if (pi.concerns && pi.concerns.length > 0) {
                      dealContext += `  Concerns: ${pi.concerns.join(', ')}\n`;
                    }
                  }
                  
                  // Top risks
                  if (analysis.risks && analysis.risks.length > 0) {
                    dealContext += `  Top Risks: ${analysis.risks.slice(0, 3).join(', ')}\n`;
                  }
                  
                  // Key recommendations
                  if (analysis.recommendations && analysis.recommendations.length > 0) {
                    dealContext += `  Key Recommendations: ${analysis.recommendations.slice(0, 3).join(', ')}\n`;
                  }
                }
              });
              
              dealContext += `\n---\n\n`;
            });
            
            dealContext += `\nYou can ask questions to compare deals, analyze specific metrics, identify best opportunities, or get insights about any aspect of these deals.`;
          }
        }
      } catch (error) {
        console.error('Error fetching deals overview:', error);
        // Continue without context if there's an error
      }
    } else if (dealId) {
      // Single deal page - provide basic deal context
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
            
            // Add basic analysis context for single deal
            docsResult.rows.forEach((doc: DocumentWithAnalysis) => {
              if (doc.analysis_result) {
                const analysis = doc.analysis_result;
                dealContext += `\n\n${doc.original_filename}:\n`;
                dealContext += `Summary: ${analysis.summary || 'N/A'}\n`;
                dealContext += `Confidence: ${analysis.confidence || 'N/A'}%\n`;
                
                if (analysis.key_metrics) {
                  Object.entries(analysis.key_metrics).forEach(([key, value]) => {
                    dealContext += `${key}: ${value}\n`;
                  });
                }
              }
            });
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
