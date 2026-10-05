import React from 'react';
import type { CampusNode, PathResult } from '../types';
import { 
  ArrowRightLeft, 
  Clock, 
  Footprints, 
  PlayCircle, 
  GitCompare, 
  HelpCircle, 
  ArrowDown, 
  ShieldCheck, 
  Zap,
  MapPin
} from 'lucide-react';

interface RoutePanelProps {
  nodes: CampusNode[];
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  onFindRoute: () => void;
  pathResult: PathResult | null;
  onOpenVisualizer: () => void;
  onOpenCompare: () => void;
  onOpenWhyRoute: () => void;
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  nodes,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
  onFindRoute,
  pathResult,
  onOpenVisualizer,
  onOpenCompare,
  onOpenWhyRoute
}) => {
  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const swapLocations = () => {
    const temp = sourceId;
    setSourceId(targetId);
    setTargetId(temp);
  };

  const handlePreset = (src: string, dst: string) => {
    setSourceId(src);
    setTargetId(dst);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      
      {/* 1. Selection Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Where do you want to go?</h2>
          <p className="text-xs text-slate-400 mt-0.5">Select start point and destination on campus</p>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => handlePreset('main-block', 'cs-block')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/25 transition-all"
          >
            ⭐ Main Block ➜ CS Block
          </button>
          <button
            onClick={() => handlePreset('main-block', 'library')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            Main Block ➜ Library
          </button>
          <button
            onClick={() => handlePreset('auditorium', 'science-lab')}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            Auditorium ➜ Science Lab
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-2.5 pt-1">
          {/* From */}
          <div>
            <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              From (Starting Point)
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="">Select Starting Building...</option>
              {nodes.map(n => (
                <option key={`src-${n.id}`} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-end -my-1.5 pr-2">
            <button
              type="button"
              onClick={swapLocations}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title="Swap Locations"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
              To (Destination)
            </label>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-rose-500 transition-colors"
            >
              <option value="">Select Destination Building...</option>
              {nodes.map(n => (
                <option key={`dst-${n.id}`} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Find Route Button */}
          <button
            type="button"
            onClick={onFindRoute}
            disabled={!sourceId || !targetId}
            className="w-full mt-2 py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <Zap className="w-4 h-4 fill-current" />
            Find Shortest Route
          </button>
        </div>

      </div>

      {/* 2. Clean Results Card */}
      {pathResult && (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 shadow-lg space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block">
                Shortest Route
              </span>
              <h3 className="text-sm font-bold text-white">Navigation Result</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              {pathResult.executionTimeMs} ms
            </span>
          </div>

          {/* Vertical Path Steps (Like Prompt Section 1) */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            {pathResult.path.map((id, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === pathResult.path.length - 1;
              const node = nodeMap.get(id);

              return (
                <div key={`step-res-${id}`}>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${isFirst ? 'bg-emerald-400' : isLast ? 'bg-rose-400' : 'bg-slate-400'}`} />
                    <span className={`font-semibold ${isFirst ? 'text-emerald-300' : isLast ? 'text-rose-300' : 'text-slate-200'}`}>
                      {node?.name || id}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="pl-1 py-1">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Distance</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                {pathResult.totalDistance}m
              </span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Walking Time</span>
              <span className="text-base font-extrabold text-cyan-400 font-mono">
                {pathResult.estimatedMinutes} min
              </span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Nodes Visited</span>
              <span className="text-base font-extrabold text-indigo-400 font-mono">
                {pathResult.visitedNodesCount} / {nodes.length}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onOpenVisualizer}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Visualize Algorithm
            </button>

            <button
              onClick={onOpenWhyRoute}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              Why this route?
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
