"use client";

import Link from 'next/link';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Large Stars */}
        <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-[25%] left-[80%] w-0.5 h-0.5 bg-gray-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-[35%] left-[25%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-35 animate-pulse"></div>
        <div className="absolute top-[45%] left-[70%] w-1 h-1 bg-white rounded-full opacity-45 animate-pulse"></div>
        <div className="absolute top-[60%] left-[30%] w-0.5 h-0.5 bg-gray-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-[75%] left-[85%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-35 animate-pulse"></div>
        <div className="absolute top-[15%] left-[60%] w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-[55%] left-[10%] w-0.5 h-0.5 bg-gray-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-[80%] left-[45%] w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-[20%] left-[90%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-35 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 border-b border-emerald-400/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-sm shadow-lg shadow-emerald-400/40"></div>
              <h1 className="text-xl font-bold tracking-wider text-white">UNDERWRITER.AI</h1>
            </Link>
            
            <nav className="flex space-x-6">
              <Link href="/deals" className="text-gray-300 hover:text-emerald-400 transition-colors tracking-wide">
                DEALS
              </Link>
              <Link href="/test-analysis" className="text-gray-300 hover:text-emerald-400 transition-colors tracking-wide">
                TEST ANALYSIS
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-light mb-2 text-white tracking-tight">
              {title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/50"></div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
