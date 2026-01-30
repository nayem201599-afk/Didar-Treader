
import React, { useState, useEffect } from 'react';
import { validateApiKey } from '../services/geminiService';

const Header: React.FC = () => {
  const [isKeyValid, setIsKeyValid] = useState(validateApiKey(process.env.API_KEY).valid);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsKeyValid(validateApiKey(process.env.API_KEY).valid);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenKeySetup = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
    } else {
      // Fallback for local development or environments without the dialog
      window.open('https://aistudio.google.com/app/apikey', '_blank');
    }
  };

  return (
    <header className="py-6 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Didar <span className="text-indigo-400">Trader</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Advanced Neural Signals</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* API Key Setup Button */}
          <button 
            onClick={handleOpenKeySetup}
            className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all group relative ${
              !isKeyValid 
                ? 'bg-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500/20'
            }`}
            title="Set API Key"
          >
            {!isKeyValid && <span className="absolute inset-0 rounded-full animate-ping bg-amber-500/20"></span>}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isKeyValid ? 'Setup Key' : 'Fix Key'}
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${isKeyValid ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`}></div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Neural Engine</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className={`w-1.5 h-1.5 rounded-full ${isKeyValid ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
