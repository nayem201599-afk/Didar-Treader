
import React, { useState, useEffect } from 'react';

const ASSETS = [
  { name: 'EUR/USD', base: 1.0850, spread: 0.0001 },
  { name: 'BTC/USD', base: 64500, spread: 50 },
  { name: 'XAU/USD', base: 2350.20, spread: 1.5 },
  { name: 'GBP/USD', base: 1.2640, spread: 0.0002 },
  { name: 'AUD/USD', base: 0.6620, spread: 0.0001 },
];

const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState(ASSETS.map(a => ({ ...a, current: a.base, change: 0 })));

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const move = (Math.random() - 0.5) * p.spread * 0.5;
        const newPrice = p.current + move;
        const change = ((newPrice - p.base) / p.base) * 100;
        return { ...p, current: newPrice, change };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-900/80 border-y border-slate-800 py-2 overflow-hidden relative">
      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-4">
        {[...prices, ...prices].map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{p.name}</span>
            <span className="text-xs font-mono font-bold text-white">
              {p.current.toLocaleString(undefined, { 
                minimumFractionDigits: p.base < 10 ? 4 : 2, 
                maximumFractionDigits: p.base < 10 ? 4 : 2 
              })}
            </span>
            <span className={`text-[9px] font-bold ${p.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PriceTicker;
