import { CampusNode, CampusEdge, AlgorithmMetrics } from '../types';
import { buildAdjacencyList, findEdgeBetween } from './graphUtils';

export function runBFS(
  nodes: CampusNode[],
  edges: CampusEdge[],
  sourceId: string,
  targetId: string
): AlgorithmMetrics {
  const startTime = performance.now();
  const adj = buildAdjacencyList(nodes, edges);

  const visited = new Set<string>();
  const queue: string[] = [];
  const parent: Record<string, string | null> = {};

  for (const node of nodes) {
    parent[node.id] = null;
  }

  visited.add(sourceId);
  queue.push(sourceId);

  let edgeChecks = 0;
  let targetFound = false;

  if (sourceId === targetId) {
    const elapsed = (performance.now() - startTime) * 1000;
    return {
      name: 'Breadth-First Search (BFS)',
      shortName: 'BFS',
      pathFound: true,
      pathLengthNodes: 1,
      totalDistanceMeters: 0,
      nodesVisited: 1,
      edgeChecks: 0,
      executionTimeUs: Math.max(1, Math.round(elapsed)),
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      handlesNegativeWeights: false,
      optimalForWeighted: false,
      bestUseSnippet: 'Optimal only for unweighted graphs (hop count minimization). Ignores real meter distances.',
      path: [sourceId]
    };
  }

  while (queue.length > 0) {
    const u = queue.shift()!;
    if (u === targetId) {
      targetFound = true;
      break;
    }

    const neighbors = adj.get(u) || [];
    for (const neighbor of neighbors) {
      edgeChecks++;
      const v = neighbor.nodeId;
      if (!visited.has(v)) {
        visited.add(v);
        parent[v] = u;
        queue.push(v);
        if (v === targetId) {
          targetFound = true;
          break;
        }
      }
    }
    if (targetFound) break;
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

  // Calculate actual weighted distance along the BFS path
  let totalDistanceMeters = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const edge = findEdgeBetween(edges, path[i], path[i + 1]);
    if (edge) totalDistanceMeters += edge.distance;
  }

  return {
    name: 'Breadth-First Search (BFS)',
    shortName: 'BFS',
    pathFound: path.length > 0 && path[0] === sourceId,
    pathLengthNodes: path.length,
    totalDistanceMeters,
    nodesVisited: visited.size,
    edgeChecks,
    executionTimeUs,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    handlesNegativeWeights: false,
    optimalForWeighted: false,
    bestUseSnippet: 'Finds path with fewest edges (hops). Suboptimal when edges have varying physical distances.',
    path
  };
}
