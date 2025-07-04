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

// Cleans document filenames by removing extensions and timestamps
export const cleanDocumentName = (filename: string): string => {
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

  return (
    <div className="overflow-hidden">
      {/* Compact Document Type Tabs - Much Smaller */}
      <div className="bg-gradient-to-r from-black/30 to-black/20 border-b border-white/[0.08] px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {groupKeys.map((type) => {
            const typeInfo = getTypeInfo(type);
            const docCount = documentGroups[type].length;
            const isActive = activeTab === type;
            
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200 rounded whitespace-nowrap ${
                  isActive 
                    ? `bg-${typeInfo.color}-400 text-black shadow-lg` 
                    : `text-${typeInfo.color}-400 hover:bg-${typeInfo.color}-400/10`
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{typeInfo.icon}</span>
                  <span>{typeInfo.label}</span>
                  <span className="opacity-75">({docCount})</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Direct Tab Content - No Redundant Cards */}
      <div className="min-h-[600px]">
        {activeTab && documentGroups[activeTab] && (
          <div className="space-y-4 p-3">
            {documentGroups[activeTab].map((doc) => (
              <div key={doc.id} className="bg-gradient-to-br from-white/[0.02] to-white/[0.04] border border-white/[0.08] rounded-lg shadow-lg overflow-hidden">
                {/* Direct Analysis - No Headers */}
                {doc.analysis_result && (
                  <TabbedAnalysisResults 
                    analysis={doc.analysis_result} 
                    documentName={doc.original_filename}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
