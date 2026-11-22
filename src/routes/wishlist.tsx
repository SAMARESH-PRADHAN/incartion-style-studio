import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, X } from "lucide-react";
import { Container } from "@/components/common/Reveal";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { getProductById, type Product } from "@/data/products";
import { useUI, useWishlist } from "@/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Incartion" },
      { name: "description", content: "Uniforms and garments you saved for later." },
      { property: "og:title", content: "My Wishlist — Incartion" },
      { property: "og:description", content: "Your saved Incartion products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const hydrated = useUI((s) => s.hydrated);
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const items = ids.map(getProductById).filter(Boolean) as Product[];
  return (
    <Container className="py-6">
      <h1 className="mb-5 text-xl font-black">My Wishlist {hydrated && <span className="font-normal text-muted-foreground">{items.length} items</span>}</h1>
      {!hydrated ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart className="h-20 w-20 text-primary/30" />
          <p className="mt-4 text-xl font-black">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
          <Button asChild className="mt-6"><Link to="/products">Continue shopping</Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {items.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard p={p} />
              <button aria-label="Remove" onClick={() => remove(p.id)} className="absolute left-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/90 shadow-card"><X className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
