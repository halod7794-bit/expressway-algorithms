import { useVizStore } from "@/store/useVizStore";
import { motion, AnimatePresence } from "framer-motion";

export function ExplanationPanel() {
  const step = useVizStore((s) => s.current());
  const index = useVizStore((s) => s.index);
  if (!step) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">Explanation</h3>
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-sm leading-relaxed text-foreground"
        >
          {step.explain}
        </motion.p>
      </AnimatePresence>
      {(step.cost !== undefined || step.iteration !== undefined) && (
        <div className="mt-3 flex gap-3 text-xs">
          {step.cost !== undefined && (
            <span className="px-2 py-1 rounded bg-success/10 text-success font-mono">
              cost: {step.cost}
            </span>
          )}
          {step.iteration !== undefined && (
            <span className="px-2 py-1 rounded bg-secondary/20 text-secondary font-mono">
              iter: {step.iteration}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
