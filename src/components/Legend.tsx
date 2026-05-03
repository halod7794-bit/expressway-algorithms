export function Legend() {
  const items = [
    { color: "hsl(190 95% 55%)", label: "Active node" },
    { color: "hsl(270 80% 65%)", label: "Visited" },
    { color: "hsl(45 95% 60%)",  label: "Active edge" },
    { color: "hsl(142 76% 50%)", label: "Accepted / final" },
    { color: "hsl(0 70% 55%)",   label: "Rejected / cycle" },
  ];
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Legend</h3>
      <ul className="space-y-2 text-xs">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: i.color, boxShadow: `0 0 10px ${i.color}` }} />
            {i.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
