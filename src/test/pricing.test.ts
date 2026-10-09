import { describe, expect, it } from "vitest";
import { coupons } from "@/data/coupons";
import { cartBill, unitPrice, validateCoupon, gstRateFor } from "@/lib/pricing";

const c = (code: string) => coupons.find((x) => x.code === code);
const now = new Date("2026-10-09");

describe("pricing rules", () => {
  const tiers = [
    { minQty: 1, price: 500 },
    { minQty: 10, price: 450 },
    { minQty: 50, price: 400 },
    { minQty: 100, price: 350 },
  ];
  it("bulk tier price changes with total quantity", () => {
    expect(unitPrice(tiers, 9)).toBe(500);
    expect(unitPrice(tiers, 10)).toBe(450);
    expect(unitPrice(tiers, 50)).toBe(400);
    expect(unitPrice(tiers, 120)).toBe(350);
  });
  it("INCART10 is 10% capped at ₹500 with ₹999 minimum", () => {
    expect(validateCoupon(c("INCART10"), { subtotal: 2000, qty: 2, orderCount: 0, now })).toEqual({ ok: true, discount: 200 });
    expect(validateCoupon(c("INCART10"), { subtotal: 9000, qty: 9, orderCount: 0, now })).toEqual({ ok: true, discount: 500 });
    expect(validateCoupon(c("INCART10"), { subtotal: 900, qty: 1, orderCount: 0, now }).ok).toBe(false);
  });
  it("BULK20 needs 50+ pieces", () => {
    expect(validateCoupon(c("BULK20"), { subtotal: 20000, qty: 49, orderCount: 0, now }).ok).toBe(false);
    expect(validateCoupon(c("BULK20"), { subtotal: 20000, qty: 50, orderCount: 0, now })).toEqual({ ok: true, discount: 4000 });
  });
  it("WELCOME100 only on first order", () => {
    expect(validateCoupon(c("WELCOME100"), { subtotal: 600, qty: 1, orderCount: 1, now }).ok).toBe(false);
    expect(validateCoupon(c("WELCOME100"), { subtotal: 600, qty: 1, orderCount: 0, now })).toEqual({ ok: true, discount: 100 });
  });
  it("expired coupon is rejected", () => {
    expect(validateCoupon(c("FESTIVE25"), { subtotal: 5000, qty: 5, orderCount: 0, now }).ok).toBe(false);
  });
  it("free delivery from ₹999, otherwise ₹79", () => {
    expect(cartBill([{ qty: 1, unit: 500, subtotal: 500, mrpTotal: 800, gstRate: 5 }]).delivery).toBe(79);
    expect(cartBill([{ qty: 2, unit: 500, subtotal: 1000, mrpTotal: 1600, gstRate: 5 }]).delivery).toBe(0);
  });
  it("GST is 5% up to ₹1000 per piece, 12% above", () => {
    expect(gstRateFor(1000)).toBe(5);
    expect(gstRateFor(1001)).toBe(12);
  });
});
