import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { ROADS } from "@/features/graph/data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const baseGrid = { color: "hsla(220, 15%, 50%, 0.15)" };
const baseTicks = { color: "hsl(220 15% 70%)" };

export default function Analytics() {
  const [series, setSeries] = useState<number[]>(() =>
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 1500 + 500))
  );

  useEffect(() => {
    const i = setInterval(() => {
      setSeries((s) => [...s.slice(1), Math.floor(Math.random() * 1500 + 500)]);
    }, 1500);
    return () => clearInterval(i);
  }, []);

  const lineData = {
    labels: series.map((_, i) => `t-${series.length - i}`),
    datasets: [{
      label: "Vehicles / 5 min",
      data: series,
      borderColor: "hsl(190, 95%, 55%)",
      backgroundColor: "hsla(190, 95%, 55%, 0.15)",
      fill: true,
      tension: 0.35,
      pointRadius: 0,
    }],
  };

  const barData = {
    labels: ROADS.map((r) => `${r.source}-${r.target}`),
    datasets: [
      { label: "Distance (km)", data: ROADS.map((r) => r.distance), backgroundColor: "hsla(190, 95%, 55%, 0.7)" },
      { label: "Toll (₹)", data: ROADS.map((r) => r.toll), backgroundColor: "hsla(270, 80%, 65%, 0.7)" },
    ],
  };

  const opts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "hsl(210 40% 90%)" } } },
    scales: {
      x: { grid: baseGrid, ticks: baseTicks },
      y: { grid: baseGrid, ticks: baseTicks },
    },
  };

  return (
    <AppLayout title="Analytics">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Live Traffic</h3>
          <div className="h-72"><Line data={lineData} options={opts as any} /></div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Road Metrics</h3>
          <div className="h-72"><Bar data={barData} options={opts as any} /></div>
        </div>
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Roads Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground uppercase">
                <tr><th className="text-left p-2">Edge</th><th className="text-right p-2">Distance</th><th className="text-right p-2">Toll</th><th className="text-right p-2">Fuel</th></tr>
              </thead>
              <tbody>
                {ROADS.map((r) => (
                  <tr key={r.id} className="border-t border-border/40">
                    <td className="p-2 font-mono">{r.source} → {r.target}</td>
                    <td className="p-2 text-right font-mono">{r.distance} km</td>
                    <td className="p-2 text-right font-mono">₹{r.toll}</td>
                    <td className="p-2 text-right font-mono">{r.fuel} L</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
