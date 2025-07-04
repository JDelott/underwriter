"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';

interface AnalysisResult {
  summary: string;
  key_metrics: Record<string, string | number>;
  risks: string[];
  recommendations: string[];
  confidence: number;
}

interface Document {
  id: number;
  original_filename: string;
  status: string;
  analysis_result?: AnalysisResult;
  created_at: string;
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

export default function DealPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [textInput, setTextInput] = useState('');
  const [documentType, setDocumentType] = useState('rent roll');

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(`/api/deals/${dealId}/documents`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await fetch(`/api/deals/${dealId}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    setUploading(true);
    try {
      const response = await fetch(`/api/deals/${dealId}/upload-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textInput,
          documentType,
        }),
      });

      if (response.ok) {
        setTextInput('');
        fetchDocuments();
      }
    } catch (error) {
      console.error('Text upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      
      const response = await fetch(`/api/deals/${dealId}/analyze`, {
        method: 'POST',
      });

      if (response.ok) {
        router.push(`/deals/${dealId}/analysis`);
      } else {
        console.error('Analysis failed');
        router.push(`/deals/${dealId}/analysis`);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      router.push(`/deals/${dealId}/analysis`);
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'text-emerald-400';
      case 'analyzing': return 'text-yellow-400';
      case 'uploaded': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-emerald-400/10 border-emerald-400/30';
      case 'analyzing': return 'bg-yellow-400/10 border-yellow-400/30';
      case 'uploaded': return 'bg-blue-400/10 border-blue-400/30';
      case 'error': return 'bg-red-400/10 border-red-400/30';
      default: return 'bg-gray-400/10 border-gray-400/30';
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
    setTextInput(sampleTexts[type] || '');
    setDocumentType(type);
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Upload Section */}
        <div className="bg-white/[0.03] border border-emerald-400/20 p-8 shadow-2xl shadow-emerald-400/10">
          <h2 className="text-2xl font-light mb-6 text-white tracking-wide">DOCUMENT INPUT</h2>
          
          {/* Mode Toggle */}
          <div className="flex mb-6 bg-black/30 border border-gray-600 p-1 rounded-lg">
            <button
              onClick={() => setInputMode('file')}
              className={`flex-1 px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 ${
                inputMode === 'file'
                  ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              FILE UPLOAD
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex-1 px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200 ${
                inputMode === 'text'
                  ? 'bg-emerald-400 text-black shadow-lg shadow-emerald-400/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              TEXT INPUT
            </button>
          </div>

          {/* File Upload Mode */}
          {inputMode === 'file' && (
            <div
              className={`border-2 border-dashed p-12 text-center transition-all duration-200 ${
                dragOver 
                  ? 'border-emerald-400 bg-emerald-400/10' 
                  : 'border-gray-600 hover:border-emerald-400/50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-6xl text-emerald-400">📁</div>
                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    Drag and drop your documents here
                  </p>
                  <p className="text-sm text-gray-400">
                    or click to browse files
                  </p>
                </div>
                
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide cursor-pointer"
                >
                  {uploading ? 'UPLOADING...' : 'SELECT FILES'}
                </label>
              </div>
            </div>
          )}

          {/* Text Input Mode */}
          {inputMode === 'text' && (
            <div className="space-y-6">
              {/* Sample Data Buttons */}
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3 tracking-wide">LOAD SAMPLE DATA</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => loadSample('rent roll')}
                    className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-4 py-2 font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
                  >
                    RENT ROLL
                  </button>
                  <button
                    onClick={() => loadSample('operating statement')}
                    className="bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-300 hover:to-purple-400 text-black px-4 py-2 font-bold text-sm transition-all duration-200 shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 tracking-wide"
                  >
                    OPERATING STATEMENT
                  </button>
                  <button
                    onClick={() => loadSample('lease agreement')}
                    className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-300 hover:to-red-400 text-black px-4 py-2 font-bold text-sm transition-all duration-200 shadow-lg shadow-orange-400/40 hover:shadow-orange-400/60 tracking-wide"
                  >
                    LEASE AGREEMENT
                  </button>
                </div>
              </div>

              {/* Document Type Selection */}
              <div>
                <label className="block text-gray-300 mb-2 tracking-wide font-medium">DOCUMENT TYPE</label>
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

              {/* Text Input Area */}
              <div>
                <label className="block text-gray-300 mb-2 tracking-wide font-medium">DOCUMENT CONTENT</label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your document content here..."
                  className="w-full h-64 bg-black/50 border border-gray-600 text-white px-4 py-3 focus:border-emerald-400 focus:outline-none transition-colors font-mono text-sm"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleTextSubmit}
                disabled={uploading || !textInput.trim()}
                className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'ADDING DOCUMENT...' : 'ADD TEXT DOCUMENT'}
              </button>
            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || documents.length === 0}
              className="bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-300 hover:to-purple-400 text-black px-8 py-4 font-bold transition-all duration-200 shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'ANALYZING WITH AI...' : 'ANALYZE DOCUMENTS & VIEW RESULTS →'}
            </button>
          </div>
        </div>

        {/* Documents Summary */}
        <div className="bg-white/[0.03] border border-white/[0.08] p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-light text-white tracking-wide mb-2">
                UPLOADED DOCUMENTS
              </h2>
              <p className="text-gray-400">
                {documents.length} documents uploaded • {documents.filter(d => d.analysis_result).length} analyzed
              </p>
            </div>
            {documents.filter(d => d.analysis_result).length > 0 && (
              <Link
                href={`/deals/${dealId}/analysis`}
                className="bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-300 hover:to-purple-400 text-black px-6 py-3 font-bold transition-all duration-200 shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 tracking-wide"
              >
                VIEW ANALYSIS →
              </Link>
            )}
          </div>

          {/* Document List */}
          {documents.length > 0 ? (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-black/30 border border-gray-600 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {doc.original_filename.toLowerCase().includes('rent') ? '📊' :
                       doc.original_filename.toLowerCase().includes('operating') ? '💰' :
                       doc.original_filename.toLowerCase().includes('lease') ? '📄' : '📋'}
                    </div>
                    <div>
                      <h3 className="text-white font-medium tracking-wide">{cleanDocumentName(doc.original_filename)}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`text-xs tracking-widest font-bold px-3 py-1 border ${getStatusBg(doc.status)} ${getStatusColor(doc.status)}`}>
                      {doc.status.toUpperCase()}
                    </div>
                    {doc.analysis_result && (
                      <div className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-500/30 px-2 py-1 rounded">
                        ✓ ANALYZED
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No documents uploaded yet
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
