import { Link } from "@tanstack/react-router";
import { Eye, Heart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { formatCount } from "@/data/products";
import { useUI, useWishlist } from "@/store";
import { inr } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function Price({ p, size = "sm" }: { p: Pick<Product, "price" | "mrp" | "discountPercent">; size?: "sm" | "lg" }) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2", size === "lg" ? "text-2xl" : "text-sm")}>
      <span className="font-black">{inr(p.price)}</span>
      <span className={cn("text-muted-foreground line-through", size === "lg" ? "text-lg" : "text-xs")}>{inr(p.mrp)}</span>
      <span className={cn("font-bold text-accent", size === "lg" ? "text-lg" : "text-xs")}>({p.discountPercent}% OFF)</span>
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const hydrated = useUI((s) => s.hydrated);
  const wished = useWishlist((s) => s.ids.includes(p.id));
  const toggle = useWishlist((s) => s.toggle);
  const setUI = useUI((s) => s.set);
  const on = hydrated && wished;
  return (
    <article className="group relative overflow-hidden rounded-sm bg-card transition-shadow hover:shadow-card">
      <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:opacity-0" />
          <img src={p.images[1]} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100" />
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-sm bg-background/90 px-1.5 py-0.5 text-[11px] font-bold">
            {p.rating} <span className="text-rating">★</span> <span className="text-muted-foreground">| {formatCount(p.ratingCount)}</span>
          </span>
          {(p.isNew || p.isBestSeller) && (
            <span className={cn("absolute left-0 top-2 rounded-r-sm px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary-foreground", p.isNew ? "bg-success" : "bg-primary")}>
              {p.isNew ? "New" : "Bestseller"}
            </span>
          )}
        </div>
        <div className="px-2.5 pb-3 pt-2">
          <p className="truncate text-sm font-black">INCARTION</p>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">{p.name}</p>
          <div className="mt-1"><Price p={p} /></div>
        </div>
      </Link>
      <button
        aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={on}
        onClick={() => {
          const added = toggle(p.id);
          toast(added ? "Added to wishlist" : "Removed from wishlist");
        }}
        className={cn(
          "absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow-card transition lg:opacity-0 lg:group-hover:opacity-100",
          on && "lg:opacity-100",
        )}
      >
        <Heart className={cn("h-4 w-4", on ? "fill-primary text-primary" : "")} />
      </button>
      <button
        onClick={() => setUI({ quickViewId: p.id })}
        className="absolute inset-x-2 hidden translate-y-2 items-center justify-center gap-2 rounded-sm bg-background/95 py-2 text-xs font-bold uppercase opacity-0 shadow-card transition group-hover:translate-y-0 group-hover:opacity-100 lg:flex"
        style={{ top: "auto", bottom: "88px" }}
      >
        <Eye className="h-4 w-4" /> Quick view
      </button>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="skeleton aspect-[3/4] rounded-sm" />
      <div className="skeleton mt-2 h-4 w-1/2 rounded-sm" />
      <div className="skeleton mt-1.5 h-3 w-3/4 rounded-sm" />
      <div className="skeleton mt-1.5 h-4 w-2/3 rounded-sm" />
    </div>
  );
}
