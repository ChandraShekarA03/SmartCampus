import React from 'react';
import { 
  CampusNode, 
  CampusEdge, 
  AlgorithmMetrics 
} from '../types';
import { runAllAlgorithmsComparison } from '../algorithms/comparison';
import { 
  GitCompare, 
  Check, 
  X, 
  Clock, 
  Cpu, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Zap
} from 'lucide-react';

interface AlgorithmComparisonPanelProps {
  nodes: CampusNode[];
  edges: CampusEdge[];
  sourceId: string;
  targetId: string;
}

export const AlgorithmComparisonPanel: React.FC<AlgorithmComparisonPanelProps> = ({
  nodes,
  edges,
  sourceId,
  targetId
}) => {
  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const sourceName = nodeMap.get(sourceId)?.shortName || sourceId || 'Source';
  const targetName = nodeMap.get(targetId)?.shortName || targetId || 'Destination';

  const metrics: AlgorithmMetrics[] = sourceId && targetId 
    ? runAllAlgorithmsComparison(nodes, edges, sourceId, targetId)
    : [];

  const dijkstraMetric = metrics.find(m => m.shortName === 'Dijkstra');
  const bfsMetric = metrics.find(m => m.shortName === 'BFS');

  return (
    <div className="glass-panel p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">DAA Algorithm Benchmark Arena</h3>
            <p className="text-xs text-slate-400">
              Comparative Analysis: <span className="text-emerald-400 font-semibold">{sourceName}</span> ➜ <span className="text-rose-400 font-semibold">{targetName}</span>
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          4 Algorithms Benchmarked
        </span>
      </div>

      {/* Primary Highlight: Dijkstra vs BFS Contrast (Section 9 Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Dijkstra Card */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-emerald-950/40 to-slate-900/60 border border-emerald-500/40 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h4 className="text-sm font-bold text-emerald-300">Dijkstra&apos;s Algorithm</h4>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Optimal
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Graph Applicability:</span>
              <span className="font-semibold text-slate-200">Weighted (Non-negative)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Total Distance Found:</span>
              <span className="font-mono font-bold text-emerald-400">{dijkstraMetric?.totalDistanceMeters ?? 0} meters</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Nodes Visited:</span>
              <span className="font-mono text-cyan-300">{dijkstraMetric?.nodesVisited ?? 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Time Complexity:</span>
              <span className="font-mono text-indigo-300">O((V + E) log V)</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 italic">
              ⭐ Ideal for real-world campus navigation where path lengths vary in meters.
            </p>
          </div>
        </div>

        {/* BFS Card */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-amber-950/30 to-slate-900/60 border border-amber-500/40 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h4 className="text-sm font-bold text-amber-300">Breadth-First Search (BFS)</h4>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Hop-Count Only
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Graph Applicability:</span>
              <span className="font-semibold text-slate-200">Unweighted Graphs Only</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Total Distance Found:</span>
              <span className="font-mono font-bold text-amber-400">
                {bfsMetric?.totalDistanceMeters ?? 0} meters ({bfsMetric?.pathLengthNodes ? bfsMetric.pathLengthNodes - 1 : 0} hops)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Nodes Visited:</span>
              <span className="font-mono text-cyan-300">{bfsMetric?.nodesVisited ?? 0}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Time Complexity:</span>
              <span className="font-mono text-indigo-300">O(V + E)</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 italic">
              ⚠️ Minimizes edge hops, but may choose a longer physical distance if an edge has high meter weight!
            </p>
          </div>
        </div>

      </div>

      {/* Comprehensive Benchmark Table */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" />
          Full Algorithmic Complexity & Execution Metrics Matrix
        </h4>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Algorithm</th>
                <th className="p-3">Total Distance</th>
                <th className="p-3">Path Hops</th>
                <th className="p-3">Nodes Visited</th>
                <th className="p-3">Edge Checks</th>
                <th className="p-3">Latency (µs)</th>
                <th className="p-3">Time Complexity</th>
                <th className="p-3">Weighted Optimal?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/80 font-mono">
              {metrics.map(m => {
                const isDijkstra = m.shortName === 'Dijkstra';
                return (
                  <tr key={m.shortName} className={isDijkstra ? 'bg-emerald-950/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-900/40'}>
                    <td className="p-3 font-sans font-bold flex items-center gap-1.5">
                      {isDijkstra && <span className="text-emerald-400">⭐</span>}
                      <span>{m.name}</span>
                    </td>
                    <td className="p-3 font-bold text-white">
                      {m.totalDistanceMeters} m
                    </td>
                    <td className="p-3">
                      {m.pathLengthNodes > 0 ? m.pathLengthNodes - 1 : 0}
                    </td>
                    <td className="p-3">
                      {m.nodesVisited}
                    </td>
                    <td className="p-3">
                      {m.edgeChecks}
                    </td>
                    <td className="p-3 text-cyan-400">
                      {m.executionTimeUs} µs
                    </td>
                    <td className="p-3 text-indigo-300">
                      {m.timeComplexity}
                    </td>
                    <td className="p-3">
                      {m.optimalForWeighted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          <Check className="w-3 h-3" /> YES
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                          <X className="w-3 h-3" /> NO
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DAA Viva Answer Snippet */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Professor Viva Question: &quot;Why not use BFS for campus navigation?&quot;</span>
        </div>
        <p className="text-slate-300">
          <strong>Answer: </strong>
          BFS operates under the uniform-cost assumption (all edge weights = 1). When edges represent real campus walking distances (e.g. 120m vs 340m), BFS may choose a 1-hop path of 340m instead of a 2-hop path of (120m + 100m = 220m). Hence, <strong>Dijkstra&apos;s algorithm with a Min-Heap is strictly required</strong> to achieve true shortest physical distance in $O((V+E)\log V)$ time.
        </p>
      </div>

    </div>
  );
};
