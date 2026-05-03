import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { GraphCanvas } from "@/components/GraphCanvas";
import { ROADS, CITIES } from "@/features/graph/data";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Route, Network, AlertTriangle, Binary, Database, Activity, ArrowRight } from "lucide-react";

const algos = [
  { to: "/dijkstra",     label: "Dijkstra",     desc: "Shortest path from source to all nodes",  icon: Route, color: "from-primary to-cyan-400" },
  { to: "/kruskal",      label: "Kruskal MST",  desc: "Minimum spanning tree via union-find",    icon: Network, color: "from-secondary to-fuchsia-400" },
  { to: "/bellman-ford", label: "Bellman-Ford", desc: "Handles negative edges & cycle detection", icon: AlertTriangle, color: "from-warning to-orange-400" },
  { to: "/fenwick",      label: "Fenwick Tree", desc: "O(log n) prefix sums for toll counters", icon: Binary, color: "from-emerald-400 to-success" },
  { to: "/bloom",        label: "Bloom Filter", desc: "Probabilistic vehicle membership cache",   icon: Database, color: "from-pink-400 to-accent" },
  { to: "/topk",         label: "Top-K Roads",  desc: "Min-heap selection of busiest segments",  icon: Activity, color: "from-primary to-secondary" },
];

export default function Dashboard() {
  const [traffic, setTraffic] = useState(() => Math.floor(Math.random() * 4000 + 8000));
  useEffect(() => {
    const i = setInterval(() => setTraffic((t) => t + Math.floor(Math.random() * 60 - 30)), 1500);
    return () => clearInterval(i);
  }, []);

  const totalKm = ROADS.reduce((s, r) => s + r.distance, 0);
  const avgToll = Math.round(ROADS.reduce((s, r) => s + r.toll, 0) / ROADS.length);

  return (
    <AppLayout title="Dashboard">
      <section className="glass rounded-2xl p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-20 w-72 h-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">Delhi–Dehradun Expressway</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            <span className="text-gradient">Intelligence & Algorithm</span> Visualization Platform
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Step through classic graph and data-structure algorithms on a real corridor.
            Every animation runs entirely in your browser — no backend required.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Cities" value={CITIES.length} />
        <Stat label="Roads" value={ROADS.length} />
        <Stat label="Total km" value={totalKm} />
        <Stat label="Live traffic" value={traffic.toLocaleString()} pulse />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Network Map</h3>
          <GraphCanvas step={null} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Quick Stats</h3>
          <div className="glass rounded-2xl p-4 space-y-3 text-sm">
            <Row k="Avg toll" v={`₹${avgToll}`} />
            <Row k="Longest segment" v={`${Math.max(...ROADS.map((r) => r.distance))} km`} />
            <Row k="Shortest segment" v={`${Math.min(...ROADS.map((r) => r.distance))} km`} />
            <Row k="Total fuel est." v={`${ROADS.reduce((s, r) => s + r.fuel, 0).toFixed(1)} L`} />
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Algorithms</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {algos.map((a, i) => (
          <motion.div
            key={a.to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={a.to} className="group block glass rounded-2xl p-5 hover:scale-[1.02] transition-transform">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 glow-primary`}>
                <a.icon className="w-5 h-5 text-background" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{a.label}</h4>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, pulse }: { label: string; value: string | number; pulse?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${pulse ? "text-primary animate-pulse-glow" : ""}`}>{value}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono text-foreground">{v}</span>
    </div>
  );
}
