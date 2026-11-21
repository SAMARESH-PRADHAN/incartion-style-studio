import type { Coupon } from "@/data/coupons";

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"] as const;
export type Size = (typeof SIZES)[number];
export type SizeQty = Partial<Record<Size, number>>;
export type Tier = { minQty: number; price: number };

export const FREE_DELIVERY_MIN = 999;
export const DELIVERY_FEE = 79;

export type PrintOption = { id: string; group: string; label: string; unitPrice: number };
export const PRINT_OPTIONS: PrintOption[] = [
  { id: "none", group: "No Print", label: "No Print", unitPrice: 0 },
  { id: "dtf-chest-4x4", group: "DTF Print", label: "Chest Print (4 × 4 inch)", unitPrice: 0 },
  { id: "dtf-back-name", group: "DTF Print", label: "Back Name (9 × 2 inch)", unitPrice: 40 },
  { id: "dtf-front-a4", group: "DTF Print", label: "Front Print (A4)", unitPrice: 40 },
  { id: "dtf-back-a4", group: "DTF Print", label: "Back Print (A4)", unitPrice: 40 },
  { id: "dtf-front-a3", group: "DTF Print", label: "Front Print (A3)", unitPrice: 80 },
  { id: "dtf-back-a3", group: "DTF Print", label: "Back Print (A3)", unitPrice: 80 },
  { id: "sublimation-a4", group: "Sublimation Print", label: "Sublimation A4 Print", unitPrice: 30 },
  { id: "sublimation-back-name", group: "Sublimation Print", label: "Sublimation Back Name", unitPrice: 20 },
  { id: "sublimation-logo", group: "Sublimation Print", label: "Sublimation Logo", unitPrice: 10 },
  { id: "embroidery-chest-logo", group: "Embroidery Print", label: "Chest Logo (1–3 thread colors)", unitPrice: 20 },
];

export function printUnitCost(optionIds: string[]) {
  if (optionIds.includes("none")) return 0;
  const selected = new Set(optionIds);
  return PRINT_OPTIONS.reduce((total, option) => total + (selected.has(option.id) ? option.unitPrice : 0), 0);
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const totalQty = (s: SizeQty) => Object.values(s).reduce<number>((a, b) => a + (b || 0), 0);

export function unitPrice(tiers: Tier[], qty: number) {
  const sorted = [...tiers].sort((a, b) => a.minQty - b.minQty);
  let p = sorted[0].price;
  for (const t of sorted) if (qty >= t.minQty) p = t.price;
  return p;
}

/** Indian GST on apparel: 5% up to ₹1000 per piece, 12% above. */
export const gstRateFor = (unit: number) => (unit <= 1000 ? 5 : 12);

export type Line = { qty: number; unit: number; subtotal: number; mrpTotal: number; gstRate: number; printCharges: number };

export function lineBill(p: { mrp: number; bulkPricing: Tier[] }, sizes: SizeQty, printUnit = 0): Line {
  const qty = totalQty(sizes);
  const unit = unitPrice(p.bulkPricing, Math.max(qty, 1));
  return { qty, unit, subtotal: unit * qty, mrpTotal: p.mrp * qty, gstRate: gstRateFor(unit), printCharges: printUnit * qty };
}

export type CouponResult = { ok: true; discount: number } | { ok: false; error: string };

export function validateCoupon(
  c: Coupon | undefined,
  ctx: { subtotal: number; qty: number; orderCount: number; now?: Date },
): CouponResult {
  if (!c) return { ok: false, error: "Invalid coupon code" };
  const now = ctx.now ?? new Date();
  if (!c.active || new Date(c.expiry + "T23:59:59") < now) return { ok: false, error: "This coupon has expired" };
  if (ctx.subtotal < c.minOrder)
    return { ok: false, error: `Add items worth ${inr(c.minOrder - ctx.subtotal)} more to use ${c.code}` };
  if (c.minQty && ctx.qty < c.minQty) return { ok: false, error: `${c.code} needs at least ${c.minQty} pieces` };
  if (c.firstOrderOnly && ctx.orderCount > 0) return { ok: false, error: `${c.code} is valid on your first order only` };
  const raw = c.type === "flat" ? c.value : Math.round((ctx.subtotal * c.value) / 100);
  const discount = Math.min(raw, c.maxDiscount ?? Infinity, ctx.subtotal);
  return { ok: true, discount };
}

export type Bill = {
  qty: number;
  mrpTotal: number;
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  printCharges: number;
  gst: number;
  delivery: number;
  total: number;
  saved: number;
};

export function cartBill(lines: Line[], couponDiscount = 0): Bill {
  const qty = lines.reduce((a, l) => a + l.qty, 0);
  const mrpTotal = lines.reduce((a, l) => a + l.mrpTotal, 0);
  const subtotal = lines.reduce((a, l) => a + l.subtotal, 0);
  const printCharges = lines.reduce((a, l) => a + l.printCharges, 0);
  const cd = Math.min(couponDiscount, subtotal);
  const ratio = subtotal ? (subtotal - cd) / subtotal : 0;
  const gst = Math.round(lines.reduce((a, l) => a + (l.subtotal * l.gstRate) / 100, 0) * ratio);
  const taxable = subtotal - cd;
  const delivery = qty === 0 ? 0 : taxable >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  return {
    qty,
    mrpTotal,
    subtotal,
    productDiscount: mrpTotal - subtotal,
    couponDiscount: cd,
    printCharges,
    gst,
    delivery,
    total: taxable + gst + delivery + printCharges,
    saved: mrpTotal - subtotal + cd,
  };
}
