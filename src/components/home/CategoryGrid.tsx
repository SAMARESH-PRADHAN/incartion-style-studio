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
        className="preserve-3d relative aspect-[4/5] overflow-hidden rounded-md shadow-card transition-transform duration-200 ease-out sm:aspect-[4/3]"
        style={{ transform: `rotateY(${t.x * 12}deg) rotateX(${-t.y * 12}deg)` }}
      >
        <img src={c.image} alt={c.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
        <div className="pointer-events-none absolute inset-0 bg-shade" />
        <button onClick={onToggle} aria-expanded={open} className="absolute inset-0 flex flex-col justify-end p-3 text-left text-primary-foreground sm:p-5" style={{ transform: "translateZ(40px)" }}>
          <span className="text-base font-black uppercase leading-tight sm:text-2xl">{c.name}</span>
          <span className="mt-1 hidden text-sm opacity-90 sm:block">{c.tagline}</span>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-accent">
            {c.subs.length} styles <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
          </span>
        </button>
      </div>
    </div>
  );
}

export function CategoryGrid() {
  const [open, setOpen] = useState<string | null>(null);
  const active = categories.find((c) => c.slug === open);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {categories.map((c) => (
          <TiltCard key={c.slug} c={c} open={open === c.slug} onToggle={() => setOpen(open === c.slug ? null : c.slug)} />
        ))}
      </div>
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-md border bg-secondary p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="eyebrow text-primary">Pick a style in {active.name}</p>
                <Link to="/products" search={{ category: active.slug }} className="flex items-center gap-1 text-sm font-bold">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {active.subs.map((s) => (
                  <Link
                    key={s.slug}
                    to="/products"
                    search={{ category: active.slug, sub: s.slug }}
                    className="rounded-full border bg-background px-5 py-2.5 text-sm font-bold transition hover:border-primary hover:text-primary"
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
}
