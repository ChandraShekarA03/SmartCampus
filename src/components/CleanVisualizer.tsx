import React, { useState, useEffect } from 'react';
import type { CampusNode, DijkstraStep } from '../types';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw, 
  Info,
  CheckCircle2,
  Table
} from 'lucide-react';

interface CleanVisualizerProps {
  steps: DijkstraStep[];
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  nodes: CampusNode[];
  sourceName: string;
  targetName: string;
}

export const CleanVisualizer: React.FC<CleanVisualizerProps> = ({
  steps,
  currentStepIndex,
  setCurrentStepIndex,
  nodes,
  sourceName,
  targetName
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

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
      }, 1000 / speed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, speed, setCurrentStepIndex]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 block">
            DAA Step Simulator
          </span>
          <h3 className="text-sm font-bold text-white">
            Dijkstra Tracing: {sourceName} ➜ {targetName}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Step {currentStepIndex + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Narrative Explanation (Plain English) */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed text-slate-200">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
          <Info className="w-3.5 h-3.5" />
          <span>Step Action:</span>
        </div>
        <p>{step?.description}</p>
      </div>

      {/* Clean Player Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setIsPlaying(false); setCurrentStepIndex(0); }}
            title="Reset"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => currentStepIndex > 0 && setCurrentStepIndex(currentStepIndex - 1)}
            disabled={currentStepIndex === 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors flex items-center gap-1"
          >
            <SkipBack className="w-3.5 h-3.5" />
            Previous
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
          </button>
          <button
            onClick={() => currentStepIndex < totalSteps - 1 && setCurrentStepIndex(currentStepIndex + 1)}
            disabled={currentStepIndex === totalSteps - 1}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors flex items-center gap-1"
          >
            Next
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 px-1 text-[11px]">Speed:</span>
          {[0.5, 1, 2].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded-lg font-mono text-[11px] font-bold ${
                speed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Live Distance Table */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
          <Table className="w-3.5 h-3.5 text-indigo-400" />
          <span>Live Vertex Distance Table (dist[v])</span>
        </div>

        <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px] uppercase sticky top-0">
              <tr>
                <th className="p-2">Vertex</th>
                <th className="p-2">Current Distance</th>
                <th className="p-2">Predecessor</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
              {nodes.map(node => {
                const dist = step?.distances?.[node.id];
                const prevId = step?.previous?.[node.id];
                const prevNode = prevId ? nodeMap.get(prevId) : null;
                const isSettled = step?.settledNodes?.includes(node.id);
                const isCurrent = step?.currentNodeId === node.id;

                return (
                  <tr key={node.id} className={isCurrent ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'}>
                    <td className="p-2 font-semibold font-sans">{node.shortName}</td>
                    <td className="p-2 font-bold">{dist === Infinity ? '∞' : `${dist}m`}</td>
                    <td className="p-2 text-slate-400">{prevNode ? prevNode.shortName : '-'}</td>
                    <td className="p-2 text-[10px]">
                      {isCurrent ? (
                        <span className="text-purple-400 font-bold">Extracting...</span>
                      ) : isSettled ? (
                        <span className="text-emerald-400 font-bold">Settled ✓</span>
                      ) : (
                        <span className="text-slate-500">Unvisited</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
