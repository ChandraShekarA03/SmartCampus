import { CampusNode, CampusEdge, AlgorithmMetrics } from '../types';
import { runDijkstra } from './dijkstra';
import { runBFS } from './bfs';
import { runAStar } from './astar';
import { runBellmanFord } from './bellmanFord';

export function runAllAlgorithmsComparison(
  nodes: CampusNode[],
  edges: CampusEdge[],
  sourceId: string,
  targetId: string
): AlgorithmMetrics[] {
  // 1. Dijkstra
  const startDijkstra = performance.now();
  const dijkstraResult = runDijkstra(nodes, edges, sourceId, targetId);
  const dijkstraUs = Math.max(1, Math.round((performance.now() - startDijkstra) * 1000));

  const dijkstraMetrics: AlgorithmMetrics = {
    name: "Dijkstra's Algorithm (Min-Heap)",
    shortName: 'Dijkstra',
    pathFound: dijkstraResult.found,
    pathLengthNodes: dijkstraResult.path.length,
    totalDistanceMeters: dijkstraResult.totalDistance,
    nodesVisited: dijkstraResult.visitedNodesCount,
    edgeChecks: dijkstraResult.edgesRelaxedCount,
    executionTimeUs: dijkstraUs,
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V + E)',
    handlesNegativeWeights: false,
    optimalForWeighted: true,
    bestUseSnippet: 'Standard gold standard for weighted non-negative graphs. Finds absolute shortest physical path.',
    path: dijkstraResult.path
  };

  // 2. BFS
  const bfsMetrics = runBFS(nodes, edges, sourceId, targetId);

  // 3. A*
  const astarMetrics = runAStar(nodes, edges, sourceId, targetId);

  // 4. Bellman-Ford
  const bellmanMetrics = runBellmanFord(nodes, edges, sourceId, targetId);

  return [dijkstraMetrics, astarMetrics, bfsMetrics, bellmanMetrics];
}
