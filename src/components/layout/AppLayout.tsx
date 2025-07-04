"use client";

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const dealId = params?.id as string;
  
  // Check if we're on an analysis page
  const isAnalysisPage = pathname?.includes('/analysis');

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:50px_50px] opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(white_0.5px,transparent_0.5px)] [background-size:20px_20px] opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Main Navigation Header */}
        <header className="px-8 py-6 border-b border-white/[0.08]">
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
                  href="/deals"
                  className={`text-gray-400 hover:text-white transition-colors duration-200 tracking-wide ${
                    pathname?.startsWith('/deals') ? 'text-emerald-400' : ''
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

        {/* Page Header - Hidden on Analysis Pages */}
        {!isAnalysisPage && (
          <header className="border-b border-emerald-400/20 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light tracking-wide text-white">
                    {title}
                  </h2>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
