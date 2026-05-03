import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Route, Network, AlertTriangle, Binary, Database, BarChart3, Activity } from "lucide-react";

const sections = [
  {
    title: "Overview",
    items: [
      { to: "/",         label: "Dashboard",  icon: LayoutDashboard },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Algorithms",
    items: [
      { to: "/dijkstra",     label: "Dijkstra",      icon: Route },
      { to: "/kruskal",      label: "Kruskal MST",   icon: Network },
      { to: "/bellman-ford", label: "Bellman-Ford",  icon: AlertTriangle },
      { to: "/fenwick",      label: "Fenwick Tree",  icon: Binary },
      { to: "/bloom",        label: "Bloom Filter",  icon: Database },
      { to: "/topk",         label: "Top-K Roads",   icon: Activity },
    ],
  },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-strong border-r border-border min-h-screen p-5 gap-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary glow-primary" />
          <div>
            <h1 className="text-sm font-bold tracking-tight">DDE Intel</h1>
            <p className="text-[10px] text-muted-foreground">Algorithm Visualizer</p>
          </div>
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec.title}>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{sec.title}</div>
          <nav className="space-y-1">
            {sec.items.map((item) => {
              const active = pathname === item.to;
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className="block">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r" />}
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </motion.div>
                </NavLink>
              );
            })}
          </nav>
        </div>
      ))}

      <div className="mt-auto text-[10px] text-muted-foreground">
        © 2026 DDE Intel · Frontend-only
      </div>
    </aside>
  );
}
