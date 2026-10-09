import { useMemo } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { format } from "date-fns";
import type { Product } from "@/data/products";
import { formatCount } from "@/data/products";
import { seedReviews } from "@/data/reviews";
import { useReviews, useUI } from "@/store";
import { Stars } from "@/components/common/Reveal";

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
    <section id="reviews" className="mt-12">
      <h2 className="eyebrow mb-4 flex items-center gap-2">Ratings & Reviews <Star className="h-4 w-4" /></h2>
      <div className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="flex items-center gap-6 md:block">
          <div>
            <p className="text-5xl font-black">{p.rating}<span className="text-2xl text-rating"> ★</span></p>
            <p className="mt-1 text-sm text-muted-foreground">{formatCount(total)} verified buyers</p>
          </div>
          <div className="mt-4 flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((s, i) => (
              <div key={s} className="flex items-center gap-2 text-xs">
                <span className="w-6">{s} ★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full rounded-full ${s >= 4 ? "bg-rating" : s === 3 ? "bg-accent" : "bg-destructive"}`} style={{ width: `${(dist[i] / max) * 100}%` }} />
                </div>
                <span className="w-10 text-right text-muted-foreground">{formatCount(dist[i])}</span>
              </div>
            ))}
          </div>
        </div>
        <ul className="divide-y">
          {list.map((r) => (
            <li key={r.id} className="py-4 first:pt-0">
              <div className="flex items-center gap-2">
                <span className={`rounded-sm px-1.5 py-0.5 text-xs font-bold text-success-foreground ${r.rating >= 4 ? "bg-rating" : r.rating === 3 ? "bg-accent" : "bg-destructive"}`}>{r.rating} ★</span>
                <p className="text-sm font-black">{r.title}</p>
              </div>
              <p className="mt-2 text-sm">{r.text}</p>
              {r.photo && <img src={r.photo} alt="Customer upload" className="mt-2 h-24 w-24 rounded-sm object-cover" />}
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {r.userName} · {format(new Date(r.date), "dd MMM yyyy")}
                {r.verified && <span className="flex items-center gap-1 font-bold text-success"><BadgeCheck className="h-3.5 w-3.5" /> Verified Buyer</span>}
                {!r.id.startsWith("seed") && <Stars value={r.rating} size={12} />}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
