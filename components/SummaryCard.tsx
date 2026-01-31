
import React, { useEffect, useState } from 'react';
import { AIAnalysis } from '../types';
import { AlertCircle, CheckCircle2, Info, Thermometer, User, ShieldCheck, Zap, Activity, HeartPulse } from 'lucide-react';

interface SummaryCardProps {
  analysis: AIAnalysis;
  rawText?: string;
  compact?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ analysis, rawText, compact = false }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(analysis.riskScore), 500);
    return () => clearTimeout(timer);
  }, [analysis.riskScore]);

  const urgencyStyles = {
    Low: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500', glow: 'shadow-emerald-200/50', gradient: ['#10b981', '#059669'] },
    Medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-500', glow: 'shadow-amber-200/50', gradient: ['#f59e0b', '#d97706'] },
    High: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-100', dot: 'bg-orange-500', glow: 'shadow-orange-200/50', gradient: ['#f97316', '#ea580c'] },
    Emergency: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500', glow: 'shadow-red-200/50', gradient: ['#ef4444', '#dc2626'] },
  };

  const style = urgencyStyles[analysis.urgency];
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`group bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-indigo-200/30 ${compact ? '' : 'max-w-4xl w-full mx-auto'}`}>
      {/* Dynamic Header */}
      <div className={`px-10 py-5 border-b ${style.border} ${style.bg} flex justify-between items-center relative overflow-hidden`}>
         <div className="absolute inset-0 shimmer opacity-20"></div>
         <div className="flex items-center gap-3 relative z-10">
            <div className={`p-1.5 rounded-lg ${style.bg} border ${style.border}`}>
               <ShieldCheck className={`w-4 h-4 ${style.color}`} />
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${style.color}`}>
              Intelligent Clinical Evaluation
            </span>
         </div>
         <div className="flex items-center gap-3 relative z-10">
            <div className="flex -space-x-1">
               {[1,2,3].map(i => (
                 <div key={i} className={`w-1.5 h-1.5 rounded-full ${style.dot} opacity-${40 + i*20} animate-pulse`} style={{ animationDelay: `${i*0.2}s` }}></div>
               ))}
            </div>
            <span className={`text-xs font-black uppercase tracking-widest ${style.color}`}>{analysis.urgency} Level</span>
         </div>
      </div>

      <div className="p-10 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-14">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center text-white">
                  <Activity className="w-6 h-6" />
               </div>
               <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-tight">Patient Clinical <br/>Profile</h3>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              &quot;{analysis.briefSummary}&quot;
            </p>
          </div>
          
          <div className="lg:col-span-5">
             <div className={`p-8 rounded-[2.5rem] border-2 ${style.border} bg-white relative shadow-xl ${style.glow} group/score transition-transform hover:scale-[1.02] overflow-hidden`}>
                <div className="absolute top-4 right-6">
                   <HeartPulse className={`w-5 h-5 ${style.color} opacity-20`} />
                </div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-center relative z-10">Triage Urgency Score</h4>
                
                <div className="relative flex flex-col items-center justify-center">
                   {/* Modern Circular Gauge with fixed SVG viewport to prevent clipping */}
                   <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 140 140">
                         <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                               <stop offset="0%" stopColor={style.gradient[0]} />
                               <stop offset="100%" stopColor={style.gradient[1]} />
                            </linearGradient>
                            <filter id="glow">
                               <feGaussianBlur stdDeviation="3" result="blur" />
                               <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                         </defs>
                         {/* Background Track */}
                         <circle cx="70" cy="70" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                         {/* Progress Arc */}
                         <circle 
                           cx="70" 
                           cy="70" 
                           r={radius} 
                           stroke="url(#scoreGradient)" 
                           strokeWidth="12" 
                           fill="transparent" 
                           strokeDasharray={circumference}
                           strokeDashoffset={offset}
                           strokeLinecap="round"
                           filter="url(#glow)"
                           className="transition-all duration-[1.5s] ease-out"
                         />
                      </svg>
                      
                      {/* Center Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-500">
                         <div className="relative">
                            <span className="text-5xl font-black text-slate-900 leading-none tabular-nums animate-in fade-in zoom-in-50 duration-500">
                              {animatedScore}
                            </span>
                            <div className={`absolute -top-1 -right-3 w-2 h-2 rounded-full ${style.dot} animate-ping opacity-75`}></div>
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">Percentile</span>
                      </div>
                   </div>

                   {/* Linear Bottom Indicator */}
                   <div className="w-full mt-6 space-y-2">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                         <div 
                           className={`h-full transition-all duration-[1.5s] ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                           style={{ 
                             width: `${animatedScore}%`,
                             backgroundColor: style.gradient[0] 
                           }}
                         ></div>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Normal</span>
                         <div className="h-px flex-1 mx-4 bg-slate-100 border-dashed border-t"></div>
                         <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Critical</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
            <h4 className="flex items-center gap-3 text-sm font-black text-slate-800 uppercase tracking-widest mb-6">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-indigo-500" />
              </div>
              Observed Symptoms
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.extractedSymptoms.map((s, i) => (
                <div key={i} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm transition-all hover:scale-105 hover:border-indigo-200">
                  {s}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
            <h4 className="flex items-center gap-3 text-sm font-black text-slate-800 uppercase tracking-widest mb-6">
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-500" />
              </div>
              Clinical Context
            </h4>
            <div className="space-y-4">
              {analysis.possibleCauses.map((c, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover/item:scale-150 transition-transform"></div>
                  <span className="text-sm font-bold text-slate-600 group-hover/item:text-slate-900 transition-colors">{c}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {analysis.redFlags.length > 0 && (
          <div className="mt-12 animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="relative p-10 bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px]"></div>
              <h4 className="text-xl font-black text-white flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                   <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
                Clinical Red Flags
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.redFlags.map((f, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-300 font-semibold bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-red-500/30 transition-colors">
                    <span className="mt-1 text-red-500 text-lg leading-none">●</span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {rawText && !compact && (
          <div className="mt-12 pt-10 border-t border-slate-100">
             <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Source Audio/Text</h4>
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-1 h-3 bg-indigo-100 rounded-full animate-pulse" style={{ animationDelay: `${i*0.1}s` }}></div>
                   ))}
                </div>
             </div>
             <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 text-slate-500 italic text-base leading-relaxed relative">
                <div className="absolute top-0 left-10 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-slate-100 text-[10px] font-bold text-slate-400">VERBATIM</div>
                &ldquo;{rawText}&rdquo;
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
