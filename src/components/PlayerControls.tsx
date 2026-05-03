import { useVizStore } from "@/store/useVizStore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { useAnimation } from "@/hooks/useAnimation";

export function PlayerControls() {
  useAnimation();
  const { playing, togglePlay, next, prev, reset, speed, setSpeed, result, index, setIndex } = useVizStore();
  const total = result?.steps.length ?? 0;

  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={reset} title="Restart"><RotateCcw className="w-4 h-4" /></Button>
        <Button size="icon" variant="ghost" onClick={prev} title="Step back"><SkipBack className="w-4 h-4" /></Button>
        <Button size="icon" onClick={togglePlay} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary" title="Play/Pause">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button size="icon" variant="ghost" onClick={next} title="Step forward"><SkipForward className="w-4 h-4" /></Button>
        <div className="ml-auto font-mono text-sm text-muted-foreground">
          Step <span className="text-primary">{Math.min(index + 1, total)}</span> / {total}
        </div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1">Timeline</div>
        <Slider value={[index]} max={Math.max(0, total - 1)} step={1} onValueChange={(v) => setIndex(v[0])} />
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-1">Speed: {(1000 / speed).toFixed(1)} steps/sec</div>
        <Slider value={[1100 - speed]} min={100} max={1050} step={50} onValueChange={(v) => setSpeed(1100 - v[0])} />
      </div>
    </div>
  );
}
