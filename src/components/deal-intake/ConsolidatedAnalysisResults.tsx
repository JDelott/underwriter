// src/components/deal-intake/ConsolidatedAnalysisResults.tsx
"use client";

import { useState } from 'react';
import TabbedAnalysisResults from './TabbedAnalysisResults';

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

interface Document {
  id: number;
  original_filename: string;
  status: string;
  analysis_result?: AnalysisResult;
  created_at: string;
}

interface ConsolidatedAnalysisResultsProps {
  documents: Document[];
}

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

export default function ConsolidatedAnalysisResults({ documents }: ConsolidatedAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<string>('');

  // Group documents by type based on filename/content
  const groupDocumentsByType = (docs: Document[]) => {
    const groups: { [key: string]: Document[] } = {};
    
    docs.forEach(doc => {
      const filename = doc.original_filename.toLowerCase();
      let type = 'other';
      
      if (filename.includes('rent') || filename.includes('roll')) {
        type = 'rent-roll';
      } else if (filename.includes('operating') || filename.includes('statement')) {
        type = 'operating-statement';
      } else if (filename.includes('lease') || filename.includes('agreement')) {
        type = 'lease-agreement';
      } else if (filename.includes('profit') || filename.includes('loss') || filename.includes('p&l')) {
        type = 'profit-loss';
      } else if (filename.includes('appraisal')) {
        type = 'appraisal';
      } else if (filename.includes('inspection')) {
        type = 'inspection';
      }
      
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(doc);
    });
    
    return groups;
  };

  const getTypeInfo = (type: string) => {
    const typeMap: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
      'rent-roll': { label: 'RENT ROLL', icon: '📊', color: 'emerald', bgColor: 'bg-emerald-400' },
      'operating-statement': { label: 'OPERATING STATEMENT', icon: '💰', color: 'blue', bgColor: 'bg-blue-400' },
      'lease-agreement': { label: 'LEASE AGREEMENTS', icon: '📄', color: 'purple', bgColor: 'bg-purple-400' },
      'profit-loss': { label: 'P&L STATEMENTS', icon: '📈', color: 'green', bgColor: 'bg-green-400' },
      'appraisal': { label: 'APPRAISALS', icon: '🏡', color: 'orange', bgColor: 'bg-orange-400' },
      'inspection': { label: 'INSPECTIONS', icon: '🔍', color: 'red', bgColor: 'bg-red-400' },
      'other': { label: 'OTHER DOCUMENTS', icon: '📋', color: 'gray', bgColor: 'bg-gray-400' }
    };
    
    return typeMap[type] || typeMap.other;
  };

  const analyzedDocuments = documents.filter(doc => doc.analysis_result);
  
  if (analyzedDocuments.length === 0) {
    return null;
  }

  const documentGroups = groupDocumentsByType(analyzedDocuments);
  const groupKeys = Object.keys(documentGroups);
  
  // Set initial active tab
  if (!activeTab && groupKeys.length > 0) {
    setActiveTab(groupKeys[0]);
  }

  const getTabClasses = (type: string, color: string) => {
    const isActive = activeTab === type;
    const colorClasses = {
      emerald: isActive ? 'bg-emerald-400 text-black shadow-emerald-400/40' : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10',
      blue: isActive ? 'bg-blue-400 text-black shadow-blue-400/40' : 'text-blue-400 hover:text-blue-300 hover:bg-blue-400/10',
      purple: isActive ? 'bg-purple-400 text-black shadow-purple-400/40' : 'text-purple-400 hover:text-purple-300 hover:bg-purple-400/10',
      green: isActive ? 'bg-green-400 text-black shadow-green-400/40' : 'text-green-400 hover:text-green-300 hover:bg-green-400/10',
      orange: isActive ? 'bg-orange-400 text-black shadow-orange-400/40' : 'text-orange-400 hover:text-orange-300 hover:bg-orange-400/10',
      red: isActive ? 'bg-red-400 text-black shadow-red-400/40' : 'text-red-400 hover:text-red-300 hover:bg-red-400/10',
      gray: isActive ? 'bg-gray-400 text-black shadow-gray-400/40' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-400/10'
    };
    
    return `px-6 py-4 text-sm font-bold tracking-wide transition-all duration-200 rounded-t-lg border-b-2 ${
      isActive ? `border-${color}-400 shadow-lg` : 'border-transparent'
    } ${colorClasses[color as keyof typeof colorClasses]}`;
  };

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-black/70 to-black/50 p-6 border-b border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-400/40">
              <span className="text-black font-bold text-lg">AI</span>
            </div>
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide">
                COMPREHENSIVE ANALYSIS
              </h2>
              <p className="text-sm text-gray-400">
                {analyzedDocuments.length} document{analyzedDocuments.length !== 1 ? 's' : ''} analyzed • AI Powered
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-400 bg-black/50 px-3 py-2 rounded-lg border border-gray-600">
              AI POWERED
            </div>
            <div className="text-xs text-emerald-400 bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-500/30">
              REAL-TIME ANALYSIS
            </div>
          </div>
        </div>
      </div>

      {/* Document Type Tabs - Enhanced */}
      <div className="bg-gradient-to-r from-black/30 to-black/20 border-b border-white/[0.08] px-6 pt-4">
        <div className="flex space-x-2 overflow-x-auto pb-4">
          {groupKeys.map((type) => {
            const typeInfo = getTypeInfo(type);
            const docCount = documentGroups[type].length;
            
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={getTabClasses(type, typeInfo.color)}
              >
                <div className="flex items-center space-x-3 min-w-max">
                  <span className="text-lg">{typeInfo.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold">{typeInfo.label}</div>
                    <div className="text-xs opacity-75">{docCount} document{docCount !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Enhanced */}
      <div className="min-h-[600px]">
        {activeTab && documentGroups[activeTab] && (
          <div className="space-y-6 p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-light text-white mb-2">
                {getTypeInfo(activeTab).label} ANALYSIS
              </h3>
              <p className="text-gray-400">
                {documentGroups[activeTab].length} document{documentGroups[activeTab].length !== 1 ? 's' : ''} • 
                Click through the analysis tabs below to explore detailed insights
              </p>
            </div>

            {documentGroups[activeTab].map((doc, index) => (
              <div key={doc.id} className="bg-gradient-to-br from-white/[0.02] to-white/[0.04] border border-white/[0.08] rounded-lg shadow-lg overflow-hidden">
                {/* Document Header */}
                <div className="bg-gradient-to-r from-black/40 to-black/30 p-5 border-b border-white/[0.08]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white mb-1 tracking-wide">
                          {cleanDocumentName(doc.original_filename)}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</span>
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                            {doc.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-400 bg-black/50 px-3 py-1 rounded border border-gray-600">
                        {getTypeInfo(activeTab).label}
                      </div>
                      <div className="text-xs text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded border border-emerald-500/30">
                        ANALYZED
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                {doc.analysis_result && (
                  <div className="p-1">
                    <TabbedAnalysisResults 
                      analysis={doc.analysis_result} 
                      documentName={doc.original_filename}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
