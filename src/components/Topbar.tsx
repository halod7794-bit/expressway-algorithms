import { motion } from "framer-motion";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="glass-strong border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_hsl(142_76%_50%)]"
        />
        Connected · Local engine
      </div>
    </header>
  );
}
