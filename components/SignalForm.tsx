
import React, { useState } from 'react';

interface SignalFormProps {
  onGenerate: (market: string, marketType: 'OTC' | 'Real', timeframe: string) => void;
  isLoading: boolean;
}

const SignalForm: React.FC<SignalFormProps> = ({ onGenerate, isLoading }) => {
  const [market, setMarket] = useState('');
  const [marketType, setMarketType] = useState<'Real' | 'OTC'>('Real');
  const [timeframe, setTimeframe] = useState('1 min');

  const timeframes = Array.from({ length: 10 }, (_, i) => `${i + 1} min`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!market.trim()) return;
    onGenerate(market, marketType, timeframe);
  };

  return (
    <div className="glass p-8 rounded-3xl shadow-2xl">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        Signal Configuration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Market Type</label>
          <div className="flex p-1 bg-slate-800/50 rounded-xl border border-slate-700">
            {(['Real', 'OTC'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMarketType(type)}
                disabled={isLoading}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  marketType === type
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Market Asset</label>
          <input
            type="text"
            placeholder={marketType === 'OTC' ? "e.g. QTX OTC" : "e.g. EUR/USD"}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Timeframe</label>
          <div className="grid grid-cols-5 gap-2">
            {timeframes.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                disabled={isLoading}
                className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${
                  timeframe === t
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-800/30 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                {t.replace(' min', 'm')}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !market}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${
            isLoading || !market
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-500/20 active:scale-95'
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            "Analyze Market"
          )}
        </button>
      </form>
    </div>
  );
};

export default SignalForm;
