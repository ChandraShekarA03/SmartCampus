import React, { useState } from 'react';
import type { CampusNode, PathResult } from '../types';
import { 
  MapPin, 
  ArrowRightLeft, 
  Navigation, 
  Footprints, 
  Clock, 
  Flame, 
  Sparkles, 
  PlayCircle, 
  GitCompare, 
  Info, 
  ChevronRight,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface RouteFinderPanelProps {
  nodes: CampusNode[];
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  onFindRoute: () => void;
  pathResult: PathResult | null;
  onOpenSimulator: () => void;
  onOpenComparison: () => void;
  onOpenAnalysis: () => void;
}

export const RouteFinderPanel: React.FC<RouteFinderPanelProps> = ({
  nodes,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
  onFindRoute,
  pathResult,
  onOpenSimulator,
  onOpenComparison,
  onOpenAnalysis
}) => {
  const [showItinerary, setShowItinerary] = useState(true);

  const swapLocations = () => {
    const temp = sourceId;
    setSourceId(targetId);
    setTargetId(temp);
  };

  const handlePresetSelect = (from: string, to: string) => {
    setSourceId(from);
    setTargetId(to);
  };

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  return (
    <div className="w-full max-w-sm flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-1">
      
      {/* Route Finder Card */}
      <div className="p-5 rounded-3xl glass-island shadow-2xl space-y-4">
        
        {/* Top Scenarios Chips */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Scenarios
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              |V|={nodes.length} Nodes
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handlePresetSelect('main-block', 'cs-block')}
              className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold border border-emerald-500/30 transition-all"
            >
              ⭐ Main ➜ CS Block (300m)
            </button>
            <button
              onClick={() => handlePresetSelect('main-block', 'library')}
              className="text-xs px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium border border-white/10 transition-all"
            >
              Main ➜ Library
            </button>
            <button
              onClick={() => handlePresetSelect('auditorium', 'science-lab')}
              className="text-xs px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium border border-white/10 transition-all"
            >
              Auditorium ➜ Science Lab
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-2 relative">
          {/* Starting Location */}
          <div className="relative">
            <div className="absolute left-3.5 top-3.5 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            </div>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-9 pr-8 py-3 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">Choose Starting Point...</option>
              {nodes.map(node => (
                <option key={`src-${node.id}`} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-3.5 text-slate-500 text-xs">▼</div>
          </div>

          {/* Swap Floating Button */}
          <div className="flex justify-end -my-2.5 relative z-10 pr-6">
            <button
              type="button"
              onClick={swapLocations}
              title="Swap Locations"
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-all shadow-lg hover:scale-110"
            >
              <ArrowRightLeft className="w-3 h-3" />
            </button>
          </div>

          {/* Destination */}
          <div className="relative">
            <div className="absolute left-3.5 top-3.5 flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
            </div>
            <select
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-900/90 border border-white/10 rounded-2xl pl-9 pr-8 py-3 text-xs font-semibold text-white focus:outline-none focus:border-rose-500 transition-all appearance-none cursor-pointer"
            >
              <option value="">Choose Destination...</option>
              {nodes.map(node => (
                <option key={`dst-${node.id}`} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3.5 top-3.5 text-slate-500 text-xs">▼</div>
          </div>

          {/* Find Route Button */}
          <button
            type="button"
            onClick={onFindRoute}
            disabled={!sourceId || !targetId}
            className="w-full mt-2 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4 fill-current" />
            Compute Shortest Route
          </button>
        </div>

      </div>

      {/* Route Results Box */}
      {pathResult && (
        <div className="p-5 rounded-3xl glass-island shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 border-emerald-500/30">
          
          {/* Header Stats */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                Shortest Route Found
              </span>
              <div className="text-2xl font-extrabold text-white font-mono tracking-tight flex items-baseline gap-1.5">
                {pathResult.totalDistance} <span className="text-xs font-semibold text-slate-400">meters</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-cyan-400 font-mono flex items-center justify-end gap-1">
                <Clock className="w-4 h-4" />
                {pathResult.estimatedMinutes} <span className="text-xs font-normal">min</span>
              </div>
              <span className="text-[10px] text-slate-400">~{pathResult.estimatedSteps} steps</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 block mb-0.5">Explored Nodes</span>
              <span className="text-sm font-bold text-indigo-400 font-mono">{pathResult.visitedNodesCount} / {nodes.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-slate-400 block mb-0.5">Runtime Latency</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{pathResult.executionTimeMs} ms</span>
            </div>
          </div>

          {/* Waypoints Toggle */}
          <div>
            <button
              onClick={() => setShowItinerary(!showItinerary)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white py-1 transition-colors"
            >
              <span>Waypoint Navigation ({pathResult.path.length} stops)</span>
              {showItinerary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showItinerary && (
              <div className="mt-2 space-y-2 p-3 rounded-2xl bg-black/40 border border-white/5 max-h-48 overflow-y-auto">
                {pathResult.path.map((nodeId, idx) => {
                  const node = nodeMap.get(nodeId);
                  const isFirst = idx === 0;
                  const isLast = idx === pathResult.path.length - 1;

                  return (
                    <div key={`stop-${nodeId}`} className="flex items-center gap-2.5 text-xs">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isFirst
                          ? 'bg-emerald-500 text-slate-950'
                          : isLast
                          ? 'bg-rose-500 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 truncate">
                        <span className={`font-semibold ${isFirst ? 'text-emerald-400' : isLast ? 'text-rose-400' : 'text-slate-200'}`}>
                          {node?.shortName || nodeId}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Triggers */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onOpenSimulator}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              Simulator
            </button>

            <button
              onClick={onOpenAnalysis}
              className="py-2.5 px-3 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-slate-200 transition-all flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Why this route?
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
