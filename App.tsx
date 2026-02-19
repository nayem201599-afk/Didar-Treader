
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
          setError(null);
        }
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [keyStatus]);

  const handleToggleGlobalAnalysis = async () => {
    if (!keyStatus.valid) {
      setError("এই ফিচারটি ব্যবহার করতে একটি সঠিক API Key প্রয়োজন। উপরের 'Setup Key' বাটন ব্যবহার করুন।");
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
      setError("ডেটা লোড করতে সমস্যা হচ্ছে। আপনার API Key চেক করুন।");
    } finally {
      setIsAnalyzingGlobal(false);
      setSyncStep('');
    }
  };

  const handleGenerate = async (market: string, marketType: 'OTC' | 'Real', timeframe: string) => {
    if (!keyStatus.valid) {
      setError("সিগন্যাল জেনারেট করতে API Key সেট করা আবশ্যক।");
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

  return (
    <div className="min-h-screen pb-24 bg-slate-950 text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      <Header />
      <PriceTicker />

      {!keyStatus.valid && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 text-center flex items-center justify-center gap-2">
           <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
           <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">
             API Key পাওয়া যায়নি। ফিচারগুলো চালু করতে উপরের 'FIX KEY' বা 'SETUP KEY' বাটনে ক্লিক করুন।
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
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">নেটওয়ার্ক স্ট্যাটাস</h4>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${keyStatus.valid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {keyStatus.valid ? 'SECURE' : 'OFFLINE'}
                  </span>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">Node</span><span className="text-white font-mono text-xs">Cloudflare-Edge</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">AI Engine</span><span className="text-white font-mono text-xs">Gemini 3.0</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 uppercase font-bold">Latency</span><span className="text-green-400 font-mono text-xs">24ms</span></div>
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[9px] text-slate-600 leading-tight uppercase font-bold">আপনার ট্রেডিং ডেটা নিউরাল প্রোটেকশনের মাধ্যমে সুরক্ষিত।</p>
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
