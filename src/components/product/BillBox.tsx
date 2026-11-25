import type { Bill } from "@/lib/pricing";
import { inr, FREE_DELIVERY_MIN } from "@/lib/pricing";

export function BillRows({ bill, couponCode }: { bill: Bill; couponCode?: string | null }) {
  const row = "flex items-center justify-between gap-4 border-b border-border/70 py-2 text-sm last:border-0";
  return (
    <div className="divide-y divide-border/70">
      <div className={row}><span className="text-muted-foreground">Total MRP</span><span className="font-medium">{inr(bill.mrpTotal)}</span></div>
      <div className={row}><span className="text-muted-foreground">Discount on MRP</span><span className="font-semibold text-success">-{inr(bill.productDiscount)}</span></div>
      {bill.couponDiscount > 0 && <div className={row}><span className="text-muted-foreground">Coupon {couponCode ? `(${couponCode})` : ""}</span><span className="font-semibold text-success">-{inr(bill.couponDiscount)}</span></div>}
      <div className="my-1 flex items-center justify-between gap-4 rounded-sm border border-border bg-secondary/70 px-3 py-2.5 text-sm font-bold">
        <span>Print &amp; Customization Charges</span><span>{inr(bill.printCharges ?? 0)}</span>
      </div>
      <div className={row}><span className="text-muted-foreground">GST</span><span>{inr(bill.gst)}</span></div>
      <div className={row}>
        <span className="text-muted-foreground">Delivery fee</span>
        <span>{bill.delivery === 0 ? <span className="font-bold text-success">FREE</span> : inr(bill.delivery)}</span>
      </div>
      {bill.delivery > 0 && <p className="text-xs text-muted-foreground">Free delivery on orders above {inr(FREE_DELIVERY_MIN)}</p>}
      <div className="mt-2 flex justify-between border-t border-foreground/20 pt-3 text-base font-black"><span>Total Amount</span><span>{inr(bill.total)}</span></div>
      {bill.saved > 0 && <p className="mt-3 rounded-sm border border-border bg-secondary px-3 py-2 text-xs font-bold text-foreground">You save {inr(bill.saved)} on this order</p>}
    </div>
  );
}
