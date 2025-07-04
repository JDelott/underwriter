"use client";

import { useState } from 'react';

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

interface TabbedAnalysisResultsProps {
  analysis: AnalysisResult;
  documentName: string;
}

type TabType = 'summary' | 'financial' | 'property' | 'risks' | 'recommendations' | 'confidence';

export default function TabbedAnalysisResults({ analysis, documentName }: TabbedAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const tabs = [
    { id: 'summary', label: 'EXECUTIVE SUMMARY', icon: '📊', color: 'emerald' },
    { id: 'financial', label: 'FINANCIAL METRICS', icon: '💰', color: 'blue' },
    { id: 'property', label: 'PROPERTY INSIGHTS', icon: '🏢', color: 'green' },
    { id: 'risks', label: 'RISK ASSESSMENT', icon: '⚠️', color: 'red' },
    { id: 'recommendations', label: 'RECOMMENDATIONS', icon: '💡', color: 'cyan' },
    { id: 'confidence', label: 'AI CONFIDENCE', icon: '🎯', color: 'purple' }
  ];

  const getTabClasses = (tabId: string, color: string) => {
    const isActive = activeTab === tabId;
    const colorClasses = {
      emerald: isActive ? 'bg-emerald-400 text-black shadow-emerald-400/40' : 'text-emerald-400 hover:text-emerald-300',
      blue: isActive ? 'bg-blue-400 text-black shadow-blue-400/40' : 'text-blue-400 hover:text-blue-300',
      green: isActive ? 'bg-green-400 text-black shadow-green-400/40' : 'text-green-400 hover:text-green-300',
      red: isActive ? 'bg-red-400 text-black shadow-red-400/40' : 'text-red-400 hover:text-red-300',
      cyan: isActive ? 'bg-cyan-400 text-black shadow-cyan-400/40' : 'text-cyan-400 hover:text-cyan-300',
      purple: isActive ? 'bg-purple-400 text-black shadow-purple-400/40' : 'text-purple-400 hover:text-purple-300'
    };
    
    return `px-4 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
      isActive ? `border-${color}-400 shadow-lg` : 'border-transparent hover:border-gray-600'
    } ${colorClasses[color as keyof typeof colorClasses]}`;
  };

  return (
    <div className="bg-black/30 border border-gray-600 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-black/50 p-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">AI</span>
            </div>
            <div>
              <h4 className="text-lg font-medium text-emerald-400 tracking-wide">
                CLAUDE 4 ANALYSIS
              </h4>
              <p className="text-xs text-gray-400">{documentName}</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded">
            ANTHROPIC CLAUDE 3.5 SONNET
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-black/20 border-b border-gray-600 overflow-x-auto">
        <div className="flex min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={getTabClasses(tab.id, tab.color)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 min-h-[400px]">
        {/* Executive Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
              <h5 className="text-lg font-medium text-emerald-400 tracking-wide">EXECUTIVE SUMMARY</h5>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-lg">
              <p className="text-gray-300 leading-relaxed text-base">{analysis.summary}</p>
            </div>
          </div>
        )}

        {/* Financial Metrics Tab */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <h5 className="text-lg font-medium text-blue-400 tracking-wide">FINANCIAL METRICS</h5>
            </div>
            
            {/* Key Metrics */}
            {analysis.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
              <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysis.key_metrics).map(([key, value]) => (
                    <div key={key} className="bg-blue-800/30 p-4 rounded border border-blue-500/20">
                      <div className="text-sm text-blue-300 font-medium mb-1">{key}</div>
                      <div className="text-xl text-blue-400 font-bold">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Highlights */}
            {analysis.financial_highlights && (
              <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-lg">
                <h6 className="text-md font-medium text-purple-400 mb-4 tracking-wide">FINANCIAL HIGHLIGHTS</h6>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {analysis.financial_highlights.revenue_items && analysis.financial_highlights.revenue_items.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-purple-300 mb-3 tracking-wide">REVENUE DRIVERS</div>
                      <div className="space-y-2">
                        {analysis.financial_highlights.revenue_items.map((item, index) => (
                          <div key={index} className="text-sm text-purple-200 flex items-center bg-purple-800/20 p-2 rounded">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.financial_highlights.expense_items && analysis.financial_highlights.expense_items.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-purple-300 mb-3 tracking-wide">EXPENSE CATEGORIES</div>
                      <div className="space-y-2">
                        {analysis.financial_highlights.expense_items.map((item, index) => (
                          <div key={index} className="text-sm text-purple-200 flex items-center bg-purple-800/20 p-2 rounded">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.financial_highlights.profitability_notes && analysis.financial_highlights.profitability_notes.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-purple-300 mb-3 tracking-wide">PROFITABILITY NOTES</div>
                      <div className="space-y-2">
                        {analysis.financial_highlights.profitability_notes.map((note, index) => (
                          <div key={index} className="text-sm text-purple-200 flex items-center bg-purple-800/20 p-2 rounded">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Property Insights Tab */}
        {activeTab === 'property' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <h5 className="text-lg font-medium text-green-400 tracking-wide">PROPERTY INSIGHTS</h5>
            </div>
            
            {analysis.property_insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                {analysis.property_insights.strengths && analysis.property_insights.strengths.length > 0 && (
                  <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-lg">
                    <h6 className="text-md font-medium text-green-400 mb-4 tracking-wide">PROPERTY STRENGTHS</h6>
                    <div className="space-y-3">
                      {analysis.property_insights.strengths.map((strength, index) => (
                        <div key={index} className="bg-green-800/30 p-3 rounded border border-green-500/20">
                          <div className="flex items-start space-x-3">
                            <span className="text-green-400 mt-1 text-lg">✓</span>
                            <span className="text-green-300 text-sm leading-relaxed">{strength}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concerns */}
                {analysis.property_insights.concerns && analysis.property_insights.concerns.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 p-6 rounded-lg">
                    <h6 className="text-md font-medium text-yellow-400 mb-4 tracking-wide">AREAS OF CONCERN</h6>
                    <div className="space-y-3">
                      {analysis.property_insights.concerns.map((concern, index) => (
                        <div key={index} className="bg-yellow-800/30 p-3 rounded border border-yellow-500/20">
                          <div className="flex items-start space-x-3">
                            <span className="text-yellow-400 mt-1 text-lg">⚠</span>
                            <span className="text-yellow-300 text-sm leading-relaxed">{concern}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Risk Assessment Tab */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-3 h-3 bg-red-400 rounded-full"></span>
              <h5 className="text-lg font-medium text-red-400 tracking-wide">RISK ASSESSMENT</h5>
            </div>
            
            {analysis.risks && analysis.risks.length > 0 ? (
              <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg">
                <div className="space-y-4">
                  {analysis.risks.map((risk, index) => (
                    <div key={index} className="bg-red-800/30 p-4 rounded border border-red-500/20">
                      <div className="flex items-start space-x-3">
                        <span className="text-red-400 mt-1 text-lg">⚠</span>
                        <span className="text-red-300 text-sm leading-relaxed">{risk}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-lg text-center">
                <span className="text-green-400 text-4xl mb-4 block">✓</span>
                <p className="text-green-300">No significant risks identified in this document.</p>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
              <h5 className="text-lg font-medium text-cyan-400 tracking-wide">ACTIONABLE RECOMMENDATIONS</h5>
            </div>
            
            {analysis.recommendations && analysis.recommendations.length > 0 ? (
              <div className="bg-cyan-900/20 border border-cyan-500/30 p-6 rounded-lg">
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="bg-cyan-800/30 p-4 rounded border border-cyan-500/20">
                      <div className="flex items-start space-x-3">
                        <span className="text-cyan-400 mt-1 text-lg">→</span>
                        <span className="text-cyan-300 text-sm leading-relaxed">{rec}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/20 border border-gray-500/30 p-6 rounded-lg text-center">
                <span className="text-gray-400 text-4xl mb-4 block">📋</span>
                <p className="text-gray-300">No specific recommendations provided for this document.</p>
              </div>
            )}
          </div>
        )}

        {/* Confidence Score Tab */}
        {activeTab === 'confidence' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
              <h5 className="text-lg font-medium text-purple-400 tracking-wide">AI CONFIDENCE SCORE</h5>
            </div>
            
            <div className="bg-purple-900/20 border border-purple-500/30 p-8 rounded-lg">
              <div className="text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full border-8 border-purple-800"></div>
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-purple-400"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${50 + (analysis.confidence * 50)}% 0%, ${50 + (analysis.confidence * 50)}% 100%, 50% 100%)`
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{Math.round(analysis.confidence * 100)}%</div>
                      <div className="text-xs text-purple-300">CONFIDENCE</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h6 className="text-md font-medium text-purple-300 tracking-wide">ANALYSIS RELIABILITY</h6>
                  <div className="bg-purple-800/30 p-4 rounded border border-purple-500/20">
                    <p className="text-purple-200 text-sm leading-relaxed">
                      {analysis.confidence >= 0.8 ? "High confidence - The analysis is based on clear, comprehensive data with minimal ambiguity." :
                       analysis.confidence >= 0.6 ? "Moderate confidence - The analysis is reasonably reliable but may benefit from additional data verification." :
                       "Lower confidence - The analysis may require additional documentation or clarification for optimal accuracy."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
