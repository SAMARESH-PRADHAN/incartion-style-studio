const EMPTY: never[] = [];
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, FastForward, PackageOpen, RotateCw, Star, XCircle, ChevronRight, Camera } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";
import { RequireAuth } from "@/components/common/RequireAuth";
import { Container } from "@/components/common/Reveal";
import { OrderTimeline } from "@/components/order/OrderTimeline";
import { BillRows } from "@/components/product/BillBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { inr, PRINT_OPTIONS } from "@/lib/pricing";
import { ORDER_STEPS, useCart, useOrders, useReviews, useSession, newId, type Order, type OrderItem } from "@/store";
import { downloadInvoice } from "@/lib/invoice";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — Incartion" },
      { name: "description", content: "Track your Incartion orders, download GST invoices and review products." },
      { property: "og:title", content: "My Orders — Incartion" },
      { property: "og:description", content: "Track orders, download invoices and leave reviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <RequireAuth><OrdersPage /></RequireAuth>,
});

const advance = (o: Order): Order =>
  o.cancelled || o.status >= ORDER_STEPS.length - 1 ? o : { ...o, status: o.status + 1, history: [...o.history, new Date().toISOString()] };

function ReviewDialog({ item, onClose, onDone }: { item: OrderItem; onClose: () => void; onDone: () => void }) {
  const user = useSession((s) => s.user)!;
  const add = useReviews((s) => s.add);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const submit = () => {
    if (!rating) return toast.error("Please select a star rating");
    if (text.trim().length < 10) return toast.error("Please write at least 10 characters");
    add({ id: newId(), productId: item.productId, userName: user.name, rating, title: title.trim() || ["", "Poor", "Fair", "Good", "Very good", "Excellent"][rating], text: text.trim(), date: new Date().toISOString(), photo, verified: true });
    toast.success("Thanks! Your review is live on the product page.");
    onDone();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate & review</DialogTitle>
          <DialogDescription className="truncate">{item.name}</DialogDescription>
        </DialogHeader>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} role="radio" aria-checked={rating === i} aria-label={`${i} stars`} onClick={() => setRating(i)} className="grid h-11 w-11 place-items-center">
              <Star className={cn("h-8 w-8 transition", i <= rating ? "fill-rating text-rating" : "text-border")} />
            </button>
          ))}
        </div>
        <Input placeholder="Review title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-11" />
        <Textarea placeholder="How was the fabric, fit and finish?" value={text} onChange={(e) => setText(e.target.value)} rows={4} />
        <label className="flex cursor-pointer items-center gap-3 text-sm font-bold">
          <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-sm border border-dashed">
            {photo ? <img src={photo} alt="Upload preview" className="h-full w-full object-cover" /> : <Camera className="h-5 w-5 text-muted-foreground" />}
          </span>
          Add photo (optional)
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (f.size > 1.5e6) return toast.error("Image must be under 1.5 MB");
            const r = new FileReader();
            r.onload = () => setPhoto(String(r.result));
            r.readAsDataURL(f);
          }} />
        </label>
        <Button onClick={submit}>Submit review</Button>
      </DialogContent>
    </Dialog>
  );
}

