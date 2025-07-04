"use client";

interface AnalysisResult {
  summary: string;
  key_metrics: Record<string, string | number>;
  risks: string[];
  recommendations: string[];
  confidence: number;
  property_insights?: {
    strengths: string[];
    concerns: string[];
  };
  financial_highlights?: {
    revenue_items: string[];
    expense_items: string[];
    profitability_notes: string[];
  };
}

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  documentName: string;
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div className="bg-black/30 border border-gray-600 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-emerald-400 tracking-wide">
          🤖 CLAUDE 4 ANALYSIS RESULTS
        </h4>
        <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded">
          ANTHROPIC CLAUDE 3.5 SONNET
        </div>
      </div>
      
      {/* Summary */}
      <div>
        <h5 className="text-sm font-medium text-emerald-400 mb-3 tracking-wide flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
          EXECUTIVE SUMMARY
        </h5>
        <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded">
          <p className="text-gray-300 leading-relaxed">{analysis.summary}</p>
        </div>
      </div>

      {/* Key Metrics */}
      {analysis.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-blue-400 mb-3 tracking-wide flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            KEY FINANCIAL METRICS
          </h5>
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(analysis.key_metrics).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-2 border-b border-blue-500/20 last:border-b-0">
                  <span className="text-gray-300 font-medium">{key}:</span>
                  <span className="text-blue-400 font-bold">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Property Insights */}
      {analysis.property_insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          {analysis.property_insights.strengths && analysis.property_insights.strengths.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-green-400 mb-3 tracking-wide flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                PROPERTY STRENGTHS
              </h5>
              <div className="bg-green-900/20 border border-green-500/30 p-4 rounded space-y-2">
                {analysis.property_insights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-green-300 text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concerns */}
          {analysis.property_insights.concerns && analysis.property_insights.concerns.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-yellow-400 mb-3 tracking-wide flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                AREAS OF CONCERN
              </h5>
              <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded space-y-2">
                {analysis.property_insights.concerns.map((concern, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-400 mt-1">⚠</span>
                    <span className="text-yellow-300 text-sm">{concern}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Financial Highlights */}
      {analysis.financial_highlights && (
        <div>
          <h5 className="text-sm font-medium text-purple-400 mb-3 tracking-wide flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            FINANCIAL HIGHLIGHTS
          </h5>
          <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.financial_highlights.revenue_items && analysis.financial_highlights.revenue_items.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-purple-300 mb-2 tracking-wide">REVENUE DRIVERS</h6>
                  <div className="space-y-1">
                    {analysis.financial_highlights.revenue_items.map((item, index) => (
                      <div key={index} className="text-xs text-purple-200 flex items-center">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.financial_highlights.expense_items && analysis.financial_highlights.expense_items.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-purple-300 mb-2 tracking-wide">EXPENSE CATEGORIES</h6>
                  <div className="space-y-1">
                    {analysis.financial_highlights.expense_items.map((item, index) => (
                      <div key={index} className="text-xs text-purple-200 flex items-center">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysis.financial_highlights.profitability_notes && analysis.financial_highlights.profitability_notes.length > 0 && (
                <div>
                  <h6 className="text-xs font-medium text-purple-300 mb-2 tracking-wide">PROFITABILITY NOTES</h6>
                  <div className="space-y-1">
                    {analysis.financial_highlights.profitability_notes.map((note, index) => (
                      <div key={index} className="text-xs text-purple-200 flex items-center">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Risks */}
      {analysis.risks && analysis.risks.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-red-400 mb-3 tracking-wide flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
            RISK ASSESSMENT
          </h5>
          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded space-y-2">
            {analysis.risks.map((risk, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">⚠</span>
                <span className="text-red-300 text-sm">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-cyan-400 mb-3 tracking-wide flex items-center">
            <span className="w-2 h-2 bg-cyan-400 rounded-full mr-2"></span>
            ACTIONABLE RECOMMENDATIONS
          </h5>
          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span className="text-cyan-300 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Score */}
      <div>
        <h5 className="text-sm font-medium text-emerald-400 mb-3 tracking-wide flex items-center">
          <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
          AI CONFIDENCE SCORE
        </h5>
        <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded">
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full shadow-lg shadow-emerald-400/50 transition-all duration-1000" 
                style={{ width: `${(analysis.confidence || 0) * 100}%` }}
              ></div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold text-lg tracking-wide">
                {((analysis.confidence || 0) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-400">
                {analysis.confidence >= 0.8 ? 'HIGH' : analysis.confidence >= 0.6 ? 'MEDIUM' : 'LOW'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
