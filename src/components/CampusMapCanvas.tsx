import React, { useState, useRef, useEffect } from 'react';
import type { CampusNode, CampusEdge, DijkstraStep } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers, 
  MapPin,
  Sparkles,
  Compass,
  Navigation,
  Eye,
  Info
} from 'lucide-react';

interface CampusMapCanvasProps {
  nodes: CampusNode[];
  edges: CampusEdge[];
  selectedSourceId: string;
  selectedTargetId: string;
  activePath: string[];
  simulatorStep: DijkstraStep | null;
  isSimulatorActive: boolean;
  onSelectNode: (nodeId: string, asType: 'source' | 'target' | 'view') => void;
  isEditorMode?: boolean;
  onNodeMove?: (nodeId: string, x: number, y: number) => void;
  onEdgeClick?: (edge: CampusEdge) => void;
}

export const CampusMapCanvas: React.FC<CampusMapCanvasProps> = ({
  nodes,
  edges,
  selectedSourceId,
  selectedTargetId,
  activePath,
  simulatorStep,
  isSimulatorActive,
  onSelectNode,
  isEditorMode = false,
  onNodeMove,
  onEdgeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Viewport transformation
  const [zoom, setZoom] = useState<number>(0.92);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 15 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);

  // HUD layers
  const [showDistances, setShowDistances] = useState<boolean>(true);
  const [showParks, setShowParks] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<CampusNode | null>(null);

  const resetView = () => {
    setZoom(0.92);
    setPan({ x: 40, y: 25 });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 2.4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.45));

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggingNodeId) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (draggingNodeId && isEditorMode && onNodeMove) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const rawX = (e.clientX - rect.left - pan.x) / zoom;
        const rawY = (e.clientY - rect.top - pan.y) / zoom;
        onNodeMove(draggingNodeId, Math.round(rawX), Math.round(rawY));
      }
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
    setZoom(prev => Math.min(Math.max(prev + delta, 0.45), 2.5));
  };

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const pathEdgeSet = new Set<string>();
  for (let i = 0; i < activePath.length - 1; i++) {
    const u = activePath[i];
    const v = activePath[i + 1];
    pathEdgeSet.add(`${u}->${v}`);
    pathEdgeSet.add(`${v}->${u}`);
  }

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'academic': return { fill: '#1e293b', border: '#3b82f6', glow: '#3b82f6', text: '#93c5fd', icon: '🏛️' };
      case 'food': return { fill: '#1e293b', border: '#f59e0b', glow: '#f59e0b', text: '#fde68a', icon: '☕' };
      case 'admin': return { fill: '#1e293b', border: '#a855f7', glow: '#a855f7', text: '#d8b4fe', icon: '🏛️' };
      case 'facility': return { fill: '#1e293b', border: '#10b981', glow: '#10b981', text: '#6ee7b7', icon: '🎭' };
      case 'sports': return { fill: '#1e293b', border: '#f43f5e', glow: '#f43f5e', text: '#fda4af', icon: '⚽' };
      case 'residential': return { fill: '#1e293b', border: '#0ea5e9', glow: '#0ea5e9', text: '#7dd3fc', icon: '🏠' };
      default: return { fill: '#1e293b', border: '#64748b', glow: '#64748b', text: '#cbd5e1', icon: '📍' };
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-[#07090e] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Dynamic Ambient Mesh Glow Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(30, 58, 138, 0.15) 0%, rgba(6, 78, 59, 0.08) 50%, transparent 80%)'
        }}
      />

      <svg
        className="w-full h-full absolute inset-0 pointer-events-auto"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <defs>
          <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.8" />
          </filter>

          <filter id="emeraldRouteGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <pattern id="campusGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* 1. Base Blueprint Grid */}
        <rect x="-1000" y="-1000" width="4000" height="4000" fill="url(#campusGrid)" />

        {/* 2. Campus Terrain: Parks, Plazas, Reflection Lake */}
        {showParks && (
          <g className="terrain-features opacity-85">
            {/* Central Courtyard & Botanical Lawn */}
            <path
              d="M 320 220 C 400 150, 600 160, 680 230 C 720 320, 620 440, 520 420 C 400 400, 280 340, 320 220 Z"
              fill="rgba(6, 44, 30, 0.45)"
              stroke="rgba(16, 185, 129, 0.15)"
              strokeWidth="2"
            />

            {/* University Fountain & Reflection Pond */}
            <ellipse
              cx="580"
              cy="340"
              rx="65"
              ry="45"
              fill="rgba(6, 40, 61, 0.6)"
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="2"
            />
            <circle cx="580" cy="340" r="12" fill="rgba(6, 182, 212, 0.4)" />
            <text x="580" y="344" textAnchor="middle" fill="#67e8f9" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600" opacity="0.8">
              FOUNTAIN
            </text>

            {/* Athletic Arena Field */}
            <rect
              x="720"
              y="480"
              width="150"
              height="100"
              rx="30"
              fill="rgba(50, 15, 28, 0.45)"
              stroke="rgba(244, 63, 94, 0.25)"
              strokeWidth="2"
            />
            <line x1="795" y1="480" x2="795" y2="580" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="795" cy="530" r="18" fill="none" stroke="rgba(244, 63, 94, 0.2)" strokeWidth="1.5" />

            {/* West Amphitheatre Lawn */}
            <path
              d="M 240 560 A 80 80 0 0 1 400 560 Z"
              fill="rgba(20, 30, 50, 0.5)"
              stroke="rgba(99, 102, 241, 0.2)"
              strokeWidth="2"
            />
          </g>
        )}

        {/* 3. Walkways and Road Network */}
        <g className="edges-network">
          {edges.map(edge => {
            const uNode = nodeMap.get(edge.source);
            const vNode = nodeMap.get(edge.target);
            if (!uNode || !vNode) return null;

            const isEdgeInPath = pathEdgeSet.has(`${edge.source}->${edge.target}`);
            const isRelaxingInSim =
              isSimulatorActive &&
              simulatorStep?.activeEdge &&
              ((simulatorStep.activeEdge.source === edge.source && simulatorStep.activeEdge.target === edge.target) ||
                (edge.bidirectional && simulatorStep.activeEdge.source === edge.target && simulatorStep.activeEdge.target === edge.source));

            const midX = (uNode.x + vNode.x) / 2;
            const midY = (uNode.y + vNode.y) / 2;

            return (
              <g 
                key={edge.id}
                className="transition-all duration-300 cursor-pointer group"
                onClick={() => onEdgeClick && onEdgeClick(edge)}
              >
                {/* Wide Pavement Asphalt Underlayer */}
                <line
                  x1={uNode.x}
                  y1={uNode.y}
                  x2={vNode.x}
                  y2={vNode.y}
                  stroke={isEdgeInPath ? 'rgba(16, 185, 129, 0.25)' : isRelaxingInSim ? 'rgba(6, 182, 212, 0.3)' : 'rgba(15, 23, 42, 0.8)'}
                  strokeWidth={isEdgeInPath ? 14 : isRelaxingInSim ? 12 : 8}
                  strokeLinecap="round"
                />

                {/* Road Curb Border */}
                <line
                  x1={uNode.x}
                  y1={uNode.y}
                  x2={vNode.x}
                  y2={vNode.y}
                  stroke={
                    isEdgeInPath
                      ? '#059669'
                      : isRelaxingInSim
                      ? '#0891b2'
                      : edge.type === 'covered'
                      ? 'rgba(99, 102, 241, 0.35)'
                      : 'rgba(51, 65, 85, 0.6)'
                  }
                  strokeWidth={isEdgeInPath ? 4 : isRelaxingInSim ? 3.5 : 2}
                  strokeDasharray={edge.type === 'covered' ? '6 4' : 'none'}
                  strokeLinecap="round"
                  filter={isEdgeInPath ? 'url(#emeraldRouteGlow)' : undefined}
                />

                {/* Animated Glowing Laser Route */}
                {isEdgeInPath && (
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke="#34d399"
                    strokeWidth={3}
                    strokeLinecap="round"
                    className="route-flow-line"
                  />
                )}

                {/* Simulator Laser Sweep */}
                {isRelaxingInSim && (
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke="#22d3ee"
                    strokeWidth={3}
                    strokeLinecap="round"
                    className="laser-pulse"
                  />
                )}

                {/* Distance Badge Label */}
                {showDistances && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-22"
                      y="-10"
                      width="44"
                      height="20"
                      rx="6"
                      fill={isEdgeInPath ? '#064e3b' : isRelaxingInSim ? '#155e75' : '#0f172a'}
                      stroke={isEdgeInPath ? '#10b981' : isRelaxingInSim ? '#06b6d4' : 'rgba(255,255,255,0.12)'}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={isEdgeInPath ? '#a7f3d0' : isRelaxingInSim ? '#a5f3fc' : '#94a3b8'}
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                      fontWeight="600"
                    >
                      {edge.distance}m
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* 4. Architectural Building Footprints & Nodes */}
        <g className="buildings-layer">
          {nodes.map(node => {
            const isSource = node.id === selectedSourceId;
            const isTarget = node.id === selectedTargetId;
            const isInPath = activePath.includes(node.id);
            const pathIndex = activePath.indexOf(node.id);

            const isCurrentInSim = isSimulatorActive && simulatorStep?.currentNodeId === node.id;
            const isNeighborInSim = isSimulatorActive && simulatorStep?.examiningNeighborId === node.id;
            const isSettledInSim = isSimulatorActive && simulatorStep?.settledNodes?.includes(node.id);
            const inQueueInSim = isSimulatorActive && simulatorStep?.queueState?.some(q => q.id === node.id);

            const cat = getCategoryStyles(node.category);

            // Architectural building card size
            const cardWidth = 110;
            const cardHeight = 52;
            const cardX = -cardWidth / 2;
            const cardY = -cardHeight / 2;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => {
                  if (isEditorMode) {
                    e.stopPropagation();
                    setDraggingNodeId(node.id);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isEditorMode) {
                    if (!selectedSourceId || (selectedSourceId && selectedTargetId)) {
                      onSelectNode(node.id, 'source');
                    } else {
                      onSelectNode(node.id, 'target');
                    }
                  }
                }}
              >
                {/* Visual Glow Aura for Source & Destination */}
                {isSource && (
                  <circle
                    r="48"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    className="beacon-ring"
                  />
                )}

                {isTarget && (
                  <circle
                    r="48"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2.5"
                    className="beacon-ring"
                  />
                )}

                {/* Simulator Highlights */}
                {isCurrentInSim && (
                  <circle
                    r="54"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="laser-pulse"
                  />
                )}

                {isNeighborInSim && (
                  <circle
                    r="46"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                )}

                {/* 3D Depth Isometric Shadow Base */}
                <rect
                  x={cardX}
                  y={cardY + 5}
                  width={cardWidth}
                  height={cardHeight}
                  rx="14"
                  fill="#000000"
                  opacity="0.6"
                  filter="url(#nodeShadow)"
                />

                {/* Architectural Building Card Body */}
                <rect
                  x={cardX}
                  y={cardY}
                  width={cardWidth}
                  height={cardHeight}
                  rx="14"
                  fill={
                    isSource
                      ? '#064e3b'
                      : isTarget
                      ? '#881337'
                      : isCurrentInSim
                      ? '#3b0764'
                      : isInPath
                      ? '#132e35'
                      : '#0f172a'
                  }
                  stroke={
                    isSource
                      ? '#10b981'
                      : isTarget
                      ? '#f43f5e'
                      : isCurrentInSim
                      ? '#c084fc'
                      : isInPath
                      ? '#06b6d4'
                      : isSettledInSim
                      ? '#10b981'
                      : cat.border
                  }
                  strokeWidth={isSource || isTarget ? '2.5' : isInPath ? '2' : '1.2'}
                  className="transition-all duration-200 group-hover:scale-105"
                  style={{ transformOrigin: '0 0' }}
                />

                {/* Header Icon + Floors Pill */}
                <g transform={`translate(${cardX + 10}, ${cardY + 16})`}>
                  <text fontSize="14">{cat.icon}</text>
                  <text
                    x="22"
                    y="-1"
                    fill={isSource ? '#a7f3d0' : isTarget ? '#fda4af' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans"
                  >
                    {node.shortName.length > 12 ? `${node.shortName.slice(0, 11)}..` : node.shortName}
                  </text>
                </g>

                {/* Subtitle / Category Badge inside Card */}
                <g transform={`translate(${cardX + 10}, ${cardY + 36})`}>
                  <rect
                    x="0"
                    y="-8"
                    width={node.category.length * 6 + 14}
                    height="14"
                    rx="4"
                    fill="rgba(0, 0, 0, 0.4)"
                    stroke="rgba(255, 255, 255, 0.08)"
                  />
                  <text
                    x="7"
                    y="3"
                    fill={cat.text}
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily="JetBrains Mono"
                    style={{ textTransform: 'uppercase' }}
                  >
                    {node.category}
                  </text>


                  {/* Path Sequence Order Badge (e.g. 1, 2, 3) */}
                  {isInPath && pathIndex >= 0 && (
                    <g transform={`translate(${cardWidth - 30}, 0)`}>
                      <circle r="9" fill="#10b981" />
                      <text textAnchor="middle" y="3.5" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                        {pathIndex + 1}
                      </text>
                    </g>
                  )}
                </g>

                {/* Simulator Distance Bubble */}
                {isSimulatorActive && simulatorStep?.distances[node.id] !== undefined && (
                  <g transform="translate(0, -36)">
                    <rect
                      x="-26"
                      y="-11"
                      width="52"
                      height="20"
                      rx="6"
                      fill={simulatorStep.distances[node.id] === Infinity ? '#1e293b' : '#047857'}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                    <text
                      textAnchor="middle"
                      y="3.5"
                      fill="#ffffff"
                      fontSize="10"
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

      {/* Floating Canvas Controls (Bottom Right Dock) */}
      <div className="absolute bottom-6 right-6 flex items-center gap-1.5 p-1.5 rounded-2xl glass-island shadow-2xl z-20">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset Center"
          className="p-2.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        <button
          onClick={() => setShowDistances(!showDistances)}
          title="Toggle Walking Distances"
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            showDistances ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:bg-white/10'
          }`}
        >
          Distances
        </button>

        <button
          onClick={() => setShowParks(!showParks)}
          title="Toggle Campus Greenery"
          className={`p-2.5 rounded-xl transition-all ${
            showParks ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Building Hover Quick Card (Top Center / Near Cursor) */}
      {hoveredNode && (
        <div className="absolute top-20 right-6 max-w-sm p-4 rounded-2xl glass-island shadow-2xl animate-in fade-in zoom-in-95 duration-150 pointer-events-none z-30">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h4 className="font-bold text-sm text-white">{hoveredNode.name}</h4>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full cat-${hoveredNode.category}`}>
              {hoveredNode.category}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-2">{hoveredNode.description}</p>
          {hoveredNode.departments && (
            <div className="text-[11px] text-slate-400">
              <span className="text-indigo-300 font-semibold">Departments: </span>
              {hoveredNode.departments.slice(0, 2).join(', ')}
            </div>
          )}
          <div className="text-[10px] text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Click on building to set as Start or Destination
          </div>
        </div>
      )}
    </div>
  );
};
