import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, ArrowUpDown, X, SearchX } from "lucide-react";
import { products } from "@/data/products";
import { categories, getCategory, getSubName } from "@/data/categories";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { FilterSidebar, PRICE_MAX, PRICE_MIN, type Filters } from "@/components/product/FilterSidebar";
import { filterProducts, SORTS } from "@/lib/filter";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/common/Reveal";
import { cn } from "@/lib/utils";

type Search = { category?: string; sub?: string; material?: string; min?: number; max?: number; sort?: string };
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
const num = (v: unknown) => (v === undefined || v === "" || isNaN(Number(v)) ? undefined : Number(v));

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: str(s.category),
    sub: str(s.sub),
    material: str(s.material),
    min: num(s.min),
    max: num(s.max),
    sort: str(s.sort),
  }),
  head: () => ({
    meta: [
      { title: "Shop Uniforms & Garments — Incartion" },
      { name: "description", content: "Browse 80+ uniforms: scrubs, chef coats, blazers, dungarees, school uniforms and T-shirts. Filter by category, price and material." },
      { property: "og:title", content: "Shop Uniforms & Garments — Incartion" },
      { property: "og:description", content: "Filter by category, sub-category, price and fabric. Bulk pricing on every product." },
    ],
  }),
  component: ProductsPage,
});

