# SmartCampus — Intelligent Campus Route Finder
### DAA (Design and Analysis of Algorithms) Capstone Project

**SmartCampus** is a campus navigation and route optimization system built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. The system models a physical university campus as a weighted graph $G = (V, E)$ and applies **Dijkstra's Algorithm** with a **Binary Min-Heap Priority Queue** to compute shortest walkable paths in $\mathcal{O}((V + E) \log V)$ time.

---

## 🌟 Key Features & Architectural Layers

### 1. Layer 1 — User Application & Interactive Campus Map
- **Interactive SVG Blueprint Canvas**: Zoom in/out, pan, reset view, and inspect campus buildings.
- **Dynamic Route Illumination**: Shortest routes glow with moving particle beams, distance tags, and numbered waypoint markers.
- **Location Selector**: Select source and destination buildings with instant swap, category filters (Academic, Food, Admin, Sports, Residence), and quick preset demo chips.
- **Real-time Navigation Metrics**:
  - Shortest distance in meters
  - Estimated walking time (at 1.2 m/s standard walking speed)
  - Estimated step count and calories burned
  - Step-by-step turn-by-turn waypoint itinerary

### 2. Layer 2 — DAA Algorithm Engine
- **Graph Representation**: Adjacency list representation supporting bidirectional and directed walkways.
- **Min-Binary Heap Priority Queue**: Custom heap implementation with $\mathcal{O}(\log V)$ `insert`, `extractMin`, and operation counters for viva profiling.
- **High-Resolution Microsecond Profiling**: Measures actual CPU execution time.

### 3. Layer 3 — Step-by-Step Dijkstra Visual Simulator (Viva Showcase)
- **Interactive VCR Controls**: Play/Pause, Step Next ($>|$), Step Prev ($|<$), Reset, Jump to Finish, and Playback Speed (0.5x to 4x).
- **Synchronized Pseudocode Highlighter**: Tracks the exact line of Cormen/CLRS pseudocode currently executing.
- **Live Priority Queue Visualizer**: Displays priority queue elements `[(Node, Dist), ...]`.
- **Live Distance & Predecessor Table**: Real-time snapshot of $\text{dist}[v]$, $\text{prev}[v]$, and node status (Unvisited, Relaxing, Settled).
- **Narrative Explanation Log**: Plain English explanation of each edge relaxation ($\text{dist}[u] + w < \text{dist}[v]$).

### 4. Layer 4 — "Why This Route?" & Alternative Paths Analysis
- Evaluates candidate alternative routes (e.g. via Cafeteria vs via Library).
- Shows distance differences ($\Delta m$), walking delays, and mathematical rationale based on greedy choice property and optimal substructure.

### 5. Layer 5 — Algorithm Benchmark Arena (Dijkstra vs BFS vs A* vs Bellman-Ford)
- Side-by-side run of 4 algorithms on identical campus graph:
  - **Dijkstra** ($\mathcal{O}((V+E)\log V)$): Optimal for weighted non-negative roads.
  - **BFS** ($\mathcal{O}(V+E)$): Hop-count minimization (demonstrates why BFS fails on weighted roads).
  - **A\*** ($\mathcal{O}(E)$): Heuristic-guided Euclidean search.
  - **Bellman-Ford** ($\mathcal{O}(V \cdot E)$): Relaxations for negative-weight handling.

### 6. Layer 6 — Interactive Graph Editor (Admin / Professor Sandbox)
- Add new custom campus buildings with category, map coordinates, and descriptions.
- Connect buildings with custom walkable paths, distance weights, and walkway types (Covered, Ramp, Stairs, Scenic).
- Delete nodes/edges and reset to default CHRIST Campus graph.
- Export / Import graph topology as JSON.

### 7. Layer 7 — Automated DAA Test Suite
- Automated testing harness running 7 academic test cases:
  - **T1**: Direct Adjacent Route (Main Block $\to$ Library = 120m)
  - **T2**: Multi-Hop Corridor Route (Library $\to$ CS Block = 180m)
  - **T3**: West Quad Direct Edge (Main Block $\to$ Auditorium = 160m)
  - **T4**: Same Location Boundary Test (Main $\to$ Main = 0m)
  - **T5**: Optimal Alternative Path Selection (Main $\to$ CS Block = 300m)
  - **T6**: Disconnected Island Node (Unreachable Subgraph Detection)
  - **T7**: Diagonal Long-Range Traversal

### 8. Layer 8 — Full 16-Section Academic Report & PDF Exporter
- Includes complete formal paper with Introduction, Problem Statement, Graph Modeling, Mathematical Foundations, Formal Pseudocode, Asymptotic Analysis, Proof of Correctness, Test Matrices, Limitations, and Future Scope.
- 1-Click "Print / Save PDF" with dedicated print stylesheet.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm or yarn

### Installation & Execution
```bash
# Navigate to project directory
cd /Users/chandrashekar/daa

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at **`http://localhost:5173/`**.

### Build for Production
```bash
npm run build
```

---

## 📊 Asymptotic Complexity Summary

| Component | Metric | Complexity |
| :--- | :--- | :--- |
| **Time Complexity** | With Binary Min-Heap | $\mathcal{O}((V + E) \log V)$ |
| **Time Complexity** | With Adjacency Matrix | $\mathcal{O}(V^2)$ |
| **Time Complexity** | With Fibonacci Heap | $\mathcal{O}(E + V \log V)$ |
| **Space Complexity** | Adjacency List + Heap | $\mathcal{O}(V + E)$ |

---

## 🎓 Academic Viva Presentation Tips
1. **Problem Hook**: *"Imagine you are a first-year student trying to reach the Computer Science Lab from Main Block with multiple diverging corridors. Which route is mathematically guaranteed to be the shortest?"*
2. **Preset Demo**: Click **⭐ Main Block ➜ CS Block** $\to$ Click **Compute Shortest Route** ($300\text{m}, \approx 4.2\text{ min}$).
3. **Algorithm Visualizer**: Switch to the **Dijkstra Visualizer** tab and click **Play** to show the professor step-by-step edge relaxation with cyan laser beams and synchronized Cormen pseudocode.
4. **Viva Highlight**: Switch to **Compare (Dijkstra vs BFS)** tab and explain why BFS is suboptimal for weighted campus roads while Dijkstra guarantees shortest physical distance.
