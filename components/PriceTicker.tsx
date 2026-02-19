
import React, { useState, useEffect, useRef } from 'react';

interface Asset {
  name: string;
  symbol: string;
  type: 'crypto' | 'forex' | 'commodity';
  base: number;
  spread: number;
}

const ASSETS: Asset[] = [
  { name: 'BTC/USD', symbol: 'BTCUSDT', type: 'crypto', base: 64500, spread: 50 },
  { name: 'EUR/USD', symbol: 'EUR', type: 'forex', base: 1.0850, spread: 0.0001 },
  { name: 'GBP/USD', symbol: 'GBP', type: 'forex', base: 1.2640, spread: 0.0002 },
  { name: 'AUD/USD', symbol: 'AUD', type: 'forex', base: 0.6620, spread: 0.0001 },
  { name: 'XAU/USD', symbol: 'GOLD', type: 'commodity', base: 2350.20, spread: 1.5 },
];

const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState(ASSETS.map(a => ({ ...a, current: a.base, change: 0 })));
  const [lastSync, setLastSync] = useState<string>('Syncing...');
  const isSyncing = useRef(false);

  // Function to fetch real prices from public APIs
  const fetchRealPrices = async () => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    try {
      // 1. Fetch Crypto from Binance (Public API)
      const btcRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
      const btcData = await btcRes.json();
      const realBtc = parseFloat(btcData.price);

      // 2. Fetch Forex from ExchangeRate-API (Public v4)
      const fxRes = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const fxData = await fxRes.json();
      
      setPrices(prev => prev.map(p => {
        let newBase = p.current;
        
        if (p.symbol === 'BTCUSDT') {
          newBase = realBtc;
        } else if (p.type === 'forex' && fxData.rates[p.symbol]) {
          // The API gives USD/XXX, we want XXX/USD (mostly). 
          // For EUR/USD, it's actually 1 / (USD/EUR)
          newBase = 1 / fxData.rates[p.symbol];
        } else if (p.symbol === 'GOLD') {
          // Commodity prices often need a key, so we anchor and vary slightly
          newBase = p.current + (Math.random() - 0.5) * p.spread;
        }

        const change = ((newBase - p.base) / p.base) * 100;
        return { ...p, current: newBase, change };
      }));
      
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn("Financial API fetch failed, using fallback simulation.", err);
    } finally {
      isSyncing.current = false;
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchRealPrices();

    // Heavy Sync: Every 30 seconds
    const syncInterval = setInterval(fetchRealPrices, 30000);

    // Light Tick: Every 1 second for UI "liveliness"
    const tickInterval = setInterval(() => {
      setPrices(prev => prev.map(p => {
        const move = (Math.random() - 0.5) * p.spread * 0.2;
        const newPrice = p.current + move;
        const change = ((newPrice - p.base) / p.base) * 100;
        return { ...p, current: newPrice, change };
      }));
    }, 1000);

    return () => {
      clearInterval(syncInterval);
      clearInterval(tickInterval);
    };
  }, []);

  return (
    <div className="w-full bg-slate-900/90 border-y border-white/5 py-2.5 overflow-hidden relative backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none flex items-center pl-4">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live</span>
        </div>
      </div>

      <div className="flex items-center gap-14 animate-marquee whitespace-nowrap px-4 ml-20">
        {[...prices, ...prices].map((p, i) => (
          <div key={i} className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-indigo-400 transition-colors">{p.name}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-black text-white tracking-tighter">
                {p.current.toLocaleString(undefined, { 
                  minimumFractionDigits: p.base < 10 ? 4 : 2, 
                  maximumFractionDigits: p.base < 10 ? 4 : 2 
                })}
              </span>
              <span className={`text-[8px] font-black tracking-tighter ${p.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {p.change >= 0 ? '▲' : '▼'} {Math.abs(p.change).toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none flex items-center justify-end pr-4">
        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
          Updated: {lastSync}
        </span>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default PriceTicker;
