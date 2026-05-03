import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GraphCanvas } from "@/components/GraphCanvas";
import { PlayerControls } from "@/components/PlayerControls";
import { PseudocodePanel } from "@/components/PseudocodePanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { Legend } from "@/components/Legend";
import { useVizStore } from "@/store/useVizStore";
import { runKruskal } from "@/features/algorithms/kruskal";
import { ROADS, WeightMetric } from "@/features/graph/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function KruskalPage() {
  const [metric, setMetric] = useState<WeightMetric>("distance");
  const setResult = useVizStore((s) => s.setResult);
  const step = useVizStore((s) => s.current());
  useEffect(() => { setResult(runKruskal(metric)); }, [metric, setResult]);

  const accepted = new Set(step?.acceptedEdges ?? []);
  const active = new Set(step?.activeEdges ?? []);
  const rejected = new Set(step?.rejectedEdges ?? []);
  const sorted = [...ROADS].sort((a, b) => a[metric] - b[metric]);

  return (
    <AppLayout title="Kruskal · Minimum Spanning Tree">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-4 flex items-end gap-3">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Weight</div>
              <Select value={metric} onValueChange={(v) => setMetric(v as WeightMetric)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="toll">Toll</SelectItem>
                  <SelectItem value="fuel">Fuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {step?.cost !== undefined && (
              <div className="ml-auto text-sm font-mono">
                <span className="text-muted-foreground">MST cost:</span>{" "}
                <span className="text-success font-bold">{step.cost}</span>
              </div>
            )}
          </div>

          <GraphCanvas step={step} metric={metric} />

          <div className="glass rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Sorted Edges</h3>
            <div className="flex flex-wrap gap-2">
              {sorted.map((e) => {
                const cls = accepted.has(e.id) ? "bg-success/20 text-success border-success/40"
                  : active.has(e.id)  ? "bg-warning/20 text-warning border-warning/40 animate-pulse-glow"
                  : rejected.has(e.id) ? "bg-destructive/15 text-destructive border-destructive/30 line-through opacity-60"
                  : "bg-muted/40 text-muted-foreground border-border";
                return (
                  <span key={e.id} className={`px-2.5 py-1 rounded-md text-xs font-mono border ${cls}`}>
                    {e.source}-{e.target}: {e[metric]}
                  </span>
                );
              })}
            </div>
          </div>

          <PlayerControls />
        </div>
        <div className="space-y-4">
          <ExplanationPanel />
          <PseudocodePanel />
          <Legend />
        </div>
      </div>
    </AppLayout>
  );
}
