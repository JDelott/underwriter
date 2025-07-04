"use client";

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';

interface AnalysisResult {
  summary: string;
  key_metrics: Record<string, string | number>;
  risks: string[];
  recommendations: string[];
  confidence: number;
}

export default function TestAnalysisPage() {
  const [text, setText] = useState('');
  const [documentType, setDocumentType] = useState('rent roll');
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          documentType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.analysis);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to connect to analysis service');
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleTexts: Record<string, string> = {
    'rent roll': `Property: 123 Main Street Apartments
Total Units: 24
Monthly Rent Roll:

Unit 1A: $1,200/month - Occupied
Unit 1B: $1,150/month - Occupied  
Unit 2A: $1,300/month - Vacant
Unit 2B: $1,250/month - Occupied
Unit 3A: $1,400/month - Occupied

Total Monthly Income: $28,800
Occupancy Rate: 83%
Average Rent: $1,260`,

    'operating statement': `Annual Operating Statement - 2023
123 Main Street Apartments

INCOME:
Gross Rental Income: $345,600
Other Income: $12,000
Total Income: $357,600

EXPENSES:
Property Management: $21,456
Maintenance & Repairs: $15,800
Utilities: $8,500
Insurance: $9,200
Property Taxes: $18,500
Total Expenses: $73,456

Net Operating Income: $284,144`,

    'lease agreement': `RESIDENTIAL LEASE AGREEMENT

Property: 123 Main St, Unit 2A
Tenant: John Smith
Lease Term: 12 months
Monthly Rent: $1,300
Security Deposit: $1,300
Lease Start: January 1, 2024
Lease End: December 31, 2024

Special Terms:
- Pets allowed with $200 deposit
- Tenant responsible for utilities
- 60-day notice required for termination`
  };

  const loadSample = (type: string) => {
    setText(sampleTexts[type] || '');
    setDocumentType(type);
  };

  return (
    <AppLayout title="AI DOCUMENT ANALYSIS">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Sample Data Section */}
        <div className="bg-white/[0.03] border border-emerald-400/20 p-8 shadow-2xl shadow-emerald-400/10">
          <h2 className="text-2xl font-light mb-6 text-white tracking-wide">SAMPLE DATA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => loadSample('rent roll')}
              className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-6 py-4 font-bold transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
            >
              RENT ROLL
            </button>
            <button
              onClick={() => loadSample('operating statement')}
              className="bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-300 hover:to-purple-400 text-black px-6 py-4 font-bold transition-all duration-200 shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 tracking-wide"
            >
              OPERATING STATEMENT
            </button>
            <button
              onClick={() => loadSample('lease agreement')}
              className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-300 hover:to-red-400 text-black px-6 py-4 font-bold transition-all duration-200 shadow-lg shadow-orange-400/40 hover:shadow-orange-400/60 tracking-wide"
            >
              LEASE AGREEMENT
            </button>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white/[0.03] border border-white/[0.08] p-8 shadow-2xl shadow-emerald-400/10">
          <div className="mb-6">
            <label className="block text-gray-300 mb-3 tracking-wide font-medium">DOCUMENT TYPE</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors"
            >
              <option value="rent roll">Rent Roll</option>
              <option value="operating statement">Operating Statement</option>
              <option value="lease agreement">Lease Agreement</option>
              <option value="profit and loss">Profit & Loss Statement</option>
              <option value="appraisal">Appraisal Report</option>
              <option value="inspection report">Inspection Report</option>
              <option value="other">Other Document</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-3 tracking-wide font-medium">DOCUMENT CONTENT</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your document content here..."
              className="w-full h-64 bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors font-mono text-sm"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !text.trim()}
            className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? 'ANALYZING WITH CLAUDE AI...' : 'ANALYZE DOCUMENT'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 p-6 shadow-lg shadow-red-500/20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">!</div>
              <p className="text-red-400 tracking-wide">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="bg-white/[0.03] border border-emerald-400/20 p-8 shadow-2xl shadow-emerald-400/10">
            <h2 className="text-2xl font-light mb-6 text-white tracking-wide">ANALYSIS RESULTS</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-3 tracking-wide">SUMMARY</h3>
                <div className="bg-black/30 border border-gray-600 p-4 text-gray-300 leading-relaxed">
                  {results.summary}
                </div>
              </div>

              {results.key_metrics && Object.keys(results.key_metrics).length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-emerald-400 mb-3 tracking-wide">KEY METRICS</h3>
                  <div className="bg-black/30 border border-gray-600 p-4 space-y-3">
                    {Object.entries(results.key_metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
                        <span className="text-gray-300 tracking-wide">{key}:</span>
                        <span className="text-emerald-400 font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.risks && results.risks.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-red-400 mb-3 tracking-wide">RISKS & RED FLAGS</h3>
                  <div className="bg-red-900/20 border border-red-500/50 p-4 space-y-2">
                    {results.risks.map((risk, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-red-300">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.recommendations && results.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-green-400 mb-3 tracking-wide">RECOMMENDATIONS</h3>
                  <div className="bg-green-900/20 border border-green-500/50 p-4 space-y-2">
                    {results.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-green-300">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-emerald-400 mb-3 tracking-wide">CONFIDENCE SCORE</h3>
                <div className="bg-black/30 border border-gray-600 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full shadow-lg shadow-emerald-400/50 transition-all duration-500" 
                        style={{ width: `${(results.confidence || 0) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-emerald-400 font-bold text-xl tracking-wide">
                      {((results.confidence || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
