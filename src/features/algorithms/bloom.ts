import { AlgoResult, AlgoStep } from "./types";

const PSEUDO = [
  "function add(x):",
  "  for each hash hi in H:",
  "    bits[hi(x) mod m] = 1",
  "function contains(x):",
  "  for each hash hi in H:",
  "    if bits[hi(x) mod m] = 0: return false",
  "  return true  // may be false positive",
];

// Two simple, deterministic string hashers (FNV-1a + djb2 variant).
function h1(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function h2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function h3(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h * 2654435761);
}

export interface BloomOp { type: "add" | "check"; key: string; }

export function runBloom(size: number, ops: BloomOp[]): AlgoResult {
  const steps: AlgoStep[] = [];
  const bits = new Array(size).fill(0);
  const hashes = [h1, h2, h3];

  steps.push({
    explain: `Initialize Bloom filter: m=${size} bits, k=${hashes.length} hashes.`,
    payload: { bits: [...bits], size },
  });

  for (const op of ops) {
    const positions = hashes.map((h) => h(op.key) % size);
    if (op.type === "add") {
      steps.push({
        line: 0, payload: { bits: [...bits], size, active: positions, op: "add", key: op.key },
        explain: `add("${op.key}") → hash positions [${positions.join(", ")}].`,
      });
      positions.forEach((p, idx) => {
        bits[p] = 1;
        steps.push({
          line: 2, payload: { bits: [...bits], size, active: [p], op: "add", key: op.key },
          explain: `Set bit[${p}] = 1 (hash #${idx + 1}).`,
        });
      });
    } else {
      const hits = positions.map((p) => bits[p]);
      const present = hits.every((b) => b === 1);
      steps.push({
        line: 4, payload: { bits: [...bits], size, active: positions, op: "check", key: op.key },
        explain: `contains("${op.key}") → check positions [${positions.join(", ")}] = [${hits.join(", ")}].`,
      });
      steps.push({
        payload: { bits: [...bits], size, active: positions, op: "check", key: op.key, result: present },
        explain: present
          ? `All bits set → MAYBE present (could be false positive).`
          : `At least one bit is 0 → DEFINITELY NOT present.`,
      });
    }
  }

  return { steps, pseudocode: PSEUDO, title: "Bloom Filter (Vehicle Cache)" };
}
