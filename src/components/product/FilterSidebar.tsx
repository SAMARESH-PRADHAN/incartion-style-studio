import { categories } from "@/data/categories";
import { MATERIALS } from "@/data/products";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

export const PRICE_MIN = 0;
export const PRICE_MAX = 4000;

export type Filters = { cats: string[]; subs: string[]; mats: string[]; min: number; max: number };

export function FilterSidebar({ f, onChange }: { f: Filters; onChange: (p: Partial<Filters>) => void }) {
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  return (
    <div className="divide-y">
      <section className="pb-5">
        <p className="eyebrow mb-3">Categories</p>
        <ul className="space-y-1">
          {categories.map((c) => {
            const on = f.cats.includes(c.slug);
            return (
              <li key={c.slug}>
                <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
                  <Checkbox
                    checked={on}
                    onCheckedChange={() => {
                      const cats = toggle(f.cats, c.slug);
                      const subs = on ? f.subs.filter((s) => !c.subs.some((x) => x.slug === s) || cats.some((cc) => categories.find((k) => k.slug === cc)?.subs.some((x) => x.slug === s))) : f.subs;
                      onChange({ cats, subs });
                    }}
                  />
                  <span className={on ? "font-bold" : ""}>{c.name}</span>
                </label>
                {on && (
                  <ul className="mb-2 ml-7 space-y-0.5 border-l pl-3">
                    {c.subs.map((s) => (
                      <li key={s.slug}>
                        <label className="flex min-h-8 cursor-pointer items-center gap-2.5 text-sm text-muted-foreground">
                          <Checkbox checked={f.subs.includes(s.slug)} onCheckedChange={() => onChange({ subs: toggle(f.subs, s.slug) })} />
                          <span className={f.subs.includes(s.slug) ? "font-bold text-foreground" : ""}>{s.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <section className="py-5">
        <p className="eyebrow mb-4">Price</p>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={[f.min, f.max]}
          onValueChange={([min, max]) => onChange({ min, max })}
          aria-label="Price range"
        />
        <div className="mt-4 flex items-center gap-2">
          <Input aria-label="Min price" inputMode="numeric" value={f.min} onChange={(e) => onChange({ min: Math.min(Number(e.target.value.replace(/\D/g, "")) || 0, f.max) })} className="h-10" />
          <span className="text-muted-foreground">–</span>
          <Input aria-label="Max price" inputMode="numeric" value={f.max} onChange={(e) => onChange({ max: Number(e.target.value.replace(/\D/g, "")) || PRICE_MAX })} className="h-10" />
        </div>
      </section>
      <section className="py-5">
        <p className="eyebrow mb-3">Material</p>
        <ul className="space-y-1">
          {MATERIALS.map((m) => (
            <li key={m}>
              <label className="flex min-h-9 cursor-pointer items-center gap-3 text-sm">
                <Checkbox checked={f.mats.includes(m)} onCheckedChange={() => onChange({ mats: toggle(f.mats, m) })} />
                <span className={f.mats.includes(m) ? "font-bold" : ""}>{m}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
