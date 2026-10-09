import { Copy } from "lucide-react";
import type { Coupon } from "@/data/coupons";
import { copyCode } from "@/components/layout/OfferTicker";
import { inr } from "@/lib/pricing";
import { format } from "date-fns";

export const couponHeadline = (c: Coupon) => (c.type === "flat" ? `${inr(c.value)} OFF` : `${c.value}% OFF`);

export function CouponCard({ c }: { c: Coupon }) {
  return (
    <div className="flex w-[280px] shrink-0 snap-start overflow-hidden rounded-md border bg-card shadow-card sm:w-[320px]">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-brand p-3 text-center text-primary-foreground">
        <span className="text-2xl font-black leading-none">{c.type === "flat" ? `₹${c.value}` : `${c.value}%`}</span>
        <span className="eyebrow mt-1">OFF</span>
      </div>
      <div className="relative flex-1 border-l-2 border-dashed p-4">
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-background" />
        <span className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full bg-background" />
        <p className="text-sm font-bold">{c.desc}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Min. order {inr(c.minOrder)}{c.minQty ? ` · ${c.minQty}+ pcs` : ""}{c.maxDiscount ? ` · Max ${inr(c.maxDiscount)}` : ""}
        </p>
        <p className="text-xs text-muted-foreground">Expires {format(new Date(c.expiry), "dd MMM yyyy")}</p>
        <button onClick={() => copyCode(c.code)} className="mt-3 flex h-10 w-full items-center justify-between rounded-sm border border-dashed border-primary bg-primary/5 px-3 text-sm font-black tracking-widest text-primary">
          {c.code} <span className="flex items-center gap-1 text-xs"><Copy className="h-3.5 w-3.5" /> COPY</span>
        </button>
      </div>
    </div>
  );
}
