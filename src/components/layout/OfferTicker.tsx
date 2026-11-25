import { activeCoupons } from "@/data/coupons";
import { toast } from "sonner";
import { Tag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function copyCode(code: string) {
  navigator.clipboard?.writeText(code).catch(() => {});
  toast.success(`Coupon ${code} copied!`, { description: "Apply it in your bag at checkout." });
}


export function OfferTicker({ thin = false }: { thin?: boolean }) {
  const list = activeCoupons();
  const items = [...list, ...list];
  return (
    <div
      className={cn(
        "marquee relative border-b border-premium/30 bg-linear-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white",
        thin ? "h-7 text-[11px]" : "h-10 text-xs sm:text-sm",
      )}
      style={{ ["--marquee-speed" as string]: thin ? "28s" : "40s" }}
      aria-label="Current offers"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-neutral-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-neutral-950 to-transparent" />
      <div className="marquee-track items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {items.map((c, i) => (
              <button
                key={dup + c.code + i}
                onClick={() => copyCode(c.code)}
                className="group flex items-center gap-2 whitespace-nowrap px-5"
              >
                <Tag className="h-3.5 w-3.5 text-premium" />
                <span className="rounded-sm border border-premium/60 bg-premium/10 px-2 py-0.5 font-extrabold tracking-widest text-premium">{c.code}</span>
                <span className="text-white/80 transition-colors group-hover:text-white">{c.desc}</span>
                <Sparkles className="ml-5 h-3 w-3 text-premium/50" />
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}