
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SignalForm from './components/SignalForm';
import SignalResult from './components/SignalResult';
import TopControls from './components/TopControls';
import PriceTicker from './components/PriceTicker';
import MarketChart from './components/MarketChart';
import AIChat from './components/AIChat';
import { generateSignal, getGlobalMarketOverview, validateApiKey } from './services/geminiService';
import { TradingSignal } from './types';

const App: React.FC = () => {
  const [currentSignal, setCurrentSignal] = useState<TradingSignal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingGlobal, setIsAnalyzingGlobal] = useState(false);
  const [showGlobalResults, setShowGlobalResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalOverview, setGlobalOverview] = useState<string>('');
  const [isPreview, setIsPreview] = useState(false);
  
  const [keyStatus, setKeyStatus] = useState<{ valid: boolean; reason?: 'MISSING' | 'INVALID_FORMAT' }>(
    validateApiKey(process.env.API_KEY)
  );

  const [syncStep, setSyncStep] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const current = validateApiKey(process.env.API_KEY);
      if (current.valid !== keyStatus.valid || current.reason !== keyStatus.reason) {
        setKeyStatus(current);
        if (current.valid) {
          setIsPreview(false);
          setError(null);
        }
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [keyStatus]);

  const handleOpenVercelSettings = () => {
    window.open('https://vercel.com/dashboard', '_blank');
  };

  const handleToggleGlobalAnalysis = async () => {
    if (!keyStatus.valid) {
      setError("এই ফিচারটি ব্যবহার করতে API Key প্রয়োজন।");
      setIsPreview(false);
      return;
    }
    if (showGlobalResults) {
      setShowGlobalResults(false);
      setGlobalOverview('');
      return;
    }
    setIsAnalyzingGlobal(true);
    setError(null);
    const steps = ["Establishing Neural Link...", "Syncing Market Nodes...", "Generating AI Insight..."];
    for (const step of steps) {
      setSyncStep(step);
      await new Promise(r => setTimeout(r, 600));
    }
    try {
      const { text } = await getGlobalMarketOverview();
      setGlobalOverview(text);
      setShowGlobalResults(true);
    } catch (err: any) {
      setError("ডেটা লোড করতে সমস্যা হচ্ছে।");
    } finally {
      setIsAnalyzingGlobal(false);
      setSyncStep('');
    }
  };

  const handleGenerate = async (market: string, marketType: 'OTC' | 'Real', timeframe: string) => {
    if (!keyStatus.valid) {
      setError("সিগন্যাল জেনারেট করতে API Key সেট করা আবশ্যক।");
      setIsPreview(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateSignal(market, marketType, timeframe);
      setCurrentSignal({
        id: Math.random().toString(36).substring(7),
        market: data.market,
        marketType: data.marketType as 'OTC' | 'Real',
        timeframe: data.timeframe,
        signal: data.signal.toUpperCase() as any,
        entry: data.entry,
        confidence: data.confidence,
        timestamp: Date.now(),
        algorithmDescription: data.algorithmDescription,
        strategyExplanation: data.strategyExplanation,
        technicalPoints: data.technicalPoints,
        sources: data.sources
      });
    } catch (err: any) {
      setError(err.message || "সিগন্যাল তৈরি করা যাচ্ছে না।");
    } finally {
      setIsLoading(false);
    }
  };

  if (!keyStatus.valid && !isPreview) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.15),transparent)] pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
          <div className="mb-8">
            <div className="inline-block p-4 rounded-full bg-white text-black mb-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <svg viewBox="0 0 76 65" fill="none" className="w-10 h-10"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="currentColor"/></svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Vercel Deployment</h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Activation Required</p>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-white/5 shadow-2xl space-y-6 text-left">
            <div className="space-y-4">
               <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white text-xs font-bold">1</div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide">Environment Variable</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Vercel Settings-এ গিয়ে <code className="text-indigo-400 font-mono">API_KEY</code> নামে আপনার কী (Key) টি অ্যাড করুন।
                    </p>
                  </div>
               </div>

               <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400 text-xs font-bold">2</div>
                  <div>
                    <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-wide">Redeploy Site</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      কী সেভ করার পর Deployments ট্যাবে গিয়ে <b>Redeploy</b> বাটনে ক্লিক করুন। এটি না করলে অ্যাপ কাজ করবে না।
                    </p>
                  </div>
               </div>
            </div>

            <div className="space-y-3 pt-4">
              <button 
                onClick={handleOpenVercelSettings}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-slate-200 active:scale-95 transition-all text-xs"
              >
                Vercel ড্যাশবোর্ড ওপেন করুন
              </button>
              <button 
                onClick={() => setIsPreview(true)}
                className="w-full py-4 bg-white/5 text-slate-500 font-bold uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all text-[10px] border border-white/5"
              >
                স্কিপ করে অ্যাপ দেখুন (Preview)
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
            System Online: v2.4.5-Stable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      <Header />
      <PriceTicker />

      {isPreview && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 text-center flex items-center justify-center gap-2">
           <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
           <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">
             আপনি প্রিভিউ মোডে আছেন। সঠিক বিশ্লেষণের জন্য API Key অ্যাড করুন।
           </p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 mt-6">
        <TopControls onToggleAnalysis={handleToggleGlobalAnalysis} isAnalyzing={isAnalyzingGlobal} isOpen={showGlobalResults} />
        
        {(isAnalyzingGlobal || showGlobalResults) && (
          <div className="mb-8 glass p-6 rounded-3xl border border-indigo-500/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
             <div className="flex items-center gap-2 mb-4">
                <span className={`w-2 h-2 rounded-full ${isAnalyzingGlobal ? 'bg-orange-500 animate-ping' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'}`}></span>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">গ্লোবাল মার্কেট ইন্টেলিজেন্স</h3>
             </div>
             {isAnalyzingGlobal ? (
               <div className="py-6 text-center italic text-sm text-slate-400 font-mono animate-pulse">{syncStep}</div>
             ) : (
               <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">{globalOverview}</div>
             )}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-center animate-in shake duration-500">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignalForm onGenerate={handleGenerate} isLoading={isLoading} />
            <SignalResult signal={currentSignal} />
          </div>
          <div className="lg:col-span-4">
             <div className="glass p-6 rounded-3xl border border-white/5 bg-white/[0.02] h-full">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 flex justify-between">
                  নেটওয়ার্ক স্ট্যাটাস <span className="text-green-500">SECURE</span>
                </h4>
                <div className="space-y-5">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">Server</span><span className="text-white font-mono text-xs">Vercel-Edge</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">API Gateway</span><span className="text-white font-mono text-xs">Gemini-Flash</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">Encryption</span><span className="text-indigo-400 font-mono text-xs">AES-256</span></div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] text-slate-600 leading-tight uppercase font-bold">আপনার সব ডেটা নিউরাল নেটওয়ার্কের মাধ্যমে এনক্রিপ্ট করা হয়।</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

        <div className="mt-8">
           <MarketChart marketName={currentSignal?.market || "Global Analysis"} />
        </div>
      </main>
      <AIChat />
    </div>
  );
};

export default App;
