import { CampusNode, CampusEdge, PathResult, DijkstraStep } from '../types';
import { MinPriorityQueue } from './priorityQueue';
import { buildAdjacencyList, calculateWalkingMetrics } from './graphUtils';

/**
 * Standard Dijkstra Shortest Path Implementation
 * Time Complexity: O((V + E) log V) with Binary Min-Heap
 * Space Complexity: O(V + E)
 */
export function runDijkstra(
  nodes: CampusNode[],
  edges: CampusEdge[],
  sourceId: string,
  targetId: string
): PathResult {
  const startTime = performance.now();
  const adj = buildAdjacencyList(nodes, edges);

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const visitedOrder: string[] = [];

  let edgesRelaxedCount = 0;

  // 1. Initialize single source
  for (const node of nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  }
  distances[sourceId] = 0;

  const pq = new MinPriorityQueue<string>();
  pq.insert(sourceId, 0);

  let targetFound = false;

  // Handle case when source === target
  if (sourceId === targetId) {
    const elapsed = performance.now() - startTime;
    return {
      path: [sourceId],
      nodeNames: [nodeMap.get(sourceId)?.name || sourceId],
      totalDistance: 0,
      estimatedMinutes: 0,
      estimatedSteps: 0,
      caloriesBurned: 0,
      visitedNodesCount: 1,
      edgesRelaxedCount: 0,
      pqOperationsCount: 1,
      executionTimeMs: Math.max(0.01, Math.round(elapsed * 100) / 100),
      allDistances: distances,
      previousPointers: previous,
      visitedOrder: [sourceId],
      found: true
    };
  }

  while (!pq.isEmpty()) {
    const current = pq.extractMin();
    if (!current) break;

    const u = current.item;
    const currentDist = current.priority;

    if (visited.has(u)) continue;
    visited.add(u);
    visitedOrder.push(u);

    // If we've reached the target node, we can stop early
    if (u === targetId) {
      targetFound = true;
      break;
    }

    // If the minimum distance in queue is infinity, remaining nodes are unreachable
    if (currentDist === Infinity) break;

    const neighbors = adj.get(u) || [];
    for (const neighbor of neighbors) {
      const v = neighbor.nodeId;
      const weight = neighbor.weight;

      if (!visited.has(v)) {
        const alt = currentDist + weight;
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = u;
          pq.insert(v, alt);
          edgesRelaxedCount++;
        }
      }
    }
  }

  const endTime = performance.now();
  const executionTimeMs = Math.max(0.01, Math.round((endTime - startTime) * 1000) / 1000);

  // Path reconstruction
  const path: string[] = [];
  if (distances[targetId] !== Infinity || targetFound) {
    let curr: string | null = targetId;
    while (curr !== null) {
      path.unshift(curr);
      curr = previous[curr];
    }
  }

  const found = path.length > 0 && path[0] === sourceId;
  const totalDistance = found ? distances[targetId] : 0;
  const metrics = calculateWalkingMetrics(totalDistance);

  const nodeNames = path.map(id => nodeMap.get(id)?.name || id);

  return {
    path: found ? path : [],
    nodeNames: found ? nodeNames : [],
    totalDistance,
    estimatedMinutes: metrics.estimatedMinutes,
    estimatedSteps: metrics.estimatedSteps,
    caloriesBurned: metrics.caloriesBurned,
    visitedNodesCount: visited.size,
    edgesRelaxedCount,
    pqOperationsCount: pq.operationCount,
    executionTimeMs,
    allDistances: distances,
    previousPointers: previous,
    visitedOrder,
    found
  };
}

/**
 * Step-by-Step Dijkstra Trace Generator for Visual Simulation
 * Emits detailed states at every decision point with pseudocode mapping.
 */
