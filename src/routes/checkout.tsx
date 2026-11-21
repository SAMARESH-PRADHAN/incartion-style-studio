const EMPTY: never[] = [];
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Plus, Smartphone, CreditCard, Landmark, Wallet, Banknote, FileText, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { RequireAuth } from "@/components/common/RequireAuth";
import { Container } from "@/components/common/Reveal";
import { AddressCard, AddressForm } from "@/components/common/AddressForm";
import { BillRows } from "@/components/product/BillBox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/common/Stepper";
import { useCartSummary } from "@/lib/cart";
import { inr } from "@/lib/pricing";
import { useAddresses, useCart, useOrders, useSession, newId, type Order } from "@/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Incartion" },
      { name: "description", content: "Choose your delivery address and pay securely." },
      { property: "og:title", content: "Checkout — Incartion" },
      { property: "og:description", content: "Secure checkout for your uniform order." },
    ],
  }),
  component: () => <RequireAuth><Checkout /></RequireAuth>,
});

const methods = [
  { id: "upi", l: "UPI", i: Smartphone },
  { id: "card", l: "Credit / Debit Card", i: CreditCard },
  { id: "net", l: "Net Banking", i: Landmark },
  { id: "wallet", l: "Wallets", i: Wallet },
  { id: "cod", l: "Cash on Delivery", i: Banknote },
  { id: "invoice", l: "Pay Later / Request Invoice", i: FileText },
] as const;
type M = (typeof methods)[number]["id"];

function luhn(n: string) {
  let s = 0;
  n.split("").reverse().forEach((d, i) => { let x = +d; if (i % 2) { x *= 2; if (x > 9) x -= 9; } s += x; });
  return s % 10 === 0;
}

