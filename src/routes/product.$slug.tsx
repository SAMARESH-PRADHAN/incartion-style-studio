import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Heart, ShoppingBag, Share2, Ruler, MapPin, Truck, ShieldCheck, Check, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { getProduct, getProductById, products, formatCount, type Product } from "@/data/products";
import { getCategory, getSubName } from "@/data/categories";
import { QuantitySizeSelector } from "@/components/product/QuantitySizeSelector";
import { BillRows } from "@/components/product/BillBox";
import { Reviews } from "@/components/product/Reviews";
import { ProductRail } from "@/components/product/ProductRail";
import { Price } from "@/components/product/ProductCard";
import { Container } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cartBill, inr, lineBill, PRINT_OPTIONS, printUnitCost, totalQty, unitPrice, type SizeQty } from "@/lib/pricing";
import { useCart, useRecent, useRequireAuth, useUI, useWishlist, type ArtworkFile } from "@/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { id: p.id };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProductById(loaderData.id) : undefined;
    if (!p) return { meta: [
      { title: "Product not found — Incartion" },
      { name: "description", content: "This Incartion product could not be found." },
      { property: "og:title", content: "Product not found — Incartion" },
      { property: "og:description", content: "This Incartion product could not be found." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ] };
    const d = `${p.name} at ₹${p.price} (${p.discountPercent}% OFF). Bulk pricing from ₹${p.bulkPricing[3].price}/pc. Custom logo available.`;
    return {
      meta: [
        { title: `${p.name} — Incartion` },
        { name: "description", content: d },
        { property: "og:title", content: `${p.name} — Incartion` },
        { property: "og:description", content: d },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-2xl font-black">Product not found</p>
      <Button asChild className="mt-6"><Link to="/products">Browse products</Link></Button>
    </div>
  );
}

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div>
      <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:hidden" onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {p.images.map((src, k) => (
          <img key={k} src={src} alt={`${p.name} image ${k + 1}`} className="aspect-[3/4] w-full shrink-0 snap-center object-cover" />
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5 md:hidden">
        {p.images.map((_, k) => <span key={k} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-5 bg-primary" : "w-1.5 bg-border")} />)}
      </div>
      <div className="hidden gap-3 md:flex">
        <div className="flex w-20 shrink-0 flex-col gap-2">
          {p.images.map((src, k) => (
            <button key={k} onMouseEnter={() => setI(k)} onClick={() => setI(k)} aria-label={`View image ${k + 1}`} className={cn("overflow-hidden rounded-sm border-2", k === i ? "border-primary" : "border-transparent")}>
              <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
            </button>
          ))}
        </div>
        <div
          className="relative flex-1 cursor-zoom-in overflow-hidden rounded-sm bg-muted"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <img
            src={p.images[i]}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover transition-transform duration-200"
            style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </div>
      </div>
    </div>
  );
}

const sizeChart = [
  ["XS", 34, 26, 27], ["S", 36, 28, 28], ["M", 38, 30, 29], ["L", 40, 32, 30], ["XL", 42, 34, 31], ["XXL", 44, 36, 32], ["3XL", 46, 38, 33],
];
const printGroups = ["DTF Print", "Sublimation Print", "Embroidery Print"];

function ProductPage() {
  const { id } = Route.useLoaderData();
  const p = getProductById(id)!;
  const cat = getCategory(p.category)!;
  const [sizes, setSizes] = useState<SizeQty>({});
  const [note, setNote] = useState("");
  const [selectedPrintOptions, setSelectedPrintOptions] = useState<string[]>(["none"]);
  const [artwork, setArtwork] = useState<ArtworkFile | null>(null);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [chart, setChart] = useState(false);
  const hydrated = useUI((s) => s.hydrated);
  const setUI = useUI((s) => s.set);
  const wished = useWishlist((s) => s.ids.includes(p.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const addToCart = useCart((s) => s.add);
  const recentIds = useRecent((s) => s.ids);
  const pushRecent = useRecent((s) => s.push);
  const requireAuth = useRequireAuth();

  useEffect(() => {
    setSizes({});
    setNote("");
    setSelectedPrintOptions(["none"]);
    setArtwork(null);
    if (hydrated) pushRecent(p.id);
  }, [p.id, hydrated]);

  const qty = totalQty(sizes);
  const printPrice = printUnitCost(selectedPrintOptions);
  const line = lineBill(p, sizes, printPrice);
  const bill = cartBill([line]);
  const related = useMemo(() => products.filter((x) => x.id !== p.id && x.category === p.category).sort((a) => (a.subCategory === p.subCategory ? -1 : 1)).slice(0, 12), [p.id]);
  const recent = hydrated ? recentIds.filter((x) => x !== p.id).map(getProductById).filter(Boolean) as Product[] : [];

  const add = () => {
    if (qty === 0) {
      toast.error("Please select quantity for at least one size");
      document.getElementById("sizes")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const s = { ...sizes };
    const n = note;
    const options = [...selectedPrintOptions];
    const uploadedArtwork = artwork;
    requireAuth(() => {
      addToCart(p.id, s, n, options, uploadedArtwork);
      toast.success(`${totalQty(s)} pcs added to bag`);
      setUI({ miniCartOpen: true });
      setSizes({});
    });
  };
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: p.name, url }).catch(() => {});
    else { await navigator.clipboard?.writeText(url); toast.success("Link copied"); }
  };
  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) return setPinMsg({ ok: false, t: "Enter a valid 6-digit pincode" });
    if (pin.startsWith("0")) return setPinMsg({ ok: false, t: "Sorry, we don't deliver here yet" });
    const days = pin.startsWith("75") ? 2 : pin.startsWith("7") ? 4 : 6;
    const d = new Date(Date.now() + days * 86400000).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    setPinMsg({ ok: true, t: `Delivery by ${d}${pin.startsWith("75") ? " · Express from Bhubaneswar" : ""}` });
  };

  return (
    <div className="pb-24 lg:pb-0">
      <Container className="py-3">
        <nav aria-label="Breadcrumb" className="truncate text-xs text-muted-foreground">
          <Link to="/">Home</Link> / <Link to="/products" search={{ category: cat.slug }}>{cat.name}</Link> /{" "}
          <Link to="/products" search={{ category: cat.slug, sub: p.subCategory }}>{getSubName(cat.slug, p.subCategory)}</Link> / <span className="text-foreground">{p.name}</span>
        </nav>
      </Container>
      <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
        <div className="-mx-3 sm:mx-0 lg:sticky lg:top-24 lg:self-start"><Gallery p={p} /></div>
        <div className="min-w-0">
          <h1 className="text-xl font-black sm:text-2xl">{p.name}</h1>
          <a href="#reviews" className="mt-2 inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-sm font-bold hover:border-foreground">
            {p.rating} <span className="text-rating">★</span> <span className="font-normal text-muted-foreground">| {formatCount(p.ratingCount)} Ratings</span>
          </a>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

          <div className="mt-5 border-t pt-5">
            <Price p={p} size="lg" />
            <p className="mt-1 text-xs font-bold text-success">inclusive of all taxes</p>
            <div className="mt-4 overflow-hidden rounded-sm border">
              <div className="bg-secondary px-3 py-2 text-xs font-black uppercase">Bulk pricing · price per piece</div>
              <div className="grid grid-cols-4 text-center text-sm">
                {p.bulkPricing.map((t, k) => {
                  const next = p.bulkPricing[k + 1];
                  const on = qty >= t.minQty && (!next || qty < next.minQty) && qty > 0;
                  return (
                    <div key={t.minQty} className={cn("border-r px-1 py-2 last:border-r-0 transition", on && "bg-primary/10")}>
                      <p className="text-xs text-muted-foreground">{t.minQty}{next ? `–${next.minQty - 1}` : "+"} pcs</p>
                      <p className={cn("font-black", on && "text-primary")}>{inr(t.price)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <section className="mt-6 border-t pt-5" aria-labelledby="print-options-title">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p id="print-options-title" className="eyebrow">Print &amp; customization type</p>
              <span className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-black text-foreground">{inr(printPrice)}/pc</span>
            </div>
            <div className="space-y-4" role="group" aria-labelledby="print-options-title">
              {PRINT_OPTIONS.filter((option) => option.group === "No Print").map((option) => (
                <label key={option.id} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-3 py-2 transition-colors", selectedPrintOptions.includes(option.id) ? "border-foreground bg-secondary shadow-card" : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/50")}>
                  <input
                    type="checkbox"
                    checked={selectedPrintOptions.includes(option.id)}
                    onChange={(event) => {
                      if (event.currentTarget.checked) {
                        setSelectedPrintOptions(["none"]);
                        setArtwork(null);
                      }
                    }}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="min-w-0 flex-1 text-sm font-bold">{option.label}</span>
                  <span className="text-xs font-black">FREE</span>
                </label>
              ))}
              {printGroups.map((group) => (
                <fieldset key={group} className="space-y-2">
                  <legend className="mb-2 text-xs font-black uppercase tracking-wide">{group}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PRINT_OPTIONS.filter((option) => option.group === group).map((option) => (
                      <label key={option.id} className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-3 py-2 transition-colors", selectedPrintOptions.includes(option.id) ? "border-foreground bg-secondary shadow-card" : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/50")}>
                        <input
                          type="checkbox"
                          checked={selectedPrintOptions.includes(option.id)}
                          onChange={(event) => {
                            const checked = event.currentTarget.checked;
                            setSelectedPrintOptions((current) => {
                              const next = new Set(current.filter((id) => id !== "none"));
                              if (checked) next.add(option.id);
                              else next.delete(option.id);
                              return next.size ? [...next] : ["none"];
                            });
                          }}
                          className="h-4 w-4 shrink-0 accent-primary"
                        />
                        <span className="min-w-0 flex-1 text-sm font-semibold">{option.label}</span>
                        <span className="shrink-0 text-xs font-black">{option.unitPrice === 0 ? "FREE" : `${inr(option.unitPrice)}/pc`}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            {!selectedPrintOptions.includes("none") && (
              <div className="mt-4 space-y-3 rounded-sm border border-dashed border-foreground/30 bg-secondary/30 p-4 transition-colors hover:border-foreground/60">
                <label htmlFor="artwork-file" className="flex items-center gap-2 text-sm font-bold"><Upload className="h-4 w-4 text-primary" /> Upload Logo / Artwork (PNG, JPG, PDF)</label>
                <Input
                  id="artwork-file"
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  className="h-auto min-h-11 py-2 file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-bold"
                  onClick={(event) => { event.currentTarget.value = ""; }}
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (!file) return;
                    const allowed = ["image/png", "image/jpeg", "application/pdf"].includes(file.type);
                    if (!allowed) {
                      toast.error("Please choose a PNG, JPG, or PDF file");
                      event.currentTarget.value = "";
                      return;
                    }
                    if (file.size > 1024 * 1024) {
                      toast.error("Artwork must be under 1 MB");
                      event.currentTarget.value = "";
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") setArtwork({ name: file.name, type: file.type, dataUrl: reader.result });
                    };
                    reader.onerror = () => toast.error("Could not read this artwork file");
                    reader.readAsDataURL(file);
                  }}
                />
                <p className="text-xs text-muted-foreground">PNG, JPG or PDF · up to 1 MB</p>
                {artwork && (
                  <div className="flex items-center gap-3 rounded-sm bg-secondary p-2">
                    {artwork.type.startsWith("image/") ? (
                      <img src={artwork.dataUrl} alt="Artwork preview" className="h-12 w-12 rounded-sm object-cover" />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-sm bg-background"><FileText className="h-5 w-5 text-primary" /></span>
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{artwork.name}</span>
                    <Button type="button" variant="ghost" className="h-9 w-9 p-0" aria-label="Clear uploaded artwork" onClick={() => setArtwork(null)}><X className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            )}
          </section>

          <div id="sizes" className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">Select quantity per size</p>
              <button onClick={() => setChart(true)} className="flex items-center gap-1 text-xs font-bold text-primary"><Ruler className="h-4 w-4" /> SIZE CHART</button>
            </div>
            <QuantitySizeSelector value={sizes} onChange={setSizes} />
          </div>

          <div className="mt-6">
            <label htmlFor="note" className="eyebrow mb-2 block">Note for our team</label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Logo placement, embroidery text, colour preferences, special instructions…" maxLength={500} />
          </div>

          <div className="mt-6 rounded-sm border border-border bg-background p-4 shadow-card">
            <p className="eyebrow mb-3">Calculated bill</p>
            {qty === 0 ? (
              <p className="text-sm text-muted-foreground">Add quantities above to see your live bill.</p>
            ) : (
              <>
                <ul className="mb-3 space-y-1 border-b pb-3 text-sm">
                  {Object.entries(sizes).filter(([, v]) => v).map(([s, v]) => (
                    <li key={s} className="flex justify-between"><span>Size {s} × {v}</span><span>{inr((v || 0) * line.unit)}</span></li>
                  ))}
                  <li className="flex justify-between pt-1 font-bold"><span>{qty} pcs @ {inr(unitPrice(p.bulkPricing, qty))}/pc (GST {line.gstRate}%)</span><span>{inr(line.subtotal)}</span></li>
                </ul>
                <BillRows bill={bill} />
              </>
            )}
          </div>

          <div className="mt-6 hidden gap-3 lg:flex">
            <Button size="lg" className="flex-[2]" onClick={add}><ShoppingBag /> Add to bag</Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={() => toast(toggleWish(p.id) ? "Added to wishlist" : "Removed from wishlist")}>
              <Heart className={cn(hydrated && wished && "fill-primary text-primary")} /> {hydrated && wished ? "Wishlisted" : "Wishlist"}
            </Button>
          </div>

          <div className="mt-6 border-t pt-5">
            <p className="eyebrow mb-3 flex items-center gap-2">Delivery options <Truck className="h-4 w-4" /></p>
            <div className="flex max-w-sm gap-2">
              <Input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter pincode" inputMode="numeric" className="h-11" aria-label="Pincode" />
              <Button variant="outlinePink" onClick={checkPin}>Check</Button>
            </div>
            {pinMsg && <p className={cn("mt-2 flex items-center gap-1 text-sm", pinMsg.ok ? "text-success" : "text-destructive")}>{pinMsg.ok ? <Check className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}{pinMsg.t}</p>}
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 100% original quality-checked garments</li>
              <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free delivery above ₹999</li>
            </ul>
            <button onClick={share} className="mt-4 flex items-center gap-2 text-sm font-bold"><Share2 className="h-4 w-4" /> Share</button>
          </div>

          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Product Overview</TabsTrigger>
              <TabsTrigger value="wash">Wash Care</TabsTrigger>
              <TabsTrigger value="design">Design Guideline</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 py-3">
                {Object.entries(p.overview).map(([k, v]) => (
                  <div key={k} className="border-b pb-2"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="text-sm font-bold">{v}</dd></div>
                ))}
                <div className="border-b pb-2"><dt className="text-xs text-muted-foreground">Colours</dt><dd className="text-sm font-bold">{p.colors.join(", ")}</dd></div>
              </dl>
            </TabsContent>
            <TabsContent value="wash">
              <ul className="list-disc space-y-1.5 py-3 pl-5 text-sm">{p.washCare.map((w) => <li key={w}>{w}</li>)}</ul>
            </TabsContent>
            <TabsContent value="design">
              <ul className="list-disc space-y-1.5 py-3 pl-5 text-sm">{p.designGuideline.map((w) => <li key={w}>{w}</li>)}</ul>
            </TabsContent>
          </Tabs>
        </div>
      </Container>

      <Container><Reviews p={p} /></Container>
      <Container className="mt-12">
        <h2 className="eyebrow mb-4">Similar products</h2>
        <ProductRail items={related} />
      </Container>
      {recent.length > 0 && (
        <Container className="mt-12">
          <h2 className="eyebrow mb-4">Recently viewed</h2>
          <ProductRail items={recent} />
        </Container>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t bg-background p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
        <Button variant="outline" className="h-12 flex-1" onClick={() => toast(toggleWish(p.id) ? "Added to wishlist" : "Removed from wishlist")}>
          <Heart className={cn(hydrated && wished && "fill-primary text-primary")} /> Wishlist
        </Button>
        <Button className="h-12 flex-[1.6]" onClick={add}>
          <ShoppingBag /> {qty ? `Add ${qty} · ${inr(bill.total)}` : "Add to bag"}
        </Button>
      </div>

      <Dialog open={chart} onOpenChange={setChart}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Size chart (inches)</DialogTitle></DialogHeader>
          <table className="w-full text-center text-sm">
            <thead className="bg-secondary text-xs uppercase"><tr><th className="py-2">Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr></thead>
            <tbody>{sizeChart.map((r) => <tr key={r[0]} className="border-b">{r.map((c, k) => <td key={k} className={cn("py-2", k === 0 && "font-black")}>{c}</td>)}</tr>)}</tbody>
          </table>
          <p className="text-xs text-muted-foreground">Measurements are of the body. For a relaxed fit, choose one size up.</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
