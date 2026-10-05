import React from 'react';
import { 
  Compass, 
  PlayCircle, 
  GitCompare, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  GraduationCap,
  Sparkles,
  Presentation,
  SlidersHorizontal
} from 'lucide-react';

export type ActiveTab = 'navigator' | 'simulator' | 'comparison' | 'editor' | 'testsuite';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenReport: () => void;
  isVivaMode: boolean;
  setIsVivaMode: (val: boolean) => void;
  campusName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReport,
  isVivaMode,
  setIsVivaMode,
  campusName
}) => {
  return (
    <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
      
      {/* Brand Island (Top Left) */}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-island shadow-2xl pointer-events-auto">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
          <Compass className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold tracking-tight text-white">
              SmartCampus
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
              DAA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {campusName}
          </p>
        </div>
      </div>

      {/* Floating Center Tabs (Top Center) */}
      <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-2xl glass-island shadow-2xl pointer-events-auto">
        <button
          onClick={() => setActiveTab('navigator')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'navigator'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Route Finder
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'simulator'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          Dijkstra Visualizer
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'comparison'
              ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          Compare BFS
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'editor'
              ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          Graph Editor
        </button>

        <button
          onClick={() => setActiveTab('testsuite')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'testsuite'
              ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Test Suite
        </button>
      </nav>

      {/* Right Action Island (Top Right) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-island shadow-2xl pointer-events-auto">
        <button
          onClick={() => setIsVivaMode(!isVivaMode)}
          title="Toggle Viva Presentation Mode"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isVivaMode
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Viva Mode</span>
        </button>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-500/25 transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Academic Paper</span>
          <span className="sm:hidden">Report</span>
        </button>
      </div>

    </header>
  );
};
