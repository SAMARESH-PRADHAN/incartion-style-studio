import { useMemo } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { format } from "date-fns";
import type { Product } from "@/data/products";
import { formatCount } from "@/data/products";
import { seedReviews } from "@/data/reviews";
import { useReviews, useUI } from "@/store";
import { Stars, SectionTitle } from "@/components/common/Reveal";
import { motion } from "framer-motion";

export function Reviews({ p }: { p: Product }) {
  const hydrated = useUI((s) => s.hydrated);
  const user = useReviews((s) => s.list);
  const list = useMemo(
    () => [...(hydrated ? user.filter((r) => r.productId === p.id) : []), ...seedReviews(p.id)],
    [user, hydrated, p.id],
  );
  const total = p.ratingCount + list.length;
  // Synthesised distribution from the product's average, plus actual submitted reviews
  const dist = useMemo(() => {
    const base = [5, 4, 3, 2, 1].map((s) => Math.max(0.02, 1 - Math.abs(s - p.rating) / 2.2));
    const sum = base.reduce((a, b) => a + b, 0);
    return [5, 4, 3, 2, 1].map((s, i) => Math.round((base[i] / sum) * p.ratingCount) + list.filter((r) => r.rating === s).length);
  }, [p, list]);
  const max = Math.max(...dist);
  
  return (
  <section id="reviews" className="mt-14">
    <SectionTitle eyebrow="Customer voice" title="Ratings & reviews" />
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <div className="h-fit rounded-xl border border-t-2 border-t-premium bg-card p-6 shadow-card md:sticky md:top-[96px]">
        <div className="flex items-end gap-3">
          <p className="text-5xl font-black leading-none">{p.rating}</p>
          <div className="pb-1">
            <Stars value={p.rating} size={18} />
            <p className="mt-1 text-xs text-muted-foreground">{formatCount(total)} verified buyers</p>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {[5, 4, 3, 2, 1].map((s, i) => (
            <div key={s} className="flex items-center gap-2 text-xs">
              <span className="w-6 font-bold">{s} ★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className={`h-full rounded-full ${s >= 4 ? "bg-emerald-500" : s === 3 ? "bg-amber-400" : "bg-red-500"}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(dist[i] / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground">{formatCount(dist[i])}</span>
            </div>
          ))}
        </div>
      </div>
      <ul className="space-y-3">
        {list.map((r, k) => (
          <motion.li
            key={r.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: Math.min(k, 4) * 0.06 }}
            className="rounded-xl border bg-card p-4 transition-all duration-300 hover:border-premium/40 hover:shadow-card"
          >
            <div className="flex items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold text-white ${r.rating >= 4 ? "bg-emerald-600" : r.rating === 3 ? "bg-amber-500" : "bg-red-500"}`}>{r.rating} ★</span>
              <p className="text-sm font-black">{r.title}</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            {r.photo && <img src={r.photo} alt="Customer upload" className="mt-3 h-24 w-24 rounded-lg border object-cover" />}
            <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-neutral-950 text-[10px] font-black text-premium">{r.userName[0]}</span>
              {r.userName} · {format(new Date(r.date), "dd MMM yyyy")}
              {r.verified && <span className="flex items-center gap-1 font-bold text-emerald-600"><BadgeCheck className="h-3.5 w-3.5" /> Verified Buyer</span>}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  </section>
);
}
