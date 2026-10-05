import { CampusNode, CampusEdge, AlgorithmMetrics } from '../types';
import { MinPriorityQueue } from './priorityQueue';
import { buildAdjacencyList, findEdgeBetween } from './graphUtils';

/**
 * Euclidean distance heuristic for A* algorithm
 */
function heuristic(nodeA: CampusNode, nodeB: CampusNode): number {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  // Scaled Euclidean distance on campus map
  return Math.sqrt(dx * dx + dy * dy) * 0.8;
}

export function runAStar(
  nodes: CampusNode[],
  edges: CampusEdge[],
  sourceId: string,
  targetId: string
): AlgorithmMetrics {
  const startTime = performance.now();
  const adj = buildAdjacencyList(nodes, edges);

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  const targetNode = nodeMap.get(targetId);
  const sourceNode = nodeMap.get(sourceId);

  if (!targetNode || !sourceNode) {
    return {
      name: 'A* Search (A-Star)',
      shortName: 'A*',
      pathFound: false,
      pathLengthNodes: 0,
      totalDistanceMeters: 0,
      nodesVisited: 0,
      edgeChecks: 0,
      executionTimeUs: 0,
      timeComplexity: 'O(E)',
      spaceComplexity: 'O(V)',
      handlesNegativeWeights: false,
      optimalForWeighted: true,
      bestUseSnippet: 'Heuristic-guided shortest path. Highly effective for 2D spatial campus navigation.',
      path: []
    };
  }

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const parent: Record<string, string | null> = {};
  const visited = new Set<string>();

  for (const node of nodes) {
    gScore[node.id] = Infinity;
    fScore[node.id] = Infinity;
    parent[node.id] = null;
  }

  gScore[sourceId] = 0;
  fScore[sourceId] = heuristic(sourceNode, targetNode);

  const openSet = new MinPriorityQueue<string>();
  openSet.insert(sourceId, fScore[sourceId]);

  let edgeChecks = 0;
  let targetFound = false;

  if (sourceId === targetId) {
    const elapsed = (performance.now() - startTime) * 1000;
    return {
      name: 'A* Search (A-Star)',
      shortName: 'A*',
      pathFound: true,
      pathLengthNodes: 1,
      totalDistanceMeters: 0,
      nodesVisited: 1,
      edgeChecks: 0,
      executionTimeUs: Math.max(1, Math.round(elapsed)),
      timeComplexity: 'O(E)',
      spaceComplexity: 'O(V)',
      handlesNegativeWeights: false,
      optimalForWeighted: true,
      bestUseSnippet: 'Heuristic-guided shortest path. Highly effective for 2D spatial campus navigation.',
      path: [sourceId]
    };
  }

  while (!openSet.isEmpty()) {
    const current = openSet.extractMin();
    if (!current) break;

    const u = current.item;
    if (visited.has(u)) continue;
    visited.add(u);

    if (u === targetId) {
      targetFound = true;
      break;
    }

    const neighbors = adj.get(u) || [];
    for (const neighbor of neighbors) {
      edgeChecks++;
      const v = neighbor.nodeId;
      const vNode = nodeMap.get(v);
      if (!vNode || visited.has(v)) continue;

      const tentativeG = gScore[u] + neighbor.weight;
      if (tentativeG < gScore[v]) {
        parent[v] = u;
        gScore[v] = tentativeG;
        const h = heuristic(vNode, targetNode);
        fScore[v] = tentativeG + h;
        openSet.insert(v, fScore[v]);
      }
    }
  }

  const endTime = performance.now();
  const executionTimeUs = Math.max(1, Math.round((endTime - startTime) * 1000));

  const path: string[] = [];
  if (targetFound) {
    let curr: string | null = targetId;
    while (curr !== null) {
      path.unshift(curr);
      curr = parent[curr];
    }
  }

  let totalDistanceMeters = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = findEdgeBetween(edges, path[i], path[i + 1]);
    if (edge) totalDistanceMeters += edge.distance;
  }

  return {
    name: 'A* Search (A-Star)',
    shortName: 'A*',
    pathFound: path.length > 0 && path[0] === sourceId,
    pathLengthNodes: path.length,
    totalDistanceMeters,
    nodesVisited: visited.size,
    edgeChecks,
    executionTimeUs,
    timeComplexity: 'O(E) with admissible heuristic',
    spaceComplexity: 'O(V)',
    handlesNegativeWeights: false,
    optimalForWeighted: true,
    bestUseSnippet: 'Uses Euclidean directional guidance to explore fewer nodes towards target.',
    path
  };
}
