"use client"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-[family-name:var(--font-geist-sans)] overflow-hidden">
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
        
        {/* Medium Stars */}
        <div className="absolute top-[30%] left-[50%] w-0.5 h-0.5 bg-gray-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-[40%] left-[20%] w-0.5 h-0.5 bg-white rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[70%] left-[75%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-35 animate-pulse"></div>
        <div className="absolute top-[85%] left-[20%] w-0.5 h-0.5 bg-gray-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-[50%] left-[95%] w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-[5%] left-[40%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[65%] left-[60%] w-0.5 h-0.5 bg-gray-200 rounded-full opacity-35 animate-pulse"></div>
        <div className="absolute top-[90%] left-[65%] w-0.5 h-0.5 bg-white rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-[10%] left-[75%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-[25%] left-[35%] w-0.5 h-0.5 bg-gray-200 rounded-full opacity-25 animate-pulse"></div>
        
        {/* Small Stars */}
        <div className="absolute top-[12%] left-[22%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[18%] left-[55%] w-0.5 h-0.5 bg-white rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[28%] left-[15%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[33%] left-[85%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[38%] left-[45%] w-0.5 h-0.5 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[42%] left-[78%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[48%] left-[12%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[52%] left-[88%] w-0.5 h-0.5 bg-white rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[58%] left-[25%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[62%] left-[65%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[68%] left-[40%] w-0.5 h-0.5 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[72%] left-[90%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[78%] left-[18%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[82%] left-[72%] w-0.5 h-0.5 bg-white rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[88%] left-[35%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[92%] left-[82%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[8%] left-[68%] w-0.5 h-0.5 bg-white rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[22%] left-[48%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[37%] left-[92%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[47%] left-[28%] w-0.5 h-0.5 bg-white rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute top-[67%] left-[8%] w-0.5 h-0.5 bg-gray-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-[77%] left-[58%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-25 animate-pulse"></div>
        
        {/* Very Subtle Stars */}
        <div className="absolute top-[14%] left-[32%] w-0.5 h-0.5 bg-gray-500 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-[26%] left-[67%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-[34%] left-[52%] w-0.5 h-0.5 bg-gray-500 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-[44%] left-[82%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-[54%] left-[42%] w-0.5 h-0.5 bg-gray-500 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-[64%] left-[78%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-[74%] left-[28%] w-0.5 h-0.5 bg-gray-500 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-[84%] left-[55%] w-0.5 h-0.5 bg-gray-400 rounded-full opacity-15 animate-pulse"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-sm shadow-lg shadow-emerald-400/40"></div>
            <h1 className="text-xl font-bold tracking-wider text-white">UNDERWRITER.AI</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/[0.03] border border-emerald-400/20 rounded-none p-16 shadow-2xl shadow-emerald-400/10">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">
                <h2 className="text-6xl md:text-8xl font-light mb-8 leading-none tracking-tight">
                  <span className="text-white">AI-POWERED</span>
                  <br />
                  <span className="text-emerald-400 font-normal drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]">REAL ESTATE</span>
                  <br />
                  <span className="text-white">UNDERWRITING</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mb-8 shadow-lg shadow-emerald-400/50"></div>
                <p className="text-xl text-gray-200 mb-12 max-w-2xl font-light leading-relaxed">
                  Transform deal analysis with intelligent automation. From intake to investment decision in minutes, not weeks.
                </p>
              </div>
              <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide">
                    START ANALYSIS
                  </button>
                  <button 
                    onClick={() => window.location.href = '/test-analysis'}
                    className="w-full bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-300 hover:to-purple-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-violet-400/40 hover:shadow-violet-400/60 tracking-wide"
                  >
                    TEST ANALYSIS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="relative z-10 px-8 py-24">
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
                  <span className="tracking-wide">MARKET ANALYSIS</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group bg-white/[0.03] border border-white/[0.08] p-8 hover:bg-cyan-400/5 hover:border-cyan-400/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-xl font-bold shadow-lg shadow-cyan-400/40 text-black">
                  04
                </div>
                <div className="text-xs text-cyan-400 tracking-widest font-bold">WORKFLOW</div>
              </div>
              <h4 className="text-xl font-normal mb-6 text-white tracking-wide">INVESTOR WORKFLOW</h4>
              <p className="text-gray-300 mb-6 font-light">Automated report generation and distribution</p>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
                  <span className="tracking-wide">EXECUTIVE SUMMARY</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
                  <span className="tracking-wide">FINANCIAL MODELS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 shadow-lg shadow-cyan-400/50"></div>
                  <span className="tracking-wide">RISK ASSESSMENT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/[0.03] border border-emerald-400/20 p-16 shadow-2xl shadow-emerald-400/10">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-4">
                <h3 className="text-4xl font-light mb-4 text-white">
                  POWERED BY
                  <br />
                  <span className="text-emerald-400 font-normal drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">PRECISION</span>
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/50"></div>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="text-center">
                    <div className="text-6xl font-light text-emerald-400 mb-2 tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.5)]">95%</div>
                    <div className="text-white font-normal tracking-wide">TIME REDUCTION</div>
                    <div className="text-sm text-emerald-400 mt-2 tracking-wide font-medium">FROM WEEKS TO MINUTES</div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-light text-violet-400 mb-2 tracking-tight drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]">99.7%</div>
                    <div className="text-white font-normal tracking-wide">ACCURACY RATE</div>
                    <div className="text-sm text-violet-400 mt-2 tracking-wide font-medium">AI-VERIFIED CALCULATIONS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-light text-orange-400 mb-2 tracking-tight drop-shadow-[0_0_20px_rgba(251,146,60,0.5)]">$2.5B</div>
                    <div className="text-white font-normal tracking-wide">ASSETS ANALYZED</div>
                    <div className="text-sm text-orange-400 mt-2 tracking-wide font-medium">ACROSS 10,000+ DEALS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-400/10 to-green-500/10 border border-emerald-400/30 p-16 shadow-2xl shadow-emerald-400/20">
            <div className="text-center">
              <h3 className="text-4xl font-light mb-6 text-white">
                READY TO TRANSFORM
                <br />
                <span className="text-emerald-400 font-normal drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">YOUR UNDERWRITING?</span>
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 mx-auto mb-8 shadow-lg shadow-emerald-400/50"></div>
              <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Join leading capital firms who trust AI to accelerate their deal flow and improve investment decisions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                <button className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-black px-8 py-4 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 tracking-wide">
                  SCHEDULE DEMO
                </button>
                <button className="bg-transparent border-2 border-emerald-400 hover:border-emerald-300 hover:bg-emerald-400/10 px-8 py-4 font-medium text-lg transition-all duration-200 tracking-wide text-emerald-400">
                  CONTACT SALES
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-emerald-400/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/40"></div>
                <span className="font-bold text-white tracking-wider">UNDERWRITER.AI</span>
              </div>
              <div className="text-sm text-gray-400 tracking-wide">
                © 2024 UNDERWRITER AI. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
