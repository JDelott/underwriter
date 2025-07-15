"use client";

import React, { useState } from 'react';

interface BulkUploadProps {
  onUploadComplete: () => void;
}

interface UploadResult {
  file: string;
  propertyName?: string;
  propertyId?: number;
  status: 'success' | 'error';
  error?: string;
}

interface UploadResponse {
  message?: string;
  error?: string;
  summary?: {
    totalFiles: number;
    totalDeals: number;
    successCount: number;
    errorCount: number;
  };
  results?: UploadResult[];
}

export default function BulkUpload({ onUploadComplete }: BulkUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResponse | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    setResults(null);
    
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      const response = await fetch('/api/portfolio/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        onUploadComplete();
      } else {
        const error = await response.json();
        setResults({ error: error.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setResults({ error: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  return (
    <div className="bg-white/[0.03] border border-emerald-400/20 p-8 shadow-2xl shadow-emerald-400/10">
      <h2 className="text-2xl font-light mb-6 text-white tracking-wide">
        COMMUNE CAPITAL BULK UPLOAD
      </h2>
      
      <div className="mb-6">
        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
          <h3 className="text-blue-400 font-medium mb-2">Upload Instructions</h3>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• Upload all PDF documents from Commune Capital deals</li>
            <li>• System will automatically extract property data</li>
            <li>• Supports multiple files at once</li>
            <li>• Processes both current and past offerings</li>
          </ul>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          dragOver
            ? 'border-emerald-400 bg-emerald-400/10'
            : 'border-gray-600 hover:border-emerald-400/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-upload"
        />
        
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer block"
        >
          <div className="text-6xl text-emerald-400 mb-4">📄</div>
          <h3 className="text-xl text-white mb-2">
            {uploading ? 'Processing PDFs...' : 'Upload Commune Capital PDFs'}
          </h3>
          <p className="text-gray-400">
            {uploading
              ? 'Extracting property data from documents...'
              : 'Drag and drop PDF files here or click to select'}
          </p>
        </label>
      </div>

      {/* Progress */}
      {uploading && (
        <div className="mt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="ml-3 text-emerald-400">Processing documents...</span>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="mt-6">
          {results.error ? (
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
              <h3 className="text-red-400 font-medium mb-2">Upload Error</h3>
              <p className="text-red-300 text-sm">{results.error}</p>
            </div>
          ) : (
            <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-lg">
              <h3 className="text-emerald-400 font-medium mb-4">Upload Complete!</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {results.summary?.totalFiles || 0}
                  </div>
                  <div className="text-sm text-gray-400">Files Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {results.summary?.totalDeals || 0}
                  </div>
                  <div className="text-sm text-gray-400">Deals Extracted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {results.summary?.successCount || 0}
                  </div>
                  <div className="text-sm text-gray-400">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {results.summary?.errorCount || 0}
                  </div>
                  <div className="text-sm text-gray-400">Errors</div>
                </div>
              </div>

              {results.results && results.results.length > 0 && (
                <div className="max-h-48 overflow-y-auto">
                  <h4 className="text-white font-medium mb-2">Processed Properties:</h4>
                  <div className="space-y-2">
                    {results.results.map((result: UploadResult, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">
                          {result.propertyName || result.file}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          result.status === 'success' 
                            ? 'bg-green-400/20 text-green-400' 
                            : 'bg-red-400/20 text-red-400'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 
