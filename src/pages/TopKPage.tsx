import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PlayerControls } from "@/components/PlayerControls";
import { PseudocodePanel } from "@/components/PseudocodePanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { useVizStore } from "@/store/useVizStore";
import { runTopK } from "@/features/algorithms/topK";
import { WeightMetric } from "@/features/graph/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TopKPage() {
  const [k, setK] = useState(3);
  const [metric, setMetric] = useState<WeightMetric>("distance");
  const setResult = useVizStore((s) => s.setResult);
  const step = useVizStore((s) => s.current());
  useEffect(() => { setResult(runTopK(k, metric)); }, [k, metric, setResult]);

  const payload = (step?.payload ?? {}) as any;
  const heap: { id: string; label: string; value: number }[] = payload.heap ?? [];
  const max = Math.max(1, ...heap.map((h) => h.value));

  return (
    <AppLayout title="Top-K Roads · Heap Selection">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-4 flex items-end gap-3">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1">K</div>
              <Select value={String(k)} onValueChange={(v) => setK(+v)}>
                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent>{[2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Metric</div>
              <Select value={metric} onValueChange={(v) => setMetric(v as WeightMetric)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="toll">Toll</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto text-xs font-mono text-muted-foreground">
              {payload.action && <span>action: <span className="text-primary">{payload.action}</span></span>}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-primary mb-4 uppercase tracking-wide">Heap Contents</h3>
            <div className="space-y-2">
              {heap.length === 0 && <div className="text-xs text-muted-foreground">Heap is empty.</div>}
              {heap.map((h) => (
                <div key={h.id} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-mono text-foreground">{h.label}</div>
                  <div className="flex-1 bg-muted/40 rounded h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary glow-primary transition-all"
                      style={{ width: `${(h.value / max) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-xs font-mono text-right text-primary">{h.value}</div>
                </div>
              ))}
            </div>
          </div>

          {payload.current && (
            <div className="glass rounded-2xl p-4 text-xs font-mono">
              Considering: <span className="text-warning">{payload.current.label}</span> ({payload.current.value})
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
