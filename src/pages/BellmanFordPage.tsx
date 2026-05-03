import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GraphCanvas } from "@/components/GraphCanvas";
import { PlayerControls } from "@/components/PlayerControls";
import { PseudocodePanel } from "@/components/PseudocodePanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { Legend } from "@/components/Legend";
import { DistanceTable } from "@/components/DistanceTable";
import { useVizStore } from "@/store/useVizStore";
import { runBellmanFord } from "@/features/algorithms/bellmanFord";
import { CITIES, WeightMetric } from "@/features/graph/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function BellmanFordPage() {
  const [source, setSource] = useState("DEL");
  const [metric, setMetric] = useState<WeightMetric>("distance");
  const [neg, setNeg] = useState(false);
  const setResult = useVizStore((s) => s.setResult);
  const step = useVizStore((s) => s.current());
  useEffect(() => { setResult(runBellmanFord(source, metric, neg)); }, [source, metric, neg, setResult]);

  const isCycle = step?.payload?.negativeCycle === true;

  return (
    <AppLayout title="Bellman-Ford · Negative Cycle Detection">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-4 flex flex-wrap items-end gap-4">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Source</div>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>{CITIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Weight</div>
              <Select value={metric} onValueChange={(v) => setMetric(v as WeightMetric)}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="toll">Toll</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="neg" checked={neg} onCheckedChange={setNeg} />
              <Label htmlFor="neg" className="text-xs">Inject negative cycle</Label>
            </div>
            {isCycle && (
              <div className="ml-auto text-sm font-mono text-destructive animate-pulse-glow">
                ⚠ NEGATIVE CYCLE DETECTED
              </div>
            )}
          </div>

          <GraphCanvas step={step} metric={metric} />
          <DistanceTable />
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
