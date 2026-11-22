import { createFileRoute } from "@tanstack/react-router";
import { searchProducts } from "@/components/layout/SearchBox";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s.q === "string" ? s.q : "" }),
  head: () => ({ meta: [{ title: "Search — Incartion" }, { name: "description", content: "Search Incartion uniforms and garments." }, { property: "og:title", content: "Search — Incartion" }, { property: "og:description", content: "Search Incartion uniforms and garments." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const r = searchProducts(q);
  return (
    <div className="mx-auto max-w-[1536px] px-3 py-6 sm:px-6">
      <h1 className="text-lg font-black">Results for "{q}" <span className="font-normal text-muted-foreground">- {r.length} items</span></h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">{r.map((p) => <ProductCard key={p.id} p={p} />)}</div>
    </div>
  );
}
