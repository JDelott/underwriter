"use client"

import AppLayout from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/[0.03] border border-emerald-400/20 rounded-none p-16 shadow-2xl shadow-emerald-400/10">
            <div className="text-center">
              <h2 className="text-6xl md:text-8xl font-light mb-8 leading-none tracking-tight">
                <span className="text-white">AI-POWERED</span>
                <br />
                <span className="text-emerald-400 font-normal drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]">REAL ESTATE</span>
                <br />
                <span className="text-white">UNDERWRITING</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mb-8 shadow-lg shadow-emerald-400/50 mx-auto"></div>
              <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                Transform deal analysis with intelligent automation. From intake to investment decision in minutes, not weeks.
              </p>
              
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => window.location.href = '/deals'}
                  className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-12 py-6 font-bold text-xl transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide transform hover:scale-105"
                >
                  START ANALYSIS
                </button>
                <p className="text-sm text-emerald-400 mt-4 tracking-wide font-medium">
                  BEGIN YOUR DEAL EVALUATION
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 mb-16">
            <div className="col-span-12 lg:col-span-4">
              <h3 className="text-4xl font-light mb-4 text-white">
                STREAMLINED
                <br />
                <span className="text-emerald-400 font-normal drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">PROCESS</span>
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/50"></div>
            </div>
            <div className="col-span-12 lg:col-span-8">
              <p className="text-xl text-gray-300 font-light">
                Four precision-engineered steps that transform raw data into investment-ready insights
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {/* Step 1 */}
            <div className="group bg-white/[0.03] border border-white/[0.08] p-8 hover:bg-emerald-400/5 hover:border-emerald-400/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-emerald-400/40 text-black">
                  01
                </div>
                <div className="text-xs text-emerald-400 tracking-widest font-bold">INTAKE</div>
              </div>
              <h4 className="text-xl font-normal mb-6 text-white tracking-wide">DEAL INTAKE</h4>
              <p className="text-gray-300 mb-6 font-light">Automated document processing from multiple sources</p>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                  <span className="tracking-wide">PDF DOCUMENTS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                  <span className="tracking-wide">MLS DATA</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 shadow-lg shadow-emerald-400/50"></div>
                  <span className="tracking-wide">VOICE INPUT</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group bg-white/[0.03] border border-white/[0.08] p-8 hover:bg-violet-400/5 hover:border-violet-400/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-violet-400/40 text-black">
                  02
                </div>
                <div className="text-xs text-violet-400 tracking-widest font-bold">MODELING</div>
              </div>
              <h4 className="text-xl font-normal mb-6 text-white tracking-wide">FINANCIAL MODELING</h4>
              <p className="text-gray-300 mb-6 font-light">AI-driven financial analysis and projections</p>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-violet-400 shadow-lg shadow-violet-400/50"></div>
                  <span className="tracking-wide">NOI CALCULATIONS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-violet-400 shadow-lg shadow-violet-400/50"></div>
                  <span className="tracking-wide">DSCR ANALYSIS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-violet-400 shadow-lg shadow-violet-400/50"></div>
                  <span className="tracking-wide">IRR PROJECTIONS</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group bg-white/[0.03] border border-white/[0.08] p-8 hover:bg-orange-400/5 hover:border-orange-400/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-orange-400/40 text-black">
                  03
                </div>
                <div className="text-xs text-orange-400 tracking-widest font-bold">ANALYSIS</div>
              </div>
              <h4 className="text-xl font-normal mb-6 text-white tracking-wide">ANALYSIS & DECISION</h4>
              <p className="text-gray-300 mb-6 font-light">Intelligent risk assessment and recommendations</p>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 shadow-lg shadow-orange-400/50"></div>
                  <span className="tracking-wide">RISK FLAGS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 shadow-lg shadow-orange-400/50"></div>
                  <span className="tracking-wide">OPPORTUNITY SCORE</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-400 shadow-lg shadow-orange-400/50"></div>
                  <span className="tracking-wide">DECISION MATRIX</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group bg-white/[0.03] border border-white/[0.08] p-8 hover:bg-blue-400/5 hover:border-blue-400/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-400/40 text-black">
                  04
                </div>
                <div className="text-xs text-blue-400 tracking-widest font-bold">REPORT</div>
              </div>
              <h4 className="text-xl font-normal mb-6 text-white tracking-wide">AUTOMATED REPORTS</h4>
              <p className="text-gray-300 mb-6 font-light">Investment-ready documentation and presentations</p>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                  <span className="tracking-wide">EXECUTIVE SUMMARY</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                  <span className="tracking-wide">INVESTOR DECK</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 shadow-lg shadow-blue-400/50"></div>
                  <span className="tracking-wide">DUE DILIGENCE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
