import { useEffect, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PlayerControls } from "@/components/PlayerControls";
import { PseudocodePanel } from "@/components/PseudocodePanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { useVizStore } from "@/store/useVizStore";
import { runFenwick } from "@/features/algorithms/fenwick";

const SIZE = 8;
const OPS = [
  { type: "update" as const, index: 1, value: 50 },
  { type: "update" as const, index: 3, value: 30 },
  { type: "update" as const, index: 5, value: 20 },
  { type: "update" as const, index: 7, value: 40 },
  { type: "update" as const, index: 4, value: 10 },
  { type: "query"  as const, index: 6 },
  { type: "query"  as const, index: 8 },
];

export default function FenwickPage() {
  const setResult = useVizStore((s) => s.setResult);
  const step = useVizStore((s) => s.current());
  useEffect(() => { setResult(runFenwick(SIZE, OPS)); }, [setResult]);

  const payload = (step?.payload ?? {}) as any;
  const bit: number[] = payload.bit ?? new Array(SIZE + 1).fill(0);
  const active: number[] = payload.active ?? [];
  const visited: number[] = payload.visited ?? [];
  const max = Math.max(1, ...bit);

  const tree = useMemo(() => {
    // Build positions for binary-indexed tree visualization (1..n)
    return Array.from({ length: SIZE }, (_, i) => i + 1);
  }, []);

  return (
    <AppLayout title="Fenwick Tree · Toll Counter">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">BIT Array</h3>
            <div className="flex gap-2 items-end">
              {tree.map((i) => {
                const v = bit[i];
                const h = (v / max) * 140 + 10;
                const isActive = active.includes(i);
                const isVisited = visited.includes(i);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-xs font-mono text-foreground">{v}</div>
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        isActive ? "bg-primary glow-primary" :
                        isVisited ? "bg-secondary" : "bg-muted"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                    <div className="text-[10px] font-mono text-muted-foreground">{i}</div>
                    <div className="text-[9px] font-mono text-muted-foreground/60">
                      {i.toString(2).padStart(4, "0")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {payload.op === "query" && payload.sum !== undefined && (
            <div className="glass rounded-2xl p-4 font-mono text-sm">
              Running prefix sum:{" "}
              <span className="text-success font-bold">{payload.sum}</span>
            </div>
          )}

          <PlayerControls />
        </div>
        <div className="space-y-4">
          <ExplanationPanel />
          <PseudocodePanel />
        </div>
      </div>
    </AppLayout>
  );
}
