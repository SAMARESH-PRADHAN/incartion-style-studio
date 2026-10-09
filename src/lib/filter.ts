import { categories } from "@/data/categories";
import type { Product } from "@/data/products";

export const SORTS = [
  { v: "recommended", l: "Recommended" },
  { v: "price_asc", l: "Price: Low to High" },
  { v: "price_desc", l: "Price: High to Low" },
  { v: "rating", l: "Customer Rating" },
  { v: "newest", l: "What's New" },
  { v: "discount", l: "Better Discount" },
] as const;

export function filterProducts(
  list: Product[],
  f: { cats: string[]; subs: string[]; mats: string[]; min: number; max: number; sort: string },
) {
  let out = list.filter((p) => {
    if (f.cats.length && !f.cats.includes(p.category)) return false;
    if (f.subs.length) {
      const cat = categories.find((c) => c.slug === p.category)!;
      const relevant = f.subs.filter((s) => cat.subs.some((x) => x.slug === s));
      // when no categories are chosen, sub filters apply globally
      if (f.cats.length ? relevant.length && !relevant.includes(p.subCategory) : !f.subs.includes(p.subCategory)) return false;
    }
    if (f.mats.length && !f.mats.includes(p.material)) return false;
    return p.price >= f.min && p.price <= f.max;
  });
  const by: Record<string, (a: Product, b: Product) => number> = {
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    newest: (a, b) => b.createdAt - a.createdAt,
    discount: (a, b) => b.discountPercent - a.discountPercent,
    recommended: (a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.ratingCount - a.ratingCount,
  };
  out = [...out].sort(by[f.sort] ?? by.recommended);
  return out;
}