export function generateDijkstraSteps(
  nodes: CampusNode[],
  edges: CampusEdge[],
  sourceId: string,
  targetId: string
): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const adj = buildAdjacencyList(nodes, edges);

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const settled = new Set<string>();

  // 1. Initial State
  for (const node of nodes) {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  }
  distances[sourceId] = 0;

  const pq = new MinPriorityQueue<string>();
  pq.insert(sourceId, 0);

  const getQueueSnapshot = () =>
    pq.toArray().map(el => ({ id: el.item, dist: el.priority }));

  const sourceName = nodeMap.get(sourceId)?.shortName || sourceId;
  const targetName = nodeMap.get(targetId)?.shortName || targetId;

  // Step 0: Initialization
  steps.push({
    stepIndex: 0,
    type: 'INIT',
    currentNodeId: sourceId,
    currentDist: 0,
    examiningNeighborId: null,
    examiningEdgeWeight: null,
    calculatedDist: null,
    previousBestDist: null,
    updated: false,
    pseudocodeLine: 1, // "1. Set distance[source] = 0, all others = ∞"
    description: `Initialized graph. Distance to source (${sourceName}) set to 0m. All other ${nodes.length - 1} locations set to ∞. Source pushed to Priority Queue.`,
    distances: { ...distances },
    previous: { ...previous },
    queueState: getQueueSnapshot(),
    settledNodes: Array.from(settled),
    activeEdge: null
  });

  if (sourceId === targetId) {
    settled.add(sourceId);
    steps.push({
      stepIndex: 1,
      type: 'TARGET_REACHED',
      currentNodeId: sourceId,
      currentDist: 0,
      examiningNeighborId: null,
      examiningEdgeWeight: null,
      calculatedDist: null,
      previousBestDist: null,
      updated: false,
      pseudocodeLine: 6,
      description: `Source and Destination are the same node (${sourceName}). Shortest distance is 0 meters.`,
      distances: { ...distances },
      previous: { ...previous },
      queueState: [],
      settledNodes: Array.from(settled),
      activeEdge: null
    });
    return steps;
  }

  let stepCount = 1;

  while (!pq.isEmpty()) {
    const current = pq.extractMin();
    if (!current) break;

    const u = current.item;
    const distU = current.priority;
    const uName = nodeMap.get(u)?.shortName || u;

    // Skip if already settled
    if (settled.has(u)) {
      continue;
    }

    // Step: Extract Min
    steps.push({
      stepIndex: stepCount++,
      type: 'EXTRACT_MIN',
      currentNodeId: u,
      currentDist: distU,
      examiningNeighborId: null,
      examiningEdgeWeight: null,
      calculatedDist: null,
      previousBestDist: null,
      updated: false,
      pseudocodeLine: 3, // "3. Extract node u with minimum distance from PQ"
      description: `Extracted '${uName}' from Priority Queue with current shortest distance = ${distU}m.`,
      distances: { ...distances },
      previous: { ...previous },
      queueState: getQueueSnapshot(),
      settledNodes: Array.from(settled),
      activeEdge: null
    });

    // Check if target is reached
    if (u === targetId) {
      settled.add(u);
      steps.push({
        stepIndex: stepCount++,
        type: 'TARGET_REACHED',
        currentNodeId: u,
        currentDist: distU,
        examiningNeighborId: null,
        examiningEdgeWeight: null,
        calculatedDist: null,
        previousBestDist: null,
        updated: false,
        pseudocodeLine: 5, // "5. Target reached! Shortest path verified."
        description: `Target destination '${targetName}' reached with guaranteed shortest distance of ${distU}m! Early stopping invoked.`,
        distances: { ...distances },
        previous: { ...previous },
        queueState: getQueueSnapshot(),
        settledNodes: Array.from(settled),
        activeEdge: null
      });
      break;
    }

    const neighbors = adj.get(u) || [];

    for (const neighbor of neighbors) {
      const v = neighbor.nodeId;
      const weight = neighbor.weight;
      const vName = nodeMap.get(v)?.shortName || v;

      if (settled.has(v)) {
        // Neighbor already finalized
        steps.push({
          stepIndex: stepCount++,
          type: 'SKIP_EDGE',
          currentNodeId: u,
          currentDist: distU,
          examiningNeighborId: v,
          examiningEdgeWeight: weight,
          calculatedDist: distU + weight,
          previousBestDist: distances[v],
          updated: false,
          pseudocodeLine: 4, // "4. Check neighbor v"
          description: `Checked neighbor '${vName}' via edge (${weight}m). Skipped because '${vName}' is already settled.`,
          distances: { ...distances },
          previous: { ...previous },
          queueState: getQueueSnapshot(),
          settledNodes: Array.from(settled),
          activeEdge: { source: u, target: v }
        });
        continue;
      }

      const alt = distU + weight;
      const oldDist = distances[v];

      if (alt < oldDist) {
        distances[v] = alt;
        previous[v] = u;
        pq.insert(v, alt);

        steps.push({
          stepIndex: stepCount++,
          type: 'RELAX_EDGE',
          currentNodeId: u,
          currentDist: distU,
          examiningNeighborId: v,
          examiningEdgeWeight: weight,
          calculatedDist: alt,
          previousBestDist: oldDist,
          updated: true,
          pseudocodeLine: 4, // "4. Relax edge (u, v): dist[u] + w < dist[v] -> update"
          description: `Relaxed edge ${uName} ➜ ${vName} (${weight}m): New path ${distU}m + ${weight}m = ${alt}m is shorter than previous ${oldDist === Infinity ? '∞' : oldDist + 'm'}. Updated dist[${vName}] = ${alt}m and pushed to PQ.`,
          distances: { ...distances },
          previous: { ...previous },
          queueState: getQueueSnapshot(),
          settledNodes: Array.from(settled),
          activeEdge: { source: u, target: v }
        });
      } else {
        steps.push({
          stepIndex: stepCount++,
          type: 'SKIP_EDGE',
          currentNodeId: u,
          currentDist: distU,
          examiningNeighborId: v,
          examiningEdgeWeight: weight,
          calculatedDist: alt,
          previousBestDist: oldDist,
          updated: false,
          pseudocodeLine: 4,
          description: `Checked edge ${uName} ➜ ${vName} (${weight}m): Path ${distU}m + ${weight}m = ${alt}m is NOT shorter than existing best ${oldDist}m. No update.`,
          distances: { ...distances },
          previous: { ...previous },
          queueState: getQueueSnapshot(),
          settledNodes: Array.from(settled),
          activeEdge: { source: u, target: v }
        });
      }
    }

    settled.add(u);
    steps.push({
      stepIndex: stepCount++,
      type: 'NODE_SETTLED',
      currentNodeId: u,
      currentDist: distU,
      examiningNeighborId: null,
      examiningEdgeWeight: null,
      calculatedDist: null,
      previousBestDist: null,
      updated: false,
      pseudocodeLine: 3,
      description: `'${uName}' is now fully settled (all outgoing edges relaxed). Distance is mathematically optimal.`,
      distances: { ...distances },
      previous: { ...previous },
      queueState: getQueueSnapshot(),
      settledNodes: Array.from(settled),
      activeEdge: null
    });
  }

  // Final step
  const finalDistance = distances[targetId];
  if (finalDistance === Infinity) {
    steps.push({
      stepIndex: stepCount++,
      type: 'NO_PATH',
      currentNodeId: null,
      currentDist: Infinity,
      examiningNeighborId: null,
      examiningEdgeWeight: null,
      calculatedDist: null,
      previousBestDist: null,
      updated: false,
      pseudocodeLine: 6,
      description: `Search completed. No walkable path exists between '${sourceName}' and '${targetName}' (Disconnected Subgraph).`,
      distances: { ...distances },
      previous: { ...previous },
      queueState: [],
      settledNodes: Array.from(settled),
      activeEdge: null
    });
  } else {
    steps.push({
      stepIndex: stepCount++,
      type: 'FINISHED',
      currentNodeId: targetId,
      currentDist: finalDistance,
      examiningNeighborId: null,
      examiningEdgeWeight: null,
      calculatedDist: null,
      previousBestDist: null,
      updated: false,
      pseudocodeLine: 6,
      description: `Algorithm execution finished. Shortest route from '${sourceName}' to '${targetName}' is confirmed at ${finalDistance}m.`,
      distances: { ...distances },
      previous: { ...previous },
      queueState: [],
      settledNodes: Array.from(settled),
      activeEdge: null
    });
  }

  return steps;
}
