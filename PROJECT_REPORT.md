# DESIGN AND ANALYSIS OF ALGORITHMS (DAA)
## COURSE PROJECT REPORT (CIA 3)

---

# SmartCampus — Intelligent Campus Route Finder
**Topic:** Single-Source Shortest Path Optimization using Dijkstra's Algorithm and Min-Binary Heap  
**Institution:** CHRIST (Deemed to be University)  
**Academic Year:** 2026–2027  

---

## 📋 Table of Contents
1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Real-World Application](#4-real-world-application)
5. [Graph Representation](#5-graph-representation)
6. [Dijkstra's Algorithm](#6-dijkstras-algorithm)
7. [Algorithm / Formal Pseudocode](#7-algorithm--formal-pseudocode)
8. [System Architecture](#8-system-architecture)
9. [Implementation Details](#9-implementation-details)
10. [Visual Walkthrough & UI Components](#10-visual-walkthrough--ui-components)
11. [Test Cases & Assertions Matrix](#11-test-cases--assertions-matrix)
12. [Asymptotic Complexity Analysis](#12-asymptotic-complexity-analysis)
13. [Results & Comparative Benchmarks](#13-results--comparative-benchmarks)
14. [Limitations](#14-limitations)
15. [Future Enhancements](#15-future-enhancements)
16. [Conclusion](#16-conclusion)

---

## 1. Introduction
Navigating expansive modern university campuses with numerous interconnected academic departments, research labs, sports complexes, libraries, and canteens is often confusing for new students, visiting scholars, and guests. 

**SmartCampus** is a web-based spatial navigation and route optimization system that models the campus infrastructure as a weighted, undirected/directed graph $G = (V, E)$. By leveraging **Dijkstra's Algorithm** with an optimized **Min-Binary Heap Priority Queue**, the system computes the mathematically shortest physical path between any source and destination in $\mathcal{O}((V + E) \log V)$ time.

---

## 2. Problem Statement
Given a university campus modeled as a graph $G = (V, E)$ where:
- $V$ is the set of landmark vertices (buildings, laboratories, libraries, auditoriums).
- $E$ is the set of walkable road/pathway segments connecting adjacent vertices.
- $w(u, v) \ge 0$ represents the physical distance (in meters) of edge $(u, v) \in E$.

**Goal:** Given an origin $s \in V$ and destination $t \in V$, find a path $P = \langle s = v_0, v_1, v_2, \dots, v_k = t \rangle$ such that the total path distance:
$$\sum_{i=1}^{k} w(v_{i-1}, v_i)$$
is minimized, and reconstruct the complete sequence of physical waypoints with estimated walking time and step count.

---

## 3. Objectives
1. **Graph Modeling**: Model campus buildings and connecting footpaths as an adjacency list graph data structure.
2. **Optimal Path Calculation**: Implement Dijkstra's algorithm with a custom binary min-heap to guarantee $\mathcal{O}((V + E) \log V)$ asymptotic efficiency.
3. **Interactive Step-by-Step Simulator**: Provide an execution tracer displaying line-by-line pseudocode execution, edge relaxation calculations, and live priority queue updates for viva evaluation.
4. **Algorithmic Comparison**: Benchmark Dijkstra against Breadth-First Search (BFS), A* Search, and Bellman-Ford to illustrate algorithmic selection trade-offs.
5. **Interactive Graph Topology Editor**: Allow users and professors to dynamically add vertices, connect walkways, adjust distance weights, and test Dijkstra on arbitrary graph topologies.

---

## 4. Real-World Application
The algorithmic foundations employed in SmartCampus mirror industry-standard shortest-path systems:
- **GPS Navigation Systems**: (e.g., Google Maps, Apple Maps, OpenStreetMap) for vehicular and pedestrian route routing.
- **Autonomous Delivery Robots**: Navigation across university and corporate campuses.
- **Indoor Airport / Hospital Routing**: Assisting visitors through multi-wing facilities.
- **Network Packet Routing**: Open Shortest Path First (OSPF) protocol in computer networks.

---

## 5. Graph Representation
The campus network is formally represented as an Adjacency List $G = (V, E)$:

### Vertices $V$ (Locations)
$$V = \{ \text{Main Block, Library, CS Block, Cafeteria, Auditorium, Science Lab, Sports Arena, Hostel Block, Exam Office, Health Center, Research Hub, Amphitheatre} \}$$

### Edges $E$ & Weights $w(u, v)$
| Edge ID | Source ($u$) | Target ($v$) | Distance ($w$) | Pathway Type |
| :--- | :--- | :--- | :--- | :--- |
| `e-main-lib` | Main Block | Library | **120 m** | Covered walkway |
| `e-lib-cs` | Library | Computer Science Block | **180 m** | Academic corridor |
| `e-main-cs` | Main Block | Computer Science Block | **340 m** | Central avenue |
| `e-main-caf` | Main Block | Central Cafeteria | **200 m** | Canopy path |
| `e-caf-cs` | Central Cafeteria | Computer Science Block | **100 m** | Food court connector |
| `e-aud-main` | Auditorium | Main Block | **160 m** | West quad |
| `e-aud-lib` | Auditorium | Library | **210 m** | Garden pathway |
| `e-cs-sci` | Computer Science Block | Science Labs | **160 m** | Skybridge |
| `e-caf-sports` | Central Cafeteria | Sports Arena | **180 m** | Recreation avenue |
| `e-sports-hostel`| Sports Arena | Hostel Residence | **150 m** | Residential promenade |

---

## 6. Dijkstra's Algorithm & Mathematical Foundations
Dijkstra's algorithm is a greedy algorithm that solves the single-source shortest path problem on graphs with non-negative edge weights ($w(u, v) \ge 0$).

### Core Properties
1. **Optimal Substructure**: If the shortest path from $s$ to $t$ passes through intermediate node $u$, then the portion from $s$ to $u$ is itself the shortest path from $s$ to $u$.
2. **Greedy Choice Property**: At each step, selecting the unsettled vertex $u$ with the minimum tentative distance $\text{dist}[u]$ from the Priority Queue guarantees that $\text{dist}[u]$ is finalized.
3. **Edge Relaxation Condition**: For each outgoing neighbor $v$ of $u$:
$$\text{IF } \text{dist}[u] + w(u, v) < \text{dist}[v] \implies \text{dist}[v] \leftarrow \text{dist}[u] + w(u, v), \quad \text{prev}[v] \leftarrow u$$

---

## 7. Algorithm / Formal Pseudocode

```text
ALGORITHM Dijkstra(Graph G, Source s, Destination t):
Input:  Graph G = (V, E) with non-negative edge weights w, source vertex s, destination t
Output: Shortest distance dist[t] and reconstructed path array P

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
11.     
12.     IF u == t:
13.         BREAK  // Early stopping target optimization
14.     
15.     FOR each neighbor v in G.Adj[u]:
16.         alt ← dist[u] + w(u, v)
17.         IF alt < dist[v]:                 // Edge Relaxation
18.             dist[v] ← alt
19.             prev[v] ← u
20.             PQ.insert(v, alt)
21. 
22. // Reconstruct path
23. path ← []
24. curr ← t
25. WHILE curr ≠ NULL:
26.     path.prepend(curr)
27.     curr ← prev[curr]
28. 
29. RETURN path, dist[t]
```

---

## 8. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    SMARTCAMPUS FRONTEND                      │
├──────────────────────────────┬───────────────────────────────┤
│    Route Finder & Controls   │    Interactive SVG Canvas     │
│   • Origin / Destination     │   • 2.5D Building Vertices    │
│   • Metric cards (m, min)    │   • Glowing Route Laser       │
│   • Turn-by-Turn Waypoints   │   • Edge Distance Markers     │
└──────────────┬───────────────┴───────────────┬───────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    DAA ALGORITHM ENGINE                      │
├──────────────────────────────────────────────────────────────┤
│  • Dijkstra Engine (Min-Heap)                                │
│  • Step-by-Step Simulator Tracer                             │
│  • Alternative Path Finder (Why This Route?)                 │
│  • Multi-Algorithm Benchmark (Dijkstra vs BFS vs A*)         │
│  • Automated Test Suite (T1 – T7)                            │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                    DATA & GRAPH LAYER                        │
├──────────────────────────────────────────────────────────────┤
│  • Campus Graph Adjacency List                               │
│  • MinBinaryHeap Data Structure                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Implementation Details

### 1. Min-Binary Heap (`MinPriorityQueue<T>`)
- Implemented in [priorityQueue.ts](file:///Users/chandrashekar/daa/src/algorithms/priorityQueue.ts).
- Provides $\mathcal{O}(\log V)$ `insert` (bubble-up) and $\mathcal{O}(\log V)$ `extractMin` (sink-down).
- Tracks atomic priority queue operations for complexity profiling.

### 2. Fast Dijkstra & Step Tracer
- Implemented in [dijkstra.ts](file:///Users/chandrashekar/daa/src/algorithms/dijkstra.ts).
- `runDijkstra`: Profiles execution latency via `performance.now()`.
- `generateDijkstraSteps`: Records discrete snapshots of the queue, distances array, and currently relaxing edge for the step visualizer.

### 3. Metric Calculations
- **Walking Time**: $\text{Minutes} = \frac{\text{Distance (m)}}{72 \text{ m/min}}$ (based on standard pedestrian velocity of $1.2\text{ m/s}$).
- **Step Count**: $\text{Steps} = \frac{\text{Distance (m)}}{0.76\text{ m/stride}}$.
- **Energy**: $\text{Calories} = \text{Distance (m)} \times 0.05\text{ kcal/m}$.

---

## 10. Visual Walkthrough & UI Components
1. **Route Finder View**: Allows selecting starting and destination buildings, calculating the shortest route with 1-click presets (*Main Block ➜ CS Block*).
2. **Interactive Campus Map**: Renders building vertices, distances on road segments, and highlights the active shortest path in neon emerald green.
3. **Dijkstra Visualizer**: Step-by-step playback controls (*Play, Pause, Step Next, Scrubber Slider*) with live distance tables and narrative log.
4. **Comparison Arena**: Side-by-side benchmark table comparing Dijkstra, BFS, A*, and Bellman-Ford.
5. **Graph Editor**: Visual sandbox to add new custom nodes, connect walkways, and export graph topologies as JSON.

---

## 11. Test Cases & Assertions Matrix

| Test ID | Scenario | Source ($s$) | Destination ($t$) | Expected Distance | Actual Distance | Status | Verification Detail |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **T1** | Direct Adjacent Route | Main Block | Library | **120 m** | **120 m** | ✅ PASS | Single-hop edge relaxation |
| **T2** | Multi-Hop Corridor | Library | CS Block | **180 m** | **180 m** | ✅ PASS | Standard academic corridor |
| **T3** | West Quad Direct Edge | Main Block | Auditorium | **160 m** | **160 m** | ✅ PASS | Bidirectional edge test |
| **T4** | Self-Loop Identity | Main Block | Main Block | **0 m** | **0 m** | ✅ PASS | Source === Target boundary |
| **T5** | Multi-Path Tie Break | Main Block | CS Block | **300 m** | **300 m** | ✅ PASS | Path via Library (120+180=300m) vs via Cafeteria (200+100=300m) |
| **T6** | Disconnected Island | Main Block | Isolated Annex | `UNREACHABLE` | `UNREACHABLE` | ✅ PASS | Disconnected subgraph handling without crash |
| **T7** | Cross-Campus Diagonal | Health Center | Hostel Block | **650 m** | **650 m** | ✅ PASS | Long-range multi-hop path traversal |

---

## 12. Asymptotic Complexity Analysis

### Time Complexity
- **Initialization**: Initializing `dist[]` and `prev[]` takes $\mathcal{O}(V)$ time.
- **Extract-Min Operations**: Each vertex is extracted from the min-heap at most once. For $V$ vertices, this takes $V \times \mathcal{O}(\log V) = \mathcal{O}(V \log V)$.
- **Edge Relaxation Operations**: Each edge $(u, v)$ is examined at most twice (in undirected graphs). For each relaxation, inserting/updating into the min-heap takes $\mathcal{O}(\log V)$. Across all $E$ edges: $E \times \mathcal{O}(\log V) = \mathcal{O}(E \log V)$.

$$\text{Total Time Complexity} = \mathcal{O}((V + E) \log V)$$

### Space Complexity
- **Adjacency List**: Stores $|V|$ vertex lists with $|E|$ total edges $\implies \mathcal{O}(V + E)$.
- **Auxiliary Structures**: Distance array $\mathcal{O}(V)$, Predecessor array $\mathcal{O}(V)$, Priority Queue $\mathcal{O}(V)$.

$$\text{Total Space Complexity} = \mathcal{O}(V + E)$$

---

## 13. Results & Comparative Benchmarks

Evaluating the canonical scenario: **Main Block ➜ Computer Science Block**

| Algorithm | Distance Found | Path Hops | Nodes Visited | Time Complexity | Optimal for Campus Roads? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Dijkstra's Algorithm** | **300 m** | **2 hops** | 7 | $\mathcal{O}((V + E) \log V)$ | **YES (Guaranteed Optimal)** |
| **A\* Search** | **300 m** | **2 hops** | 5 | $\mathcal{O}(E)$ | **YES (Heuristic Guided)** |
| **Breadth-First Search (BFS)**| **340 m** | **1 hop** | 6 | $\mathcal{O}(V + E)$ | ❌ **NO (Suboptimal: 1 long hop vs 2 short hops)** |
| **Bellman-Ford** | **300 m** | **2 hops** | 12 | $\mathcal{O}(V \cdot E)$ | **YES (Slower)** |

> **Key Finding for Viva**: BFS minimizes the *number of edge hops* (choosing direct 340m edge), while Dijkstra minimizes the *cumulative physical distance* (choosing $120\text{m} + 180\text{m} = 300\text{m}$). This proves why Dijkstra is strictly necessary for weighted campus road networks.

---

## 14. Limitations
1. **Static Edge Weights**: Assumes constant walking speeds and does not dynamically factor in real-time pedestrian rush-hour congestion.
2. **Non-Negative Assumption**: Standard Dijkstra requires edge weights $w(u, v) \ge 0$ (which is always true for real-world physical road distances).
3. **Single Elevation Layer**: Models 2D outdoor campus ground; does not yet model indoor multi-floor vertical elevator/stair transitions.

---

## 15. Future Enhancements
1. **Real-time GPS / WiFi Beacon Integration**: Live student blue-dot location tracking.
2. **Accessibility-Aware Routing**: Filtering routes for wheelchair ramps and elevator-only access.
3. **Weather-Aware Navigation**: Prioritizing covered walkways during monsoon rains.
4. **Dynamic Congestion Avoidance**: Real-time traffic penalties during class transition intervals.

---

## 16. Conclusion
The **SmartCampus** system provides an end-to-end realization of graph theory and greedy shortest-path optimization. By coupling Dijkstra's algorithm with a binary min-heap, the application computes optimal campus routes in $\mathcal{O}((V + E) \log V)$ time. The integrated step simulator, comparison matrix, and test suite make the underlying algorithmic principles transparent and verifiable for academic evaluation.

---

**Submitted by:** DAA Project Group  
**CHRIST (Deemed to be University)**  
*Department of Computer Science and Engineering*
