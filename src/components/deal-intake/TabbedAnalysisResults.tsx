"use client";

import { useState } from 'react';
import { SummaryIcon, FinancialIcon, PropertyIcon, RiskIcon, ActionsIcon, ConfidenceIcon } from '@/components/ui/AnalysisIcons';

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

export default function TabbedAnalysisResults({ analysis }: TabbedAnalysisResultsProps) {
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
      emerald: isActive ? 'bg-emerald-400 text-black' : 'text-emerald-400 hover:bg-emerald-400/10',
      blue: isActive ? 'bg-blue-400 text-black' : 'text-blue-400 hover:bg-blue-400/10',
      green: isActive ? 'bg-green-400 text-black' : 'text-green-400 hover:bg-green-400/10',
      red: isActive ? 'bg-red-400 text-black' : 'text-red-400 hover:bg-red-400/10',
      cyan: isActive ? 'bg-cyan-400 text-black' : 'text-cyan-400 hover:bg-cyan-400/10',
      purple: isActive ? 'bg-purple-400 text-black' : 'text-purple-400 hover:bg-purple-400/10'
    };
    
    return `flex-1 px-2 py-3 text-xs font-bold tracking-wider transition-all duration-300 text-center rounded ${
      colorClasses[color as keyof typeof colorClasses]
    }`;
  };

  return (
    <div className="bg-gradient-to-br from-black/40 to-black/20 border border-white/[0.08] rounded-lg overflow-hidden">
      {/* Compact Tab Navigation */}
      <div className="bg-gradient-to-r from-black/30 to-black/20 p-1">
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
                  <IconComponent size={12} className="text-current" />
                  <span className="text-xs font-bold tracking-wider">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Streamlined Tab Content */}
      <div className="p-4 h-[600px] overflow-y-auto bg-gradient-to-br from-white/[0.02] to-transparent">
        {/* Executive Summary Tab - No Redundant Headers */}
        {activeTab === 'summary' && (
          <div className="h-full flex flex-col space-y-4">
            {/* Key Financial Metrics Only */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* NOI */}
              <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border border-emerald-400/50 p-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-xs text-emerald-300 font-bold uppercase mb-1">NOI</div>
                <div className="text-xl text-emerald-400 font-bold">
                  {analysis.key_metrics?.['NOI'] || 
                   analysis.key_metrics?.['Net Operating Income'] || 
                   analysis.key_metrics?.['net_operating_income'] ||
                   'N/A'}
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-400/50 p-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-xs text-blue-300 font-bold uppercase mb-1">Revenue</div>
                <div className="text-xl text-blue-400 font-bold">
                  {analysis.key_metrics?.['Total Revenue'] || 
                   analysis.key_metrics?.['total_revenue'] || 
                   analysis.key_metrics?.['Revenue'] ||
                   'N/A'}
                </div>
              </div>

              {/* Expenses */}
              <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 border border-red-400/50 p-3 rounded-lg shadow-lg hover:scale-105 transition-all duration-300">
                <div className="text-xs text-red-300 font-bold uppercase mb-1">Expenses</div>
                <div className="text-xl text-red-400 font-bold">
                  {analysis.key_metrics?.['Total Expenses'] || 
                   analysis.key_metrics?.['total_expenses'] || 
                   analysis.key_metrics?.['Expenses'] ||
                   'N/A'}
                </div>
              </div>
            </div>

            {/* Main Summary - Clean */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30 p-4 rounded-lg shadow-lg flex-1">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium text-emerald-300 uppercase tracking-wide">Analysis</div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    analysis.confidence >= 0.8 ? 'bg-green-400' : 
                    analysis.confidence >= 0.6 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-xs text-emerald-300">{Math.round(analysis.confidence * 100)}% Confidence</span>
                </div>
              </div>
              
              <p className="text-gray-100 leading-relaxed text-sm italic">
                &quot;{analysis.summary}&quot;
              </p>
              
              {/* Compact Insights */}
              <div className="flex flex-wrap gap-2 mt-3">
                {analysis.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
                  <span className="bg-blue-400/20 border border-blue-400/40 px-2 py-1 rounded text-xs text-blue-300">
                    {Object.keys(analysis.key_metrics).length} Metrics
                  </span>
                )}
                {analysis.risks && analysis.risks.length > 0 && (
                  <span className="bg-red-400/20 border border-red-400/40 px-2 py-1 rounded text-xs text-red-300">
                    {analysis.risks.length} Risks
                  </span>
                )}
                {analysis.recommendations && analysis.recommendations.length > 0 && (
                  <span className="bg-cyan-400/20 border border-cyan-400/40 px-2 py-1 rounded text-xs text-cyan-300">
                    {analysis.recommendations.length} Actions
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Financial Tab - Simplified */}
        {activeTab === 'financial' && (
          <div className="h-full overflow-y-auto">
            {analysis.key_metrics && Object.keys(analysis.key_metrics).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(analysis.key_metrics).map(([key, value]) => (
                  <div key={key} className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 p-3 rounded-lg">
                    <div className="text-xs text-blue-300 font-medium uppercase mb-1">{key}</div>
                    <div className="text-lg text-blue-400 font-bold">{String(value)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Property Tab - Simplified */}
        {activeTab === 'property' && (
          <div className="h-full">
            {analysis.property_insights ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                {/* Strengths */}
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 p-4 rounded-lg">
                  <h6 className="text-sm font-medium text-green-400 mb-3 uppercase">Strengths</h6>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {analysis.property_insights.strengths?.map((strength, index) => (
                      <div key={index} className="bg-green-800/40 p-3 rounded text-sm text-green-200">
                        {strength}
                      </div>
                    )) || <div className="text-center text-green-300">No strengths identified</div>}
                  </div>
                </div>

                {/* Concerns */}
                <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 p-4 rounded-lg">
                  <h6 className="text-sm font-medium text-yellow-400 mb-3 uppercase">Concerns</h6>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {analysis.property_insights.concerns?.map((concern, index) => (
                      <div key={index} className="bg-yellow-800/40 p-3 rounded text-sm text-yellow-200">
                        {concern}
                      </div>
                    )) || <div className="text-center text-yellow-300">No concerns identified</div>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400">No property insights available</div>
            )}
          </div>
        )}

        {/* Risks Tab - Simplified */}
        {activeTab === 'risks' && (
          <div className="h-full">
            {analysis.risks && analysis.risks.length > 0 ? (
              <div className="space-y-3">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className="bg-red-800/40 p-4 rounded-lg border border-red-500/20 flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-red-200 text-sm">{risk}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">✅</div>
                <h6 className="text-green-400 text-lg font-medium">No Major Risks</h6>
              </div>
            )}
          </div>
        )}

        {/* Actions Tab - Simplified */}
        {activeTab === 'recommendations' && (
          <div className="h-full">
            {analysis.recommendations && analysis.recommendations.length > 0 ? (
              <div className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="bg-cyan-800/40 p-4 rounded-lg border border-cyan-500/20 flex items-start space-x-3">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-cyan-200 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📋</div>
                <h6 className="text-gray-400 text-lg font-medium">No Actions Required</h6>
              </div>
            )}
          </div>
        )}

        {/* Confidence Tab - Simplified */}
        {activeTab === 'confidence' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-purple-400 mb-4">{Math.round(analysis.confidence * 100)}%</div>
              <h6 className="text-lg font-medium text-purple-300 mb-4">AI Confidence Score</h6>
              <p className="text-purple-200 text-sm max-w-md">
                {analysis.confidence >= 0.8 ? 
                  "High confidence - analysis is based on clear, comprehensive data." :
                 analysis.confidence >= 0.6 ? 
                  "Moderate confidence - analysis is reasonably reliable." :
                  "Lower confidence - may require additional verification."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
