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
      <div className="max-w-[95rem] mx-auto space-y-4">
        {/* Clean Property & Analytics Container */}
        <div className="bg-gradient-to-r from-white/[0.03] to-white/[0.05] border border-emerald-400/20 rounded-lg p-6 shadow-xl shadow-emerald-400/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Property Information */}
            <div className="lg:col-span-1">
              <div className="space-y-2">
                <h2 className="text-xl font-medium text-white tracking-wide">
                  {deal?.name || `Deal #${dealId}`}
                </h2>
                <div className="space-y-1">
                  {deal?.property_type && (
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                      <span className="text-sm text-gray-300 tracking-wide">{deal.property_type.toUpperCase()}</span>
                    </div>
                  )}
                  {deal?.address && (
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">{deal.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{totalDocuments}</div>
                  <div className="text-xs text-emerald-300 tracking-wider uppercase">Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{completedAnalysis}</div>
                  <div className="text-xs text-blue-300 tracking-wider uppercase">Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {totalDocuments > 0 ? Math.round((completedAnalysis / totalDocuments) * 100) : 0}%
                  </div>
                  <div className="text-xs text-purple-300 tracking-wider uppercase">Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {analyzedDocuments.length > 0 ? 
                      Math.round(analyzedDocuments.reduce((acc, doc) => acc + (doc.analysis_result?.confidence || 0), 0) / analyzedDocuments.length * 100) : 0}%
                  </div>
                  <div className="text-xs text-cyan-300 tracking-wider uppercase">Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Results - Full Width */}
        {completedAnalysis > 0 ? (
          <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.04] border border-white/[0.08] rounded-lg shadow-2xl shadow-black/20">
            <ConsolidatedAnalysisResults documents={documents} />
          </div>
        ) : (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-12 text-center">
            <div className="text-4xl text-gray-600 mb-4">🤖</div>
            <h3 className="text-lg text-gray-400 mb-3 font-light">No Analysis Available</h3>
            <p className="text-gray-500 mb-6">Upload documents and run analysis to see results</p>
            <Link
              href={`/deals/${dealId}`}
              className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-6 py-3 font-bold transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide"
            >
              UPLOAD DOCUMENTS
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
