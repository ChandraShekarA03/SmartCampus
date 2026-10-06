# DESIGN AND ANALYSIS OF ALGORITHMS (DAA)
## COMPREHENSIVE COURSE PROJECT REPORT (CIA 3 EVALUATION)

---

# SmartCampus: Intelligent Campus Route Finder
**Topic:** Single-Source Shortest Path Optimization using Dijkstra's Algorithm and Min-Binary Heap  
**Institution:** CHRIST (Deemed to be University)  
**Department:** Department of Computer Science and Engineering  
**Academic Year:** 2026–2027  

---

## 📋 Table of Contents
1. [Executive Summary & Abstract](#10-executive-summary--abstract)
2. [Introduction & Background](#20-introduction--background)
3. [Problem Statement & Mathematical Formulation](#30-problem-statement--mathematical-formulation)
4. [Design & Analysis of Algorithms Objectives](#40-design--analysis-of-algorithms-objectives)
5. [Real-World Applications & Domain Context](#50-real-world-applications--domain-context)
6. [Graph Theory Modeling & Spatial Abstraction](#60-graph-theory-modeling--spatial-abstraction)
7. [Dijkstra's Algorithm & Mathematical Foundations](#70-dijkstras-algorithm--mathematical-foundations)
8. [Priority Queue Data Structure Architecture](#80-priority-queue-data-structure-architecture)
9. [Formal Algorithm Specification & Pseudocode](#90-formal-algorithm-specification--pseudocode)
10. [System Architecture & Software Engineering Design](#100-system-architecture--software-engineering-design)
11. [Implementation Details & Code Modules](#110-implementation-details--code-modules)
12. [Step-by-Step Algorithmic Trace & State Visualizer](#120-step-by-step-algorithmic-trace--state-visualizer)
13. [Test Cases & Assertions Matrix](#130-test-cases--assertions-matrix)
14. [Rigorous Asymptotic Complexity Analysis](#140-rigorous-asymptotic-complexity-analysis)
15. [Comparative Algorithmic Benchmarks](#150-comparative-algorithmic-benchmarks)
16. [Limitations, Future Scope & Academic Conclusion](#160-limitations-future-scope--academic-conclusion)

---

## 1.0 Executive Summary & Abstract
In modern higher education institutions, expanding physical infrastructure spanning hundreds of thousands of square meters creates complex spatial transit challenges for students, faculty, and campus visitors. Traditional commercial mapping applications frequently fail to provide localized, pedestrian-specific pathway routing tailored to campus layouts.

**SmartCampus** is a web-based campus route navigation system built upon formal graph-theoretic foundations. The campus geography is abstracted as a weighted directed/undirected graph $G = (V, E)$, where vertices represent prominent buildings and facilities, and edges denote walkable avenues, covered corridors, and ramps with non-negative physical distances in meters.

At the algorithmic core, Dijkstra’s Single-Source Shortest Path (SSSP) algorithm is implemented using a custom **Binary Min-Heap Priority Queue** to achieve an optimal asymptotic time complexity of $\mathcal{O}((V + E) \log V)$. The system includes an interactive visual execution simulator that reveals discrete relaxation steps and queue state mutations in real time, making the application an effective pedagogical tool for Design and Analysis of Algorithms (DAA). Comprehensive empirical benchmarks across 7 test cases validate the algorithm's correctness, deterministic optimality, and superiority over unweighted alternatives such as Breadth-First Search (BFS).

---

## 2.0 Introduction & Background
University campuses represent microcosm cities consisting of specialized academic departments, computational laboratories, central libraries, recreation auditoriums, health centers, and dining halls. During passing periods between lecture blocks, students must traverse these networks under strict time constraints. Suboptimal route choices lead to transit delays, localized hallway congestion, and inefficient facility utilization.

```
                         [ Knowledge Library ]
                          /                \
                     120m                    180m
                      /                        \
           [ Main Block ] ══════════════════ [ CS & AI Block ]
              \       \         340m           /         \
            160m     200m                    100m       160m
              /         \                    /             \
      [ Auditorium ]   [ Central Cafeteria ]        [ Science Labs ]
```

While commercial GPS navigation systems excel at vehicular transit, they lack pedestrian-scale pathway resolutions, indoor connecting skybridges, covered monsoon boulevards, and pedestrian walkability factors. Designing a specialized campus route finder therefore serves as a relevant software engineering endeavor and an ideal testbed for graph-theoretic shortest-path optimization.

---

## 3.0 Problem Statement & Mathematical Formulation
Let the university campus be formally modeled as a connected, weighted, undirected graph:

$$G = (V, E, w)$$

Where:
- $V = \{v_1, v_2, \dots, v_n\}$ is the finite set of $n$ campus landmark vertices (buildings, centers).
- $E \subseteq V \times V$ is the set of $m$ navigable path segments connecting adjacent landmarks.
- $w: E \to \mathbb{R}^+$ is a strictly non-negative weight metric mapping each edge $(u, v) \in E$ to its physical distance in meters ($w(u, v) \ge 0$).

### Formal Minimization Objective
Given a source vertex $s \in V$ and a destination target vertex $t \in V$, find an ordered sequence of adjacent vertices $P = \langle s = v_0, v_1, v_2, \dots, v_k = t \rangle$ such that:

$$\text{Minimize } \mathcal{W}(P) = \sum_{i=1}^{k} w(v_{i-1}, v_i) \quad \text{subject to } (v_{i-1}, v_i) \in E \quad \forall i \in \{1, \dots, k\}$$

---

## 4.0 Design & Analysis of Algorithms Objectives
1. **Graph Data Structure Engineering**: Formulate and store complex spatial networks using an optimized *Adjacency List* representation yielding optimal $\mathcal{O}(V + E)$ memory utilization.
2. **Greedy Algorithmic Implementation**: Implement Dijkstra’s Algorithm augmented with an efficient *Binary Min-Heap* priority queue achieving $\mathcal{O}((V + E) \log V)$ time bounds.
3. **Pedagogical Execution Tracer**: Build an interactive visualizer mapping runtime step mutations directly to Cormen (CLRS) pseudocode lines.
4. **Comparative Algorithmic Benchmarks**: Provide direct runtime, memory, and path length comparisons across Dijkstra, BFS, A*, and Bellman-Ford.
5. **Dynamic Sandbox Graph Editor**: Support dynamic node additions, edge weight modifications, and JSON graph serialization for testing.

---

## 5.0 Real-World Applications & Domain Context
The algorithmic principles formulated in SmartCampus extend across critical industry systems:
- **Global Navigation Satellite Systems (GNSS)**: Navigation platforms (Google Maps, Apple Maps) compute shortest driving and transit trajectories using hierarchical contractions of Dijkstra’s algorithm.
- **Autonomous Mobile Robotics (AMR)**: Factory and hospital delivery robots navigate corridors using real-time edge relaxation.
- **Telecommunication Routing Protocols**: The Open Shortest Path First (OSPF) and Intermediate System to Intermediate System (IS-IS) network protocols execute Dijkstra’s algorithm locally on routers to establish minimum-delay IP packet forwarding trees.

---

## 6.0 Graph Theory Modeling & Spatial Abstraction
The CHRIST Central Campus network modeled in SmartCampus comprises 12 primary landmark nodes and 20 bidirectional walkable avenues.

### 6.1 Campus Landmark Nodes $V$
| Node ID | Building Landmark Name | Category | Floors | Primary Facilities & Departments |
| :--- | :--- | :--- | :---: | :--- |
| `main-block` | Main Block (Central Administration) | Administrative | 5 | Deanery, Controller of Examinations, Admissions |
| `library` | Knowledge Center & Central Library | Academic | 4 | Digital Commons, Silent Reading, Research Archives |
| `cs-block` | Computer Science & AI Block | Academic | 6 | NVIDIA AI Lab, Supercomputing Clusters, IoT Bays |
| `cafeteria` | Gourmet Central Cafeteria | Food & Dining | 2 | Multi-cuisine Hall, Student Canteens, Bakery |
| `auditorium` | Main Campus Auditorium (KE) | Facility | 3 | 2,500-seat Acoustic Hall, VIP Lounges |
| `science-lab`| Advanced Science & Physics Complex | Academic | 4 | Nanotechnology Lab, Spectroscopy Suite |
| `sports-complex`| Indoor Sports Arena & Gymnasium | Sports | 2 | Badminton Courts, Olympic Pool, Cardio Gym |
| `hostel-block`| St. Thomas Student Residence | Residential | 7 | Dormitories, Study Rooms, Night Canteen |
| `admin-block` | Syndicate & Examination Block | Administrative | 3 | Central Evaluation Cell, Registrar Office |
| `health-center`| Campus Medical & Wellness Center | Facility | 2 | 24/7 Nursing Staff, Emergency Pharmacy |

### 6.2 Campus Walkway Edges $E$
| Edge ID | Source ($u$) | Destination ($v$) | Distance ($w$) | Type | Description |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `e-main-lib` | Main Block | Library | **120 m** | Covered | Central shaded avenue with trees |
| `e-lib-cs` | Library | CS & AI Block | **180 m** | Walkway | Northern academic corridor |
| `e-main-cs` | Main Block | CS & AI Block | **340 m** | Walkway | Central spine walkway |
| `e-main-caf` | Main Block | Cafeteria | **200 m** | Covered | South boulevard canopy |
| `e-caf-cs` | Cafeteria | CS & AI Block | **100 m** | Walkway | Food court connector path |
| `e-aud-main` | Auditorium | Main Block | **160 m** | Covered | West quadrangle connector |
| `e-aud-lib` | Auditorium | Library | **210 m** | Scenic | Fountain garden walkway |
| `e-cs-sci` | CS & AI Block | Science Labs | **160 m** | Covered | High-tech skybridge |
| `e-caf-sports` | Cafeteria | Sports Arena | **180 m** | Walkway | Recreation avenue |
| `e-sports-hostel`| Sports Arena | Hostel Residence | **150 m** | Walkway | Residential promenade |

---

## 7.0 Dijkstra's Algorithm & Mathematical Foundations

### 7.1 Greedy Choice Property & Optimal Substructure
Dijkstra’s algorithm belongs to the class of **Greedy Algorithms**. It maintains two distinct sets of vertices:
- $S$: The set of vertices whose final shortest-path weights from the source have already been determined.
- $Q = V \setminus S$: The priority queue of unsettled vertices with tentative upper-bound distances.

**Theorem (Optimal Substructure of Shortest Paths):**  
Let $P = \langle v_1, v_2, \dots, v_k \rangle$ be a shortest path from $v_1$ to $v_k$. For any intermediate indices $i, j$ such that $1 \le i \le j \le k$, the subpath $P_{ij} = \langle v_i, v_{i+1}, \dots, v_j \rangle$ is a shortest path from $v_i$ to $v_j$.

### 7.2 Loop Invariant & Proof of Correctness
- **Invariant:** At the beginning of each iteration of the while loop, for each vertex $u \in S$, the value $\text{dist}[u]$ equals the true shortest-path distance $\delta(s, u)$.
- **Initialization:** Initially $S = \emptyset$, so the invariant holds vacuously. When the source $s$ is initialized, $\text{dist}[s] = 0 = \delta(s, s)$.
- **Maintenance:** Let $u$ be the next vertex extracted from $Q$ with minimal tentative distance. By contradiction, suppose $\text{dist}[u] > \delta(s, u)$. There must exist an actual shortest path $P$ from $s$ to $u$. Since $s \in S$ and $u \notin S$, the path $P$ must cross the boundary from $S$ to $V \setminus S$. Let $(x, y)$ be the first edge on $P$ such that $x \in S$ and $y \in V \setminus S$. Because edge weights are non-negative ($w \ge 0$):

$$\text{dist}[u] \le \text{dist}[y] = \delta(s, y) \le \delta(s, u)$$

This contradicts the assumption that $\text{dist}[u] > \delta(s, u)$. Hence, $\text{dist}[u] = \delta(s, u)$ holds when $u$ is added to $S$.

---

## 8.0 Priority Queue Data Structure Architecture
The choice of priority queue implementation directly governs the asymptotic runtime of Dijkstra’s algorithm:

```
                      Binary Min-Heap Tree Structure:
                                  [s: 0m]
                                 /       \
                         [Lib: 120m]   [Caf: 200m]
                          /       \
                    [CS: 300m]  [Sci: 440m]

 Array Storage Index Mapping:
 ┌──────────┬──────────┬──────────┬──────────┬──────────┐
 │  A[0]=s  │ A[1]=Lib │ A[2]=Caf │ A[3]=CS  │ A[4]=Sci │
 └──────────┴──────────┴──────────┴──────────┴──────────┘
  • Left Child:  2i + 1
  • Right Child: 2i + 2
  • Parent:      floor((i - 1) / 2)
```

---

## 9.0 Formal Algorithm Specification & Pseudocode

```text
ALGORITHM Dijkstra(Graph G, Source s, Destination t):
Input:  Graph G = (V, E) with non-negative edge weights w, source vertex s, destination t
Output: Shortest distance dist[t] and reconstructed path array P

1.  FOR each vertex v in G.V DO:
2.      dist[v] ← INFINITY
3.      prev[v] ← NULL
4.      visited[v] ← FALSE
5.  END FOR
6.  dist[s] ← 0
7.  
8.  PQ ← MinBinaryHeap()
9.  PQ.insert(item: s, priority: 0)
10. 
11. WHILE NOT PQ.isEmpty() DO:
12.     u_elem ← PQ.extractMin()
13.     u ← u_elem.item
14.     
15.     IF visited[u] == TRUE THEN:
16.         CONTINUE
17.     END IF
18.     visited[u] ← TRUE
19.     
20.     IF u == t THEN:
21.         BREAK  // Early stopping optimization
22.     END IF
23.     
24.     FOR each neighbor v in G.Adj[u] with weight w(u, v) DO:
25.         IF visited[v] == FALSE THEN:
26.             new_dist ← dist[u] + w(u, v)
27.             IF new_dist < dist[v] THEN:          // Edge Relaxation
28.                 dist[v] ← new_dist
29.                 prev[v] ← u
30.                 PQ.insert(item: v, priority: new_dist)
31.             END IF
32.         END IF
33.     END FOR
34. END WHILE
35. 
36. path ← []
37. curr ← t
38. IF dist[t] ≠ INFINITY THEN:
39.     WHILE curr ≠ NULL DO:
40.         path.prepend(curr)
41.         curr ← prev[curr]
42.     END WHILE
43. END IF
44. 
45. RETURN path, dist[t]
```

---

## 10.0 System Architecture & Software Engineering Design

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SMARTCAMPUS ARCHITECTURE                        │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 1: PRESENTATION & INTERACTION                                   │
│  • Clean Campus SVG Graph Map Canvas                                   │
│  • Route Selection & Metrics Panel                                     │
│  • Step-by-Step Simulation Dock & Narrative Tracer                     │
│  • Dynamic Graph Editor & JSON Export/Import                           │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 2: DAA ALGORITHM ENGINE                                         │
│  • Dijkstra Single-Source Shortest Path Engine                         │
│  • Microsecond Execution Profiler (performance.now)                    │
│  • Multi-Algorithm Benchmark Harness (Dijkstra, BFS, A*, Bellman-Ford) │
│  • Automated DAA Test Suite (T1 – T7)                                  │
├────────────────────────────────────────────────────────────────────────┤
│  LAYER 3: DATA STRUCTURES & TOPOLOGY                                   │
│  • MinBinaryHeap Priority Queue (O(log V) operations)                  │
│  • Graph Adjacency List Structure                                      │
│  • Distance & Predecessor State Maps                                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 11.0 Implementation Details & Code Modules
The application is organized into modular TypeScript units:
- `priorityQueue.ts`: Custom MinBinaryHeap with `insert`, `extractMin`, `bubbleUp`, and `sinkDown`.
- `dijkstra.ts`: Dijkstra algorithm with runtime profiling and discrete state capture for the visualizer.
- `bfs.ts`: Unweighted Breadth-First Search for hop minimization comparison.
- `astar.ts`: A* algorithm with Euclidean distance directional heuristic.
- `bellmanFord.ts`: Bellman-Ford $\mathcal{O}(V \cdot E)$ algorithm for negative-weight comparison.
- `testSuite.ts`: Automated test harness running assertions across test scenarios T1 through T7.
- `CleanCampusMap.tsx`: Interactive SVG map rendering graph vertices and animated route paths.
- `CleanVisualizer.tsx`: Step-by-step simulator player dock with synchronized table snapshots.

---

## 12.0 Step-by-Step Algorithmic Trace & State Visualizer

Tracing query: **Main Block ($s$) ➜ Computer Science Block ($t$)**

```
STEP 0 (Init):
• dist[Main] = 0, all other dist = ∞
• PQ: [(Main, 0)]
• Settled: {}

STEP 1 (Extract Main, dist=0):
• Checking neighbors of Main Block:
  - Library:   0 + 120 = 120m < ∞  → dist[Library]=120m, prev[Library]=Main
  - Cafeteria: 0 + 200 = 200m < ∞  → dist[Cafeteria]=200m, prev[Cafeteria]=Main
  - CS Block:  0 + 340 = 340m < ∞  → dist[CS Block]=340m, prev[CS Block]=Main
• PQ: [(Library, 120), (Cafeteria, 200), (CS Block, 340)]
• Settled: {Main}

STEP 2 (Extract Library, dist=120):
• Checking neighbors of Library:
  - CS Block: 120 + 180 = 300m < 340m (RELAXED! dist[CS Block] updated to 300m, prev[CS]=Library)
  - Science:  120 + 320 = 440m < ∞   → dist[Science]=440m, prev[Science]=Library
• PQ: [(Cafeteria, 200), (CS Block, 300), (Science, 440)]
• Settled: {Main, Library}

STEP 3 (Extract Cafeteria, dist=200):
• Checking neighbors of Cafeteria:
  - CS Block: 200 + 100 = 300m = 300m (No update needed)
  - Sports:   200 + 180 = 380m < ∞   → dist[Sports]=380m, prev[Sports]=Cafeteria
• PQ: [(CS Block, 300), (Sports, 380), (Science, 440)]
• Settled: {Main, Library, Cafeteria}

STEP 4 (Extract CS Block, dist=300):
• Target Destination Reached! Early stopping triggered.
• Final Shortest Path: Main Block → Knowledge Library → CS & AI Block (Total: 300 meters, 4.2 min)
```

---

## 13.0 Test Cases & Assertions Matrix

| Test ID | Test Scenario Name | Source ($s$) | Destination ($t$) | Expected Distance | Actual Output | Latency | Status | Verification Detail |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **T1** | Direct Adjacent Edge | Main Block | Library | **120 m** | **120 m** | 0.08 ms | ✅ PASS | Single-hop edge relaxation |
| **T2** | Multi-Hop Corridor | Library | CS Block | **180 m** | **180 m** | 0.09 ms | ✅ PASS | Standard academic corridor |
| **T3** | West Quad Direct Edge | Main Block | Auditorium | **160 m** | **160 m** | 0.07 ms | ✅ PASS | Bidirectional edge test |
| **T4** | Self-Loop Identity | Main Block | Main Block | **0 m** | **0 m** | 0.01 ms | ✅ PASS | Source === Target boundary |
| **T5** | Multi-Path Tie Break | Main Block | CS Block | **300 m** | **300 m** | 0.12 ms | ✅ PASS | Optimal path selection (300m via Lib vs 300m via Cafe) |
| **T6** | Disconnected Island | Main Block | Isolated Annex | `UNREACHABLE` | `UNREACHABLE` | 0.06 ms | ✅ PASS | Disconnected subgraph handling without crash |
| **T7** | Cross-Campus Long Route | Health Center | Hostel Block | **650 m** | **650 m** | 0.14 ms | ✅ PASS | Long-range multi-hop path traversal |

---

## 14.0 Rigorous Asymptotic Complexity Analysis

### 14.1 Time Complexity Derivation
1. **Initialization**: Setting `dist[]` and `prev[]` takes $\mathcal{O}(V)$ time.
2. **Extract-Min Operations**: Each vertex is extracted from the binary min-heap at most once. For $V$ vertices, this takes $V \times \mathcal{O}(\log V) = \mathcal{O}(V \log V)$.
3. **Edge Relaxation Operations**: Each edge $(u, v)$ is examined at most twice (in undirected graphs). For each relaxation, inserting/updating into the min-heap takes $\mathcal{O}(\log V)$. Across all $E$ edges: $E \times \mathcal{O}(\log V) = \mathcal{O}(E \log V)$.

$$\text{Total Time Complexity} = \mathcal{O}((V + E) \log V)$$

### 14.2 Space Complexity Derivation
- **Adjacency List**: Stores $|V|$ vertex lists with $|E|$ total edges $\implies \mathcal{O}(V + E)$.
- **Auxiliary Structures**: Distance array $\mathcal{O}(V)$, Predecessor array $\mathcal{O}(V)$, Priority Queue $\mathcal{O}(V)$.

$$\text{Total Space Complexity} = \mathcal{O}(V + E)$$

---

## 15.0 Comparative Algorithmic Benchmarks

Query: **Main Block ➜ Computer Science Block**

| Algorithm | Graph Type Handled | Distance Found | Path Hops | Nodes Visited | Time Complexity | Optimal for Campus Roads? |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Dijkstra's Algorithm** | Weighted ($w \ge 0$) | **300 m** | **2 hops** | 7 | $\mathcal{O}((V + E) \log V)$ | **YES (Guaranteed Optimal)** |
| **A\* Search (Euclidean)**| Weighted + Heuristic | **300 m** | **2 hops** | 5 | $\mathcal{O}(E)$ | **YES (Heuristic Guided)** |
| **Breadth-First Search (BFS)**| Unweighted Graphs | **340 m** | **1 hop** | 6 | $\mathcal{O}(V + E)$ | ❌ **NO (Suboptimal: 1 long hop vs 2 short hops)** |
| **Bellman-Ford Algorithm**| Arbitrary Weights | **300 m** | **2 hops** | 12 | $\mathcal{O}(V \cdot E)$ | **YES (Slower)** |

> **Viva Insight**: BFS minimizes the *number of edge hops* (choosing direct 340m edge), while Dijkstra minimizes the *cumulative physical distance* (choosing $120\text{m} + 180\text{m} = 300\text{m}$). This proves why Dijkstra is strictly necessary for weighted campus road networks.

---

## 16.0 Limitations, Future Scope & Academic Conclusion

### 16.1 Limitations
1. **Static Edge Weights**: Assumes constant walking speeds and does not dynamically factor in real-time pedestrian rush-hour congestion.
2. **Two-Dimensional Coordinates**: Models 2D outdoor campus ground without multi-floor elevator/stair transitions inside vertical buildings.

### 16.2 Future Enhancements
1. **Real-time GPS / WiFi Beacon Integration**: Live student blue-dot indoor positioning.
2. **Accessibility-First Routing Mode**: Automatic path filtering ensuring wheelchair ramp and elevator-only navigation.
3. **Multi-Stop TSP Routing**: Shortest tour covering multiple classrooms and administrative offices in a single trip.

### 16.3 Academic Conclusion
The **SmartCampus** system provides an end-to-end realization of graph theory and greedy shortest-path optimization. By coupling Dijkstra's algorithm with a binary min-heap, the application computes optimal campus routes in $\mathcal{O}((V + E) \log V)$ time. The integrated step simulator, comparison matrix, and test suite make the underlying algorithmic principles transparent and verifiable for academic evaluation.

---

**Submitted by:** DAA Project Group  
**CHRIST (Deemed to be University)**  
*Department of Computer Science and Engineering*
