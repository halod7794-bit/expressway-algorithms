import { CITIES, ROADS, WeightMetric } from "@/features/graph/data";
import { AlgoResult, AlgoStep } from "./types";

const PSEUDO = [
  "function kruskal(G):",
  "  sort edges by weight ascending",
  "  for each v: makeSet(v)",
  "  MST = ∅",
  "  for each edge (u,v,w) in sorted order:",
  "    if find(u) ≠ find(v):",
  "      MST.add((u,v)); union(u,v)",
  "  return MST",
];

export function runKruskal(metric: WeightMetric = "distance"): AlgoResult {
  const steps: AlgoStep[] = [];
  const parent: Record<string, string> = {};
  CITIES.forEach((c) => (parent[c.id] = c.id));
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  const union = (a: string, b: string) => { parent[find(a)] = find(b); };

  const sorted = [...ROADS].sort((a, b) => a[metric] - b[metric]);
  steps.push({
    line: 1, explain: `Sort all ${ROADS.length} edges by ${metric} ascending.`,
  });

  const accepted: string[] = [];
  const rejected: string[] = [];
  let cost = 0;

  for (const e of sorted) {
    steps.push({
      line: 4, activeEdges: [e.id], acceptedEdges: [...accepted], rejectedEdges: [...rejected],
      cost, explain: `Consider edge ${e.source}–${e.target} (w=${e[metric]}).`,
    });
    if (find(e.source) !== find(e.target)) {
      union(e.source, e.target);
      accepted.push(e.id);
      cost += e[metric];
      steps.push({
        line: 6, activeEdges: [e.id], acceptedEdges: [...accepted], rejectedEdges: [...rejected],
        cost, explain: `Different components → ACCEPT. MST cost = ${cost}.`,
      });
    } else {
      rejected.push(e.id);
      steps.push({
        line: 5, activeEdges: [e.id], acceptedEdges: [...accepted], rejectedEdges: [...rejected],
        cost, explain: `Same component → REJECT (would form cycle).`,
      });
    }
    if (accepted.length === CITIES.length - 1) break;
  }

  steps.push({
    line: 7, acceptedEdges: [...accepted], rejectedEdges: [...rejected], cost,
    explain: `MST complete. Total ${metric} = ${cost} across ${accepted.length} edges.`,
  });

  return { steps, pseudocode: PSEUDO, title: `Kruskal MST (${metric})` };
}
