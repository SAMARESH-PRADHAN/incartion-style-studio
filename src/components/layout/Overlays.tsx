import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowUp, MessageCircle, Phone, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/AuthForm";
import { useCart, useQuotes, useUI } from "@/store";
import { getProductById } from "@/data/products";
import { categories } from "@/data/categories";
import { inr, lineBill, totalQty } from "@/lib/pricing";
import { ProductInfoQuick } from "@/components/product/QuickInfo";

export function LoginModal() {
  const open = useUI((s) => s.loginOpen);
  const close = useUI((s) => s.closeLogin);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-md overflow-hidden rounded-md p-0">
        <div className="bg-brand px-6 py-6 text-primary-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Welcome to Incartion</DialogTitle>
            <DialogDescription className="text-primary-foreground/90">
              Login to add to bag, track orders & get exclusive bulk prices.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-6">
          <AuthForm
            onSuccess={() => {
              const pending = useUI.getState().pending;
              close();
              setTimeout(() => pending?.(), 50);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MiniCart() {
  const open = useUI((s) => s.miniCartOpen);
  const setUI = useUI((s) => s.set);
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const navigate = useNavigate();
  const lines = items.map((i) => ({ i, p: getProductById(i.productId) })).filter((x) => x.p);
  const total = lines.reduce((a, { i, p }) => a + lineBill(p!, i.sizes).subtotal, 0);
  return (
    <Sheet open={open} onOpenChange={(o) => setUI({ miniCartOpen: o })}>
      <SheetContent side="right" className="flex w-[92vw] max-w-md flex-col p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="eyebrow text-left">Added to your bag ✓</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {lines.map(({ i, p }) => (
            <div key={i.key} className="flex gap-3 rounded-sm border p-2">
              <img src={p!.images[0]} alt={p!.name} className="h-20 w-16 rounded-sm object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{p!.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Object.entries(i.sizes).filter(([, v]) => v).map(([k, v]) => `${k}×${v}`).join(", ")}
                </p>
                <p className="mt-1 text-sm font-bold">{inr(lineBill(p!, i.sizes).subtotal)} <span className="text-xs font-normal text-muted-foreground">· {totalQty(i.sizes)} pcs</span></p>
              </div>
              <button aria-label="Remove" onClick={() => remove(i.key)} className="grid h-11 w-11 place-items-center text-muted-foreground hover:text-primary">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="mb-3 flex justify-between text-sm font-bold"><span>Subtotal</span><span>{inr(total)}</span></div>
          <Button className="w-full" onClick={() => { setUI({ miniCartOpen: false }); navigate({ to: "/cart" }); }}>View Bag & Checkout</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function QuickView() {
  const id = useUI((s) => s.quickViewId);
  const setUI = useUI((s) => s.set);
  const p = id ? getProductById(id) : undefined;
  return (
    <Dialog open={!!p} onOpenChange={(o) => !o && setUI({ quickViewId: null })}>
      <DialogContent className="max-w-4xl rounded-md p-0">
        <DialogTitle className="sr-only">{p?.name ?? "Quick view"}</DialogTitle>
        {p && <ProductInfoQuick p={p} onClose={() => setUI({ quickViewId: null })} />}
      </DialogContent>
    </Dialog>
  );
}

export function QuoteModal() {
  const open = useUI((s) => s.quoteOpen);
  const setUI = useUI((s) => s.set);
  const add = useQuotes((s) => s.add);
  const [f, setF] = useState({ name: "", company: "", phone: "", category: categories[1].slug, quantity: "50", message: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Required";
    if (!/^[6-9]\d{9}$/.test(f.phone)) er.phone = "Valid 10-digit mobile";
    if (!(Number(f.quantity) >= 1)) er.quantity = "Min 1";
    setErr(er);
    if (Object.keys(er).length) return;
    add({ ...f, quantity: Number(f.quantity) });
    toast.success("Quote request received!", { description: "Our team will call you within 24 hours." });
    setUI({ quoteOpen: false });
    setF({ ...f, name: "", company: "", phone: "", message: "" });
  };
  return (
    <Dialog open={open} onOpenChange={(o) => setUI({ quoteOpen: o })}>
      <DialogContent className="max-w-lg rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Request a bulk quote</DialogTitle>
          <DialogDescription>Ordering 50+ pieces? Get custom pricing, free samples and logo mockups.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2" noValidate>
          <div><Input placeholder="Your name *" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="h-11" />{err.name && <p className="text-xs text-destructive">{err.name}</p>}</div>
          <Input placeholder="Company" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} className="h-11" />
          <div><Input placeholder="Mobile *" inputMode="numeric" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="h-11" />{err.phone && <p className="text-xs text-destructive">{err.phone}</p>}</div>
          <div><Input placeholder="Quantity" type="number" min={1} value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className="h-11" />{err.quantity && <p className="text-xs text-destructive">{err.quantity}</p>}</div>
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="h-11 rounded-md border border-input bg-background px-3 text-sm sm:col-span-2" aria-label="Category">
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <Textarea placeholder="Tell us about logo, colours, delivery date…" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} className="sm:col-span-2" />
          <Button type="submit" className="sm:col-span-2">Get my quote</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed bottom-20 right-3 z-30 flex flex-col gap-2 lg:bottom-6 lg:right-6">
      {show && (
        <button aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="grid h-11 w-11 place-items-center rounded-full border bg-background shadow-pop">
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a href="tel:+919861000000" aria-label="Call us" className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background shadow-pop">
        <Phone className="h-5 w-5" />
      </a>
      <a href="https://wa.me/919861000000" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="grid h-12 w-12 place-items-center rounded-full bg-success text-success-foreground shadow-pop">
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

export { X, Link };
