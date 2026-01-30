
import React from 'react';

interface TopControlsProps {
  onToggleAnalysis: () => void;
  isAnalyzing: boolean;
  isOpen: boolean;
}

const TopControls: React.FC<TopControlsProps> = ({ onToggleAnalysis, isAnalyzing, isOpen }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-center">
        {/* Live Market Button - Centered and Prominent Toggle */}
        <button 
          onClick={onToggleAnalysis}
          disabled={isAnalyzing}
          className={`w-full max-w-2xl px-8 py-5 rounded-3xl flex items-center justify-center gap-4 shadow-2xl transition-all group border ${
            isOpen 
              ? 'bg-slate-900 border-red-500/50 text-red-400 shadow-red-500/10' 
              : 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x border-white/10 text-white shadow-indigo-500/20'
          } ${isAnalyzing ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] active:scale-95'}`}
        >
          <div className="relative">
             {isAnalyzing ? (
               <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             ) : isOpen ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             ) : (
               <div className="relative">
                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                 <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
               </div>
             )}
          </div>
          <div className="text-left">
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
              {isAnalyzing ? 'Syncing with 128 Global Nodes...' : isOpen ? 'Analysis Active • Tap to Close' : 'Neural Link Phase 1'}
            </span>
            <span className="text-sm font-black uppercase tracking-widest">
              {isAnalyzing ? 'Processing Market Intelligence' : isOpen ? 'Close Neural Feed' : 'Perform Live Global Market Analysis'}
            </span>
          </div>
        </button>
      </div>
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default TopControls;
