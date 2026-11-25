import type { Bill } from "@/lib/pricing";
import { inr, FREE_DELIVERY_MIN } from "@/lib/pricing";
import { BadgePercent } from "lucide-react";


export function BillRows({ bill, couponCode }: { bill: Bill; couponCode?: string | null }) {
  const row = "flex items-center justify-between gap-4 py-2.5 text-sm";
  return (
    <div>
      <div className="divide-y divide-dashed divide-border">
        <div className={row}><span className="text-muted-foreground">Total MRP</span><span className="font-medium">{inr(bill.mrpTotal)}</span></div>
        <div className={row}><span className="text-muted-foreground">Discount on MRP</span><span className="font-bold text-emerald-600">-{inr(bill.productDiscount)}</span></div>
        {bill.couponDiscount > 0 && (
          <div className={row}><span className="text-muted-foreground">Coupon {couponCode ? `(${couponCode})` : ""}</span><span className="font-bold text-emerald-600">-{inr(bill.couponDiscount)}</span></div>
        )}
        <div className={row}><span className="text-muted-foreground">Print &amp; Customization</span><span className="font-medium">{inr(bill.printCharges ?? 0)}</span></div>
        <div className={row}><span className="text-muted-foreground">GST</span><span className="font-medium">{inr(bill.gst)}</span></div>
        <div className={row}>
          <span className="text-muted-foreground">Delivery fee</span>
          <span>{bill.delivery === 0 ? <span className="font-bold text-emerald-600">FREE</span> : inr(bill.delivery)}</span>
        </div>
      </div>
      {bill.delivery > 0 && <p className="mt-1 text-xs text-muted-foreground">Free delivery on orders above {inr(FREE_DELIVERY_MIN)}</p>}

      <div className="mt-4 flex items-center justify-between rounded-xl bg-linear-to-r from-emerald-700 to-emerald-500 px-4 py-3.5 text-white shadow-lg shadow-emerald-600/25">
        <span className="text-sm font-bold uppercase tracking-wider">Total Amount</span>
        <span className="text-2xl font-black">{inr(bill.total)}</span>
      </div>

      {bill.saved > 0 && (
        <p className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
          <BadgePercent className="h-5 w-5 shrink-0" /> You save {inr(bill.saved)} on this order
        </p>
      )}
    </div>
  );
}