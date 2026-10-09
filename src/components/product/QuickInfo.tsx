import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatCount } from "@/data/products";
import { Price } from "./ProductCard";
import { Button } from "@/components/ui/button";

export function ProductInfoQuick({ p, onClose }: { p: Product; onClose: () => void }) {
  return (
    <div className="grid md:grid-cols-2">
      <div className="grid grid-cols-2 gap-1 bg-muted p-1">
        {p.images.map((src, i) => (
          <img key={i} src={src} alt={`${p.name} view ${i + 1}`} className="aspect-[3/4] w-full rounded-sm object-cover" />
        ))}
      </div>
      <div className="flex flex-col p-6">
        <p className="eyebrow text-primary">{p.category} · {p.subCategory.replace("-", " ")}</p>
        <h3 className="mt-1 text-xl font-black">{p.name}</h3>
        <p className="mt-2 inline-flex w-fit items-center gap-1 rounded-sm border px-2 py-0.5 text-sm font-bold">
          {p.rating} <span className="text-rating">★</span> <span className="text-muted-foreground">| {formatCount(p.ratingCount)} ratings</span>
        </p>
        <div className="mt-4"><Price p={p} size="lg" /></div>
        <p className="text-xs font-bold text-success">inclusive of all taxes · Bulk from {p.bulkPricing[3].price} / pc</p>
        <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto pt-6">
          <Button asChild className="w-full" onClick={onClose}>
            <Link to="/product/$slug" params={{ slug: p.slug }}>Select sizes & quantity</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
