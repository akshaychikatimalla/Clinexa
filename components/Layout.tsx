
import React from 'react';
import { Page } from '../types';
import { Activity, LayoutDashboard, ClipboardList, HeartPulse } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="glass sticky top-0 z-50 px-4 sm:px-6 lg:px-8 border-b border-white/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2.5 rounded-2xl shadow-lg shadow-indigo-200 float-anim">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">Clinexa</span>
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Intelligence for care</div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => onNavigate(Page.INTAKE)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                currentPage === Page.INTAKE 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Patient Portal
            </button>
            <button
              onClick={() => onNavigate(Page.DASHBOARD)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                currentPage === Page.DASHBOARD 
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Clinical Dashboard
            </button>
          </nav>

          <div className="flex items-center gap-4">
             <div className="hidden lg:block text-right">
                <div className="text-xs font-bold text-slate-800 leading-none">Dr. Sarah Jenkins</div>
                <div className="text-[10px] text-slate-400 font-medium">Internal Medicine</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Avatar" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 -right-20 w-96 h-96 bg-indigo-200/20 blur-3xl rounded-full -z-10"></div>
        <div className="absolute bottom-40 -left-20 w-72 h-72 bg-violet-200/20 blur-3xl rounded-full -z-10"></div>
        
        {children}
      </main>

      <footer className="py-12 px-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-60">
            <HeartPulse className="w-5 h-5" />
            <span className="font-bold">Clinexa Health</span>
          </div>
          <div className="flex gap-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Compliance</a>
            <a href="#" className="hover:text-indigo-600">Support</a>
          </div>
          <p className="text-xs text-slate-300 max-w-sm text-center md:text-right">
            AI-driven insights should supplement, not replace, clinical judgment. 
            All patient data is encrypted and HIPAA compliant.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
