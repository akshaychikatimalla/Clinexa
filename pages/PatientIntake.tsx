
import React, { useState } from 'react';
import { analyzeSymptoms } from '../services/geminiService';
import { AIAnalysis, PatientIntake as PatientIntakeType } from '../types';
import SummaryCard from '../components/SummaryCard';
import { MessageSquareText, ShieldCheck, Sparkles, Send, RefreshCw, ChevronRight, AlertCircle, Cpu, AudioLines } from 'lucide-react';

interface PatientIntakeProps {
  onSave: (intake: PatientIntakeType) => void;
}

const PatientIntake: React.FC<PatientIntakeProps> = ({ onSave }) => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIAnalysis | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeSymptoms(symptoms);
      setResult(analysis);
      
      const newIntake: PatientIntakeType = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        rawSymptoms: symptoms,
        summary: analysis
      };
      
      onSave(newIntake);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex-1 flex flex-col py-16 px-6 lg:px-12 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        
        {/* Left: Instructional Content */}
        <div className={`lg:col-span-5 flex flex-col justify-center transition-all duration-1000 ${result ? 'lg:opacity-0 lg:-translate-x-20 lg:pointer-events-none' : 'opacity-100'}`}>
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/10 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 w-fit border border-indigo-200/50">
              <Sparkles className="w-3.5 h-3.5" />
              Intelligence Layer Activated
           </div>
           <h1 className="text-6xl font-black text-slate-900 tracking-tight leading-[1] mb-8">
              Redefining <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Patient Triage</span>.
           </h1>
           <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium">
              We translate the human experience of illness into high-fidelity clinical data. 
              Help your doctor help you.
           </p>
           
           <div className="grid grid-cols-1 gap-6">
              {[
                { icon: MessageSquareText, title: 'Natural Language Processing', desc: 'No rigid forms. Speak normally.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { icon: Cpu, title: 'Clinical Reasoning Engine', desc: 'Gemini-3 analysis of risk & urgency.', color: 'text-violet-500', bg: 'bg-violet-50' },
                { icon: ShieldCheck, title: 'HIPAA Secured Pipeline', desc: 'Enterprise-grade encryption.', color: 'text-emerald-500', bg: 'bg-emerald-50' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 p-5 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-white hover:border-indigo-100 transition-all group">
                   <div className={`w-14 h-14 shrink-0 ${item.bg} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-7 h-7 ${item.color}`} />
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 tracking-tight">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Interaction Area */}
        <div className={`transition-all duration-1000 ease-in-out ${result ? 'lg:col-span-12' : 'lg:col-span-7'}`}>
          {!result ? (
            <div className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[3rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 lg:p-14 relative overflow-hidden">
                {loading && <div className="scanline"></div>}
                
                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                           <AudioLines className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Describe Your Symptoms</h2>
                     </div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 px-4 py-1.5 rounded-full border border-slate-200/50">SECURE PORTAL V3</div>
                  </div>

                  <div className="relative">
                    <textarea
                      id="symptoms"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Start typing how you feel... 'For the past few hours I've had a dull ache in my chest that radiates to my left arm...'"
                      className="w-full h-80 p-10 bg-slate-50/50 border-2 border-slate-100 rounded-[2.5rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500/50 focus:bg-white transition-all outline-none text-xl text-slate-800 placeholder:text-slate-300 placeholder:font-light resize-none font-medium leading-relaxed shadow-inner"
                      required
                    />
                    <div className="absolute bottom-8 right-10 flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Context Analysis</span>
                       <div className={`w-2 h-2 rounded-full ${symptoms.length > 20 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-200'}`}></div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                         <AlertCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <p className="text-sm text-red-700 font-bold">{error}</p>
                    </div>
                  )}

                  <div className="relative pt-4">
                    <button
                      type="submit"
                      disabled={loading || !symptoms.trim()}
                      className={`group w-full py-6 rounded-[2rem] text-white font-black text-2xl shadow-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-4 overflow-hidden relative ${
                        loading || !symptoms.trim() 
                          ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                          : 'bg-slate-900 hover:bg-black shadow-indigo-200/50'
                      }`}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-7 h-7 animate-spin text-indigo-400" />
                          <span className="tracking-tight">Synthesizing Bio-Markers...</span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-tight">Prepare Clinical Summary</span>
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                             <ChevronRight className="w-6 h-6" />
                          </div>
                        </>
                      )}
                    </button>
                    {!loading && symptoms.trim() && (
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-600/40 uppercase tracking-[0.4em] pointer-events-none">Press Enter to Begin</div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
              <SummaryCard analysis={result} rawText={symptoms} />
              
              <div className="mt-16 flex flex-wrap justify-center gap-6">
                 <button 
                   onClick={handleReset}
                   className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-700 font-black rounded-[2rem] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xl active:scale-95 flex items-center gap-4 group"
                 >
                   <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                   Start New Triage
                 </button>
                 <button 
                   className="px-12 py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-4 relative overflow-hidden group"
                 >
                   <div className="absolute inset-0 shimmer opacity-10"></div>
                   <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   Finalize Submission
                 </button>
              </div>
              
              <div className="mt-12 flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_HIPAA.svg" alt="HIPAA" className="h-6" />
                 <div className="h-4 w-px bg-slate-300"></div>
                 <span className="text-[10px] font-black tracking-widest uppercase">AES-256 Encrypted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientIntake;
