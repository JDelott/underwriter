"use client";

import { useState } from 'react';
import { SummaryIcon, FinancialIcon, PropertyIcon, RiskIcon, ActionsIcon, ConfidenceIcon, AIIcon } from '@/components/ui/AnalysisIcons';

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

const cleanDocumentName = (filename: string): string => {
  // Remove file extensions
  let cleanName = filename.replace(/\.(txt|pdf|doc|docx|xlsx|csv)$/i, '');
  
  // Remove timestamps (ISO format or similar patterns)
  cleanName = cleanName.replace(/-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z/g, '');
  cleanName = cleanName.replace(/-\d{13,}/g, ''); // Remove long timestamp numbers
  
  // Replace hyphens and underscores with spaces
  cleanName = cleanName.replace(/[-_]/g, ' ');
  
  // Capitalize words and handle common abbreviations
  cleanName = cleanName.replace(/\b\w+/g, (word) => {
    const lowerWord = word.toLowerCase();
    // Handle common real estate terms
    if (lowerWord === 'noi') return 'NOI';
    if (lowerWord === 'roi') return 'ROI';
    if (lowerWord === 'cap') return 'Cap';
    if (lowerWord === 'dscr') return 'DSCR';
    if (lowerWord === 'ltv') return 'LTV';
    if (lowerWord === 'p&l' || lowerWord === 'pl') return 'P&L';
    
    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return cleanName.trim();
};

export default function TabbedAnalysisResults({ analysis, documentName }: TabbedAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const tabs = [
    { id: 'summary', label: 'SUMMARY', icon: SummaryIcon, color: 'emerald' },
    { id: 'financial', label: 'FINANCIAL', icon: FinancialIcon, color: 'blue' },
    { id: 'property', label: 'PROPERTY', icon: PropertyIcon, color: 'green' },
    { id: 'risks', label: 'RISKS', icon: RiskIcon, color: 'red' },
    { id: 'recommendations', label: 'ACTIONS', icon: ActionsIcon, color: 'cyan' },
    { id: 'confidence', label: 'CONFIDENCE', icon: ConfidenceIcon, color: 'purple' }
  ];

  const getTabClasses = (tabId: string, color: string) => {
    const isActive = activeTab === tabId;
    const colorClasses = {
      emerald: isActive ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/30' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/5',
      blue: isActive ? 'bg-blue-400 text-black shadow-lg shadow-blue-400/30' : 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/5',
      green: isActive ? 'bg-green-400 text-black shadow-lg shadow-green-400/30' : 'text-green-400 hover:text-green-300 hover:bg-green-400/5',
      red: isActive ? 'bg-red-400 text-black shadow-lg shadow-red-400/30' : 'text-red-400 hover:text-red-300 hover:bg-red-400/5',
      cyan: isActive ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/5',
      purple: isActive ? 'bg-purple-400 text-black shadow-lg shadow-purple-400/30' : 'text-purple-400 hover:text-purple-300 hover:bg-purple-400/5'
    };
    
    return `flex-1 px-3 py-4 text-xs font-bold tracking-wider transition-all duration-300 text-center rounded-t-lg ${
      colorClasses[color as keyof typeof colorClasses]
    } ${isActive ? 'transform translate-y-0' : 'hover:transform hover:-translate-y-1'}`;
  };

  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 border border-white/[0.08] rounded-lg overflow-hidden shadow-2xl">
      {/* Clean Header - No Branding */}
      <div className="bg-gradient-to-r from-black/60 to-black/40 p-4 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-400/40">
              <AIIcon size={12} className="text-black" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-emerald-400 tracking-wide">DOCUMENT ANALYSIS</h4>
              <p className="text-xs text-gray-500 truncate max-w-[300px]">{cleanDocumentName(documentName)}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-black/50 px-3 py-2 rounded">
            <div className="text-emerald-400 font-bold">AI POWERED</div>
            <div>ANALYSIS</div>
          </div>
        </div>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="bg-gradient-to-r from-black/30 to-black/20 p-2">
        <div className="grid grid-cols-6 gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={getTabClasses(tab.id, tab.color)}
              >
                <div className="flex flex-col items-center space-y-1">
                  <IconComponent size={16} className="text-current" />
                  <span className="text-xs font-bold tracking-wider">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Tab Content with Uniform Sizing */}
      <div className="p-6 h-[700px] overflow-y-auto bg-gradient-to-br from-white/[0.02] to-transparent">
        {/* Executive Summary Tab */}
        {activeTab === 'summary' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-400/40">
                <SummaryIcon size={16} className="text-black" />
              </div>
              <h5 className="text-xl font-light text-emerald-400 tracking-wide">EXECUTIVE SUMMARY</h5>
            </div>
            
            <div className="flex-1 space-y-6">
              {/* High-Level Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 p-4 rounded-xl shadow-lg text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">
                    {Math.round(analysis.confidence * 100)}%
                  </div>
                  <div className="text-xs text-emerald-300 tracking-wide uppercase">AI Confidence</div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 p-4 rounded-xl shadow-lg text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {Object.keys(analysis.key_metrics || {}).length}
                  </div>
                  <div className="text-xs text-blue-300 tracking-wide uppercase">Key Metrics</div>
                </div>
                
                <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 p-4 rounded-xl shadow-lg text-center">
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {analysis.risks?.length || 0}
                  </div>
                  <div className="text-xs text-red-300 tracking-wide uppercase">Risk Factors</div>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-500/30 p-4 rounded-xl shadow-lg text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {analysis.recommendations?.length || 0}
                  </div>
                  <div className="text-xs text-cyan-300 tracking-wide uppercase">Action Items</div>
                </div>
              </div>

              {/* Main Summary Content */}
              <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30 p-8 rounded-xl shadow-lg flex-1 min-h-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h6 className="text-lg font-medium text-emerald-300 tracking-wide uppercase">Document Analysis</h6>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        analysis.confidence >= 0.8 ? 'bg-green-400' : 
                        analysis.confidence >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-xs text-emerald-300">
                        {analysis.confidence >= 0.8 ? 'HIGH CONFIDENCE' : 
                         analysis.confidence >= 0.6 ? 'MODERATE CONFIDENCE' : 'LOW CONFIDENCE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto text-center">
                      <p className="text-gray-100 leading-relaxed text-xl font-light italic mb-6">
                        "{analysis.summary}"
                      </p>
                      
                      {/* Key Insights Pills */}
                      <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {analysis.confidence >= 0.8 && (
                          <div className="bg-green-400/20 border border-green-400/40 px-4 py-2 rounded-full">
                            <span className="text-green-300 text-sm font-medium">High Reliability Analysis</span>
                          </div>
                        )}
                        
                        {analysis.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
                          <div className="bg-blue-400/20 border border-blue-400/40 px-4 py-2 rounded-full">
                            <span className="text-blue-300 text-sm font-medium">Financial Data Available</span>
                          </div>
                        )}
                        
                        {analysis.property_insights?.strengths && analysis.property_insights.strengths.length > 0 && (
                          <div className="bg-emerald-400/20 border border-emerald-400/40 px-4 py-2 rounded-full">
                            <span className="text-emerald-300 text-sm font-medium">Property Strengths Identified</span>
                          </div>
                        )}
                        
                        {(!analysis.risks || analysis.risks.length === 0) && (
                          <div className="bg-green-400/20 border border-green-400/40 px-4 py-2 rounded-full">
                            <span className="text-green-300 text-sm font-medium">Low Risk Profile</span>
                          </div>
                        )}
                        
                        {analysis.risks && analysis.risks.length > 0 && (
                          <div className="bg-yellow-400/20 border border-yellow-400/40 px-4 py-2 rounded-full">
                            <span className="text-yellow-300 text-sm font-medium">Risk Factors Present</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Action Bar */}
                  <div className="mt-6 pt-6 border-t border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-emerald-300">
                        Document: <span className="text-white font-medium">{cleanDocumentName(documentName)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-emerald-300">
                        <span>AI Analysis</span>
                        <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Navigation Hints */}
              <div className="bg-gradient-to-r from-gray-900/30 to-gray-800/20 border border-gray-500/20 p-4 rounded-xl">
                <div className="flex items-center justify-center space-x-8 text-xs text-gray-400">
                  <div className="flex items-center space-x-2">
                    <FinancialIcon size={12} className="text-blue-400" />
                    <span>Financial metrics in FINANCIAL tab</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PropertyIcon size={12} className="text-green-400" />
                    <span>Property details in PROPERTY tab</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RiskIcon size={12} className="text-red-400" />
                    <span>Risk analysis in RISKS tab</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ActionsIcon size={12} className="text-cyan-400" />
                    <span>Next steps in ACTIONS tab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Metrics Tab */}
        {activeTab === 'financial' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-400/40">
                <FinancialIcon size={16} className="text-black" />
              </div>
              <h5 className="text-xl font-light text-blue-400 tracking-wide">FINANCIAL METRICS</h5>
            </div>
            
            <div className="flex-1 space-y-6 overflow-y-auto">
              {/* Key Metrics Grid */}
              {analysis.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
                <div className="space-y-4">
                  <h6 className="text-sm font-medium text-blue-300 tracking-wide uppercase">Key Performance Indicators</h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[200px]">
                    {Object.entries(analysis.key_metrics).map(([key, value]) => (
                      <div key={key} className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 p-6 rounded-xl shadow-lg hover:shadow-blue-400/20 transition-all duration-300 hover:scale-105 h-[120px] flex flex-col justify-between">
                        <div className="text-sm text-blue-300 font-medium tracking-wide uppercase">{key}</div>
                        <div className="text-2xl text-blue-400 font-bold">{String(value)}</div>
                      </div>
                    ))}
                    {/* Fill empty slots to maintain grid */}
                    {Array.from({ length: Math.max(0, 6 - Object.keys(analysis.key_metrics).length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="h-[120px]" />
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Highlights */}
              {analysis.financial_highlights && (
                <div className="space-y-4">
                  <h6 className="text-sm font-medium text-purple-300 tracking-wide uppercase">Financial Highlights</h6>
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 p-6 rounded-xl shadow-lg min-h-[300px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                      <div className="space-y-3">
                        <div className="text-sm font-bold text-purple-300 tracking-wide uppercase flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          Revenue Drivers
                        </div>
                        <div className="space-y-2 h-[200px] overflow-y-auto">
                          {analysis.financial_highlights.revenue_items && analysis.financial_highlights.revenue_items.length > 0 ? (
                            analysis.financial_highlights.revenue_items.map((item, index) => (
                              <div key={index} className="bg-purple-800/30 p-3 rounded-lg border border-purple-500/20 text-sm text-purple-200 hover:bg-purple-800/40 transition-colors">
                                {item}
                              </div>
                            ))
                          ) : (
                            <div className="bg-purple-800/20 p-4 rounded-lg text-center text-purple-300 text-sm">
                              No revenue data available
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-bold text-purple-300 tracking-wide uppercase flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          Expense Categories
                        </div>
                        <div className="space-y-2 h-[200px] overflow-y-auto">
                          {analysis.financial_highlights.expense_items && analysis.financial_highlights.expense_items.length > 0 ? (
                            analysis.financial_highlights.expense_items.map((item, index) => (
                              <div key={index} className="bg-purple-800/30 p-3 rounded-lg border border-purple-500/20 text-sm text-purple-200 hover:bg-purple-800/40 transition-colors">
                                {item}
                              </div>
                            ))
                          ) : (
                            <div className="bg-purple-800/20 p-4 rounded-lg text-center text-purple-300 text-sm">
                              No expense data available
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-bold text-purple-300 tracking-wide uppercase flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          Profitability
                        </div>
                        <div className="space-y-2 h-[200px] overflow-y-auto">
                          {analysis.financial_highlights.profitability_notes && analysis.financial_highlights.profitability_notes.length > 0 ? (
                            analysis.financial_highlights.profitability_notes.map((note, index) => (
                              <div key={index} className="bg-purple-800/30 p-3 rounded-lg border border-purple-500/20 text-sm text-purple-200 hover:bg-purple-800/40 transition-colors">
                                {note}
                              </div>
                            ))
                          ) : (
                            <div className="bg-purple-800/20 p-4 rounded-lg text-center text-purple-300 text-sm">
                              No profitability data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Property Insights Tab */}
        {activeTab === 'property' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/40">
                <PropertyIcon size={16} className="text-black" />
              </div>
              <h5 className="text-xl font-light text-green-400 tracking-wide">PROPERTY INSIGHTS</h5>
            </div>
            
            <div className="flex-1">
              {analysis.property_insights ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                  {/* Strengths */}
                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 p-6 rounded-xl shadow-lg h-[550px] flex flex-col">
                    <h6 className="text-lg font-medium text-green-400 mb-4 tracking-wide flex items-center">
                      <span className="text-2xl mr-3">✅</span>
                      STRENGTHS
                    </h6>
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {analysis.property_insights.strengths && analysis.property_insights.strengths.length > 0 ? (
                        analysis.property_insights.strengths.map((strength, index) => (
                          <div key={index} className="bg-green-800/40 p-4 rounded-lg border border-green-500/20 hover:bg-green-800/50 transition-colors">
                            <div className="flex items-start space-x-3">
                              <span className="text-green-400 mt-1 text-lg">✓</span>
                              <span className="text-green-200 text-sm leading-relaxed font-light">{strength}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center text-green-300">
                            <div className="text-4xl mb-2">🏢</div>
                            <p>No specific strengths identified</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Concerns */}
                  <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 p-6 rounded-xl shadow-lg h-[550px] flex flex-col">
                    <h6 className="text-lg font-medium text-yellow-400 mb-4 tracking-wide flex items-center">
                      <span className="text-2xl mr-3">⚠️</span>
                      CONCERNS
                    </h6>
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {analysis.property_insights.concerns && analysis.property_insights.concerns.length > 0 ? (
                        analysis.property_insights.concerns.map((concern, index) => (
                          <div key={index} className="bg-yellow-800/40 p-4 rounded-lg border border-yellow-500/20 hover:bg-yellow-800/50 transition-colors">
                            <div className="flex items-start space-x-3">
                              <span className="text-yellow-400 mt-1 text-lg">⚠</span>
                              <span className="text-yellow-200 text-sm leading-relaxed font-light">{concern}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center text-yellow-300">
                            <div className="text-4xl mb-2">✅</div>
                            <p>No major concerns identified</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-500/30 p-12 rounded-xl text-center h-[550px] flex items-center justify-center">
                  <div>
                    <span className="text-gray-400 text-6xl mb-4 block">🏢</span>
                    <p className="text-gray-300 text-lg">No specific property insights available for this document.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Risk Assessment Tab */}
        {activeTab === 'risks' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center shadow-lg shadow-red-400/40">
                <RiskIcon size={16} className="text-black" />
              </div>
              <h5 className="text-xl font-light text-red-400 tracking-wide">RISK ASSESSMENT</h5>
            </div>
            
            <div className="flex-1">
              {analysis.risks && analysis.risks.length > 0 ? (
                <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/30 p-6 rounded-xl shadow-lg h-[550px] flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {analysis.risks.map((risk, index) => (
                      <div key={index} className="bg-red-800/40 p-6 rounded-lg border border-red-500/20 hover:bg-red-800/50 transition-colors min-h-[80px] flex items-center">
                        <div className="flex items-start space-x-4 w-full">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <span className="text-red-200 text-sm leading-relaxed font-light">{risk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 p-12 rounded-xl text-center h-[550px] flex items-center justify-center">
                  <div>
                    <span className="text-green-400 text-6xl mb-4 block">✅</span>
                    <h6 className="text-green-400 text-xl font-medium mb-2">No Major Risks Identified</h6>
                    <p className="text-green-300 text-lg">This document shows minimal risk factors for the investment.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-400/40">
                <ActionsIcon size={16} className="text-black" />
              </div>
              <h5 className="text-xl font-light text-cyan-400 tracking-wide">ACTION ITEMS</h5>
            </div>
            
            <div className="flex-1">
              {analysis.recommendations && analysis.recommendations.length > 0 ? (
                <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 p-6 rounded-xl shadow-lg h-[550px] flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="bg-cyan-800/40 p-6 rounded-lg border border-cyan-500/20 hover:bg-cyan-800/50 transition-colors min-h-[80px] flex items-center">
                        <div className="flex items-start space-x-4 w-full">
                          <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <span className="text-cyan-200 text-sm leading-relaxed font-light">{rec}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900/30 to-gray-800/20 border border-gray-500/30 p-12 rounded-xl text-center h-[550px] flex items-center justify-center">
                  <div>
                    <span className="text-gray-400 text-6xl mb-4 block">📋</span>
                    <h6 className="text-gray-400 text-xl font-medium mb-2">No Specific Actions Required</h6>
                    <p className="text-gray-300 text-lg">No immediate recommendations provided for this document.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Confidence Score Tab */}
        {activeTab === 'confidence' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-purple-400 rounded-lg flex items-center justify-center shadow-lg shadow-purple-400/40">
                <ConfidenceIcon size={16} className="text-black" />
              </div>
              <h5 className="text-xl font-light text-purple-400 tracking-wide">AI CONFIDENCE SCORE</h5>
            </div>
            
            <div className="flex-1">
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border border-purple-500/30 p-8 rounded-xl shadow-lg h-[550px] flex flex-col">
                <div className="text-center space-y-8 flex-1 flex flex-col justify-center">
                  {/* Enhanced Circular Progress */}
                  <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 144 144">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-purple-800"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 60}`}
                        strokeDashoffset={`${2 * Math.PI * 60 * (1 - analysis.confidence)}`}
                        className="text-purple-400 transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-purple-400 mb-1">{Math.round(analysis.confidence * 100)}%</div>
                        <div className="text-xs text-purple-300 tracking-wider">CONFIDENCE</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Confidence Analysis */}
                  <div className="space-y-4">
                    <h6 className="text-lg font-medium text-purple-300 tracking-wide">ANALYSIS RELIABILITY</h6>
                    <div className="bg-purple-800/40 p-6 rounded-lg border border-purple-500/20 min-h-[120px] flex items-center">
                      <p className="text-purple-200 text-base leading-relaxed font-light">
                        {analysis.confidence >= 0.8 ? 
                          "🎯 High Confidence - The analysis is based on clear, comprehensive data with minimal ambiguity. Results are highly reliable for decision-making." :
                         analysis.confidence >= 0.6 ? 
                          "⚖️ Moderate Confidence - The analysis is reasonably reliable but may benefit from additional data verification or supplementary documentation." :
                          "⚠️ Lower Confidence - The analysis may require additional documentation, clarification, or expert review for optimal accuracy and reliability."}
                      </p>
                    </div>
                    
                    {/* Confidence Breakdown */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-purple-800/20 rounded-lg border border-purple-500/20 h-[80px] flex flex-col justify-center">
                        <div className="text-lg font-bold text-purple-400">
                          {analysis.confidence >= 0.8 ? '🟢' : analysis.confidence >= 0.6 ? '🟡' : '🔴'}
                        </div>
                        <div className="text-xs text-purple-300 mt-2">RELIABILITY</div>
                      </div>
                      <div className="text-center p-4 bg-purple-800/20 rounded-lg border border-purple-500/20 h-[80px] flex flex-col justify-center">
                        <div className="text-lg font-bold text-purple-400">
                          {Object.keys(analysis.key_metrics || {}).length}
                        </div>
                        <div className="text-xs text-purple-300 mt-2">DATA POINTS</div>
                      </div>
                      <div className="text-center p-4 bg-purple-800/20 rounded-lg border border-purple-500/20 h-[80px] flex flex-col justify-center">
                        <div className="text-lg font-bold text-purple-400">
                          {analysis.risks?.length || 0}
                        </div>
                        <div className="text-xs text-purple-300 mt-2">RISK FACTORS</div>
                      </div>
                    </div>
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
