import React, { useState } from 'react';
import { 
  CampusNode, 
  CampusEdge, 
  NodeCategory 
} from '../types';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  Link, 
  Building, 
  Edit3, 
  Check,
  AlertCircle
} from 'lucide-react';

interface GraphEditorPanelProps {
  nodes: CampusNode[];
  edges: CampusEdge[];
  onAddNode: (node: CampusNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddEdge: (edge: CampusEdge) => void;
  onDeleteEdge: (edgeId: string) => void;
  onResetGraph: () => void;
  onImportGraph: (data: { nodes: CampusNode[]; edges: CampusEdge[] }) => void;
}

export const GraphEditorPanel: React.FC<GraphEditorPanelProps> = ({
  nodes,
  edges,
  onAddNode,
  onDeleteNode,
  onAddEdge,
  onDeleteEdge,
  onResetGraph,
  onImportGraph
}) => {
  // Form states for adding node
  const [nodeName, setNodeName] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState<NodeCategory>('academic');
  const [nodeDesc, setNodeDesc] = useState('');
  const [coordX, setCoordX] = useState<number>(600);
  const [coordY, setCoordY] = useState<number>(400);

  // Form states for adding edge
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeDistance, setEdgeDistance] = useState<number>(100);
  const [isBidirectional, setIsBidirectional] = useState<boolean>(true);
  const [edgeType, setEdgeType] = useState<'walkway' | 'covered' | 'stairs' | 'ramp' | 'scenic'>('walkway');

