import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  ShoppingBag,
  Share2,
  Ruler,
  MapPin,
  Truck,
  ShieldCheck,
  Check,
  FileText,
  Upload,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { getProduct, getProductById, products, formatCount, type Product } from "@/data/products";
import { getCategory, getSubName } from "@/data/categories";
import { QuantitySizeSelector } from "@/components/product/QuantitySizeSelector";
import { BillRows } from "@/components/product/BillBox";
import { Reviews } from "@/components/product/Reviews";
import { ProductRail } from "@/components/product/ProductRail";
import { Price } from "@/components/product/ProductCard";
import { Container, Reveal, SectionTitle } from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  cartBill,
  inr,
  lineBill,
  PRINT_OPTIONS,
  printUnitCost,
  totalQty,
  unitPrice,
  type SizeQty,
} from "@/lib/pricing";
import { useCart, useRecent, useRequireAuth, useUI, useWishlist, type ArtworkFile } from "@/store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, Receipt, Sparkles } from "lucide-react";


export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return { id: p.id };
  },
  head: ({ loaderData }) => {
    const p = loaderData ? getProductById(loaderData.id) : undefined;
    if (!p)
      return {
        meta: [
          { title: "Product not found — Incartion" },
          { name: "description", content: "This Incartion product could not be found." },
          { property: "og:title", content: "Product not found — Incartion" },
          { property: "og:description", content: "This Incartion product could not be found." },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "robots", content: "noindex" },
        ],
      };
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
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});
function ProductNotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-2xl font-black">Product not found</p>
      <Button asChild className="mt-6">
        <Link to="/products">Browse products</Link>
      </Button>
    </div>
  );
}

