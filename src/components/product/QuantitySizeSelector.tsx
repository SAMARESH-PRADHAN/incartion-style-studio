import { Minus, Plus } from "lucide-react";
import { SIZES, totalQty, type Size, type SizeQty } from "@/lib/pricing";

export function QuantitySizeSelector({ value, onChange, compact }: { value: SizeQty; onChange: (v: SizeQty) => void; compact?: boolean }) {
  const set = (s: Size, n: number) => onChange({ ...value, [s]: Math.max(0, Math.min(9999, Math.floor(n) || 0)) });
  return (
    <div>
      <div className={compact ? "grid grid-cols-2 gap-2 sm:grid-cols-4" : "grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4"}>
        {SIZES.map((s) => {
          const q = value[s] || 0;
          return (
            <div key={s} className={`flex items-center justify-between rounded-sm border p-1.5 transition ${q ? "border-premium bg-premium/5 shadow-sm" : "hover:border-premium/40"}`}>
              <span className={`w-10 text-center text-sm font-black ${q ? "text-premium" : ""}`}>{s}</span>
              <div className="flex items-center">
                <button type="button" aria-label={`Decrease ${s}`} onClick={() => set(s, q - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary disabled:opacity-30" disabled={!q}>
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  aria-label={`Quantity for size ${s}`}
                  inputMode="numeric"
                  value={q}
                  onChange={(e) => set(s, Number(e.target.value.replace(/\D/g, "")))}
                  onFocus={(e) => e.target.select()}
                  className="h-9 w-11 rounded-sm border bg-background text-center text-sm font-bold outline-none focus:border-premium"
                />
                <button type="button" aria-label={`Increase ${s}`} onClick={() => set(s, q + 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm">
        Total pieces: <span className="font-black text-premium">{totalQty(value)}</span>
      </p>
    </div>
  );
}
