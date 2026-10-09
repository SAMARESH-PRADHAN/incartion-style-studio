import { useMemo, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export function searchProducts(q: string) {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return products.filter((p) =>
    [p.name, p.material, p.category, p.subCategory, ...p.tags].join(" ").toLowerCase().includes(t),
  );
}

export function SearchBox({ autoFocus, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const navigate = useNavigate();
  const results = useMemo(() => searchProducts(q).slice(0, 6), [q]);
  const cats = useMemo(
    () => (q.trim() ? categories.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase())) : []),
    [q],
  );
  const go = () => {
    if (!q.trim()) return;
    navigate({ to: "/search", search: { q: q.trim() } });
    setFocus(false);
    onDone?.();
  };
  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex h-10 items-center gap-2 rounded-sm bg-secondary px-3 focus-within:bg-background focus-within:ring-1 focus-within:ring-border"
      >
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 150)}
          placeholder="Search for scrubs, blazers, polo…"
          aria-label="Search products"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </form>
      {focus && (results.length > 0 || cats.length > 0) && (
        <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-sm border bg-popover shadow-pop">
          {cats.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ category: c.slug }}
              onClick={onDone}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary"
            >
              <span className="eyebrow text-primary">Category</span> {c.name}
            </Link>
          ))}
          {results.map((p) => (
            <Link
              key={p.id}
              to="/product/$slug"
              params={{ slug: p.slug }}
              onClick={onDone}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary"
            >
              <img src={p.images[0]} alt="" className="h-10 w-8 rounded-sm object-cover" />
              <span className="min-w-0 flex-1 truncate">{p.name}</span>
            </Link>
          ))}
          <button onMouseDown={go} className="w-full border-t px-4 py-2 text-left text-sm font-bold text-primary hover:bg-secondary">
            See all results for "{q}"
          </button>
        </div>
      )}
    </div>
  );
}
