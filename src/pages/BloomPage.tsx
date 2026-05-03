import { useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PlayerControls } from "@/components/PlayerControls";
import { PseudocodePanel } from "@/components/PseudocodePanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { useVizStore } from "@/store/useVizStore";
import { runBloom } from "@/features/algorithms/bloom";

const SIZE = 32;
const OPS = [
  { type: "add"   as const, key: "DL01AB1234" },
  { type: "add"   as const, key: "UP14CD5678" },
  { type: "add"   as const, key: "HR26EF9012" },
  { type: "check" as const, key: "DL01AB1234" }, // present
  { type: "check" as const, key: "MH12XY0001" }, // probably absent
  { type: "add"   as const, key: "UK07GH3456" },
  { type: "check" as const, key: "UK07GH3456" }, // present
];

export default function BloomPage() {
  const setResult = useVizStore((s) => s.setResult);
  const step = useVizStore((s) => s.current());
  useEffect(() => { setResult(runBloom(SIZE, OPS)); }, [setResult]);

  const payload = (step?.payload ?? {}) as any;
  const bits: number[] = payload.bits ?? new Array(SIZE).fill(0);
  const active: number[] = payload.active ?? [];

  return (
    <AppLayout title="Bloom Filter · Vehicle Cache">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Bit Array (m={SIZE}, k=3)</h3>
              {payload.key && (
                <div className="text-xs font-mono">
                  <span className="text-muted-foreground">{payload.op}: </span>
                  <span className="text-primary">{payload.key}</span>
                  {payload.result !== undefined && (
                    <span className={`ml-2 px-2 py-0.5 rounded ${payload.result ? "bg-warning/20 text-warning" : "bg-success/20 text-success"}`}>
                      {payload.result ? "MAYBE" : "NOT PRESENT"}
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-16 gap-1.5" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
              {bits.map((b, i) => {
                const isActive = active.includes(i);
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-full aspect-square rounded-md flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                        isActive
                          ? b ? "bg-warning text-warning-foreground glow-primary scale-110" : "bg-destructive/40 text-destructive-foreground scale-110"
                          : b ? "bg-primary/30 text-primary border border-primary/40" : "bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {b}
                    </div>
                    <div className="text-[8px] font-mono text-muted-foreground/50">{i}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">False positives:</strong> A Bloom filter may report "maybe present" for keys never inserted, because three independent hashes can coincidentally all hit set bits. It never produces false negatives.
          </div>

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
