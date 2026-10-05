import { CampusNode, CampusEdge, AlternativePath } from '../types';
import { runDijkstra } from './dijkstra';
import { calculateWalkingMetrics } from './graphUtils';

export function findAlternativeRoutes(
  nodes: CampusNode[],
  edges: CampusEdge[],
  sourceId: string,
  targetId: string,
  primaryPath: string[]
): AlternativePath[] {
  if (primaryPath.length <= 1 || sourceId === targetId) return [];

  const alternatives: AlternativePath[] = [];
  const primaryResult = runDijkstra(nodes, edges, sourceId, targetId);
  const primaryDist = primaryResult.totalDistance;

  const nodeMap = new Map<string, CampusNode>();
  nodes.forEach(n => nodeMap.set(n.id, n));

  // Try removing or penalizing each edge in the primary path one by one to find distinct alternative routes
  const seenPathKeys = new Set<string>();
  seenPathKeys.add(primaryPath.join('->'));

  for (let i = 0; i < primaryPath.length - 1; i++) {
    const u = primaryPath[i];
    const v = primaryPath[i + 1];

    // Filter out the edge (u, v)
    const filteredEdges = edges.filter(
      e => !( (e.source === u && e.target === v) || (e.bidirectional && e.source === v && e.target === u) )
    );

    const altResult = runDijkstra(nodes, filteredEdges, sourceId, targetId);

    if (altResult.found && altResult.path.length > 0) {
      const pathKey = altResult.path.join('->');
      if (!seenPathKeys.has(pathKey)) {
        seenPathKeys.add(pathKey);

        const deltaMeters = altResult.totalDistance - primaryDist;
        const metrics = calculateWalkingMetrics(altResult.totalDistance);

        // Find intermediate waypoint that differs
        const intermediateNodes = altResult.path.slice(1, -1);
        const differingNode = intermediateNodes.find(id => !primaryPath.includes(id));
        const differingNodeName = differingNode ? nodeMap.get(differingNode)?.shortName : intermediateNodes[0] ? nodeMap.get(intermediateNodes[0])?.shortName : 'alternate corridor';

        alternatives.push({
          path: altResult.path,
          distance: altResult.totalDistance,
          timeMinutes: metrics.estimatedMinutes,
          deltaMeters,
          viaDescription: differingNodeName ? `Via ${differingNodeName}` : 'Alternative bypass route'
        });
      }
    }
  }

  // Sort alternatives by distance
  return alternatives.sort((a, b) => a.distance - b.distance).slice(0, 3);
}
