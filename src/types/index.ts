export type NodeCategory = 'academic' | 'facility' | 'food' | 'admin' | 'sports' | 'residential';

export interface CampusNode {
  id: string;
  name: string;
  shortName: string;
  category: NodeCategory;
  x: number; // canvas x coordinate
  y: number; // canvas y coordinate
  floors?: number;
  description?: string;
  departments?: string[];
  facilities?: string[];
  icon?: string;
}

export interface CampusEdge {
  id: string;
  source: string;
  target: string;
  distance: number; // in meters
  bidirectional: boolean;
  type?: 'walkway' | 'covered' | 'stairs' | 'ramp' | 'scenic';
  description?: string;
}

export interface CampusGraphData {
  name: string;
  campusName: string;
  description: string;
  nodes: CampusNode[];
  edges: CampusEdge[];
}

export interface AdjacencyNeighbor {
  nodeId: string;
  weight: number;
  edgeId: string;
  type?: string;
}

export type AdjacencyList = Map<string, AdjacencyNeighbor[]>;

export interface PathResult {
  path: string[]; // array of node IDs
  nodeNames: string[];
  totalDistance: number; // in meters
  estimatedMinutes: number;
  estimatedSteps: number;
  caloriesBurned: number;
  visitedNodesCount: number;
  edgesRelaxedCount: number;
  pqOperationsCount: number;
  executionTimeMs: number;
  allDistances: Record<string, number>;
  previousPointers: Record<string, string | null>;
  visitedOrder: string[];
  found: boolean;
}

export type SimulatorStepType =
  | 'INIT'
  | 'EXTRACT_MIN'
  | 'EXAMINE_NEIGHBOR'
  | 'RELAX_EDGE'
  | 'SKIP_EDGE'
  | 'NODE_SETTLED'
  | 'TARGET_REACHED'
  | 'FINISHED'
  | 'NO_PATH';

export interface DijkstraStep {
  stepIndex: number;
  type: SimulatorStepType;
  currentNodeId: string | null;
  currentDist: number;
  examiningNeighborId: string | null;
  examiningEdgeWeight: number | null;
  calculatedDist: number | null;
  previousBestDist: number | null;
  updated: boolean;
  pseudocodeLine: number;
  description: string;
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  queueState: Array<{ id: string; dist: number }>;
  settledNodes: string[];
  activeEdge: { source: string; target: string } | null;
}

export interface AlternativePath {
  path: string[];
  distance: number;
  timeMinutes: number;
  deltaMeters: number;
  viaDescription: string;
}

export interface AlgorithmMetrics {
  name: string;
  shortName: string;
  pathFound: boolean;
  pathLengthNodes: number;
  totalDistanceMeters: number;
  nodesVisited: number;
  edgeChecks: number;
  executionTimeUs: number; // microseconds
  timeComplexity: string;
  spaceComplexity: string;
  handlesNegativeWeights: boolean;
  optimalForWeighted: boolean;
  bestUseSnippet: string;
  path: string[];
}

export interface TestCaseResult {
  id: string;
  title: string;
  source: string;
  destination: string;
  expectedDistance: number | 'UNREACHABLE' | 0;
  actualDistance: number | 'UNREACHABLE' | 0;
  passed: boolean;
  executionTimeMs: number;
  pathFound: string[];
  notes: string;
}
