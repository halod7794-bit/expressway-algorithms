import { create } from "zustand";
import { AlgoResult, AlgoStep } from "@/features/algorithms/types";

interface VizState {
  result: AlgoResult | null;
  index: number;
  playing: boolean;
  speed: number; // ms per step
  setResult: (r: AlgoResult) => void;
  setIndex: (i: number) => void;
  next: () => void;
  prev: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (s: number) => void;
  reset: () => void;
  current: () => AlgoStep | null;
}

export const useVizStore = create<VizState>((set, get) => ({
  result: null,
  index: 0,
  playing: false,
  speed: 700,
  setResult: (r) => set({ result: r, index: 0, playing: false }),
  setIndex: (i) => {
    const r = get().result;
    if (!r) return;
    set({ index: Math.max(0, Math.min(r.steps.length - 1, i)) });
  },
  next: () => {
    const { result, index } = get();
    if (!result) return;
    if (index < result.steps.length - 1) set({ index: index + 1 });
    else set({ playing: false });
  },
  prev: () => {
    const { index } = get();
    if (index > 0) set({ index: index - 1 });
  },
  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  togglePlay: () => set({ playing: !get().playing }),
  setSpeed: (s) => set({ speed: s }),
  reset: () => set({ index: 0, playing: false }),
  current: () => {
    const { result, index } = get();
    return result?.steps[index] ?? null;
  },
}));
