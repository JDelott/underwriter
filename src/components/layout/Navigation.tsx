"use client";

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Navigation() {
  const params = useParams();
  const pathname = usePathname();
  const dealId = params?.id as string;
  
  // Check if we're on an analysis page
  const isAnalysisPage = pathname?.includes('/analysis');

  return (
    <header className="px-8 py-6 border-b border-white/[0.08] bg-gradient-to-br from-black via-gray-900 to-black relative z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-sm shadow-lg shadow-emerald-400/40"></div>
            <h1 className="text-xl font-bold tracking-wider text-white">UNDERWRITER.AI</h1>
          </Link>

          {/* Main Navigation */}
          <nav className="flex items-center space-x-8 text-sm">
            <Link
              href="/dashboard"
              className={`text-gray-400 hover:text-white transition-colors duration-200 tracking-wide ${
                pathname === '/dashboard' ? 'text-emerald-400' : ''
              }`}
            >
              DASHBOARD
            </Link>
            
            <Link
              href="/deals"
              className={`text-gray-400 hover:text-white transition-colors duration-200 tracking-wide ${
                pathname?.startsWith('/deals') && !isAnalysisPage ? 'text-emerald-400' : ''
              }`}
            >
              DEALS
            </Link>
            
            {/* Analysis-specific navigation */}
            {isAnalysisPage && dealId && (
              <>
                <span className="text-gray-600">•</span>
                <Link
                  href={`/deals/${dealId}`}
                  className="text-gray-400 hover:text-white transition-colors duration-200 tracking-wide"
                >
                  UPLOAD
                </Link>
                <span className="text-gray-600">•</span>
                <span className="text-emerald-400 tracking-wide">ANALYSIS</span>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
