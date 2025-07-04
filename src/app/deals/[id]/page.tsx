"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
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

export default function DealPage() {
  const params = useParams();
  const dealId = params.id as string;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(`/api/deals/${dealId}/analyze`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchDocuments();
      }
    } catch (error) {
      console.error('Analysis failed:', error);
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

  return (
    <AppLayout title={`DEAL #${dealId}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Upload Section */}
        <div className="bg-white/[0.03] border border-emerald-400/20 p-8 shadow-2xl shadow-emerald-400/10">
          <h2 className="text-2xl font-light mb-6 text-white tracking-wide">DOCUMENT UPLOAD</h2>
          
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

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || documents.length === 0}
              className="bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-300 hover:to-purple-400 text-black px-8 py-4 font-bold transition-all duration-200 shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? 'ANALYZING WITH AI...' : 'ANALYZE ALL DOCUMENTS'}
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white/[0.03] border border-white/[0.08] p-8 hover:bg-emerald-400/5 hover:border-emerald-400/40 transition-all duration-300">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-normal text-white mb-2 tracking-wide">{doc.original_filename}</h3>
                  <p className="text-sm text-gray-400 tracking-wide">
                    Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-xs tracking-widest font-bold px-3 py-1 border ${getStatusBg(doc.status)} ${getStatusColor(doc.status)}`}>
                  {doc.status.toUpperCase()}
                </div>
              </div>
              
              {doc.analysis_result && (
                <div className="bg-black/30 border border-gray-600 p-6 space-y-6">
                  <h4 className="text-lg font-medium text-emerald-400 tracking-wide">ANALYSIS RESULTS</h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-3 tracking-wide">SUMMARY</h5>
                      <p className="text-gray-400 text-sm leading-relaxed">{doc.analysis_result.summary}</p>
                    </div>
                    
                    {doc.analysis_result.key_metrics && Object.keys(doc.analysis_result.key_metrics).length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-3 tracking-wide">KEY METRICS</h5>
                        <div className="space-y-2">
                          {Object.entries(doc.analysis_result.key_metrics).map(([key, value]) => (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="text-gray-400">{key}:</span>
                              <span className="text-emerald-400">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {doc.analysis_result.risks && doc.analysis_result.risks.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-red-400 mb-3 tracking-wide">RISKS</h5>
                      <div className="space-y-1">
                        {doc.analysis_result.risks.map((risk, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-red-300">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {doc.analysis_result.recommendations && doc.analysis_result.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-green-400 mb-3 tracking-wide">RECOMMENDATIONS</h5>
                      <div className="space-y-1">
                        {doc.analysis_result.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-green-300">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h5 className="text-sm font-medium text-emerald-400 mb-3 tracking-wide">CONFIDENCE SCORE</h5>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full shadow-lg shadow-emerald-400/50 transition-all duration-500" 
                          style={{ width: `${(doc.analysis_result.confidence || 0) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm tracking-wide">
                        {((doc.analysis_result.confidence || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl text-gray-600 mb-4">📄</div>
            <h3 className="text-xl text-gray-400 mb-2">No documents uploaded</h3>
            <p className="text-gray-500">Upload documents to begin analysis</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
