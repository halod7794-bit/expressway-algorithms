import { useEffect, useRef } from "react";
import { useVizStore } from "@/store/useVizStore";

/** Drives auto-stepping using requestAnimationFrame for smooth, non-blocking playback. */
export function useAnimation() {
  const playing = useVizStore((s) => s.playing);
  const speed = useVizStore((s) => s.speed);
  const next = useVizStore((s) => s.next);
  const lastRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    lastRef.current = performance.now();
    const tick = (t: number) => {
      if (t - lastRef.current >= speed) {
        next();
        lastRef.current = t;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, speed, next]);
}
