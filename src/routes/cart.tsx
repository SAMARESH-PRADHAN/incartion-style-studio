import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Pencil, ShoppingBag, Tag, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { RequireAuth } from "@/components/common/RequireAuth";
import { Container } from "@/components/common/Reveal";
import { QuantitySizeSelector } from "@/components/product/QuantitySizeSelector";
import { BillRows } from "@/components/product/BillBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartSummary } from "@/lib/cart";
import { activeCoupons, coupons } from "@/data/coupons";
import { inr, validateCoupon } from "@/lib/pricing";
import { couponHeadline } from "@/components/common/CouponCard";
import { useCart, useWishlist } from "@/store";
import { cn } from "@/lib/utils";
import { Stepper } from "@/components/common/Stepper";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Shopping Bag — Incartion" },
      { name: "description", content: "Review your bag, apply coupons and place your uniform order." },
      { property: "og:title", content: "Shopping Bag — Incartion" },
      { property: "og:description", content: "Review items, apply coupons and checkout." },
    ],
  }),
  component: () => <RequireAuth><CartPage /></RequireAuth>,
});


function CartPage() {
  const { lines, bill, code, couponRes, orderCount } = useCartSummary();
  const { update, remove, setCoupon } = useCart();
  const toggleWish = useWishlist((s) => s.toggle);
  const [editing, setEditing] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const navigate = useNavigate();

  const apply = (c: string) => {
    const r = validateCoupon(coupons.find((x) => x.code === c.toUpperCase()), { subtotal: bill.subtotal, qty: bill.qty, orderCount });
    if (r.ok) {
      setCoupon(c.toUpperCase());
      setMsg({ ok: true, t: `${c.toUpperCase()} applied! You saved ${inr(r.discount)}` });
      toast.success("Coupon applied");
    } else setMsg({ ok: false, t: r.error });
  };

  if (!lines.length)
    return (
      <div className="flex flex-col items-center px-4 py-24 text-center">
        <ShoppingBag className="h-20 w-20 text-primary/40" />
        <p className="mt-4 text-xl font-black">Hey, it feels so light!</p>
        <p className="mt-1 text-sm text-muted-foreground">There is nothing in your bag. Let's add some items.</p>
        <div className="mt-6 flex gap-3">
          <Button asChild><Link to="/products">Shop now</Link></Button>
          <Button asChild variant="outlinePink"><Link to="/wishlist">From wishlist</Link></Button>
        </div>
      </div>
    );

  return (
    <Container className="max-w-6xl pb-28 lg:pb-10">
      <Stepper step={0} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {lines.map(({ item, p, line }) => (
            <div key={item.key} className="rounded-sm border p-3 sm:p-4">
              <div className="flex gap-3 sm:gap-4">
                <Link to="/product/$slug" params={{ slug: p.slug }} className="shrink-0">
                  <img src={p.images[0]} alt={p.name} className="h-32 w-24 rounded-sm object-cover sm:h-36 sm:w-28" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">INCARTION</p>
                  <p className="truncate text-sm">{p.name}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(item.sizes).filter(([, v]) => v).map(([s, v]) => (
                      <span key={s} className="rounded-sm bg-secondary px-2 py-1 text-xs font-bold">{s}: {v}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-sm"><span className="font-black">{inr(line.subtotal)}</span> <span className="text-xs text-muted-foreground line-through">{inr(line.mrpTotal)}</span> <span className="text-xs font-bold text-accent">{line.qty} pcs @ {inr(line.unit)}</span></p>
                  {item.note && editing !== item.key && <p className="mt-1 truncate text-xs text-muted-foreground">Note: {item.note}</p>}
                </div>
              </div>
              {editing === item.key && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <QuantitySizeSelector compact value={item.sizes} onChange={(sizes) => update(item.key, { sizes })} />
                  <Textarea value={item.note} onChange={(e) => update(item.key, { note: e.target.value })} placeholder="Note for our team" />
                </div>
              )}
              <div className="mt-3 grid grid-cols-3 border-t pt-2 text-xs font-bold uppercase">
                <button onClick={() => setEditing(editing === item.key ? null : item.key)} className="flex h-10 items-center justify-center gap-1.5">
                  {editing === item.key ? <><Check className="h-4 w-4" /> Done</> : <><Pencil className="h-4 w-4" /> Edit</>}
                </button>
                <button onClick={() => { remove(item.key); toast("Item removed"); }} className="flex h-10 items-center justify-center gap-1.5 border-x"><Trash2 className="h-4 w-4" /> Remove</button>
                <button onClick={() => { if (!useWishlist.getState().ids.includes(p.id)) toggleWish(p.id); remove(item.key); toast("Moved to wishlist"); }} className="flex h-10 items-center justify-center gap-1.5"><Heart className="h-4 w-4" /> Wishlist</button>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-sm border p-4">
            <p className="eyebrow mb-3 flex items-center gap-2"><Tag className="h-4 w-4" /> Coupons</p>
            {code && couponRes?.ok ? (
              <div className="flex items-center justify-between rounded-sm bg-success/10 p-3 text-sm">
                <span><b className="text-success">{code}</b> applied · -{inr(couponRes.discount)}</span>
                <button onClick={() => { setCoupon(null); setMsg(null); }} className="text-xs font-bold text-primary">REMOVE</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (input) apply(input); }} className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="h-11" aria-label="Coupon code" />
                <Button variant="outlinePink" type="submit">Apply</Button>
              </form>
            )}
            {code && couponRes && !couponRes.ok && <p className="mt-2 text-xs text-destructive">{couponRes.error} (removed from bill)</p>}
            {msg && !(code && couponRes?.ok) && <p className={cn("mt-2 text-xs", msg.ok ? "text-success" : "text-destructive")}>{msg.t}</p>}
            <div className="mt-3 space-y-2">
              {activeCoupons().map((c) => {
                const r = validateCoupon(c, { subtotal: bill.subtotal, qty: bill.qty, orderCount });
                return (
                  <button key={c.code} onClick={() => apply(c.code)} className={cn("w-full rounded-sm border border-dashed p-3 text-left transition hover:border-primary", code === c.code && "border-success bg-success/5")}>
                    <div className="flex items-center justify-between"><span className="text-sm font-black tracking-wider text-primary">{c.code}</span><span className="text-xs font-bold">{couponHeadline(c)}</span></div>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                    {!r.ok && <p className="mt-1 text-[11px] text-accent">{r.error}</p>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="rounded-sm border p-4">
            <p className="eyebrow mb-3">Price details ({bill.qty} pcs)</p>
            <BillRows bill={bill} couponCode={code} />
            <Button className="mt-4 hidden w-full lg:flex" onClick={() => navigate({ to: "/checkout" })}>Place order</Button>
          </div>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-[52px] z-30 flex items-center gap-3 border-t bg-background p-3 lg:hidden">
        <div className="min-w-0 flex-1"><p className="text-lg font-black">{inr(bill.total)}</p><p className="text-xs text-success">You save {inr(bill.saved)}</p></div>
        <Button className="flex-1" onClick={() => navigate({ to: "/checkout" })}>Place order</Button>
      </div>
    </Container>
  );
}
