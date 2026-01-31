
import React, { useState } from 'react';
import { PatientIntake as PatientIntakeType } from '../types';
import SummaryCard from '../components/SummaryCard';
// Added HeartPulse to imports
import { Search, Filter, Clock, MoreVertical, CheckCircle2, AlertTriangle, Users, TrendingUp, History, LayoutGrid, ListFilter, HeartPulse } from 'lucide-react';

interface DoctorDashboardProps {
  intakes: PatientIntakeType[];
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ intakes }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedIntake = intakes.find(i => i.id === selectedId);
  const filteredIntakes = intakes.filter(i => 
    i.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.summary.briefSummary.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  const emergencyCount = intakes.filter(i => i.summary.urgency === 'Emergency').length;
  const highRiskCount = intakes.filter(i => i.summary.urgency === 'High').length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden h-[calc(100vh-5rem)]">
      
      {/* Premium Stats bar */}
      <div className="px-10 py-8 bg-white/40 backdrop-blur-md border-b border-slate-200 flex items-center justify-between gap-8">
         <div className="flex gap-10 shrink-0">
            {[
              { label: 'Critical Triage', val: emergencyCount, icon: AlertTriangle, color: 'red', bg: 'bg-red-500' },
              { label: 'High Priority', val: highRiskCount, icon: TrendingUp, color: 'orange', bg: 'bg-orange-500' },
              { label: 'Total Volume', val: intakes.length, icon: Users, color: 'indigo', bg: 'bg-indigo-600' }
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-5 group">
                 <div className={`w-14 h-14 rounded-2xl ${stat.bg} shadow-lg shadow-${stat.color}-200 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="w-7 h-7" />
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
                    <div className="text-3xl font-black text-slate-900 leading-none mt-1">{stat.val}</div>
                 </div>
              </div>
            ))}
         </div>

         <div className="flex-1 max-w-xl relative hidden xl:block">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
               <Search className="w-5 h-5 text-slate-300" />
            </div>
            <input 
              type="text" 
              placeholder="Filter by Clinical ID, Symptom, or Urgency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/80 border border-slate-200 rounded-3xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 outline-none transition-all text-base font-medium shadow-sm"
            />
         </div>
         
         <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
               <ListFilter className="w-4 h-4" />
               Filter
            </button>
            <button className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
               <LayoutGrid className="w-5 h-5" />
            </button>
         </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar: Patient List */}
        <div className="w-full lg:w-[480px] bg-white border-r border-slate-200 flex flex-col shadow-2xl relative z-20">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incoming Feed</h4>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Updates</span>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredIntakes.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-24 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 rotate-12">
                   <Search className="w-12 h-12 text-slate-200" />
                </div>
                <h4 className="text-xl font-black text-slate-800">No matching cases</h4>
                <p className="text-sm font-medium text-slate-500 mt-2 px-10 leading-relaxed">Try searching for a different patient ID or symptom profile.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filteredIntakes.map((intake, idx) => (
                  <button
                    key={intake.id}
                    onClick={() => setSelectedId(intake.id)}
                    className={`w-full text-left px-8 py-8 transition-all relative group flex gap-6 ${
                      selectedId === intake.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {selectedId === intake.id && <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-indigo-600 rounded-r-2xl"></div>}
                    
                    <div className="relative flex-shrink-0">
                       <div className="w-16 h-16 rounded-[1.5rem] bg-white border border-slate-200 shadow-sm overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${intake.id}&backgroundColor=c0aede,d1d4f9,b6e3f4`} alt="Patient" className="w-full h-full object-cover opacity-90" />
                       </div>
                       <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${
                         intake.summary.urgency === 'Emergency' ? 'bg-red-500' : 
                         intake.summary.urgency === 'High' ? 'bg-orange-500' : 'bg-emerald-500'
                       } shadow-md`}></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 tracking-tight leading-none">Case {intake.id}</span>
                           <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{intake.timestamp.split(',')[0]}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
                           <Clock className="w-3 h-3 text-indigo-500" />
                           <span className="text-[10px] font-black text-slate-800 uppercase">{intake.timestamp.split(',')[1].trim()}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium truncate mb-4 leading-relaxed italic">&ldquo;{intake.summary.briefSummary}&rdquo;</p>
                      
                      <div className="flex items-center justify-between">
                         <div className={`px-3 py-1 rounded-xl border flex items-center gap-2 ${
                            intake.summary.urgency === 'Emergency' ? 'bg-red-50 border-red-100 text-red-600' :
                            intake.summary.urgency === 'High' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                            'bg-emerald-50 border-emerald-100 text-emerald-600'
                         }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              intake.summary.urgency === 'Emergency' ? 'bg-red-500 animate-ping' : 
                              intake.summary.urgency === 'High' ? 'bg-orange-500' : 'bg-emerald-500'
                            }`}></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{intake.summary.urgency}</span>
                         </div>
                         <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Risk Confidence</span>
                            <span className={`text-sm font-black ${intake.summary.riskScore > 75 ? 'text-red-600' : 'text-slate-800'}`}>{intake.summary.riskScore}%</span>
                         </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main View: Summary Detail */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-8 lg:p-16 relative">
          {selectedIntake ? (
            <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-700 max-w-6xl mx-auto pb-32">
               <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="flex-1">
                     <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => setSelectedId(null)} className="lg:hidden w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">←</button>
                        <div className="px-4 py-1.5 bg-indigo-600 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-indigo-200">Clinical ID: {selectedIntake.id}</div>
                        <div className="h-px flex-1 bg-slate-200"></div>
                     </div>
                     <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">Patient Clinical Overview</h2>
                     <p className="text-lg text-slate-400 font-medium mt-3 flex items-center gap-3">
                        <History className="w-5 h-5 text-indigo-400" />
                        Retrieved via Secure Intelligent Relay on {selectedIntake.timestamp}
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <MoreVertical className="w-5 h-5" />
                        Clinical Actions
                     </button>
                     <button className="flex items-center gap-3 px-10 py-4 bg-slate-900 rounded-[1.5rem] text-sm font-black text-white shadow-2xl hover:bg-black transition-all active:scale-95 group">
                        <CheckCircle2 className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                        Acknowledge Profile
                     </button>
                  </div>
               </div>
               
               <SummaryCard analysis={selectedIntake.summary} rawText={selectedIntake.rawSymptoms} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20">
               <div className="w-80 h-80 relative mb-16">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full animate-blob"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center float-anim border border-slate-100">
                        <HeartPulse className="w-16 h-16 text-indigo-500" />
                     </div>
                  </div>
                  {/* Decorative Dots */}
                  <div className="absolute top-10 right-10 w-4 h-4 bg-violet-400 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute bottom-10 left-10 w-6 h-6 bg-indigo-300 rounded-full blur-sm animate-pulse delay-700"></div>
               </div>
               <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-6">Physician Command Center</h3>
               <p className="max-w-lg text-xl text-slate-400 font-medium leading-relaxed mb-12">
                  Select a triage record to begin high-fidelity clinical review. 
                  Clinexa has already processed and risk-scored all incoming narratives.
               </p>
               <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
                  <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Platform Efficiency</span>
                     <span className="text-3xl font-black text-slate-800">14.8x</span>
                     <span className="text-xs font-bold text-emerald-500 block mt-1">+2.4% vs last week</span>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/50">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Triage Accuracy</span>
                     <span className="text-3xl font-black text-slate-800">99.1%</span>
                     <span className="text-xs font-bold text-indigo-500 block mt-1">Validated Dataset</span>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
