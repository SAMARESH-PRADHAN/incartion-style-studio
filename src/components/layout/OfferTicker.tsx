import { activeCoupons } from "@/data/coupons";
import { toast } from "sonner";
import { Tag } from "lucide-react";
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
      className={cn("marquee bg-foreground text-background", thin ? "h-7 text-[11px]" : "h-9 text-xs sm:text-sm")}
      style={{ ["--marquee-speed" as string]: thin ? "28s" : "40s" }}
      aria-label="Current offers"
    >
      <div className="marquee-track items-center">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {items.map((c, i) => (
              <button
                key={dup + c.code + i}
                onClick={() => copyCode(c.code)}
                className="flex items-center gap-2 whitespace-nowrap px-6 hover:text-primary"
              >
                <Tag className="h-3.5 w-3.5 text-accent" />
                Use <span className="font-extrabold tracking-wider text-primary">{c.code}</span> – {c.desc}
                <span className="pl-6 opacity-40">|</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
