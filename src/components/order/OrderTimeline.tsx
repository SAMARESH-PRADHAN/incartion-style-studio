import { motion } from "framer-motion";
import { ClipboardCheck, BadgeCheck, Package, Truck, Bike, Home, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ORDER_STEPS } from "@/store";
import { cn } from "@/lib/utils";

const icons = [ClipboardCheck, BadgeCheck, Package, Truck, Bike, Home];

export function OrderTimeline({ status, history, cancelled }: { status: number; history: string[]; cancelled: boolean }) {
  if (cancelled)
    return (
      <div className="flex items-center gap-2 rounded-sm bg-destructive/10 p-3 text-sm font-bold text-destructive">
        <XCircle className="h-5 w-5" /> Order cancelled
      </div>
    );
  const pct = (status / (ORDER_STEPS.length - 1)) * 100;
  return (
    <div>
      {/* horizontal on md+, vertical on mobile */}
      <div className="relative hidden md:block">
        <div className="absolute left-[8.33%] right-[8.33%] top-5 h-1 rounded-full bg-border">
          <motion.div className="h-full rounded-full bg-brand" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
        </div>
        <ol className="relative grid grid-cols-6">
          {ORDER_STEPS.map((s, i) => {
            const I = icons[i];
            const done = i <= status;
            return (
              <li key={s} className="flex flex-col items-center text-center">
                <span className={cn("relative grid h-10 w-10 place-items-center rounded-full border-2 bg-background transition", done ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground", i === status && "shadow-glow")}>
                  {i === status && <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />}
                  <I className="relative h-4 w-4" />
                </span>
                <span className={cn("mt-2 text-xs font-bold", !done && "text-muted-foreground")}>{s}</span>
                {history[i] && <span className="text-[10px] text-muted-foreground">{format(new Date(history[i]), "dd MMM, hh:mm a")}</span>}
              </li>
            );
          })}
        </ol>
      </div>
      <ol className="relative space-y-4 md:hidden">
        <div className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-border">
          <motion.div className="w-full bg-brand" initial={{ height: 0 }} animate={{ height: `${pct}%` }} transition={{ duration: 0.8 }} />
        </div>
        {ORDER_STEPS.map((s, i) => {
          const I = icons[i];
          const done = i <= status;
          return (
            <li key={s} className="relative flex items-center gap-3">
              <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 bg-background", done ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground", i === status && "shadow-glow")}>
                <I className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className={cn("text-sm font-bold", !done && "text-muted-foreground")}>{s}</p>
                {history[i] && <p className="text-xs text-muted-foreground">{format(new Date(history[i]), "dd MMM, hh:mm a")}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