function OrdersPage() {
  const user = useSession((s) => s.user)!;
  const orders = useOrders((s) => s.byUser[user.id] ?? EMPTY);
  const update = useOrders((s) => s.update);
  const addToCart = useCart((s) => s.add);
  const navigate = useNavigate();
  const [open, setOpen] = useState<string | null>(null);
  const [review, setReview] = useState<{ order: string; item: OrderItem } | null>(null);
  const detail = orders.find((o) => o.id === open);

  // Demo: auto-progress active orders every 20 seconds
  useEffect(() => {
    const t = setInterval(() => {
      useOrders.getState().byUser[user.id]?.forEach((o) => { if (!o.cancelled && o.status < 5) update(user.id, o.id, advance); });
    }, 20000);
    return () => clearInterval(t);
  }, [user.id]);

  const reorder = (o: Order) => {
    o.items.forEach((i) => addToCart(i.productId, i.sizes, i.note, i.printOptions ?? ["none"], i.artwork ?? null));
    toast.success("Items added to bag");
    navigate({ to: "/cart" });
  };

  if (!orders.length)
    return (
      <div className="flex flex-col items-center px-4 py-24 text-center">
        <PackageOpen className="h-20 w-20 text-primary/40" />
        <p className="mt-4 text-xl font-black">No orders yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Your placed orders will appear here.</p>
        <Button asChild className="mt-6"><Link to="/products">Start shopping</Link></Button>
      </div>
    );

  return (
    <Container className="max-w-5xl py-6">
      <div className="mb-6 rounded-md bg-brand p-5 text-primary-foreground">
        <p className="eyebrow opacity-90">My account</p>
        <h1 className="text-2xl font-black">My Orders</h1>
        <p className="text-sm opacity-90">{orders.length} order{orders.length > 1 ? "s" : ""} · Status updates automatically every 20s (demo)</p>
      </div>
      <div className="space-y-5">
        {orders.map((o) => {
          const delivered = o.status === 5 && !o.cancelled;
          return (
            <article key={o.id} className="overflow-hidden rounded-md border shadow-card">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-secondary px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-black">Order #{o.id}</p>
                  <p className="text-xs text-muted-foreground">Placed {format(new Date(o.createdAt), "dd MMM yyyy, hh:mm a")} · {inr(o.bill.total)}</p>
                </div>
                <span className={cn("rounded-full px-3 py-1 text-xs font-black uppercase", o.cancelled ? "bg-destructive/10 text-destructive" : delivered ? "bg-success/15 text-success" : "bg-accent/15 text-accent")}>
                  {o.cancelled ? "Cancelled" : ORDER_STEPS[o.status]}
                </span>
              </header>
              <div className="space-y-5 p-4">
                <OrderTimeline status={o.status} history={o.history} cancelled={o.cancelled} />
                {!o.cancelled && !delivered && <p className="text-xs text-muted-foreground">Estimated delivery: <b>{format(addDays(new Date(o.createdAt), 6), "EEE, dd MMM")}</b></p>}
                <ul className="divide-y">
                  {o.items.map((it) => (
                    <li key={it.productId} className="flex items-center gap-3 py-3">
                      <img src={it.image} alt={it.name} className="h-16 w-12 rounded-sm object-cover" />
                      <div className="min-w-0 flex-1">
                        <Link to="/product/$slug" params={{ slug: it.slug }} className="block truncate text-sm font-bold hover:text-primary">{it.name}</Link>
                        <p className="text-xs text-muted-foreground">{Object.entries(it.sizes).filter(([, v]) => v).map(([k, v]) => `${k}×${v}`).join(", ")} · {inr(it.subtotal + (it.printCharges ?? 0))}</p>
                      </div>
                      {delivered && (o.reviewed.includes(it.productId) ? (
                        <span className="text-xs font-bold text-success">Reviewed ✓</span>
                      ) : (
                        <Button size="sm" variant="outlinePink" onClick={() => setReview({ order: o.id, item: it })}><Star /> Rate</Button>
                      ))}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setOpen(o.id)}>Details <ChevronRight /></Button>
                  {delivered && <Button size="sm" onClick={() => downloadInvoice(o, user).then(() => toast.success("Invoice downloaded"))}><Download /> Download invoice</Button>}
                  {!o.cancelled && o.status < 3 && (
                    <Button size="sm" variant="outline" onClick={() => { if (confirm("Cancel this order?")) { update(user.id, o.id, (x) => ({ ...x, cancelled: true })); toast("Order cancelled"); } }}>
                      <XCircle /> Cancel order
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => reorder(o)}><RotateCw /> Reorder</Button>
                  {!o.cancelled && !delivered && (
                    <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => update(user.id, o.id, advance)}><FastForward /> Simulate next status</Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Sheet open={!!detail} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent side="right" className="w-[92vw] max-w-md overflow-y-auto">
          {detail && (
            <>
              <SheetHeader><SheetTitle>Order #{detail.id}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-5 text-sm">
                <section>
                  <p className="eyebrow mb-2">Items</p>
                  {detail.items.map((it) => (
                    <div key={it.productId} className="mb-2 rounded-sm border p-2">
                      <p className="font-bold">{it.name}</p>
                      <p className="text-xs text-muted-foreground">{Object.entries(it.sizes).filter(([, v]) => v).map(([k, v]) => `${k}×${v}`).join(", ")} · {it.qty} pcs @ {inr(it.unit)}</p>
                      {(it.printOptions ?? ["none"]).some((id) => id !== "none") && <p className="mt-1 text-xs text-muted-foreground">Print: {(it.printOptions ?? []).filter((id) => id !== "none").map((id) => PRINT_OPTIONS.find((option) => option.id === id)?.label ?? id).join(", ")}</p>}
                      {it.artwork && <p className="mt-1 truncate text-xs text-muted-foreground">Artwork: {it.artwork.name}</p>}
                      {it.note && <p className="mt-1 text-xs">Note: {it.note}</p>}
                    </div>
                  ))}
                </section>
                <section>
                  <p className="eyebrow mb-2">Delivery address</p>
                  <p><b>{detail.address.name}</b>, {detail.address.address}, {detail.address.locality}, {detail.address.city}, {detail.address.state} - {detail.address.pincode}</p>
                  <p>Mobile: {detail.address.mobile}</p>
                </section>
                <section>
                  <p className="eyebrow mb-2">Payment</p>
                  <p>{detail.payment.method} · {detail.payment.detail}</p>
                </section>
                <section>
                  <p className="eyebrow mb-2">Bill</p>
                  <BillRows bill={detail.bill} couponCode={detail.coupon} />
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {review && (
        <ReviewDialog
          item={review.item}
          onClose={() => setReview(null)}
          onDone={() => { update(user.id, review.order, (o) => ({ ...o, reviewed: [...o.reviewed, review.item.productId] })); setReview(null); }}
        />
      )}
    </Container>
  );
}
