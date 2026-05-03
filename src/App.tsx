import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import DijkstraPage from "./pages/DijkstraPage";
import KruskalPage from "./pages/KruskalPage";
import BellmanFordPage from "./pages/BellmanFordPage";
import FenwickPage from "./pages/FenwickPage";
import BloomPage from "./pages/BloomPage";
import TopKPage from "./pages/TopKPage";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/dijkstra" element={<DijkstraPage />} />
          <Route path="/kruskal" element={<KruskalPage />} />
          <Route path="/bellman-ford" element={<BellmanFordPage />} />
          <Route path="/fenwick" element={<FenwickPage />} />
          <Route path="/bloom" element={<BloomPage />} />
          <Route path="/topk" element={<TopKPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
