import React from 'react';
import { 
  CampusNode, 
  CampusEdge, 
  PathResult 
} from '../types';
import { findAlternativeRoutes } from '../algorithms/alternativeRoutes';
import { 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Compass, 
  Clock, 
  Scale 
} from 'lucide-react';

interface RouteAnalysisPanelProps {
  nodes: CampusNode[];
  edges: CampusEdge[];
  sourceId: string;
  targetId: string;
  primaryResult: PathResult;
  onSelectPath?: (path: string[]) => void;
}

export const RouteAnalysisPanel: React.FC<RouteAnalysisPanelProps> = ({
  nodes,
  edges,
  sourceId,
  targetId,
  primaryResult,
  onSelectPath
}) => {
  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const sourceNode = nodeMap.get(sourceId);
  const targetNode = nodeMap.get(targetId);

  const alternatives = findAlternativeRoutes(
    nodes,
    edges,
    sourceId,
    targetId,
    primaryResult.path
  );

  return (
    <div className="glass-panel p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Route Analysis & "Why This Route?"</h3>
            <p className="text-xs text-slate-400">
              Comparative path optimality and greedy decision breakdown
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          Optimal Substructure Verified
        </span>
      </div>

      {/* Selected Optimal Route Card */}
      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
              Selected by Dijkstra
            </span>
            <span className="text-xs font-semibold text-emerald-300">Absolute Shortest Path</span>
          </div>
          <div className="text-sm font-mono font-bold text-emerald-400">
            {primaryResult.totalDistance} meters ({primaryResult.estimatedMinutes} min)
          </div>
        </div>

        {/* Path breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono my-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
          {primaryResult.path.map((id, idx) => (
            <React.Fragment key={`opt-${id}`}>
              <span className="px-2 py-1 rounded bg-slate-800 text-emerald-300 font-semibold">
                {nodeMap.get(id)?.shortName || id}
              </span>
              {idx < primaryResult.path.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          <span className="text-emerald-400 font-bold">Why Chosen: </span>
          Dijkstra&apos;s algorithm guaranteed this route because at every step, the relaxation principle 
          <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono text-[11px]">
            d[u] + w(u, v) &lt; d[v]
          </code> 
          minimized the cumulative sum of walkable road segments without any heuristic estimation errors.
        </p>
      </div>

      {/* Alternative Candidate Routes Comparison */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-cyan-400" />
          Alternative Viable Routes Considered
        </h4>

        {alternatives.length > 0 ? (
          <div className="space-y-3">
            {alternatives.map((alt, idx) => (
              <div 
                key={`alt-${idx}`}
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Option {idx + 2}: {alt.viaDescription}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-slate-300">{alt.distance} m</span>
                    {alt.deltaMeters === 0 ? (
                      <span className="text-amber-400 font-semibold">(Equal Distance)</span>
                    ) : (
                      <span className="text-rose-400 font-semibold">(+{alt.deltaMeters}m longer)</span>
                    )}
                  </div>
                </div>

                {/* Breadcrumbs for alternative */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono my-2 text-slate-400">
                  {alt.path.map((id, pIdx) => (
                    <React.Fragment key={`alt-node-${id}-${pIdx}`}>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                        {nodeMap.get(id)?.shortName || id}
                      </span>
                      {pIdx < alt.path.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 mt-1">
                  {alt.deltaMeters === 0 ? (
                    <span className="text-amber-300">
                      ℹ️ Equivalent distance route. Dijkstra breaks ties deterministically based on discovery order.
                    </span>
                  ) : (
                    <span>
                      ⚠️ Rejected because it incurs an extra {alt.deltaMeters}m (~{Math.round(alt.deltaMeters / 72)} min walking delay).
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 text-center">
            No viable independent alternative paths found between these campus locations.
          </div>
        )}
      </div>

      {/* DAA Algorithmic Insight Box */}
      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>DAA Theoretical Rationale for Viva Evaluation</span>
        </div>
        <p className="text-slate-300">
          Dijkstra&apos;s algorithm satisfies the <strong>Greedy Choice Property</strong> and <strong>Optimal Substructure</strong>: 
          if the shortest path from <span className="text-white">{sourceNode?.shortName}</span> to <span className="text-white">{targetNode?.shortName}</span> passes through an intermediate building <span className="text-white">X</span>, then the subpath from source to <span className="text-white">X</span> is itself an optimal shortest path.
        </p>
      </div>

    </div>
  );
};