// function Gallery({ p }: { p: Product }) {
//   const [i, setI] = useState(0);
//   const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
//   return (
//     <div>
//       <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:hidden" onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
//         {p.images.map((src, k) => (
//           <img key={k} src={src} alt={`${p.name} image ${k + 1}`} className="aspect-[3/4] w-full shrink-0 snap-center object-cover" />
//         ))}
//       </div>
//       <div className="mt-2 flex justify-center gap-1.5 md:hidden">
//         {p.images.map((_, k) => <span key={k} className={cn("h-1.5 rounded-full transition-all", k === i ? "w-5 bg-primary" : "w-1.5 bg-border")} />)}
//       </div>
//       <div className="hidden gap-3 md:flex">
//         <div className="flex w-20 shrink-0 flex-col gap-2">
//           {p.images.map((src, k) => (
//             <button key={k} onMouseEnter={() => setI(k)} onClick={() => setI(k)} aria-label={`View image ${k + 1}`} className={cn("overflow-hidden rounded-sm border-2", k === i ? "border-primary" : "border-transparent")}>
//               <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
//             </button>
//           ))}
//         </div>
//         <div
//           className="relative flex-1 cursor-zoom-in overflow-hidden rounded-sm bg-muted"
//           onMouseMove={(e) => {
//             const r = e.currentTarget.getBoundingClientRect();
//             setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
//           }}
//           onMouseLeave={() => setZoom(null)}
//         >
//           <img
//             src={p.images[i]}
//             alt={p.name}
//             className="aspect-[3/4] w-full object-cover transition-transform duration-200"
//             style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const badge = p.isNew ? "New" : p.isBestSeller ? "Bestseller" : null;
  return (
    <div>
      {/* Mobile: swipe gallery */}
      <div className="relative md:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) =>
            setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
          }
        >
          {p.images.map((src, k) => (
            <img
              key={k}
              src={src}
              alt={`${p.name} image ${k + 1}`}
              className="aspect-[3/4] w-full shrink-0 snap-center object-cover"
            />
          ))}
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow">
          {p.discountPercent}% OFF
        </span>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-neutral-950/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {i + 1} / {p.images.length}
        </span>
      </div>
      <div className="mt-3 flex justify-center gap-1.5 md:hidden">
        {p.images.map((_, k) => (
          <span
            key={k}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              k === i ? "w-6 bg-gold" : "w-1.5 bg-border",
            )}
          />
        ))}
      </div>

      {/* Desktop: thumbnails + zoom */}
      <div className="hidden gap-4 md:flex">
        <div className="flex w-20 shrink-0 flex-col gap-3">
          {p.images.map((src, k) => (
            <button
              key={k}
              onMouseEnter={() => setI(k)}
              onClick={() => setI(k)}
              aria-label={`View image ${k + 1}`}
              className={cn(
                "overflow-hidden rounded-lg border-2 transition-all duration-300",
                k === i
                  ? "border-premium shadow-pop"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
            </button>
          ))}
        </div>
        <div
          className="relative flex-1 cursor-zoom-in overflow-hidden rounded-2xl border bg-muted shadow-card"
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({
              x: ((e.clientX - r.left) / r.width) * 100,
              y: ((e.clientY - r.top) / r.height) * 100,
            });
          }}
          onMouseLeave={() => setZoom(null)}
        >
          <img
            key={i}
            src={p.images[i]}
            alt={p.name}
            className="aspect-[3/4] w-full object-cover transition-transform duration-200 animate-in fade-in duration-500"
            style={
              zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined
            }
          />
          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white shadow">
            {p.discountPercent}% OFF
          </span>
          {badge && (
            <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-neutral-950 px-3 py-1 text-xs font-black uppercase tracking-wider text-premium shadow">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const sizeChart = [
  ["XS", 34, 26, 27],
  ["S", 36, 28, 28],
  ["M", 38, 30, 29],
  ["L", 40, 32, 30],
  ["XL", 42, 34, 31],
  ["XXL", 44, 36, 32],
  ["3XL", 46, 38, 33],
];
const printGroups = ["DTF Print", "Sublimation Print", "Embroidery Print"];

function ProductPage() {
  const { id } = Route.useLoaderData();
  const p = getProductById(id)!;
  const cat = getCategory(p.category)!;
  const readymade = p.isExclusive;
  const [sizes, setSizes] = useState<SizeQty>({});
  const [note, setNote] = useState("");
  const [selectedPrintOptions, setSelectedPrintOptions] = useState<string[]>(["none"]);
  const [artwork, setArtwork] = useState<ArtworkFile | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  // const [pin, setPin] = useState("");
  // const [pinMsg, setPinMsg] = useState<{ ok: boolean; t: string } | null>(null);
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
  const related = useMemo(
    () =>
      products
        .filter((x) => x.id !== p.id && x.category === p.category)
        .sort((a) => (a.subCategory === p.subCategory ? -1 : 1))
        .slice(0, 12),
    [p.id],
  );
  const recent = hydrated
    ? (recentIds
        .filter((x) => x !== p.id)
        .map(getProductById)
        .filter(Boolean) as Product[])
    : [];

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
    else {
      await navigator.clipboard?.writeText(url);
      toast.success("Link copied");
    }
  };
const toggleOption = (id: string, checked: boolean) =>
  setSelectedPrintOptions((current) => {
    const next = new Set(current.filter((x) => x !== "none"));
    if (checked) next.add(id);
    else next.delete(id);
    return next.size ? [...next] : ["none"];
  });
const selectedLabels = PRINT_OPTIONS.filter((o) => o.id !== "none" && selectedPrintOptions.includes(o.id));
  const optCls = (on: boolean) =>
    cn(
      "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-all duration-200",
      on
        ? "border-premium bg-premium/5 shadow-sm"
        : "border-border bg-background hover:-translate-y-0.5 hover:border-premium/50",
    );
  const card = "rounded-xl border bg-card p-5 shadow-card";
  const heading = "eyebrow mb-3 flex items-center gap-2";
  const bar = <span className="h-4 w-1 rounded-full bg-gold" />;

  // return (
  //   <div className="pb-24 lg:pb-0">
  //     <Container className="py-3">
  //       <nav aria-label="Breadcrumb" className="truncate text-xs text-muted-foreground">
  //         <Link to="/">Home</Link> /{" "}
  //         <Link to="/products" search={{ category: cat.slug }}>
  //           {cat.name}
  //         </Link>{" "}
  //         /{" "}
  //         <Link to="/products" search={{ category: cat.slug, sub: p.subCategory }}>
  //           {getSubName(cat.slug, p.subCategory)}
  //         </Link>{" "}
  //         / <span className="text-foreground">{p.name}</span>
  //       </nav>
  //     </Container>
  //     <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10">
  //       <div className="-mx-3 sm:mx-0 lg:sticky lg:top-24 lg:self-start">
  //         <Gallery p={p} />
  //       </div>
  //       <div className="min-w-0">
  //         <h1 className="text-xl font-black sm:text-2xl">{p.name}</h1>
  //         <a
  //           href="#reviews"
  //           className="mt-2 inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-sm font-bold hover:border-foreground"
  //         >
  //           {p.rating} <span className="text-rating">★</span>{" "}
  //           <span className="font-normal text-muted-foreground">
  //             | {formatCount(p.ratingCount)} Ratings
  //           </span>
  //         </a>
  //         <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

  //         <div className="mt-5 border-t pt-5">
  //           <Price p={p} size="lg" />
  //           <p className="mt-1 text-xs font-bold text-success">inclusive of all taxes</p>
  //           {!readymade && (
  //             <div className="mt-4 overflow-hidden rounded-sm border">
  //               <div className="bg-secondary px-3 py-2 text-xs font-black uppercase">
  //                 Bulk pricing · price per piece
  //               </div>
  //               <div className="grid grid-cols-4 text-center text-sm">
  //                 {p.bulkPricing.map((t, k) => {
  //                   const next = p.bulkPricing[k + 1];
  //                   const on = qty >= t.minQty && (!next || qty < next.minQty) && qty > 0;
  //                   return (
  //                     <div
  //                       key={t.minQty}
  //                       className={cn(
  //                         "border-r px-1 py-2 last:border-r-0 transition",
  //                         on && "bg-primary/10",
  //                       )}
  //                     >
  //                       <p className="text-xs text-muted-foreground">
  //                         {t.minQty}
  //                         {next ? `–${next.minQty - 1}` : "+"} pcs
  //                       </p>
  //                       <p className={cn("font-black", on && "text-primary")}>{inr(t.price)}</p>
  //                     </div>
  //                   );
  //                 })}
  //               </div>
  //             </div>
  //           )}
  //         </div>

  //         {!readymade && (
  //           <section className="mt-6 border-t pt-5" aria-labelledby="print-options-title">
  //             <div className="mb-3 flex items-center justify-between gap-3">
  //               <p id="print-options-title" className="eyebrow">
  //                 Print &amp; customization type
  //               </p>
  //               <span className="shrink-0 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-black text-foreground">
  //                 {inr(printPrice)}/pc
  //               </span>
  //             </div>
  //             <div className="space-y-4" role="group" aria-labelledby="print-options-title">
  //               {PRINT_OPTIONS.filter((option) => option.group === "No Print").map((option) => (
  //                 <label
  //                   key={option.id}
  //                   className={cn(
  //                     "flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-3 py-2 transition-colors",
  //                     selectedPrintOptions.includes(option.id)
  //                       ? "border-foreground bg-secondary shadow-card"
  //                       : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/50",
  //                   )}
  //                 >
  //                   <input
  //                     type="checkbox"
  //                     checked={selectedPrintOptions.includes(option.id)}
  //                     onChange={(event) => {
  //                       if (event.currentTarget.checked) {
  //                         setSelectedPrintOptions(["none"]);
  //                         setArtwork(null);
  //                       }
  //                     }}
  //                     className="h-4 w-4 accent-primary"
  //                   />
  //                   <span className="min-w-0 flex-1 text-sm font-bold">{option.label}</span>
  //                   <span className="text-xs font-black">FREE</span>
  //                 </label>
  //               ))}
  //               {printGroups.map((group) => (
  //                 <fieldset key={group} className="space-y-2">
  //                   <legend className="mb-2 text-xs font-black uppercase tracking-wide">
  //                     {group}
  //                   </legend>
  //                   <div className="grid gap-2 sm:grid-cols-2">
  //                     {PRINT_OPTIONS.filter((option) => option.group === group).map((option) => (
  //                       <label
  //                         key={option.id}
  //                         className={cn(
  //                           "flex min-h-12 cursor-pointer items-center gap-3 rounded-sm border px-3 py-2 transition-colors",
  //                           selectedPrintOptions.includes(option.id)
  //                             ? "border-foreground bg-secondary shadow-card"
  //                             : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/50",
  //                         )}
  //                       >
  //                         <input
  //                           type="checkbox"
  //                           checked={selectedPrintOptions.includes(option.id)}
  //                           onChange={(event) => {
  //                             const checked = event.currentTarget.checked;
  //                             setSelectedPrintOptions((current) => {
  //                               const next = new Set(current.filter((id) => id !== "none"));
  //                               if (checked) next.add(option.id);
  //                               else next.delete(option.id);
  //                               return next.size ? [...next] : ["none"];
  //                             });
  //                           }}
  //                           className="h-4 w-4 shrink-0 accent-primary"
  //                         />
  //                         <span className="min-w-0 flex-1 text-sm font-semibold">
  //                           {option.label}
  //                         </span>
  //                         <span className="shrink-0 text-xs font-black">
  //                           {option.unitPrice === 0 ? "FREE" : `${inr(option.unitPrice)}/pc`}
  //                         </span>
  //                       </label>
  //                     ))}
  //                   </div>
  //                 </fieldset>
  //               ))}
  //             </div>
  //             {!selectedPrintOptions.includes("none") && (
  //               <div className="mt-4 space-y-3 rounded-sm border border-dashed border-foreground/30 bg-secondary/30 p-4 transition-colors hover:border-foreground/60">
  //                 <label
  //                   htmlFor="artwork-file"
  //                   className="flex items-center gap-2 text-sm font-bold"
  //                 >
  //                   <Upload className="h-4 w-4 text-primary" /> Upload Logo / Artwork (PNG, JPG,
  //                   PDF)
  //                 </label>
  //                 <Input
  //                   id="artwork-file"
  //                   type="file"
  //                   accept="image/png,image/jpeg,application/pdf"
  //                   className="h-auto min-h-11 py-2 file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-bold"
  //                   onClick={(event) => {
  //                     event.currentTarget.value = "";
  //                   }}
  //                   onChange={(event) => {
  //                     const file = event.currentTarget.files?.[0];
  //                     if (!file) return;
  //                     const allowed = ["image/png", "image/jpeg", "application/pdf"].includes(
  //                       file.type,
  //                     );
  //                     if (!allowed) {
  //                       toast.error("Please choose a PNG, JPG, or PDF file");
  //                       event.currentTarget.value = "";
  //                       return;
  //                     }
  //                     if (file.size > 1024 * 1024) {
  //                       toast.error("Artwork must be under 1 MB");
  //                       event.currentTarget.value = "";
  //                       return;
  //                     }
  //                     const reader = new FileReader();
  //                     reader.onload = () => {
  //                       if (typeof reader.result === "string")
  //                         setArtwork({ name: file.name, type: file.type, dataUrl: reader.result });
  //                     };
  //                     reader.onerror = () => toast.error("Could not read this artwork file");
  //                     reader.readAsDataURL(file);
  //                   }}
  //                 />
  //                 <p className="text-xs text-muted-foreground">PNG, JPG or PDF · up to 1 MB</p>
  //                 {artwork && (
  //                   <div className="flex items-center gap-3 rounded-sm bg-secondary p-2">
  //                     {artwork.type.startsWith("image/") ? (
  //                       <img
  //                         src={artwork.dataUrl}
  //                         alt="Artwork preview"
  //                         className="h-12 w-12 rounded-sm object-cover"
  //                       />
  //                     ) : (
  //                       <span className="grid h-12 w-12 place-items-center rounded-sm bg-background">
  //                         <FileText className="h-5 w-5 text-primary" />
  //                       </span>
  //                     )}
  //                     <span className="min-w-0 flex-1 truncate text-sm font-semibold">
  //                       {artwork.name}
  //                     </span>
  //                     <Button
  //                       type="button"
  //                       variant="ghost"
  //                       className="h-9 w-9 p-0"
  //                       aria-label="Clear uploaded artwork"
  //                       onClick={() => setArtwork(null)}
  //                     >
  //                       <X className="h-4 w-4" />
  //                     </Button>
  //                   </div>
  //                 )}
  //               </div>
  //             )}
  //           </section>
  //         )}

  //         <div id="sizes" className="mt-6">
  //           <div className="mb-3 flex items-center justify-between">
  //             <p className="eyebrow">Select quantity per size</p>
  //             <button
  //               onClick={() => setChart(true)}
  //               className="flex items-center gap-1 text-xs font-bold text-primary"
  //             >
  //               <Ruler className="h-4 w-4" /> SIZE CHART
  //             </button>
  //           </div>
  //           <QuantitySizeSelector value={sizes} onChange={setSizes} />
  //         </div>

  //         {!readymade && (
  //           <div className="mt-6">
  //             <label htmlFor="note" className="eyebrow mb-2 block">
  //               Note for our team
  //             </label>
  //             <Textarea
  //               id="note"
  //               value={note}
  //               onChange={(e) => setNote(e.target.value)}
  //               placeholder="Logo placement, embroidery text, colour preferences, special instructions…"
  //               maxLength={500}
  //             />
  //           </div>
  //         )}

  //         <div className="mt-6 rounded-sm border border-border bg-background p-4 shadow-card">
  //           <p className="eyebrow mb-3">Calculated bill</p>
  //           {qty === 0 ? (
  //             <p className="text-sm text-muted-foreground">
  //               Add quantities above to see your live bill.
  //             </p>
  //           ) : (
  //             <>
  //               <ul className="mb-3 space-y-1 border-b pb-3 text-sm">
  //                 {Object.entries(sizes)
  //                   .filter(([, v]) => v)
  //                   .map(([s, v]) => (
  //                     <li key={s} className="flex justify-between">
  //                       <span>
  //                         Size {s} × {v}
  //                       </span>
  //                       <span>{inr((v || 0) * line.unit)}</span>
  //                     </li>
  //                   ))}
  //                 <li className="flex justify-between pt-1 font-bold">
  //                   <span>
  //                     {qty} pcs @ {inr(unitPrice(p.bulkPricing, qty))}/pc (GST {line.gstRate}%)
  //                   </span>
  //                   <span>{inr(line.subtotal)}</span>
  //                 </li>
  //               </ul>
  //               <BillRows bill={bill} />
  //             </>
  //           )}
  //         </div>

  //         <div className="mt-6 hidden gap-3 lg:flex">
  //           <Button size="lg" className="flex-[2]" onClick={add}>
  //             <ShoppingBag /> Add to bag
  //           </Button>
  //           <Button
  //             size="lg"
  //             variant="outline"
  //             className="flex-1"
  //             onClick={() =>
  //               toast(toggleWish(p.id) ? "Added to wishlist" : "Removed from wishlist")
  //             }
  //           >
  //             <Heart className={cn(hydrated && wished && "fill-rose-500 text-rose-500")} />{" "}
  //             {hydrated && wished ? "Wishlisted" : "Wishlist"}
  //           </Button>
  //         </div>

  //         <div className="mt-6 border-t pt-5">
  //           <p className="eyebrow mb-3 flex items-center gap-2">
  //             Delivery options <Truck className="h-4 w-4" />
  //           </p>
  //           <ul className="space-y-1.5 text-sm text-muted-foreground">
  //             <li className="flex items-center gap-2">
  //               <ShieldCheck className="h-4 w-4" /> 100% original quality-checked garments
  //             </li>
  //             <li className="flex items-center gap-2">
  //               <Truck className="h-4 w-4" /> Free delivery above ₹999
  //             </li>
  //           </ul>
  //           <button onClick={share} className="mt-4 flex items-center gap-2 text-sm font-bold">
  //             <Share2 className="h-4 w-4" /> Share
  //           </button>
  //         </div>

  //         <Tabs defaultValue="overview" className="mt-8">
  //           <TabsList className="w-full justify-start overflow-x-auto">
  //             <TabsTrigger value="overview">Product Overview</TabsTrigger>
  //             <TabsTrigger value="wash">Wash Care</TabsTrigger>
  //             <TabsTrigger value="design">Design Guideline</TabsTrigger>
  //           </TabsList>
  //           <TabsContent value="overview">
  //             <dl className="grid grid-cols-2 gap-x-6 gap-y-3 py-3">
  //               {Object.entries(p.overview).map(([k, v]) => (
  //                 <div key={k} className="border-b pb-2">
  //                   <dt className="text-xs text-muted-foreground">{k}</dt>
  //                   <dd className="text-sm font-bold">{v}</dd>
  //                 </div>
  //               ))}
  //               <div className="border-b pb-2">
  //                 <dt className="text-xs text-muted-foreground">Colours</dt>
  //                 <dd className="text-sm font-bold">{p.colors.join(", ")}</dd>
  //               </div>
  //             </dl>
  //           </TabsContent>
  //           <TabsContent value="wash">
  //             <ul className="list-disc space-y-1.5 py-3 pl-5 text-sm">
  //               {p.washCare.map((w) => (
  //                 <li key={w}>{w}</li>
  //               ))}
  //             </ul>
  //           </TabsContent>
  //           <TabsContent value="design">
  //             <ul className="list-disc space-y-1.5 py-3 pl-5 text-sm">
  //               {p.designGuideline.map((w) => (
  //                 <li key={w}>{w}</li>
  //               ))}
  //             </ul>
  //           </TabsContent>
  //         </Tabs>
  //       </div>
  //     </Container>

  //     <Container>
  //       <Reviews p={p} />
  //     </Container>
  //     <Container className="mt-12">
  //       <h2 className="eyebrow mb-4">Similar products</h2>
  //       <ProductRail items={related} />
  //     </Container>
  //     {recent.length > 0 && (
  //       <Container className="mt-12">
  //         <h2 className="eyebrow mb-4">Recently viewed</h2>
  //         <ProductRail items={recent} />
  //       </Container>
  //     )}

  //     <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t bg-background p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
  //       <Button
  //         variant="outline"
  //         className="h-12 flex-1"
  //         onClick={() => toast(toggleWish(p.id) ? "Added to wishlist" : "Removed from wishlist")}
  //       >
  //         <Heart className={cn(hydrated && wished && "fill-rose-500 text-rose-500")} /> Wishlist
  //       </Button>
  //       <Button className="h-12 flex-[1.6]" onClick={add}>
  //         <ShoppingBag /> {qty ? `Add ${qty} · ${inr(bill.total)}` : "Add to bag"}
  //       </Button>
  //     </div>

  //     <Dialog open={chart} onOpenChange={setChart}>
  //       <DialogContent className="max-w-lg">
  //         <DialogHeader>
  //           <DialogTitle>Size chart (inches)</DialogTitle>
  //         </DialogHeader>
  //         <table className="w-full text-center text-sm">
  //           <thead className="bg-secondary text-xs uppercase">
  //             <tr>
  //               <th className="py-2">Size</th>
  //               <th>Chest</th>
  //               <th>Waist</th>
  //               <th>Length</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {sizeChart.map((r) => (
  //               <tr key={r[0]} className="border-b">
  //                 {r.map((c, k) => (
  //                   <td key={k} className={cn("py-2", k === 0 && "font-black")}>
  //                     {c}
  //                   </td>
  //                 ))}
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //         <p className="text-xs text-muted-foreground">
  //           Measurements are of the body. For a relaxed fit, choose one size up.
  //         </p>
  //       </DialogContent>
  //     </Dialog>
  //   </div>
  // );

  return (
  <div className="pb-24 lg:pb-0">
    <Container className="py-4">
      <nav aria-label="Breadcrumb" className="truncate text-xs text-muted-foreground">
        <Link to="/" className="hover:text-premium">Home</Link> / <Link to="/products" search={{ category: cat.slug }} className="hover:text-premium">{cat.name}</Link> /{" "}
        <Link to="/products" search={{ category: cat.slug, sub: p.subCategory }} className="hover:text-premium">{getSubName(cat.slug, p.subCategory)}</Link> / <span className="font-bold text-foreground">{p.name}</span>
      </nav>
    </Container>

    <Container className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
      <motion.div {...fadeUp(0)} className="-mx-3 sm:mx-0 lg:sticky lg:top-[96px] lg:self-start">
        <Gallery p={p} />
      </motion.div>

      <div className="min-w-0 space-y-5">
        {/* Name, rating, description */}
        <motion.section {...fadeUp(0.05)}>
          <p className="eyebrow flex items-center gap-2 text-premium"><span className="h-px w-8 bg-premium" /> {cat.name} · {getSubName(cat.slug, p.subCategory)}</p>
          <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{p.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a href="#reviews" className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700">
              {p.rating} ★ <span className="font-medium text-white/80">| {formatCount(p.ratingCount)} Ratings</span>
            </a>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <BadgeCheck className="h-3.5 w-3.5" /> In stock
            </span>
            {p.isBestSeller && <span className="rounded-full bg-neutral-950 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-premium">Bestseller</span>}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
        </motion.section>

        {/* Price + bulk pricing */}
        <motion.section {...fadeUp(0.1)} className={cn(card, "relative overflow-hidden")}>
          <span className="absolute inset-y-0 left-0 w-1 bg-gold" />
          <Price p={p} size="lg" />
          <p className="mt-1 text-xs font-bold text-emerald-600">inclusive of all taxes</p>
          {!readymade && (
            <div className="mt-4 overflow-hidden rounded-lg border">
              <div className="flex items-center gap-2 bg-neutral-950 px-3 py-2 text-xs font-black uppercase tracking-wider text-premium">
                <Sparkles className="h-3.5 w-3.5" /> Bulk pricing · price per piece
              </div>
              <div className="grid grid-cols-4 text-center text-sm">
                {p.bulkPricing.map((t, k) => {
                  const next = p.bulkPricing[k + 1];
                  const on = qty >= t.minQty && (!next || qty < next.minQty) && qty > 0;
                  return (
                    <div key={t.minQty} className={cn("border-r px-1 py-2.5 transition-colors duration-300 last:border-r-0", on && "bg-premium/10")}>
                      <p className="text-xs text-muted-foreground">{t.minQty}{next ? `–${next.minQty - 1}` : "+"} pcs</p>
                      <p className={cn("font-black", on && "text-premium")}>{inr(t.price)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.section>

        {/* Print options */}
        {!readymade && (
          <motion.section {...fadeUp(0.15)} className={card} aria-labelledby="print-options-title">
            <div className="mb-3 flex items-center justify-between gap-3">
  <p id="print-options-title" className="eyebrow flex items-center gap-2">{bar} Print &amp; customization</p>
  <span className="shrink-0 rounded-full bg-neutral-950 px-3 py-1 text-xs font-black text-premium">{inr(printPrice)}/pc</span>
</div>
{/* Selected summary on top */}
<div className="mb-4 min-h-10 rounded-lg border border-dashed border-premium/40 bg-premium/5 p-2">
  {selectedLabels.length === 0 ? (
    <p className="px-1 py-1.5 text-xs text-muted-foreground">No print selected. Choose from the dropdowns below.</p>
  ) : (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence initial={false}>
        {selectedLabels.map((o) => (
          <motion.button
            key={o.id}
            type="button"
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => toggleOption(o.id, false)}
            className="flex items-center gap-1.5 rounded-full bg-neutral-950 py-1.5 pl-3 pr-2 text-xs font-bold text-white"
          >
            {o.label}
            <span className="text-premium">{o.unitPrice === 0 ? "FREE" : `₹${o.unitPrice}`}</span>
            <X className="h-3.5 w-3.5 text-white/70" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )}
</div>
            <div className="space-y-3" role="group" aria-labelledby="print-options-title">
  {PRINT_OPTIONS.filter((option) => option.group === "No Print").map((option) => (
    <label key={option.id} className={optCls(selectedPrintOptions.includes(option.id))}>
      <input
        type="checkbox"
        checked={selectedPrintOptions.includes(option.id)}
        onChange={(event) => {
          if (event.currentTarget.checked) {
            setSelectedPrintOptions(["none"]);
            setArtwork(null);
          }
        }}
        className="h-4 w-4 accent-premium"
      />
      <span className="min-w-0 flex-1 text-sm font-bold">{option.label}</span>
      <span className="text-xs font-black text-emerald-600">FREE</span>
    </label>
  ))}

  {printGroups.map((group) => {
    const opts = PRINT_OPTIONS.filter((o) => o.group === group);
    const count = opts.filter((o) => selectedPrintOptions.includes(o.id)).length;
    const open = openGroup === group;
    return (
      <div key={group} className={cn("overflow-hidden rounded-lg border transition-colors", open || count ? "border-premium/60" : "border-border")}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpenGroup(open ? null : group)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60"
        >
          <span className="text-sm font-black uppercase tracking-wide">{group}</span>
          <span className="flex items-center gap-2">
            {count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-black text-white">{count}</span>}
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
          </span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="grid gap-2 border-t p-3 sm:grid-cols-2">
                {opts.map((option) => (
                  <label key={option.id} className={optCls(selectedPrintOptions.includes(option.id))}>
                    <input
                      type="checkbox"
                      checked={selectedPrintOptions.includes(option.id)}
                      onChange={(e) => toggleOption(option.id, e.currentTarget.checked)}
                      className="h-4 w-4 shrink-0 accent-premium"
                    />
                    <span className="min-w-0 flex-1 text-sm font-semibold">{option.label}</span>
                    <span className="shrink-0 text-xs font-black">{option.unitPrice === 0 ? "FREE" : `${inr(option.unitPrice)}/pc`}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  })}
</div>
            {!selectedPrintOptions.includes("none") && (
              <div className="mt-4 space-y-3 rounded-lg border border-dashed border-premium/50 bg-premium/5 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label htmlFor="artwork-file" className="flex items-center gap-2 text-sm font-bold"><Upload className="h-4 w-4 text-premium" /> Upload Logo / Artwork (PNG, JPG, PDF)</label>
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
                  <div className="flex items-center gap-3 rounded-lg bg-background p-2 shadow-sm">
                    {artwork.type.startsWith("image/") ? (
                      <img src={artwork.dataUrl} alt="Artwork preview" className="h-12 w-12 rounded-sm object-cover" />
                    ) : (
                      <span className="grid h-12 w-12 place-items-center rounded-sm bg-secondary"><FileText className="h-5 w-5 text-premium" /></span>
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{artwork.name}</span>
                    <Button type="button" variant="ghost" className="h-9 w-9 p-0" aria-label="Clear uploaded artwork" onClick={() => setArtwork(null)}><X className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
            )}
          </motion.section>
        )}

        {/* Sizes */}
        <motion.section {...fadeUp(0.2)} id="sizes" className={card}>
          <div className="mb-3 flex items-center justify-between">
            <p className="eyebrow flex items-center gap-2">{bar} Select quantity per size</p>
            <button onClick={() => setChart(true)} className="flex items-center gap-1 rounded-full border border-premium/40 px-3 py-1 text-xs font-bold text-premium transition hover:bg-premium hover:text-white"><Ruler className="h-4 w-4" /> SIZE CHART</button>
          </div>
          <QuantitySizeSelector value={sizes} onChange={setSizes} />
        </motion.section>

        {/* Note */}
        {!readymade && (
          <motion.section {...fadeUp(0.25)} className={card}>
            <label htmlFor="note" className={heading}>{bar} Note for our team</label>
            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Logo placement, embroidery text, colour preferences, special instructions…" maxLength={500} />
          </motion.section>
        )}

        {/* Bill */}
<motion.section {...fadeUp(0.3)} className="overflow-hidden rounded-2xl border bg-card shadow-card">
  <div className="flex items-center justify-between bg-neutral-950 px-5 py-3.5">
    <p className="eyebrow flex items-center gap-2 text-premium"><Receipt className="h-4 w-4" /> Calculated bill</p>
    {qty > 0 && <span className="rounded-full bg-gold px-3 py-0.5 text-xs font-black text-white">{qty} pcs</span>}
  </div>
  <span className="block h-0.5 bg-gold" />
  <div className="p-5">
    {qty === 0 ? (
      <div className="rounded-xl border border-dashed border-premium/40 bg-secondary/50 p-6 text-center">
        <Receipt className="mx-auto h-8 w-8 text-premium/60" />
        <p className="mt-2 text-sm text-muted-foreground">Add quantities above to see your live bill.</p>
      </div>
    ) : (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ul className="mb-4 space-y-2">
          {Object.entries(sizes).filter(([, v]) => v).map(([s, v]) => (
            <li key={s} className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2 text-sm">
              <span className="flex items-center gap-2">
                <span className="grid h-7 w-9 place-items-center rounded-md bg-neutral-950 text-xs font-black text-premium">{s}</span>
                × {v}
              </span>
              <span className="font-bold">{inr((v || 0) * line.unit)}</span>
            </li>
          ))}
        </ul>
        <p className="mb-3 flex justify-between text-xs font-bold text-muted-foreground">
          <span>{qty} pcs @ {inr(unitPrice(p.bulkPricing, qty))}/pc</span>
          <span>GST {line.gstRate}%</span>
        </p>
        <BillRows bill={bill} />
      </div>
    )}
  </div>
</motion.section>

        {/* Desktop buttons */}
        <motion.div {...fadeUp(0.35)} className="hidden gap-3 lg:flex">
          <Button size="lg" className="flex-[2] bg-gold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl" onClick={add}><ShoppingBag /> Add to bag</Button>
          <Button
            size="lg"
            variant="outline"
            className={cn("flex-1 transition-all hover:-translate-y-0.5", hydrated && wished && "border-rose-300 text-rose-600")}
            onClick={() => toast(toggleWish(p.id) ? "Added to wishlist" : "Removed from wishlist")}
          >
            <Heart className={cn(hydrated && wished && "fill-rose-500 text-rose-500")} /> {hydrated && wished ? "Wishlisted" : "Wishlist"}
          </Button>
        </motion.div>

        {/* Trust tiles */}
        <motion.section {...fadeUp(0.4)}>
          <div className="grid grid-cols-3 gap-3">
            {[
              [Truck, "Free delivery", "Above ₹999"],
              [ShieldCheck, "Quality checked", "100% original"],
              [Receipt, "GST invoice", "Claim input credit"],
            ].map(([I, t, d]) => {
              const Icon = I as typeof Truck;
              return (
                <div key={String(t)} className="rounded-xl border bg-card p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-premium/60 hover:shadow-pop">
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-premium ring-1 ring-premium/40"><Icon className="h-4 w-4" /></span>
                  <p className="mt-2 text-xs font-black">{String(t)}</p>
                  <p className="text-[11px] text-muted-foreground">{String(d)}</p>
                </div>
              );
            })}
          </div>
          <button onClick={share} className="mt-4 flex items-center gap-2 text-sm font-bold transition-colors hover:text-premium"><Share2 className="h-4 w-4" /> Share this product</button>
        </motion.section>

        {/* Tabs */}
        <motion.div {...fadeUp(0.45)}>
          <Tabs defaultValue="overview">
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl bg-secondary p-1">
              {[["overview", "Product Overview"], ["wash", "Wash Care"], ["design", "Design Guideline"]].map(([v, l]) => (
                <TabsTrigger key={v} value={v} className="rounded-lg px-4 py-2 data-[state=active]:bg-neutral-950 data-[state=active]:text-premium data-[state=active]:shadow-md">{l}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overview" className="animate-in fade-in duration-300">
              <dl className="grid grid-cols-2 gap-3 py-3">
                {Object.entries(p.overview).map(([k, v]) => (
                  <div key={k} className="rounded-lg border bg-card p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="text-sm font-bold">{v}</dd></div>
                ))}
                <div className="rounded-lg border bg-card p-3"><dt className="text-xs text-muted-foreground">Colours</dt><dd className="text-sm font-bold">{p.colors.join(", ")}</dd></div>
              </dl>
            </TabsContent>
            <TabsContent value="wash" className="animate-in fade-in duration-300">
              <ul className="space-y-2 py-3">{p.washCare.map((w) => <li key={w} className="flex gap-2 text-sm"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-premium" />{w}</li>)}</ul>
            </TabsContent>
            <TabsContent value="design" className="animate-in fade-in duration-300">
              <ul className="space-y-2 py-3">{p.designGuideline.map((w) => <li key={w} className="flex gap-2 text-sm"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-premium" />{w}</li>)}</ul>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Container>

    <Container><Reviews p={p} /></Container>
    <Container className="mt-14">
      <Reveal><SectionTitle eyebrow="You may also like" title="Similar products" /></Reveal>
      <ProductRail items={related} />
    </Container>
    {recent.length > 0 && (
      <Container className="mt-14">
        <Reveal><SectionTitle eyebrow="Pick up where you left" title="Recently viewed" /></Reveal>
        <ProductRail items={recent} />
      </Container>
    )}

    {/* Mobile sticky bar */}
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-premium/30 bg-background/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <Button variant="outline" className={cn("h-12 flex-1", hydrated && wished && "border-rose-300 text-rose-600")} onClick={() => toast(toggleWish(p.id) ? "Added to wishlist" : "Removed from wishlist")}>
        <Heart className={cn(hydrated && wished && "fill-rose-500 text-rose-500")} /> Wishlist
      </Button>
      <Button className="h-12 flex-[1.6] bg-gold text-white shadow-lg" onClick={add}>
        <ShoppingBag /> {qty ? `Add ${qty} · ${inr(bill.total)}` : "Add to bag"}
      </Button>
    </div>

    <Dialog open={chart} onOpenChange={setChart}>
      <DialogContent className="max-w-lg border-t-4 border-t-premium">
        <DialogHeader><DialogTitle className="font-black uppercase tracking-wide">Size chart (inches)</DialogTitle></DialogHeader>
        <table className="w-full text-center text-sm">
          <thead className="bg-neutral-950 text-xs uppercase text-premium"><tr><th className="py-2">Size</th><th>Chest</th><th>Waist</th><th>Length</th></tr></thead>
          <tbody>{sizeChart.map((r) => <tr key={r[0]} className="border-b transition-colors hover:bg-premium/5">{r.map((c, k) => <td key={k} className={cn("py-2", k === 0 && "font-black")}>{c}</td>)}</tr>)}</tbody>
        </table>
        <p className="text-xs text-muted-foreground">Measurements are of the body. For a relaxed fit, choose one size up.</p>
      </DialogContent>
    </Dialog>
  </div>
);
}
