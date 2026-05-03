// Generic step-based engine. Every algorithm produces a list of Steps the
// player walks through. UI components react to the current Step.

export interface AlgoStep {
  /** Nodes currently being processed / "active" frontier */
  activeNodes?: string[];
  /** Edges currently being relaxed/considered */
  activeEdges?: string[];
  /** Edges in the final/accepted set (MST, shortest path, etc.) */
  acceptedEdges?: string[];
  /** Edges explicitly rejected this step */
  rejectedEdges?: string[];
  /** Nodes already visited / settled */
  visitedNodes?: string[];
  /** Distance / cost table (nodeId -> value) */
  distances?: Record<string, number>;
  /** Pseudocode line index to highlight */
  line?: number;
  /** Human-readable explanation */
  explain: string;
  /** Optional running cost / iteration counter */
  cost?: number;
  iteration?: number;
  /** For non-graph algos: arbitrary structured payload */
  payload?: Record<string, unknown>;
}

export interface AlgoResult {
  steps: AlgoStep[];
  pseudocode: string[];
  title: string;
}
