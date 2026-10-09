import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductRail({ items }: { items: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  if (!items.length) return null;
  return (
    <div className="relative">
      <div ref={ref} className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:gap-4 sm:px-0">
        {items.map((p) => (
          <div key={p.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[18.5%] xl:w-[15.5%]">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
      <button aria-label="Previous" onClick={() => scroll(-1)} className="absolute -left-4 top-1/3 hidden h-11 w-11 place-items-center rounded-full border bg-background shadow-pop lg:grid">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button aria-label="Next" onClick={() => scroll(1)} className="absolute -right-4 top-1/3 hidden h-11 w-11 place-items-center rounded-full border bg-background shadow-pop lg:grid">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
