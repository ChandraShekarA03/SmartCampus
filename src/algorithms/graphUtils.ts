import { CampusNode, CampusEdge, AdjacencyList } from '../types';

export function buildAdjacencyList(nodes: CampusNode[], edges: CampusEdge[]): AdjacencyList {
  const adjList: AdjacencyList = new Map();

  // Initialize all nodes with empty arrays
  for (const node of nodes) {
    adjList.set(node.id, []);
  }

  // Add edges
  for (const edge of edges) {
    if (adjList.has(edge.source) && adjList.has(edge.target)) {
      adjList.get(edge.source)!.push({
        nodeId: edge.target,
        weight: edge.distance,
        edgeId: edge.id,
        type: edge.type
      });

      if (edge.bidirectional) {
        adjList.get(edge.target)!.push({
          nodeId: edge.source,
          weight: edge.distance,
          edgeId: edge.id,
          type: edge.type
        });
      }
    }
  }

  return adjList;
}

export function findEdgeBetween(edges: CampusEdge[], u: string, v: string): CampusEdge | undefined {
  return edges.find(
    e =>
      (e.source === u && e.target === v) ||
      (e.bidirectional && e.source === v && e.target === u)
  );
}

export function calculateWalkingMetrics(distanceMeters: number) {
  // Average human walking speed ~ 1.2 m/s = 72 meters/minute
  const walkingSpeedMetersPerMinute = 72;
  const estimatedMinutes = Math.max(1, Math.round((distanceMeters / walkingSpeedMetersPerMinute) * 10) / 10);
  
  // Average stride length = ~0.76m -> ~1315 steps per km
  const estimatedSteps = Math.round(distanceMeters / 0.76);
  
  // Average calories burned = ~0.05 kcal per meter walked
  const caloriesBurned = Math.round(distanceMeters * 0.05);

  return {
    estimatedMinutes,
    estimatedSteps,
    caloriesBurned
  };
}