  const [activeTab, setActiveTab] = useState<'addNode' | 'addEdge' | 'manage'>('addNode');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim() || !shortName.trim()) {
      showFeedback('Please enter building name and short label.');
      return;
    }

    const id = shortName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4);
    const newNode: CampusNode = {
      id,
      name: nodeName.trim(),
      shortName: shortName.trim(),
      category,
      x: coordX,
      y: coordY,
      description: nodeDesc.trim() || 'New campus facility added via Graph Editor.',
      floors: 3,
      departments: ['Department of Innovation']
    };

    onAddNode(newNode);
    setNodeName('');
    setShortName('');
    setNodeDesc('');
    showFeedback(`Added building '${newNode.shortName}' to Campus Graph!`);
  };

  const handleCreateEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeSource || !edgeTarget) {
      showFeedback('Please select both source and target buildings.');
      return;
    }
    if (edgeSource === edgeTarget) {
      showFeedback('Cannot connect building to itself.');
      return;
    }

    const id = `e-${edgeSource}-${edgeTarget}-${Date.now().toString().slice(-4)}`;
    const newEdge: CampusEdge = {
      id,
      source: edgeSource,
      target: edgeTarget,
      distance: Number(edgeDistance),
      bidirectional: isBidirectional,
      type: edgeType,
      description: `${edgeType.toUpperCase()} path (${edgeDistance}m)`
    };

    onAddEdge(newEdge);
    showFeedback(`Connected path with distance ${edgeDistance}m!`);
  };

  const handleExportJSON = () => {
    const exportData = { nodes, edges };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartCampus_Graph_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showFeedback('Graph exported successfully!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          onImportGraph(parsed);
          showFeedback('Imported custom campus graph successfully!');
        } else {
          showFeedback('Invalid JSON format. Expected nodes and edges arrays.');
        }
      } catch (err) {
        showFeedback('Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  return (
    <div className="glass-panel p-6 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Campus Graph Editor & Sandbox</h3>
            <p className="text-xs text-slate-400">
              Dynamically model nodes V and weighted edges E for viva demonstration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetGraph}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Default
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-purple-400" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export JSON
          </button>
        </div>
      </div>


      {/* Feedback Alert if any */}
      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs font-semibold text-purple-200 flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-purple-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('addNode')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'addNode'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          + Add Building (Node V)
        </button>
        <button
          onClick={() => setActiveTab('addEdge')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'addEdge'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          + Add Walkway (Edge E)
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'manage'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          Manage Graph ({nodes.length} Nodes, {edges.length} Edges)
        </button>
      </div>

      {/* Tab 1: Add Node Form */}
      {activeTab === 'addNode' && (
        <form onSubmit={handleCreateNode} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Building Full Name</label>
              <input
                type="text"
                placeholder="e.g. New Robotics & IoT Research Lab"
                value={nodeName}
                onChange={e => setNodeName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Short Map Label</label>
              <input
                type="text"
                placeholder="e.g. Robotics Lab"
                value={shortName}
                onChange={e => setShortName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as NodeCategory)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="academic">Academic / Labs</option>
                <option value="facility">Facility / Hall</option>
                <option value="food">Food & Canteen</option>
                <option value="admin">Administrative</option>
                <option value="sports">Sports / Arena</option>
                <option value="residential">Residential / Hostel</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Canvas X (100 - 1000)</label>
              <input
                type="number"
                value={coordX}
                onChange={e => setCoordX(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Canvas Y (80 - 700)</label>
              <input
                type="number"
                value={coordY}
                onChange={e => setCoordY(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
            <input
              type="text"
              placeholder="e.g. New laboratory facility for robotics engineering students."
              value={nodeDesc}
              onChange={e => setNodeDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <button type="submit" className="btn-accent text-xs py-2.5">
            <Plus className="w-4 h-4" />
            Add Location Node (V)
          </button>
        </form>
      )}

      {/* Tab 2: Add Edge Form */}
      {activeTab === 'addEdge' && (
        <form onSubmit={handleCreateEdge} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">From Building (u)</label>
              <select
                value={edgeSource}
                onChange={e => setEdgeSource(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">-- Select Source --</option>
                {nodes.map(n => (
                  <option key={`es-${n.id}`} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">To Building (v)</label>
              <select
                value={edgeTarget}
                onChange={e => setEdgeTarget(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                required
              >
                <option value="">-- Select Destination --</option>
                {nodes.map(n => (
                  <option key={`et-${n.id}`} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Distance (Meters Weight)</label>
              <input
                type="number"
                min="10"
                max="2000"
                value={edgeDistance}
                onChange={e => setEdgeDistance(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Path Type</label>
              <select
                value={edgeType}
                onChange={e => setEdgeType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="walkway">Standard Walkway</option>
                <option value="covered">Covered Canopy</option>
                <option value="scenic">Scenic Garden Path</option>
                <option value="ramp">Accessible Ramp</option>
                <option value="stairs">Staircase Route</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="bidirCheck"
                checked={isBidirectional}
                onChange={e => setIsBidirectional(e.target.checked)}
                className="w-4 h-4 accent-purple-500 rounded"
              />
              <label htmlFor="bidirCheck" className="text-xs text-slate-300 cursor-pointer">
                Two-way Walkway (Bidirectional)
              </label>
            </div>
          </div>

          <button type="submit" className="btn-accent text-xs py-2.5">
            <Link className="w-4 h-4" />
            Connect Walkway Edge (E)
          </button>
        </form>
      )}

      {/* Tab 3: Manage Nodes and Edges */}
      {activeTab === 'manage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Nodes List */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Campus Buildings (V = {nodes.length})
            </h4>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {nodes.map(n => (
                <div key={`m-node-${n.id}`} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{n.name}</span>
                    <span className="text-[10px] text-slate-500 ml-2">({n.category})</span>
                  </div>
                  <button
                    onClick={() => onDeleteNode(n.id)}
                    title="Delete Node"
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Edges List */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Walkway Connections (E = {edges.length})
            </h4>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {edges.map(e => {
                const sName = nodeMap.get(e.source)?.shortName || e.source;
                const tName = nodeMap.get(e.target)?.shortName || e.target;
                return (
                  <div key={`m-edge-${e.id}`} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 text-xs">
                    <div className="font-mono">
                      <span className="text-slate-300">{sName}</span>
                      <span className="text-purple-400 mx-1">⟷</span>
                      <span className="text-slate-300">{tName}</span>
                      <span className="text-emerald-400 ml-2 font-bold">({e.distance}m)</span>
                    </div>
                    <button
                      onClick={() => onDeleteEdge(e.id)}
                      title="Delete Edge"
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
