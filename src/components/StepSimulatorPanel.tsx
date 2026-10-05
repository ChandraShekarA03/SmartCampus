import React, { useState, useEffect } from 'react';
import type { CampusNode, DijkstraStep } from '../types';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  FastForward,
  Terminal, 
  Table, 
  Info,
  ListOrdered,
  X
} from 'lucide-react';

interface StepSimulatorPanelProps {
  steps: DijkstraStep[];
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  nodes: CampusNode[];
  sourceName: string;
  targetName: string;
  onClose?: () => void;
}

export const StepSimulatorPanel: React.FC<StepSimulatorPanelProps> = ({
  steps,
  currentStepIndex,
  setCurrentStepIndex,
  nodes,
  sourceName,
  targetName,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [showDataDrawer, setShowDataDrawer] = useState<boolean>(true);

  const step = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1000 / playSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, playSpeed, setCurrentStepIndex]);

  const pseudocode = [
    { line: 1, text: '1. dist[source] ← 0, dist[v] ← ∞ for all v ≠ source' },
    { line: 2, text: '2. PriorityQueue.insert(source, 0), prev[all] ← null' },
    { line: 3, text: '3. while PriorityQueue is not empty:' },
    { line: 4, text: '4.     u ← PriorityQueue.extractMin()' },
    { line: 5, text: '5.     if u == destination: return path' },
    { line: 6, text: '6.     for each neighbor v of u:' },
    { line: 7, text: '7.         if dist[u] + w(u, v) < dist[v]:  // Relax' },
    { line: 8, text: '8.             dist[v] ← dist[u] + w(u, v)' },
    { line: 9, text: '9.             prev[v] ← u, PQ.insert(v, dist[v])' },
    { line: 10, text: '10. return reconstruct_path(prev, destination)' }
  ];

  const getActiveCodeLine = () => {
    if (!step) return 1;
    switch (step.type) {
      case 'INIT': return 1;
      case 'EXTRACT_MIN': return 4;
      case 'TARGET_REACHED': return 5;
      case 'EXAMINE_NEIGHBOR': return 6;
      case 'RELAX_EDGE': return 8;
      case 'SKIP_EDGE': return 7;
      case 'NODE_SETTLED': return 3;
      case 'FINISHED': return 10;
      case 'NO_PATH': return 10;
      default: return 3;
    }
  };

  const activeLine = getActiveCodeLine();

  return (
    <div className="w-full flex flex-col gap-3 pointer-events-auto">
      
      {/* 1. Floating Bottom Player Dock */}
      <div className="p-4 rounded-3xl glass-island shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
            <h3 className="text-xs font-bold text-white">Dijkstra Visualizer</h3>
            <span className="text-[11px] text-slate-400 font-mono">
              {sourceName} ➜ {targetName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              Step {currentStepIndex + 1} / {totalSteps}
            </span>
            <button
              onClick={() => setShowDataDrawer(!showDataDrawer)}
              className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 transition-all"
            >
              {showDataDrawer ? 'Hide Code & Heap' : 'Show Code & Heap'}
            </button>
          </div>
        </div>

        {/* Playback Controls & Scrubber */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
              title="Reset"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1)}
              disabled={currentStepIndex === 0}
              title="Step Prev"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => currentStepIndex < totalSteps - 1 && setCurrentStepIndex(currentStepIndex + 1)}
              disabled={currentStepIndex === totalSteps - 1}
              title="Step Next"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white transition-all"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentStepIndex(totalSteps - 1); }}
              title="Jump to Finish"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Pills */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {[0.5, 1, 2, 4].map(spd => (
              <button
                key={`spd-${spd}`}
                onClick={() => setPlaySpeed(spd)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  playSpeed === spd ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentStepIndex(parseInt(e.target.value, 10));
          }}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />

        {/* Narrative Description Banner */}
        <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">{step?.description}</p>
        </div>
      </div>

      {/* 2. Floating Code & Priority Queue Drawer */}
      {showDataDrawer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Synchronized Pseudocode */}
          <div className="p-4 rounded-3xl glass-island shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Algorithm Pseudocode
              </span>
              <span className="text-[10px] font-mono text-slate-500">Cormen CLRS</span>
            </div>

            <div className="font-mono text-xs space-y-1 bg-black/50 p-3 rounded-2xl border border-white/5 overflow-x-auto">
              {pseudocode.map(line => {
                const isCurrent = line.line === activeLine;
                return (
                  <div
                    key={`ps-${line.line}`}
                    className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-all ${
                      isCurrent
                        ? 'bg-indigo-600/40 text-indigo-200 font-bold border-l-2 border-indigo-400 pl-2'
                        : 'text-slate-400'
                    }`}
                  >
                    {line.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Priority Queue Heap Table */}
          <div className="p-4 rounded-3xl glass-island shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ListOrdered className="w-3.5 h-3.5 text-amber-400" />
                Live Min-Priority Queue
              </span>
              <span className="text-[10px] font-mono text-amber-400">
                {step?.queueState?.length || 0} vertices queued
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[40px] items-center p-2 rounded-2xl bg-black/50 border border-white/5">
              {step?.queueState && step.queueState.length > 0 ? (
                step.queueState.map((item, idx) => {
                  const node = nodeMap.get(item.id);
                  const isMin = idx === 0;
                  return (
                    <div
                      key={`pq-chip-${item.id}-${idx}`}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono flex items-center gap-1 border ${
                        isMin
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold shadow-sm'
                          : 'bg-white/5 text-slate-300 border-white/10'
                      }`}
                    >
                      {isMin && <span className="text-[10px] text-amber-400">MIN➔</span>}
                      <span>{node?.shortName || item.id}</span>
                      <span className="text-slate-400">({item.dist}m)</span>
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-slate-500 italic px-2">Priority Queue is empty.</span>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
