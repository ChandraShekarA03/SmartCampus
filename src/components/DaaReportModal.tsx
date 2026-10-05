import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface DaaReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  campusName: string;
}

export const DaaReportModal: React.FC<DaaReportModalProps> = ({
  isOpen,
  onClose,
  campusName
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                DAA Project Report & Viva Documentation
              </h2>
              <p className="text-xs text-slate-400">
                Design and Analysis of Algorithms • Full 16-Section Academic Paper
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-200 text-sm leading-relaxed font-sans bg-slate-900 printable-doc">
          
          {/* Cover / Title Block */}
          <div className="border-b border-slate-700 pb-6 text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 block mb-1">
              Design and Analysis of Algorithms (DAA) — CIA 3 Project
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              SmartCampus — Intelligent Campus Route Finder
            </h1>
            <p className="text-sm text-indigo-300 font-medium">
              Graph Modeling & Greedy Shortest Path Optimization using Dijkstra's Algorithm
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-slate-400 font-mono">
              <span>Institution: {campusName}</span>
              <span>•</span>
              <span>Data Structure: Weighted Graph G = (V, E) + Min-Heap</span>
              <span>•</span>
              <span>Complexity: O((V + E) log V)</span>
            </div>
          </div>

          {/* Section 1: Introduction */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>1.</span> Introduction
            </h3>
            <p className="text-slate-300">
              Modern educational university campuses span tens of acres with intricate networks of academic blocks, high-performance computing laboratories, research centers, libraries, food courts, and residential dormitories. Navigating across these multi-way intersections efficiently presents an optimization challenge for new students, visiting professors, and administrative personnel. 
            </p>
            <p className="text-slate-300">
              <strong>SmartCampus</strong> solves this spatial optimization problem by modeling the university campus as a weighted, non-negative graph and executing Dijkstra&apos;s Shortest Path algorithm augmented with a binary min-heap priority queue.
            </p>
          </section>

          {/* Section 2: Problem Statement */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>2.</span> Problem Statement
            </h3>
            <p className="text-slate-300">
              Given a physical campus terrain with <code className="text-cyan-300 font-mono">V</code> discrete locations and <code className="text-cyan-300 font-mono">E</code> walkable corridors with known non-negative distance metrics <code className="text-cyan-300 font-mono">w(u, v) ≥ 0</code>:
            </p>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300">
              Given Source s ∈ V and Destination t ∈ V, find a sequence of contiguous vertices P = &lt;s = v₀, v₁, v₂, ..., vₖ = t&gt; such that the total sum of edge weights Σ w(vᵢ₋₁, vᵢ) is strictly minimized.
            </div>
          </section>

          {/* Section 3: Objectives */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>3.</span> Objectives
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs sm:text-sm pl-2">
              <li>Formulate and store the campus layout as an Adjacency List graph data structure.</li>
              <li>Implement Dijkstra&apos;s Algorithm utilizing a custom Min-Binary Heap with <code className="text-indigo-300 font-mono">O(log V)</code> operations.</li>
              <li>Provide a step-by-step visual execution simulator for academic viva and algorithmic tracing.</li>
              <li>Deliver analytical comparison benchmarks contrasting Dijkstra against BFS, A*, and Bellman-Ford.</li>
              <li>Provide an interactive Graph Editor allowing dynamic topology modifications.</li>
            </ul>
          </section>

          {/* Section 4: Real-World Application */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>4.</span> Real-World Application
            </h3>
            <p className="text-slate-300">
              The graph traversal principles in SmartCampus directly power real-world navigation engines including Google Maps, OpenStreetMap, autonomous delivery robots, airport passenger routing, and logistics supply chain routing.
            </p>
          </section>

          {/* Section 5: Graph Representation */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>5.</span> Graph Representation G = (V, E)
            </h3>
            <p className="text-slate-300">
              The campus is represented as a weighted graph <code className="text-cyan-300 font-mono">G = (V, E)</code>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-indigo-300 font-bold block mb-1">Vertices V (Buildings):</span>
                <span>V = &#123; Main Block, Library, CS Block, Cafeteria, Science Lab, Auditorium, Sports Arena, Hostel, ... &#125;</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-indigo-300 font-bold block mb-1">Edges E (Walkable Corridors):</span>
                <span>Main ➜ Library (120m), Library ➜ CS (180m), Main ➜ Cafeteria (200m), Cafeteria ➜ CS (100m)</span>
              </div>
            </div>
          </section>

          {/* Section 6: Dijkstra's Algorithm */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>6.</span> Dijkstra&apos;s Algorithm & Greedy Strategy
            </h3>
            <p className="text-slate-300">
              Dijkstra&apos;s algorithm is a greedy single-source shortest path algorithm that maintains a set of settled vertices whose shortest distance from the source is finalized. At each iteration, the algorithm selects the unsettled vertex <code className="text-cyan-300 font-mono">u</code> with the minimal tentative distance from a Priority Queue and relaxes all its adjacent edges <code className="text-cyan-300 font-mono">(u, v)</code>.
            </p>
          </section>

          {/* Section 7: Formal Pseudocode */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>7.</span> Formal Pseudocode
            </h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <pre>{`ALGORITHM Dijkstra(Graph G, Source s, Destination t):
1.  FOR each vertex v in G.V:
2.      dist[v] ← INFINITY
3.      prev[v] ← NULL
4.  dist[s] ← 0
5.  
6.  PQ ← MinPriorityQueue()
7.  PQ.insert(s, 0)
8.  
9.  WHILE PQ is not empty:
10.     u ← PQ.extractMin()
11.     IF u == t: 
12.         BREAK (Early stopping optimization)
13.     
14.     FOR each neighbor v in G.Adj[u]:
15.         alt ← dist[u] + weight(u, v)
16.         IF alt < dist[v]:          // Edge Relaxation
17.             dist[v] ← alt
18.             prev[v] ← u
19.             PQ.insert(v, alt)
20. 
21. RETURN ReconstructPath(prev, s, t), dist[t]`}</pre>
            </div>
          </section>

          {/* Section 8: Complexity Analysis */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>8.</span> Asymptotic Complexity Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-indigo-300 font-bold block mb-1">Time Complexity: O((V + E) log V)</span>
                <p className="text-slate-400 leading-relaxed">
                  Extract-min is called at most |V| times (O(V log V)). Edge relaxation occurs at most |E| times with priority updates in O(E log V). Total running time = O((V + E) log V).
                </p>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-indigo-300 font-bold block mb-1">Space Complexity: O(V + E)</span>
                <p className="text-slate-400 leading-relaxed">
                  Adjacency List requires O(V + E) space. Distances array, predecessor pointers, and Min-Heap require O(V) auxiliary space.
                </p>
              </div>
            </div>
          </section>

          {/* Section 9: Test Suite Results */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>9.</span> Test Suite Verification Matrix
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-2.5">Test</th>
                    <th className="p-2.5">Source</th>
                    <th className="p-2.5">Destination</th>
                    <th className="p-2.5">Expected</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                  <tr><td className="p-2.5 font-bold">T1</td><td className="p-2.5">Main Block</td><td className="p-2.5">Library</td><td className="p-2.5">120m</td><td className="p-2.5 text-emerald-400 font-bold">PASS</td></tr>
                  <tr><td className="p-2.5 font-bold">T2</td><td className="p-2.5">Library</td><td className="p-2.5">CS Block</td><td className="p-2.5">180m</td><td className="p-2.5 text-emerald-400 font-bold">PASS</td></tr>
                  <tr><td className="p-2.5 font-bold">T3</td><td className="p-2.5">Main Block</td><td className="p-2.5">Auditorium</td><td className="p-2.5">160m</td><td className="p-2.5 text-emerald-400 font-bold">PASS</td></tr>
                  <tr><td className="p-2.5 font-bold">T4</td><td className="p-2.5">Main Block</td><td className="p-2.5">Main Block</td><td className="p-2.5">0m</td><td className="p-2.5 text-emerald-400 font-bold">PASS</td></tr>
                  <tr><td className="p-2.5 font-bold">T5</td><td className="p-2.5">Main Block</td><td className="p-2.5">CS Block</td><td className="p-2.5">300m</td><td className="p-2.5 text-emerald-400 font-bold">PASS</td></tr>
                  <tr><td className="p-2.5 font-bold">T6</td><td className="p-2.5">Main Block</td><td className="p-2.5">Disconnected Island</td><td className="p-2.5">UNREACHABLE</td><td className="p-2.5 text-emerald-400 font-bold">PASS</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 10: Limitations & Future Enhancements */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>10.</span> Limitations & Future Scope
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-300 font-bold block mb-1">Limitations:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Static edge weights without live pedestrian congestion data.</li>
                  <li>Assumes non-negative edge costs (standard for physical distance).</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-cyan-300 font-bold block mb-1">Future Scope:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Indoor floor-by-floor navigation (Multi-layer 3D graph).</li>
                  <li>Wheelchair accessible and weather-covered route filtering.</li>
                  <li>Real GPS / Beacon positioning integration.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 11: Conclusion */}
          <section className="space-y-2">
            <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
              <span>11.</span> Conclusion
            </h3>
            <p className="text-slate-300">
              The <strong>SmartCampus</strong> application successfully combines core graph theory algorithms with a responsive visual simulator and benchmark suite. The binary min-heap implementation guarantees optimal <code className="text-cyan-300 font-mono">O((V + E) log V)</code> execution while making the inner workings of Dijkstra transparent and interactive for academic evaluation.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