function SuccessModal({ order, onClose }: { order: Order; onClose: (to: "/orders" | "/") => void }) {
  useEffect(() => {
    import("canvas-confetti").then(({ default: confetti }) => {
      const colors = ["#FF3F6C", "#FF905A", "#03A685", "#ffffff"];
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.6 }, colors });
      setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors }), 300);
      setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors }), 500);
    });
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[60] grid place-items-center bg-overlay/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Order placed">
      <motion.div initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", damping: 16 }} className="w-full max-w-md rounded-md bg-background p-8 text-center shadow-pop">
        <svg viewBox="0 0 52 52" className="mx-auto h-24 w-24">
          <circle cx="26" cy="26" r="24" fill="none" className="stroke-success" strokeWidth="3" strokeDasharray="151" strokeDashoffset="151" style={{ animation: "draw 0.6s ease-out forwards" }} />
          <path d="M14 27l8 8 16-16" fill="none" className="stroke-success" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40" style={{ animation: "draw 0.4s 0.55s ease-out forwards" }} />
        </svg>
        <h2 className="mt-4 text-2xl font-black">Order Placed Successfully! 🎉</h2>
        <p className="mt-2 text-sm text-muted-foreground">Thank you for shopping with Incartion.</p>
        <div className="mt-5 space-y-1 rounded-sm bg-secondary p-4 text-sm">
          <p className="flex justify-between"><span>Order ID</span><b>{order.id}</b></p>
          <p className="flex justify-between"><span>Amount</span><b>{inr(order.bill.total)}</b></p>
          <p className="flex justify-between"><span>Est. delivery</span><b>{format(addDays(new Date(order.createdAt), 6), "EEE, dd MMM")}</b></p>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          <Button onClick={() => onClose("/orders")}>View my orders</Button>
          <Button variant="outline" onClick={() => onClose("/")}>Continue shopping</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Checkout() {
  const user = useSession((s) => s.user)!;
  const addresses = useAddresses((s) => s.byUser[user.id] ?? EMPTY);
  const saveAddr = useAddresses((s) => s.save);
  const placeOrder = useOrders((s) => s.place);
  const clearCart = useCart((s) => s.clear);
  const { lines, bill, code, couponRes } = useCartSummary();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [sel, setSel] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [m, setM] = useState<M>("upi");
  const [pay, setPay] = useState({ upi: "", card: "", exp: "", cvv: "", bank: "SBI", wallet: "Paytm", gstin: "" });
  const [err, setErr] = useState("");
  const [state, setState] = useState<"idle" | "processing" | "failed">("idle");
  const [done, setDone] = useState<Order | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!sel && addresses.length) setSel((addresses.find((a) => a.isDefault) ?? addresses[0]).id);
  }, [addresses.length]);
  useEffect(() => { if (!addresses.length) setAdding(true); }, []);

  if (!lines.length && !done)
    return (
      <div className="py-24 text-center">
        <p className="text-xl font-black">Your bag is empty</p>
        <Button asChild className="mt-6"><Link to="/products">Shop now</Link></Button>
      </div>
    );

  const validate = () => {
    if (m === "upi" && !/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(pay.upi)) return "Enter a valid UPI ID (e.g. name@okaxis)";
    if (m === "card") {
      const n = pay.card.replace(/\s/g, "");
      if (!/^\d{16}$/.test(n) || !luhn(n)) return "Enter a valid 16-digit card number (try 4111 1111 1111 1111)";
      const [mm, yy] = pay.exp.split("/");
      if (!/^\d{2}\/\d{2}$/.test(pay.exp) || +mm < 1 || +mm > 12 || new Date(2000 + +yy, +mm) < new Date()) return "Enter a valid expiry (MM/YY)";
      if (!/^\d{3}$/.test(pay.cvv)) return "Enter a 3-digit CVV";
    }
    if (m === "invoice" && pay.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]$/.test(pay.gstin)) return "Enter a valid GSTIN or leave blank";
    return "";
  };

  const submit = () => {
    const e = validate();
    setErr(e);
    if (e) return;
    setState("processing");
    setTimeout(() => {
      const ok = m === "cod" || m === "invoice" || Math.random() < 0.85;
      if (!ok) return setState("failed");
      const address = addresses.find((a) => a.id === sel)!;
      const now = new Date().toISOString();
      const detail = m === "upi" ? pay.upi : m === "card" ? `•••• ${pay.card.replace(/\s/g, "").slice(-4)}` : m === "net" ? pay.bank : m === "wallet" ? pay.wallet : m === "invoice" ? pay.gstin || "Invoice requested" : "Pay on delivery";
      const order: Order = {
        id: "INC" + Date.now().toString().slice(-8),
        createdAt: now,
        items: lines.map(({ item, p, line }) => ({ productId: p.id, name: p.name, image: p.images[0], slug: p.slug, sizes: item.sizes, qty: line.qty, unit: line.unit, subtotal: line.subtotal, gstRate: line.gstRate, note: item.note, printOptions: item.printOptions ?? ["none"], artwork: item.artwork ?? null, printCharges: line.printCharges })),
        address,
        payment: { method: methods.find((x) => x.id === m)!.l, detail },
        bill,
        coupon: couponRes?.ok ? code : null,
        status: 0,
        history: [now],
        cancelled: false,
        reviewed: [],
      };
      placeOrder(user.id, order);
      clearCart();
      setState("idle");
      setDone(order);
    }, 2400);
  };

  const summary = (
    <div className="rounded-sm border p-4">
      <button className="flex w-full items-center justify-between lg:pointer-events-none" onClick={() => setShowSummary((v) => !v)}>
        <span className="eyebrow">Order summary ({bill.qty} pcs)</span>
        <span className="flex items-center gap-1 font-black lg:hidden">{inr(bill.total)} <ChevronDown className={cn("h-4 w-4 transition", showSummary && "rotate-180")} /></span>
      </button>
      <div className={cn("mt-3", !showSummary && "hidden lg:block")}>
        <ul className="mb-3 space-y-2 border-b pb-3">
          {lines.map(({ item, p, line }) => (
            <li key={item.key} className="flex gap-2 text-sm">
              <img src={p.images[0]} alt="" className="h-12 w-10 rounded-sm object-cover" />
              <span className="min-w-0 flex-1 truncate">{p.name}<span className="block text-xs text-muted-foreground">{line.qty} pcs</span>
                {(item.printOptions ?? ["none"]).some((id) => id !== "none") && <span className="block truncate text-xs text-muted-foreground">Print selected</span>}
                {item.artwork && <span className="block truncate text-xs text-muted-foreground">Artwork: {item.artwork.name}</span>}
              </span>
              <span className="font-bold">{inr(line.subtotal + line.printCharges)}</span>
            </li>
          ))}
        </ul>
        <BillRows bill={bill} couponCode={code} />
      </div>
    </div>
  );

  return (
    <Container className="max-w-6xl pb-10">
      <Stepper step={step} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 1 ? (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-black">Select delivery address</h1>
                {!adding && <Button variant="outline" size="sm" onClick={() => setAdding(true)}><Plus /> Add new</Button>}
              </div>
              {adding && (
                <div className="mb-4 rounded-sm border p-4">
                  <AddressForm
                    onCancel={addresses.length ? () => setAdding(false) : undefined}
                    onSave={(a) => { const s = saveAddr(user.id, a); setSel(s.id); setAdding(false); toast.success("Address saved"); }}
                  />
                </div>
              )}
              <div className="space-y-3">
                {addresses.map((a) => <AddressCard key={a.id} a={a} selected={sel === a.id} onSelect={() => setSel(a.id)} />)}
              </div>
              <Button className="mt-6 w-full sm:w-auto" disabled={!sel || adding} onClick={() => setStep(2)}>Continue to payment</Button>
              {!sel && !adding && <p className="mt-2 text-xs text-destructive">Please add or select an address to continue.</p>}
            </section>
          ) : (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3 rounded-sm bg-secondary p-3 text-sm">
                <span className="min-w-0 truncate">Deliver to: <b>{addresses.find((a) => a.id === sel)?.name}</b>, {addresses.find((a) => a.id === sel)?.pincode}</span>
                <button onClick={() => setStep(1)} className="shrink-0 text-xs font-bold text-primary">CHANGE</button>
              </div>
              <h1 className="mb-3 text-lg font-black">Choose payment mode</h1>
              <div className="grid overflow-hidden rounded-sm border md:grid-cols-[220px_1fr]">
                <div className="flex overflow-x-auto border-b bg-secondary md:block md:border-b-0 md:border-r">
                  {methods.map((x) => (
                    <button key={x.id} onClick={() => { setM(x.id); setErr(""); }} className={cn("flex min-h-12 shrink-0 items-center gap-2 px-4 text-left text-sm font-bold md:w-full", m === x.id ? "bg-background text-primary md:border-l-4 md:border-primary" : "text-muted-foreground")}>
                      <x.i className="h-4 w-4 shrink-0" /> {x.l}
                    </button>
                  ))}
                </div>
                <div className="space-y-3 p-5">
                  {m === "upi" && (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="grid h-28 w-28 shrink-0 grid-cols-7 gap-0.5 rounded-sm border p-2" aria-label="Demo QR code">
                          {Array.from({ length: 49 }).map((_, i) => <span key={i} className={(i * 7 + (i % 5)) % 3 ? "bg-foreground" : ""} />)}
                        </div>
                        <p className="text-sm text-muted-foreground">Scan with any UPI app, or enter your UPI ID below.</p>
                      </div>
                      <Input placeholder="yourname@okaxis" value={pay.upi} onChange={(e) => setPay({ ...pay, upi: e.target.value })} className="h-11" aria-label="UPI ID" />
                    </>
                  )}
                  {m === "card" && (
                    <>
                      <Input placeholder="Card number" inputMode="numeric" value={pay.card} onChange={(e) => setPay({ ...pay, card: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ") })} className="h-11" aria-label="Card number" />
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="MM/YY" inputMode="numeric" value={pay.exp} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setPay({ ...pay, exp: v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v }); }} className="h-11" aria-label="Expiry" />
                        <Input placeholder="CVV" type="password" inputMode="numeric" value={pay.cvv} onChange={(e) => setPay({ ...pay, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} className="h-11" aria-label="CVV" />
                      </div>
                    </>
                  )}
                  {m === "net" && (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "BOI"].map((b) => (
                        <button key={b} onClick={() => setPay({ ...pay, bank: b })} className={cn("h-12 rounded-sm border text-sm font-bold", pay.bank === b && "border-primary text-primary")}>{b}</button>
                      ))}
                    </div>
                  )}
                  {m === "wallet" && (
                    <div className="grid grid-cols-2 gap-2">
                      {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"].map((b) => (
                        <button key={b} onClick={() => setPay({ ...pay, wallet: b })} className={cn("h-12 rounded-sm border text-sm font-bold", pay.wallet === b && "border-primary text-primary")}>{b}</button>
                      ))}
                    </div>
                  )}
                  {m === "cod" && <p className="text-sm text-muted-foreground">Pay by cash or UPI when your order arrives.</p>}
                  {m === "invoice" && (
                    <>
                      <p className="text-sm text-muted-foreground">For businesses: we'll email a proforma GST invoice. Pay via bank transfer within 15 days.</p>
                      <Input placeholder="Company GSTIN (optional)" value={pay.gstin} onChange={(e) => setPay({ ...pay, gstin: e.target.value.toUpperCase() })} className="h-11" aria-label="GSTIN" />
                    </>
                  )}
                  {err && <p className="text-sm text-destructive">{err}</p>}
                  <Button className="w-full" size="lg" onClick={submit}>{m === "cod" || m === "invoice" ? "Place order" : `Pay ${inr(bill.total)}`}</Button>
                  <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-success" /> Demo payment — no money is charged</p>
                </div>
              </div>
            </section>
          )}
        </div>
        <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">{summary}</aside>
      </div>

      <AnimatePresence>
        {state !== "idle" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center bg-overlay/70 p-4">
            <div className="w-full max-w-sm rounded-md bg-background p-8 text-center">
              {state === "processing" ? (
                <>
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 font-black">Processing your payment…</p>
                  <p className="text-sm text-muted-foreground">Please don't close or refresh this page.</p>
                </>
              ) : (
                <>
                  <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                  <p className="mt-4 font-black">Payment failed</p>
                  <p className="text-sm text-muted-foreground">Your bank declined the transaction. No money was deducted.</p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setState("idle")}>Change mode</Button>
                    <Button onClick={submit}>Retry</Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {done && <SuccessModal order={done} onClose={(to) => navigate({ to })} />}
    </Container>
  );
}
