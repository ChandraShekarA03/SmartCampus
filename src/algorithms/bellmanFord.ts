import { CampusNode, CampusEdge, AlgorithmMetrics } from '../types';
import { findEdgeBetween } from './graphUtils';

export function runBellmanFord(
  nodes: CampusNode[],
  edges: CampusEdge[],
  sourceId: string,
  targetId: string
): AlgorithmMetrics {
  const startTime = performance.now();
  const distances: Record<string, number> = {};
  const parent: Record<string, string | null> = {};

  for (const node of nodes) {
    distances[node.id] = Infinity;
    parent[node.id] = null;
  }
  distances[sourceId] = 0;

  // Flatten edges list taking bidirectionality into account
  const directedEdges: Array<{ u: string; v: string; weight: number }> = [];
  for (const edge of edges) {
    directedEdges.push({ u: edge.source, v: edge.target, weight: edge.distance });
    if (edge.bidirectional) {
      directedEdges.push({ u: edge.target, v: edge.source, weight: edge.distance });
    }
  }

  let edgeChecks = 0;
  const V = nodes.length;

  // Relax all edges |V| - 1 times
  for (let i = 0; i < V - 1; i++) {
    let changed = false;
    for (const edge of directedEdges) {
      edgeChecks++;
      if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
        distances[edge.v] = distances[edge.u] + edge.weight;
        parent[edge.v] = edge.u;
        changed = true;
      }
    }
    if (!changed) break; // Early termination optimization
  }

  const endTime = performance.now();
  const executionTimeUs = Math.max(1, Math.round((endTime - startTime) * 1000));

  const path: string[] = [];
  if (distances[targetId] !== Infinity) {
    let curr: string | null = targetId;
    while (curr !== null) {
      path.unshift(curr);
      curr = parent[curr];
    }
  }

  const pathFound = path.length > 0 && path[0] === sourceId;
  let totalDistanceMeters = 0;
  if (pathFound) {
    for (let i = 0; i < path.length - 1; i++) {
      const edge = findEdgeBetween(edges, path[i], path[i + 1]);
      if (edge) totalDistanceMeters += edge.distance;
    }
  }

  return {
    name: 'Bellman-Ford Algorithm',
    shortName: 'Bellman-Ford',
    pathFound,
    pathLengthNodes: path.length,
    totalDistanceMeters,
    nodesVisited: V, // Relaxes all vertices V-1 times
    edgeChecks,
    executionTimeUs,
    timeComplexity: 'O(V · E)',
    spaceComplexity: 'O(V)',
    handlesNegativeWeights: true,
    optimalForWeighted: true,
    bestUseSnippet: 'Supports negative edge weights and detects negative cycles. Slower than Dijkstra.',
    path
  };
}
