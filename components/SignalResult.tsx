
import React from 'react';
import { TradingSignal } from '../types';

interface SignalResultProps {
  signal: TradingSignal | null;
}

const SignalResult: React.FC<SignalResultProps> = ({ signal }) => {
  if (!signal) {
    return (
      <div className="glass h-full rounded-3xl flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-slate-700 group transition-all hover:border-indigo-500/50">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-600 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-400">Didar AI প্রস্তুত</h3>
        <p className="text-slate-600 mt-2 max-w-xs text-[10px] uppercase tracking-widest font-black">সফল ট্রেডের জন্য মার্কেট অ্যানালাইসিস শুরু করুন</p>
      </div>
    );
  }

  const isPositive = ['CALL', 'BUY'].includes(signal.signal);
  const isNegative = ['PUT', 'SELL'].includes(signal.signal);

  return (
    <div className={`glass rounded-3xl p-6 h-full shadow-2xl relative overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}>
      {/* Decorative Glows */}
      <div className={`absolute -top-10 -left-10 w-40 h-40 blur-3xl opacity-20 rounded-full ${isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-slate-500'}`}></div>
      
      <div className="flex justify-between items-start relative z-10 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${signal.marketType === 'OTC' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
              {signal.marketType} MARKET
            </span>
          </div>
          <h3 className="text-2xl font-black text-white tracking-tighter">{signal.market}</h3>
          <span className="text-[10px] font-mono text-slate-500">{signal.timeframe} • {new Date(signal.timestamp).toLocaleTimeString()}</span>
        </div>
        <div className="text-right">
          <div className="text-[8px] font-black uppercase tracking-widest text-indigo-400 mb-1">AI Confidence</div>
          <div className={`text-2xl font-black ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-slate-400'}`}>
            {signal.confidence}
          </div>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Signal Display */}
        <div className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-700 ${
          isPositive ? 'bg-green-500/10 border-green-500/50' : 
          isNegative ? 'bg-red-500/10 border-red-500/50' : 
          'bg-slate-800/50 border-slate-700'
        }`}>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Recommended Action</span>
          <span className={`text-5xl font-black tracking-tighter ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-slate-300'}`}>
            {signal.signal}
          </span>
          <div className="mt-2 text-xs font-bold text-white bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-700">
            Entry: {signal.entry}
          </div>
        </div>

        {/* New Strategy Section */}
        <div className="space-y-4">
          <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
              AI ট্রেডিং কৌশল (Strategy Analysis)
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              {signal.strategyExplanation || signal.algorithmDescription}
            </p>
          </div>

          {/* Technical Breakdown List */}
          {signal.technicalPoints && signal.technicalPoints.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">টেকনিক্যাল এনালাইসিস পয়েন্ট</h5>
              {signal.technicalPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 transition-all hover:border-indigo-500/30">
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${isPositive ? 'bg-green-500' : isNegative ? 'bg-red-500' : 'bg-indigo-500'} shadow-[0_0_8px_rgba(99,102,241,0.5)]`}></div>
                  <p className="text-[10px] text-slate-400 font-bold leading-tight">{point}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Data Sources */}
        {signal.sources && signal.sources.length > 0 && (
          <div className="pt-4 border-t border-slate-800/50">
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 block mb-2">Verified Grounding Sources</span>
            <div className="flex flex-wrap gap-2">
              {signal.sources.slice(0, 2).map((source, idx) => (
                <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                  {source.title.substring(0, 20)}...
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignalResult;
