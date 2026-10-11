import { cn } from "@/lib/utils";

export function Stepper({ step }: { step: 0 | 1 | 2 }) {
  const s = ["Bag", "Address", "Payment"];
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold uppercase tracking-widest">
      {s.map((l, i) => (
        <div key={l} className="flex items-center gap-2">
          <span className={cn(i < step ? "text-success" : i === step ? "border-b-2 border-success text-success" : "text-muted-foreground")}>{l}</span>
          {i < 2 && <span className="w-8 border-t border-dashed sm:w-16" />}
        </div>
      ))}
    </div>
  );
}
