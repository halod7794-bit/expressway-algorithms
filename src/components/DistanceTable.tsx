import { useVizStore } from "@/store/useVizStore";
import { CITIES } from "@/features/graph/data";

export function DistanceTable() {
  const step = useVizStore((s) => s.current());
  if (!step?.distances) return null;
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Distance Table</h3>
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
        {CITIES.map((c) => {
          const d = step.distances![c.id];
          return (
            <div key={c.id} className="rounded-lg bg-muted/40 p-2">
              <div className="text-primary font-bold">{c.id}</div>
              <div className="text-foreground">{d === Infinity ? "∞" : d}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
