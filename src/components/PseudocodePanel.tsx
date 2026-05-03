import { useVizStore } from "@/store/useVizStore";

export function PseudocodePanel() {
  const result = useVizStore((s) => s.result);
  const step = useVizStore((s) => s.current());
  if (!result) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Pseudocode</h3>
      <pre className="font-mono text-[12px] leading-6 overflow-x-auto">
        {result.pseudocode.map((line, i) => (
          <div
            key={i}
            className={`px-2 rounded transition-colors ${
              step?.line === i
                ? "bg-primary/20 text-primary border-l-2 border-primary"
                : "text-muted-foreground border-l-2 border-transparent"
            }`}
          >
            <span className="opacity-40 mr-3">{String(i + 1).padStart(2, "0")}</span>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
