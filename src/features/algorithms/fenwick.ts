import { AlgoResult, AlgoStep } from "./types";

const PSEUDO = [
  "function update(i, delta):",
  "  while i ≤ n:",
  "    bit[i] += delta",
  "    i += i & (-i)",
  "function query(i):",
  "  s = 0",
  "  while i > 0:",
  "    s += bit[i]",
  "    i -= i & (-i)",
  "  return s",
];

export interface FenwickOp {
  type: "update" | "query";
  index: number;
  value?: number;
}

/** Visualize Fenwick tree operations on toll counters (1-indexed). */
export function runFenwick(size: number, ops: FenwickOp[]): AlgoResult {
  const steps: AlgoStep[] = [];
  const bit = new Array(size + 1).fill(0);

  steps.push({
    explain: `Initialize Fenwick tree of size ${size} (all zeros).`,
    payload: { bit: [...bit], size },
  });

  for (const op of ops) {
    if (op.type === "update") {
      const delta = op.value ?? 0;
      let i = op.index;
      steps.push({
        line: 0, payload: { bit: [...bit], size, active: [i], op: "update", delta },
        explain: `update(${i}, ${delta}): start at index ${i}.`,
      });
      while (i <= size) {
        bit[i] += delta;
        steps.push({
          line: 2, payload: { bit: [...bit], size, active: [i], op: "update" },
          explain: `bit[${i}] += ${delta} → ${bit[i]}. Next i = ${i} + (${i} & -${i}) = ${i + (i & -i)}.`,
        });
        i += i & -i;
      }
    } else {
      let i = op.index;
      let s = 0;
      const visited: number[] = [];
      steps.push({
        line: 5, payload: { bit: [...bit], size, active: [i], op: "query" },
        explain: `query(${op.index}): compute prefix sum.`,
      });
      while (i > 0) {
        s += bit[i];
        visited.push(i);
        steps.push({
          line: 8, payload: { bit: [...bit], size, active: [i], visited: [...visited], op: "query", sum: s },
          explain: `s += bit[${i}] (= ${bit[i]}) → s = ${s}. Next i = ${i} - (${i} & -${i}) = ${i - (i & -i)}.`,
        });
        i -= i & -i;
      }
      steps.push({
        payload: { bit: [...bit], size, visited, op: "query", sum: s, done: true },
        explain: `Result: prefix sum [1..${op.index}] = ${s}.`,
      });
    }
  }

  return { steps, pseudocode: PSEUDO, title: "Fenwick Tree (Toll Counter)" };
}
