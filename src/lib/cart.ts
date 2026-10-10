import { useMemo } from "react";
import { getProductById, type Product } from "@/data/products";
import { coupons } from "@/data/coupons";
import { cartBill, lineBill, validateCoupon, type Line } from "@/lib/pricing";
import { useCart, useOrders, useSession, type CartItem } from "@/store";

export type CartLine = { item: CartItem; p: Product; line: Line };

export function useCartSummary() {
  const items = useCart((s) => s.items);
  const code = useCart((s) => s.coupon);
  const user = useSession((s) => s.user);
  const orderCount = useOrders((s) => (user ? (s.byUser[user.id] ?? []).length : 0));
  return useMemo(() => {
    const lines: CartLine[] = items
      .map((item) => ({ item, p: getProductById(item.productId)! }))
      .filter((x) => x.p)
      .map((x) => ({ ...x, line: lineBill(x.p, x.item.sizes) }))
      .filter((x) => x.line.qty > 0);
    const base = cartBill(lines.map((l) => l.line));
    const cRes = code ? validateCoupon(coupons.find((c) => c.code === code), { subtotal: base.subtotal, qty: base.qty, orderCount }) : null;
    const bill = cartBill(lines.map((l) => l.line), cRes?.ok ? cRes.discount : 0);
    return { lines, bill, code, couponRes: cRes, orderCount };
  }, [items, code, orderCount]);
}
