import React from 'react';
import type { CampusNode, CampusEdge, DijkstraStep } from '../types';

interface CleanCampusMapProps {
  nodes: CampusNode[];
  edges: CampusEdge[];
  sourceId: string;
  targetId: string;
  activePath: string[];
  simulatorStep: DijkstraStep | null;
  isSimulating: boolean;
  onSelectNode: (nodeId: string) => void;
}

export const CleanCampusMap: React.FC<CleanCampusMapProps> = ({
  nodes,
  edges,
  sourceId,
  targetId,
  activePath,
  simulatorStep,
  isSimulating,
  onSelectNode
}) => {
  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const pathEdgeSet = new Set<string>();
  for (let i = 0; i < activePath.length - 1; i++) {
    const u = activePath[i];
    const v = activePath[i + 1];
    pathEdgeSet.add(`${u}->${v}`);
    pathEdgeSet.add(`${v}->${u}`);
  }

  // SVG dimensions & responsive viewBox
  const minX = 80;
  const minY = 60;
  const width = 960;
  const height = 620;

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-lg overflow-hidden">
      
      {/* Top Map Header / Legend */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
            Campus Graph G = (V, E)
          </span>
          <span className="text-slate-500 font-mono text-[10px]">
            ({nodes.length} Vertices, {edges.length} Walkways)
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Start (From)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-300">Destination (To)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-emerald-400 rounded-full" />
            <span className="text-emerald-400 font-semibold">Shortest Path</span>
          </div>
        </div>
      </div>

      {/* SVG Graph Visualization */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <svg
          viewBox={`${minX} ${minY} ${width} ${height}`}
          className="w-full h-full max-h-[540px]"
        >
          <defs>
            <linearGradient id="cleanRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            
            <filter id="cleanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Edges / Walkways */}
          <g className="edges-layer">
            {edges.map(edge => {
              const u = nodeMap.get(edge.source);
              const v = nodeMap.get(edge.target);
              if (!u || !v) return null;

              const isPathEdge = pathEdgeSet.has(`${edge.source}->${edge.target}`);
              const isRelaxingEdge =
                isSimulating &&
                simulatorStep?.activeEdge &&
                ((simulatorStep.activeEdge.source === edge.source && simulatorStep.activeEdge.target === edge.target) ||
                  (edge.bidirectional && simulatorStep.activeEdge.source === edge.target && simulatorStep.activeEdge.target === edge.source));

              const midX = (u.x + v.x) / 2;
              const midY = (u.y + v.y) / 2;

              return (
                <g key={edge.id} className="transition-all duration-200">
                  {/* Outer glow stroke for path */}
                  {isPathEdge && (
                    <line
                      x1={u.x}
                      y1={u.y}
                      x2={v.x}
                      y2={v.y}
                      stroke="rgba(16, 185, 129, 0.3)"
                      strokeWidth={10}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Main edge line */}
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={
                      isPathEdge
                        ? '#10b981'
                        : isRelaxingEdge
                        ? '#06b6d4'
                        : '#334155'
                    }
                    strokeWidth={isPathEdge ? 4 : isRelaxingEdge ? 3.5 : 2}
                    strokeDasharray={isRelaxingEdge ? '6 4' : 'none'}
                    strokeLinecap="round"
                  />

                  {/* Distance badge on edge */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-20"
                      y="-9"
                      width="40"
                      height="18"
                      rx="5"
                      fill={isPathEdge ? '#064e3b' : isRelaxingEdge ? '#083344' : '#0f172a'}
                      stroke={isPathEdge ? '#10b981' : isRelaxingEdge ? '#06b6d4' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={isPathEdge ? '#a7f3d0' : isRelaxingEdge ? '#67e8f9' : '#94a3b8'}
                      fontSize="9.5"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {edge.distance}m
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* 2. Vertices / Nodes */}
          <g className="nodes-layer">
            {nodes.map(node => {
              const isSource = node.id === sourceId;
              const isTarget = node.id === targetId;
              const isInPath = activePath.includes(node.id);
              const pathIdx = activePath.indexOf(node.id);

              // Simulator states
              const isCurrent = isSimulating && simulatorStep?.currentNodeId === node.id;
              const isNeighbor = isSimulating && simulatorStep?.examiningNeighborId === node.id;
              const isSettled = isSimulating && simulatorStep?.settledNodes?.includes(node.id);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => onSelectNode(node.id)}
                >
                  {/* Active highlight ring */}
                  {(isSource || isTarget || isCurrent) && (
                    <circle
                      r="26"
                      fill="none"
                      stroke={
                        isSource
                          ? 'rgba(16, 185, 129, 0.4)'
                          : isTarget
                          ? 'rgba(244, 63, 94, 0.4)'
                          : 'rgba(168, 85, 247, 0.4)'
                      }
                      strokeWidth="3"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Vertex Disc */}
                  <circle
                    r="18"
                    fill={
                      isSource
                        ? '#10b981'
                        : isTarget
                        ? '#f43f5e'
                        : isCurrent
                        ? '#a855f7'
                        : isInPath
                        ? '#059669'
                        : isSettled
                        ? '#1e293b'
                        : '#0f172a'
                    }
                    stroke={
                      isSource
                        ? '#34d399'
                        : isTarget
                        ? '#fda4af'
                        : isCurrent
                        ? '#c084fc'
                        : isInPath
                        ? '#10b981'
                        : isNeighbor
                        ? '#06b6d4'
                        : '#475569'
                    }
                    strokeWidth={isSource || isTarget ? '3' : '2'}
                  />

                  {/* Path order number or icon */}
                  {isInPath && pathIdx >= 0 ? (
                    <text
                      textAnchor="middle"
                      y="4"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono"
                    >
                      {pathIdx + 1}
                    </text>
                  ) : (
                    <circle
                      r="4"
                      fill={isSettled ? '#10b981' : isNeighbor ? '#06b6d4' : '#94a3b8'}
                    />
                  )}

                  {/* Node Label Pill Below */}
                  <g transform="translate(0, 28)">
                    <rect
                      x={-(node.shortName.length * 3.8 + 8)}
                      y="-10"
                      width={node.shortName.length * 7.6 + 16}
                      height="18"
                      rx="5"
                      fill="#0f172a"
                      stroke={
                        isSource
                          ? 'rgba(16, 185, 129, 0.6)'
                          : isTarget
                          ? 'rgba(244, 63, 94, 0.6)'
                          : 'rgba(255, 255, 255, 0.15)'
                      }
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="2.5"
                      fill={isSource ? '#6ee7b7' : isTarget ? '#fda4af' : '#f1f5f9'}
                      fontSize="10.5"
                      fontWeight="600"
                    >
                      {node.shortName}
                    </text>
                  </g>

                  {/* Distance snapshot in simulator */}
                  {isSimulating && simulatorStep?.distances[node.id] !== undefined && (
                    <g transform="translate(0, -26)">
                      <rect
                        x="-18"
                        y="-8"
                        width="36"
                        height="16"
                        rx="4"
                        fill={simulatorStep.distances[node.id] === Infinity ? '#334155' : '#047857'}
                      />
                      <text
                        textAnchor="middle"
                        y="3"
                        fill="#ffffff"
                        fontSize="9"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                      >
                        {simulatorStep.distances[node.id] === Infinity ? '∞' : `${simulatorStep.distances[node.id]}m`}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Bottom helper text */}
      <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>💡 Click any building on the map to select it</span>
        <span className="font-mono text-emerald-400">Dijkstra O((V + E) log V)</span>
      </div>

    </div>
  );
};
