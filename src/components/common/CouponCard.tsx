import { Copy } from "lucide-react";
import type { Coupon } from "@/data/coupons";
import { copyCode } from "@/components/layout/OfferTicker";
import { inr } from "@/lib/pricing";
import { format } from "date-fns";

export const couponHeadline = (c: Coupon) => (c.type === "flat" ? `${inr(c.value)} OFF` : `${c.value}% OFF`);

export function CouponCard({ c }: { c: Coupon }) {
  return (
    <div className="flex w-[290px] shrink-0 snap-start overflow-hidden rounded-xl border border-premium/30 bg-neutral-900 text-white shadow-lg transition hover:-translate-y-1 hover:border-premium sm:w-[330px]">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-gold p-3 text-center text-neutral-950">
        <span className="text-2xl font-black leading-none">{c.type === "flat" ? `₹${c.value}` : `${c.value}%`}</span>
        <span className="eyebrow mt-1">OFF</span>
      </div>
      <div className="relative flex-1 border-l-2 border-dashed border-premium/50 p-4">
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-neutral-950" />
        <span className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full bg-neutral-950" />
        <p className="text-sm font-bold">{c.desc}</p>
        <p className="mt-1 text-xs text-white/60">
          Min. order {inr(c.minOrder)}{c.minQty ? ` · ${c.minQty}+ pcs` : ""}{c.maxDiscount ? ` · Max ${inr(c.maxDiscount)}` : ""}
        </p>
        <p className="text-xs text-white/60">Expires {format(new Date(c.expiry), "dd MMM yyyy")}</p>
        <button onClick={() => copyCode(c.code)} className="mt-3 flex h-10 w-full items-center justify-between rounded-md border border-dashed border-premium bg-premium/10 px-3 text-sm font-black tracking-widest text-premium transition hover:bg-premium/20">
          {c.code} <span className="flex items-center gap-1 text-xs"><Copy className="h-3.5 w-3.5" /> COPY</span>
        </button>
      </div>
    </div>
  );
}