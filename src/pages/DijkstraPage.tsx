import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GraphCanvas } from "@/components/GraphCanvas";
import { PlayerControls } from "@/components/PlayerControls";
import { PseudocodePanel } from "@/components/PseudocodePanel";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { Legend } from "@/components/Legend";
import { DistanceTable } from "@/components/DistanceTable";
import { useVizStore } from "@/store/useVizStore";
import { runDijkstra } from "@/features/algorithms/dijkstra";
import { CITIES, WeightMetric } from "@/features/graph/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function DijkstraPage() {
  const [source, setSource] = useState("DEL");
  const [target, setTarget] = useState("DEH");
  const [metric, setMetric] = useState<WeightMetric>("distance");
  const setResult = useVizStore((s) => s.setResult);
  const step = useVizStore((s) => s.current());

  useEffect(() => { setResult(runDijkstra(source, target, metric)); }, [source, target, metric, setResult]);

  return (
    <AppLayout title="Dijkstra · Shortest Path">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="space-y-4 min-w-0">
          <div className="glass rounded-2xl p-4 flex flex-wrap items-end gap-3">
            <Selector label="Source" value={source} onChange={setSource} />
            <Selector label="Target" value={target} onChange={setTarget} />
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
            <Button variant="secondary" onClick={() => setResult(runDijkstra(source, target, metric))}>Recompute</Button>
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

function Selector({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="text-[10px] uppercase text-muted-foreground mb-1">{label}</div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>
          {CITIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
