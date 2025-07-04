// src/app/deals/[id]/analysis/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import ConsolidatedAnalysisResults from '@/components/deal-intake/ConsolidatedAnalysisResults';

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

interface Deal {
  id: number;
  name: string;
  property_type?: string;
  address?: string;
  status: string;
  created_at: string;
}

export default function AnalysisPage() {
  const params = useParams();
  const dealId = params.id as string;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDealAndDocuments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch deal info
      const dealResponse = await fetch(`/api/deals/${dealId}`);
      if (!dealResponse.ok) {
        throw new Error('Failed to fetch deal');
      }
      const dealData = await dealResponse.json();
      setDeal(dealData);

      // Fetch documents
      const docsResponse = await fetch(`/api/deals/${dealId}/documents`);
      if (!docsResponse.ok) {
        throw new Error('Failed to fetch documents');
      }
      const docsData = await docsResponse.json();
      setDocuments(docsData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [dealId]);

  useEffect(() => {
    fetchDealAndDocuments();
  }, [fetchDealAndDocuments]);

  const analyzedDocuments = documents.filter(doc => doc.analysis_result);
  const totalDocuments = documents.length;
  const completedAnalysis = analyzedDocuments.length;

  if (loading) {
    return (
      <AppLayout title="ANALYSIS DASHBOARD">
        <div className="flex items-center justify-center h-64">
          <div className="text-emerald-400 text-xl tracking-wider">LOADING ANALYSIS...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="ANALYSIS DASHBOARD">
        <div className="text-center py-16">
          <div className="text-6xl text-red-400 mb-4">⚠️</div>
          <h3 className="text-xl text-red-400 mb-2">Error Loading Analysis</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            href={`/deals/${dealId}`}
            className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
          >
            BACK TO DEAL
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`ANALYSIS DASHBOARD - ${deal?.name || `DEAL #${dealId}`}`}>
      <div className="max-w-[95rem] mx-auto space-y-6">
        {/* Header Section - Streamlined */}
        <div className="bg-gradient-to-r from-white/[0.03] to-white/[0.05] border border-emerald-400/20 rounded-lg p-6 shadow-2xl shadow-emerald-400/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-400/40">
                <span className="text-black font-bold text-xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl font-light text-white tracking-wide">
                  {deal?.name || `DEAL #${dealId}`}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  {deal?.property_type && (
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
                      {deal.property_type.toUpperCase()}
                    </span>
                  )}
                  {deal?.address && (
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                      {deal.address}
                    </span>
                  )}
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                    {completedAnalysis} of {totalDocuments} documents analyzed
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/deals/${dealId}`}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-4 py-2 font-bold transition-all duration-200 shadow-lg tracking-wide text-sm"
              >
                ← UPLOAD
              </Link>
              <Link
                href="/deals"
                className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-4 py-2 font-bold transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide text-sm"
              >
                ALL DEALS
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats - Horizontal */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg">
            <div className="text-xl font-bold text-emerald-400 mb-1">{totalDocuments}</div>
            <div className="text-xs text-emerald-300 tracking-wide">TOTAL DOCUMENTS</div>
          </div>
          <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
            <div className="text-xl font-bold text-blue-400 mb-1">{completedAnalysis}</div>
            <div className="text-xs text-blue-300 tracking-wide">ANALYZED</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
            <div className="text-xl font-bold text-purple-400 mb-1">
              {totalDocuments > 0 ? Math.round((completedAnalysis / totalDocuments) * 100) : 0}%
            </div>
            <div className="text-xs text-purple-300 tracking-wide">COMPLETION</div>
          </div>
          <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-lg">
            <div className="text-xl font-bold text-cyan-400 mb-1">
              {analyzedDocuments.length > 0 ? 
                Math.round(analyzedDocuments.reduce((acc, doc) => acc + (doc.analysis_result?.confidence || 0), 0) / analyzedDocuments.length * 100) : 0}%
            </div>
            <div className="text-xs text-cyan-300 tracking-wide">CONFIDENCE</div>
          </div>
        </div>

        {/* Analysis Results - Full Width */}
        {completedAnalysis > 0 ? (
          <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.04] border border-white/[0.08] rounded-lg shadow-2xl shadow-black/20">
            <ConsolidatedAnalysisResults documents={documents} />
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-16 text-center">
            <div className="text-6xl text-gray-600 mb-6">🤖</div>
            <h3 className="text-2xl text-gray-400 mb-4 font-light">No Analysis Available</h3>
            <p className="text-gray-500 mb-8 text-lg">Upload documents and run analysis to see comprehensive results here</p>
            <Link
              href={`/deals/${dealId}`}
              className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
            >
              UPLOAD DOCUMENTS
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
