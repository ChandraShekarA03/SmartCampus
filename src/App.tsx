import React, { useState, useEffect, useMemo } from 'react';
import { CHRIST_CAMPUS_GRAPH } from './data/defaultCampus';
import type { 
  CampusNode, 
  CampusEdge, 
  PathResult, 
  DijkstraStep 
} from './types';
import { runDijkstra, generateDijkstraSteps } from './algorithms/dijkstra';
import { CleanCampusMap } from './components/CleanCampusMap';
import { RoutePanel } from './components/RoutePanel';
import { CleanVisualizer } from './components/CleanVisualizer';
import { RouteAnalysisPanel } from './components/RouteAnalysisPanel';
import { AlgorithmComparisonPanel } from './components/AlgorithmComparisonPanel';
import { GraphEditorPanel } from './components/GraphEditorPanel';
import { TestSuitePanel } from './components/TestSuitePanel';
import { DaaReportModal } from './components/DaaReportModal';
import { 
  Compass, 
  PlayCircle, 
  GitCompare, 
  Edit3, 
  CheckCircle2, 
  FileText, 
  X,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

type MainViewTab = 'navigate' | 'visualize' | 'compare' | 'editor' | 'testsuite';

export function App() {
  const [nodes, setNodes] = useState<CampusNode[]>(CHRIST_CAMPUS_GRAPH.nodes);
  const [edges, setEdges] = useState<CampusEdge[]>(CHRIST_CAMPUS_GRAPH.edges);

  const [sourceId, setSourceId] = useState<string>('main-block');
  const [targetId, setTargetId] = useState<string>('cs-block');
  const [pathResult, setPathResult] = useState<PathResult | null>(null);

  const [currentTab, setCurrentTab] = useState<MainViewTab>('navigate');
  const [simulatorSteps, setSimulatorSteps] = useState<DijkstraStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);

  const nodeMap = useMemo(() => {
    const map = new Map<string, CampusNode>();
    nodes.forEach(n => map.set(n.id, n));
    return map;
  }, [nodes]);

  const handleFindRoute = (srcId = sourceId, dstId = targetId) => {
    if (!srcId || !dstId) return;

    const result = runDijkstra(nodes, edges, srcId, dstId);
    setPathResult(result);

    const steps = generateDijkstraSteps(nodes, edges, srcId, dstId);
    setSimulatorSteps(steps);
    setCurrentStepIndex(0);

    if (result.found && result.totalDistance > 0) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  useEffect(() => {
    handleFindRoute('main-block', 'cs-block');
  }, []);

  useEffect(() => {
    if (sourceId && targetId) {
      const steps = generateDijkstraSteps(nodes, edges, sourceId, targetId);
      setSimulatorSteps(steps);
      setCurrentStepIndex(0);
    }
  }, [sourceId, targetId, nodes, edges]);

  const handleMapSelectNode = (nodeId: string) => {
    if (!sourceId || (sourceId && targetId)) {
      setSourceId(nodeId);
      setTargetId('');
    } else {
      setTargetId(nodeId);
      handleFindRoute(sourceId, nodeId);
    }
  };

  const activePath = useMemo(() => {
    if (currentTab === 'visualize' && simulatorSteps.length > 0) {
      const step = simulatorSteps[currentStepIndex];
      if (step && step.currentNodeId) {
        const temp: string[] = [];
        let curr: string | null = step.currentNodeId;
        while (curr !== null) {
          temp.unshift(curr);
          curr = step.previous[curr] || null;
        }
        return temp;
      }
    }
    return pathResult?.path || [];
  }, [currentTab, simulatorSteps, currentStepIndex, pathResult]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. Clean Top Header */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">SmartCampus</h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                CHRIST DAA
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Intelligent Route Finder (Dijkstra Shortest Path)</p>
          </div>
        </div>

        {/* Clean Center Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setCurrentTab('navigate')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'navigate' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Route Finder
          </button>

          <button
            onClick={() => {
              setCurrentTab('visualize');
              setCurrentStepIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'visualize' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Algorithm Visualizer
          </button>

          <button
            onClick={() => setCurrentTab('compare')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'compare' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Compare Algorithms
          </button>

          <button
            onClick={() => setCurrentTab('editor')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'editor' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Graph Editor
          </button>

          <button
            onClick={() => setCurrentTab('testsuite')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              currentTab === 'testsuite' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Test Suite
          </button>
        </nav>

        {/* Academic Paper Button */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>Academic Paper (16 Sections)</span>
        </button>
      </header>

      {/* 2. Main Workspace (Clean 2-Column Split Layout) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 of 12 columns) */}
        <div className="lg:col-span-5 w-full space-y-4">
          {currentTab === 'navigate' && (
            <RoutePanel
              nodes={nodes}
              sourceId={sourceId}
              targetId={targetId}
              setSourceId={setSourceId}
              setTargetId={setTargetId}
              onFindRoute={() => handleFindRoute()}
              pathResult={pathResult}
              onOpenVisualizer={() => {
                setCurrentTab('visualize');
                setCurrentStepIndex(0);
              }}
              onOpenCompare={() => setCurrentTab('compare')}
              onOpenWhyRoute={() => setShowWhyModal(true)}
            />
          )}

          {currentTab === 'visualize' && (
            <CleanVisualizer
              steps={simulatorSteps}
              currentStepIndex={currentStepIndex}
              setCurrentStepIndex={setCurrentStepIndex}
              nodes={nodes}
              sourceName={nodeMap.get(sourceId)?.shortName || sourceId}
              targetName={nodeMap.get(targetId)?.shortName || targetId}
            />
          )}

          {currentTab === 'compare' && (
            <AlgorithmComparisonPanel
              nodes={nodes}
              edges={edges}
              sourceId={sourceId}
              targetId={targetId}
            />
          )}

          {currentTab === 'editor' && (
            <GraphEditorPanel
              nodes={nodes}
              edges={edges}
              onAddNode={(n) => setNodes(prev => [...prev, n])}
              onDeleteNode={(id) => {
                setNodes(prev => prev.filter(n => n.id !== id));
                setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
              }}
              onAddEdge={(e) => setEdges(prev => [...prev, e])}
              onDeleteEdge={(id) => setEdges(prev => prev.filter(e => e.id !== id))}
              onResetGraph={() => {
                setNodes(CHRIST_CAMPUS_GRAPH.nodes);
                setEdges(CHRIST_CAMPUS_GRAPH.edges);
                handleFindRoute('main-block', 'cs-block');
              }}
              onImportGraph={(data) => {
                setNodes(data.nodes);
                setEdges(data.edges);
              }}
            />
          )}

          {currentTab === 'testsuite' && (
            <TestSuitePanel
              nodes={nodes}
              edges={edges}
            />
          )}
        </div>

        {/* Right Column: Clean Campus Graph (7 of 12 columns) */}
        <div className="lg:col-span-7 w-full h-[580px] sticky top-4">
          <CleanCampusMap
            nodes={nodes}
            edges={edges}
            sourceId={sourceId}
            targetId={targetId}
            activePath={activePath}
            simulatorStep={currentTab === 'visualize' ? simulatorSteps[currentStepIndex] || null : null}
            isSimulating={currentTab === 'visualize'}
            onSelectNode={handleMapSelectNode}
          />
        </div>

      </main>

      {/* 3. Why This Route Modal */}
      {showWhyModal && pathResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl">
            <button
              onClick={() => setShowWhyModal(false)}
              className="absolute -top-3 -right-3 p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white border border-slate-700 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
            <RouteAnalysisPanel
              nodes={nodes}
              edges={edges}
              sourceId={sourceId}
              targetId={targetId}
              primaryResult={pathResult}
            />
          </div>
        </div>
      )}

      {/* 4. Full Academic Paper Modal */}
      <DaaReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        campusName="CHRIST (Deemed to be University)"
      />

    </div>
  );
}

export default App;
