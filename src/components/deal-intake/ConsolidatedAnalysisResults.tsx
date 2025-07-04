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
    const typeMap = {
      'rent-roll': { label: 'RENT ROLL', icon: '📊', color: 'emerald' },
      'operating-statement': { label: 'OPERATING STATEMENT', icon: '💰', color: 'blue' },
      'lease-agreement': { label: 'LEASE AGREEMENTS', icon: '📄', color: 'purple' },
      'profit-loss': { label: 'P&L STATEMENTS', icon: '📈', color: 'green' },
      'appraisal': { label: 'APPRAISALS', icon: '🏡', color: 'orange' },
      'inspection': { label: 'INSPECTIONS', icon: '🔍', color: 'red' },
      'other': { label: 'OTHER DOCUMENTS', icon: '📋', color: 'gray' }
    } as const;
    return typeMap[type as keyof typeof typeMap] || typeMap.other;
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
      emerald: isActive ? 'bg-emerald-400 text-black shadow-emerald-400/40' : 'text-emerald-400 hover:text-emerald-300',
      blue: isActive ? 'bg-blue-400 text-black shadow-blue-400/40' : 'text-blue-400 hover:text-blue-300',
      purple: isActive ? 'bg-purple-400 text-black shadow-purple-400/40' : 'text-purple-400 hover:text-purple-300',
      green: isActive ? 'bg-green-400 text-black shadow-green-400/40' : 'text-green-400 hover:text-green-300',
      orange: isActive ? 'bg-orange-400 text-black shadow-orange-400/40' : 'text-orange-400 hover:text-orange-300',
      red: isActive ? 'bg-red-400 text-black shadow-red-400/40' : 'text-red-400 hover:text-red-300',
      gray: isActive ? 'bg-gray-400 text-black shadow-gray-400/40' : 'text-gray-400 hover:text-gray-300'
    };
    
    return `px-6 py-4 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 ${
      isActive ? `border-${color}-400 shadow-lg` : 'border-transparent hover:border-gray-600'
    } ${colorClasses[color as keyof typeof colorClasses]}`;
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-black/50 p-6 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">AI</span>
            </div>
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide">
                DEAL ANALYSIS DASHBOARD
              </h2>
              <p className="text-sm text-gray-400">
                {analyzedDocuments.length} documents analyzed • Claude 4 AI
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400 bg-gray-800 px-4 py-2 rounded">
            ANTHROPIC CLAUDE 3.5 SONNET
          </div>
        </div>
      </div>

      {/* Document Type Tabs */}
      <div className="bg-black/30 border-b border-gray-600 overflow-x-auto">
        <div className="flex min-w-max">
          {groupKeys.map((type) => {
            const typeInfo = getTypeInfo(type);
            const docCount = documentGroups[type].length;
            
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={getTabClasses(type, typeInfo.color)}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{typeInfo.icon}</span>
                  <span>{typeInfo.label}</span>
                  <span className="bg-black/30 text-xs px-2 py-1 rounded">
                    {docCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab && documentGroups[activeTab] && (
          <div className="space-y-6">
            {documentGroups[activeTab].map((doc) => (
              <div key={doc.id} className="border border-gray-600 rounded-lg overflow-hidden">
                {/* Document Header */}
                <div className="bg-black/30 p-4 border-b border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1 tracking-wide">
                        {doc.original_filename}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Uploaded: {new Date(doc.created_at).toLocaleDateString()} • 
                        Status: <span className="text-emerald-400">{doc.status.toUpperCase()}</span>
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded">
                      {getTypeInfo(activeTab).label}
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                {doc.analysis_result && (
                  <div className="p-4">
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
