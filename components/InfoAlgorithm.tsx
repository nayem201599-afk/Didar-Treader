
import React from 'react';

interface InfoAlgorithmProps {
  algorithmFeed: string;
  isOverlay?: boolean;
}

const InfoAlgorithm: React.FC<InfoAlgorithmProps> = ({ algorithmFeed, isOverlay }) => {
  return (
    <div className={`space-y-6 ${isOverlay ? 'mb-8' : ''}`}>
      {/* Algorithm Feed */}
      <div className={`glass p-6 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-indigo-900/10 ${isOverlay ? 'border-indigo-500/30 bg-indigo-950/20 shadow-lg shadow-indigo-500/10' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
            {isOverlay ? 'লাইভ মার্কেট সার্ভার ফিড' : 'নিউরাল অ্যালগরিদম'}
          </h2>
          {isOverlay && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/20 rounded border border-green-500/30">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">সিঙ্কড (Synced)</span>
            </div>
          )}
        </div>
        
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800 min-h-[100px] flex flex-col justify-center">
          {algorithmFeed ? (
            <div className="space-y-3">
              <div className="flex gap-1.5">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse"></div>
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse delay-150"></div>
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed font-medium italic">
                "{algorithmFeed}"
              </p>
              {isOverlay && (
                <div className="pt-2 border-t border-slate-800 mt-2 grid grid-cols-2 gap-2">
                  <div className="text-[9px] uppercase font-bold text-slate-500">অ্যাক্টিভ নোড: <span className="text-white font-mono">24/24</span></div>
                  <div className="text-[9px] uppercase font-bold text-slate-500">সিঙ্ক রেট: <span className="text-white font-mono">100%</span></div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-4 space-y-2 opacity-30">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
               <p className="text-[10px] font-bold uppercase tracking-widest text-center">মার্কেট ডেটার অপেক্ষায়...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoAlgorithm;
