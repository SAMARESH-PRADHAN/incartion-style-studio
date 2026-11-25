import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { categories, type Category } from "@/data/categories";
import { cn } from "@/lib/utils";

function TiltCard({ c, open, onToggle }: { c: Category; open: boolean; onToggle: () => void }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div className="[perspective:1000px]">
      <div
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
        }}
        onMouseLeave={() => setT({ x: 0, y: 0 })}
        className="group preserve-3d premium-lift relative aspect-[4/5] overflow-hidden rounded-sm shadow-card transition-transform duration-200 ease-out sm:aspect-[4/3] border border-transparent hover:border-premium/70"
        style={{ transform: `rotateY(${t.x * 12}deg) rotateX(${-t.y * 12}deg)` }}
      >
        <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
        <span className="absolute inset-x-0 bottom-0 z-10 h-1 origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
        <div className="pointer-events-none absolute inset-0 bg-shade" />
        <div className="pointer-events-none absolute inset-0 bg-foreground/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <button onClick={onToggle} aria-expanded={open} className="absolute inset-0 flex flex-col justify-end p-3 text-left text-primary-foreground sm:p-5" style={{ transform: "translateZ(40px)" }}>
          <span className="mb-2 block h-0.5 w-8 bg-gold transition-all duration-500 group-hover:w-14" />
<span className="text-base font-black uppercase leading-tight sm:text-2xl">{c.name}</span>
<span className="mt-1 hidden text-sm opacity-90 sm:block">{c.tagline}</span>
<span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-premium">
  {c.subs.length} styles <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
</span>
        </button>
      </div>
    </div>
  );
}

export function CategoryGrid() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2 items-start gap-3 sm:gap-5 lg:grid-cols-3">
      {categories.map((c) => {
        const expanded = open === c.slug;
        return (
          <div key={c.slug} className="min-w-0">
            <TiltCard c={c} open={expanded} onToggle={() => setOpen(expanded ? null : c.slug)} />
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key={c.slug}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 border-t border-border/80 pt-3">
                    <Link to="/products" search={{ category: c.slug }} className="mb-2 flex items-center gap-1 text-xs font-bold text-premium">
                      View all {c.name} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {c.subs.map((s) => (
                        <Link
                          key={s.slug}
                          to="/products"
                          search={{ category: c.slug, sub: s.slug }}
                          className="rounded-full border border-border/70 bg-secondary px-3 py-2 text-xs font-bold transition-colors hover:border-premium hover:bg-neutral-950 hover:text-premium"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

