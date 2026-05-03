# Delhi–Dehradun Expressway · Algorithm Visualization Platform

A frontend-only, production-grade visualizer for classic graph algorithms and probabilistic data structures, themed around the Delhi–Dehradun Expressway corridor.

## ✨ Features

- Interactive D3.js graph (zoom, pan, drag) of cities Delhi → Meerut → Muzaffarnagar → Roorkee → Dehradun
- Step-based animation engine with **Play / Pause / Step ± / Speed slider / Timeline scrub**
- Pseudocode panel with live line highlighting + human-readable explanation panel
- Algorithms: **Dijkstra**, **Kruskal MST**, **Bellman-Ford** (with negative cycle detection), **Fenwick Tree**, **Bloom Filter**, **Top-K Roads (heap)**
- Analytics dashboard with live Chart.js line + bar charts
- Premium dark glassmorphism UI with neon-blue / purple gradients (Tailwind + Framer Motion)
- Fully typed TypeScript, modular `features / components / hooks / store / pages`
- Zustand store + custom `useAnimation` hook (requestAnimationFrame, non-blocking)

## 🛠 Tech Stack

React 18 · Vite · TypeScript · Tailwind CSS · D3.js · Chart.js · Framer Motion · Zustand · React Router

## 🚀 Getting Started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## 🌐 Deploy on Netlify

Includes `netlify.toml` with SPA redirects. Connect the repo to Netlify and it deploys automatically — no extra config needed.

## 📁 Structure

```
src/
  components/      reusable UI (GraphCanvas, panels, layout)
  features/
    graph/         city + road data
    algorithms/    pure algorithm implementations returning steps
  hooks/           useAnimation
  store/           Zustand viz store
  pages/           Dashboard, Analytics, one page per algorithm
```
