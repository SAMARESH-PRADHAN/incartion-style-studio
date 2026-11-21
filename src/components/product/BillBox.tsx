import type { Bill } from "@/lib/pricing";
import { inr, FREE_DELIVERY_MIN } from "@/lib/pricing";

export function BillRows({ bill, couponCode }: { bill: Bill; couponCode?: string | null }) {
  const row = "flex justify-between py-1.5 text-sm";
  return (
    <div>
      <div className={row}><span>Total MRP</span><span>{inr(bill.mrpTotal)}</span></div>
      <div className={row}><span>Discount on MRP</span><span className="text-success">-{inr(bill.productDiscount)}</span></div>
      {bill.couponDiscount > 0 && <div className={row}><span>Coupon {couponCode ? `(${couponCode})` : ""}</span><span className="text-success">-{inr(bill.couponDiscount)}</span></div>}
      <div className={row}><span>Print &amp; Customization Charges</span><span>{inr(bill.printCharges)}</span></div>
      <div className={row}><span>GST</span><span>{inr(bill.gst)}</span></div>
      <div className={row}>
        <span>Delivery fee</span>
        <span>{bill.delivery === 0 ? <span className="font-bold text-success">FREE</span> : inr(bill.delivery)}</span>
      </div>
      {bill.delivery > 0 && <p className="text-xs text-muted-foreground">Free delivery on orders above {inr(FREE_DELIVERY_MIN)}</p>}
      <div className="mt-2 flex justify-between border-t pt-3 text-base font-black"><span>Total Amount</span><span>{inr(bill.total)}</span></div>
      {bill.saved > 0 && <p className="mt-2 rounded-sm bg-success/10 px-3 py-2 text-xs font-bold text-success">You save {inr(bill.saved)} on this order 🎉</p>}
    </div>
  );
}
