import { ROADS, WeightMetric } from "@/features/graph/data";
import { AlgoResult, AlgoStep } from "./types";

const PSEUDO = [
  "function topK(arr, k):",
  "  heap = min-heap of size k",
  "  for each x in arr:",
  "    if heap.size < k: heap.push(x)",
  "    else if x > heap.top: heap.pop(); heap.push(x)",
  "  return heap.sortedDescending()",
];

interface HeapItem { id: string; label: string; value: number; }

export function runTopK(k: number, metric: WeightMetric = "distance"): AlgoResult {
  const steps: AlgoStep[] = [];
  const items: HeapItem[] = ROADS.map((e) => ({
    id: e.id, label: `${e.source}-${e.target}`, value: e[metric],
  }));

  const heap: HeapItem[] = [];
  const top = () => heap.reduce((m, x) => (x.value < m.value ? x : m), heap[0]);

  steps.push({
    payload: { heap: [...heap], items: [...items], k, metric },
    explain: `Find top ${k} roads by ${metric}. Process ${items.length} edges with min-heap of size ${k}.`,
  });

  for (let i = 0; i < items.length; i++) {
    const x = items[i];
    if (heap.length < k) {
      heap.push(x);
      steps.push({
        payload: { heap: [...heap], current: x, idx: i, action: "push", k, metric },
        explain: `Heap not full → push ${x.label} (${x.value}).`,
      });
    } else {
      const t = top();
      if (x.value > t.value) {
        heap.splice(heap.indexOf(t), 1);
        heap.push(x);
        steps.push({
          payload: { heap: [...heap], current: x, idx: i, action: "replace", removed: t, k, metric },
          explain: `${x.value} > heap.min ${t.value} → replace ${t.label} with ${x.label}.`,
        });
      } else {
        steps.push({
          payload: { heap: [...heap], current: x, idx: i, action: "skip", k, metric },
          explain: `${x.value} ≤ heap.min ${t.value} → skip.`,
        });
      }
    }
  }

  const sorted = [...heap].sort((a, b) => b.value - a.value);
  steps.push({
    payload: { heap: sorted, done: true, k, metric },
    explain: `Top ${k} roads by ${metric}: ${sorted.map((s) => `${s.label}(${s.value})`).join(", ")}.`,
  });

  return { steps, pseudocode: PSEUDO, title: `Top-${k} Roads by ${metric}` };
}
