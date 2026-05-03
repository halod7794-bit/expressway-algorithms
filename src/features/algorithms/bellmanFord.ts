import { CITIES, ROADS, WeightMetric } from "@/features/graph/data";
import { AlgoResult, AlgoStep } from "./types";

const PSEUDO = [
  "function bellmanFord(G, source):",
  "  for each v: dist[v] = ∞; dist[source] = 0",
  "  repeat |V|-1 times:",
  "    for each edge (u,v,w):",
  "      if dist[u] + w < dist[v]:",
  "        dist[v] = dist[u] + w",
  "  for each edge (u,v,w):",
  "    if dist[u] + w < dist[v]:",
  "      report negative cycle",
];

/**
 * Bellman-Ford on a directed view of the corridor.
 * Optionally injects a synthetic negative-weight back-edge to demonstrate
 * negative cycle detection.
 */
export function runBellmanFord(
  source: string,
  metric: WeightMetric = "distance",
  injectNegativeCycle = false
): AlgoResult {
  const steps: AlgoStep[] = [];
  const dist: Record<string, number> = {};
  CITIES.forEach((c) => (dist[c.id] = Infinity));
  dist[source] = 0;

  // Build a directed edge list (both directions for the corridor).
  const edges = ROADS.flatMap((e) => [
    { id: e.id, u: e.source, v: e.target, w: e[metric] },
    { id: e.id, u: e.target, v: e.source, w: e[metric] },
  ]);
  if (injectNegativeCycle) {
    // Synthetic negative back-edge MEE -> DEL with -200 to force a cycle.
    edges.push({ id: "neg", u: "MEE", v: "DEL", w: -200 });
  }

  steps.push({
    line: 1, distances: { ...dist },
    explain: `Initialize distances. Source ${source} = 0.`,
  });

  const V = CITIES.length;
  for (let i = 1; i < V; i++) {
    steps.push({
      line: 2, iteration: i, distances: { ...dist },
      explain: `Iteration ${i} of ${V - 1}: relax every edge.`,
    });
    let changed = false;
    for (const e of edges) {
      if (dist[e.u] + e.w < dist[e.v]) {
        dist[e.v] = dist[e.u] + e.w;
        changed = true;
        steps.push({
          line: 5, activeEdges: e.id === "neg" ? [] : [e.id],
          activeNodes: [e.u, e.v], iteration: i, distances: { ...dist },
          explain: `Relax ${e.u}→${e.v} (w=${e.w}): dist[${e.v}] = ${dist[e.v]}.`,
        });
      }
    }
    if (!changed) {
      steps.push({
        line: 2, iteration: i, distances: { ...dist },
        explain: `No relaxations this round → early termination.`,
      });
      break;
    }
  }

  // Negative cycle check
  const cycleEdges: string[] = [];
  for (const e of edges) {
    if (dist[e.u] + e.w < dist[e.v]) {
      cycleEdges.push(e.id);
    }
  }
  if (cycleEdges.length) {
    steps.push({
      line: 8, activeEdges: cycleEdges.filter((id) => id !== "neg"),
      distances: { ...dist },
      payload: { negativeCycle: true },
      explain: `⚠ Negative cycle detected — distances can be reduced indefinitely.`,
    });
  } else {
    steps.push({
      line: 6, distances: { ...dist },
      explain: `No negative cycle. Final shortest distances computed.`,
    });
  }

  return { steps, pseudocode: PSEUDO, title: `Bellman-Ford (${source})` };
}