const split = (s?: string) => (s ? s.split(",").filter(Boolean) : []);
const PAGE = 12;

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const f: Filters = {
    cats: split(search.category),
    subs: split(search.sub),
    mats: split(search.material),
    min: search.min ?? PRICE_MIN,
    max: search.max ?? PRICE_MAX,
  };
  const sort = search.sort ?? "recommended";
  const update = (p: Partial<Filters> & { sort?: string }) => {
    const n = { ...f, ...p };
    navigate({
      search: {
        category: n.cats.join(",") || undefined,
        sub: n.subs.join(",") || undefined,
        material: n.mats.join(",") || undefined,
        min: n.min > PRICE_MIN ? n.min : undefined,
        max: n.max < PRICE_MAX ? n.max : undefined,
        sort: (p.sort ?? sort) === "recommended" ? undefined : (p.sort ?? sort),
      },
      replace: true,
      resetScroll: false,
    });
  };
  const results = useMemo(() => filterProducts(products, { ...f, sort }), [search]);
  const [shown, setShown] = useState(PAGE);
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setShown(PAGE);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 240);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) setShown((s) => Math.min(s + PAGE, results.length));
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [results.length, loading]);

  const single = f.cats.length === 1 ? getCategory(f.cats[0]) : undefined;
  const title = single ? (f.subs.length === 1 ? `${single.name} ${getSubName(single.slug, f.subs[0])}` : single.name) : "All Products";
  const chips = [
    ...f.cats.map((c) => ({ k: "cat" + c, l: getCategory(c)?.name ?? c, rm: () => update({ cats: f.cats.filter((x) => x !== c) }) })),
    ...f.subs.map((s) => ({ k: "sub" + s, l: categories.flatMap((c) => c.subs).find((x) => x.slug === s)?.name ?? s, rm: () => update({ subs: f.subs.filter((x) => x !== s) }) })),
    ...f.mats.map((m) => ({ k: "mat" + m, l: m, rm: () => update({ mats: f.mats.filter((x) => x !== m) }) })),
    ...(f.min > PRICE_MIN || f.max < PRICE_MAX ? [{ k: "price", l: `₹${f.min} – ₹${f.max}`, rm: () => update({ min: PRICE_MIN, max: PRICE_MAX }) }] : []),
  ];
  const clearAll = () => navigate({ search: {}, replace: true });

  return (
    <div>
      <div className={cn("sticky top-14 z-30 border-b bg-background/95 backdrop-blur transition-all lg:top-16", scrolled ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0 h-0 overflow-hidden border-0")}>
        <div className="no-scrollbar mx-auto flex max-w-[1536px] gap-2 overflow-x-auto px-3 py-2 sm:px-6">
          {(single ? single.subs.map((s) => ({ slug: s.slug, name: s.name, isSub: true })) : categories.map((c) => ({ slug: c.slug, name: c.name, isSub: false }))).map((x) => {
            const on = x.isSub ? f.subs.includes(x.slug) : f.cats.includes(x.slug);
            return (
              <button
                key={x.slug}
                onClick={() => (x.isSub ? update({ subs: on ? f.subs.filter((s) => s !== x.slug) : [x.slug] }) : update({ cats: [x.slug], subs: [] }))}
                className={cn("shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold uppercase", on ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}
              >
                {x.name}
              </button>
            );
          })}
        </div>
      </div>

      <Container className="py-4 sm:py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link> / <Link to="/products" className="hover:text-foreground">Products</Link>
          {single && <> / <span className="font-bold text-foreground">{single.name}</span></>}
        </nav>
        <div className="mt-2 flex items-center justify-between gap-4">
          <h1 className="min-w-0 truncate text-lg font-black sm:text-xl">
            {title} <span className="font-normal text-muted-foreground">- {results.length} items</span>
          </h1>
          <label className="hidden items-center gap-2 rounded-sm border px-3 text-sm lg:flex">
            <span className="text-muted-foreground">Sort by:</span>
            <select value={sort} onChange={(e) => update({ sort: e.target.value })} className="h-10 bg-transparent font-bold outline-none">
              {SORTS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 flex gap-8">
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-32">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-black uppercase">Filters</p>
                {chips.length > 0 && <button onClick={clearAll} className="text-xs font-bold text-primary">CLEAR ALL</button>}
              </div>
              <FilterSidebar f={f} onChange={update} />
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            {chips.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button key={c.k} onClick={c.rm} className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold hover:border-foreground">
                    {c.l} <X className="h-3 w-3" />
                  </button>
                ))}
                <button onClick={clearAll} className="px-2 text-xs font-bold text-primary">Clear all</button>
              </div>
            )}
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <SearchX className="h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-black">No products match these filters</p>
                <p className="mt-1 text-sm text-muted-foreground">Try removing a filter or widening the price range.</p>
                <Button className="mt-6" onClick={clearAll}>Clear all filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {results.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} />)}
                </div>
                {shown < results.length && (
                  <div ref={sentinel} className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>

      <div className="fixed inset-x-0 bottom-[52px] z-30 grid grid-cols-2 border-t bg-background lg:hidden">
        <button onClick={() => setSheet("sort")} className="flex h-12 items-center justify-center gap-2 border-r text-sm font-bold uppercase"><ArrowUpDown className="h-4 w-4" /> Sort</button>
        <button onClick={() => setSheet("filter")} className="flex h-12 items-center justify-center gap-2 text-sm font-bold uppercase">
          <SlidersHorizontal className="h-4 w-4" /> Filter {chips.length > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{chips.length}</span>}
        </button>
      </div>
      <Sheet open={!!sheet} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-xl p-0">
          <SheetHeader className="sticky top-0 border-b bg-background p-4">
            <SheetTitle className="eyebrow text-left">{sheet === "sort" ? "Sort by" : "Filters"}</SheetTitle>
          </SheetHeader>
          {sheet === "sort" ? (
            <div className="p-2 pb-6">
              {SORTS.map((s) => (
                <button key={s.v} onClick={() => { update({ sort: s.v }); setSheet(null); }} className={cn("flex h-12 w-full items-center px-4 text-left text-sm", sort === s.v && "font-black text-primary")}>
                  {s.l}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="p-4"><FilterSidebar f={f} onChange={update} /></div>
              <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t bg-background p-3">
                <Button variant="outline" onClick={clearAll}>Clear all</Button>
                <Button onClick={() => setSheet(null)}>Show {results.length} items</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
