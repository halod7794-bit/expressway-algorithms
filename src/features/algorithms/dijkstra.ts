import { CITIES, ROADS, RoadEdge, WeightMetric } from "@/features/graph/data";
import { AlgoResult, AlgoStep } from "./types";

const PSEUDO = [
  "function dijkstra(G, source):",
  "  for each v in V: dist[v] = ∞",
  "  dist[source] = 0; PQ = {source}",
  "  while PQ not empty:",
  "    u = extract-min(PQ)",
  "    for each edge (u,v) in G:",
  "      if dist[u] + w(u,v) < dist[v]:",
  "        dist[v] = dist[u] + w(u,v)",
  "        prev[v] = u; PQ.add(v)",
  "  return dist, prev",
];

export function runDijkstra(
  source: string,
  target: string,
  metric: WeightMetric = "distance"
): AlgoResult {
  const steps: AlgoStep[] = [];
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  CITIES.forEach((c) => { dist[c.id] = Infinity; prev[c.id] = null; });
  dist[source] = 0;

  steps.push({
    line: 2, distances: { ...dist },
    explain: `Initialize all distances to ∞, source ${source} = 0.`,
  });

  const w = (e: RoadEdge) => e[metric];

  while (visited.size < CITIES.length) {
    let u: string | null = null;
    let best = Infinity;
    for (const c of CITIES) if (!visited.has(c.id) && dist[c.id] < best) { best = dist[c.id]; u = c.id; }
    if (u == null || best === Infinity) break;
    visited.add(u);

    steps.push({
      line: 4, activeNodes: [u], visitedNodes: [...visited], distances: { ...dist },
      explain: `Extract-min: select ${u} with current distance ${dist[u]}.`,
    });

    const neighbors = ROADS.filter((e) => e.source === u || e.target === u);
    for (const e of neighbors) {
      const v = e.source === u ? e.target : e.source;
      if (visited.has(v)) continue;
      const alt = dist[u] + w(e);
      steps.push({
        line: 5, activeNodes: [u, v], activeEdges: [e.id],
        visitedNodes: [...visited], distances: { ...dist },
        explain: `Relax edge ${u}→${v} (w=${w(e)}): ${dist[u]} + ${w(e)} = ${alt} vs ${dist[v]}.`,
      });
      if (alt < dist[v]) {
        dist[v] = alt; prev[v] = u;
        steps.push({
          line: 7, activeNodes: [v], activeEdges: [e.id],
          visitedNodes: [...visited], distances: { ...dist },
          explain: `Update dist[${v}] = ${alt}, prev[${v}] = ${u}.`,
        });
      }
    }

    if (u === target) break;
  }

  // Reconstruct path
  const path: string[] = [];
  const pathEdges: string[] = [];
  let cur: string | null = target;
  while (cur && prev[cur] !== null) {
    path.unshift(cur);
    const p = prev[cur]!;
    const edge = ROADS.find((e) =>
      (e.source === p && e.target === cur) || (e.target === p && e.source === cur)
    );
    if (edge) pathEdges.unshift(edge.id);
    cur = p;
  }
  if (cur === source) path.unshift(source);

  steps.push({
    line: 9, acceptedEdges: pathEdges, visitedNodes: [...visited],
    distances: { ...dist }, cost: dist[target],
    explain: `Shortest path: ${path.join(" → ")} with total ${metric} = ${dist[target]}.`,
  });

  return { steps, pseudocode: PSEUDO, title: `Dijkstra (${source} → ${target})` };
}
